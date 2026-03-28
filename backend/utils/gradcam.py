import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model

# Disabling GPU warnings for CPU-only environments
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Generate Grad-CAM heatmap for a given image and model.
    """
    # Create a model that maps the input image to the activations
    # of the last conv layer as well as the output predictions
    grad_model = Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )

    # Then, we compute the gradient of the top predicted class for our input image
    # with respect to the activations of the last conv layer
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    # This is the gradient of the output neuron (top predicted or chosen)
    # with regard to the output feature map of the last conv layer
    grads = tape.gradient(class_channel, last_conv_layer_output)

    # This is a vector where each entry is the mean intensity of the gradient
    # over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # We multiply each channel in the feature map array
    # by "how important this channel is" with regard to the top predicted class
    # then sum all the channels to obtain the heatmap class activation
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # For visualization purpose, we will also normalize the heatmap between 0 & 1
    # Note: We apply ReLU (maximum) to drop negative values
    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.math.reduce_max(heatmap)
    if max_val == 0:
        max_val = 1e-10 # Prevent division by zero
    heatmap = heatmap / max_val
    return heatmap.numpy()


def overlay_gradcam(img_path, heatmap, alpha=0.7, colormap=cv2.COLORMAP_JET):
    """
    Overlay the Grad-CAM heatmap onto the original image.
    """
    # Load the original image
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not read image from {img_path}")
        
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Rescale heatmap to a range 0-255
    heatmap_rescaled = np.uint8(255 * heatmap)

    # Resize heatmap to match original image dimensions
    heatmap_resized = cv2.resize(heatmap_rescaled, (img.shape[1], img.shape[0]))

    # Apply colormap to heatmap
    heatmap_colored = cv2.applyColorMap(heatmap_resized, colormap)
    
    # We want to overlay on RGB, applyColorMap returns BGR, so convert
    heatmap_colored_rgb = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    # Create the overlay
    overlay = cv2.addWeighted(img, 1 - alpha, heatmap_colored_rgb, alpha, 0)

    # Return the overlay image and original image (as RGB arrays)
    return overlay, img

def get_base64_from_array(img_array):
    """
    Helper to convert a numpy image array to base64 string for API streaming
    """
    import base64
    # Image must be converted back to BGR before encoding to ensure correct colors
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.jpg', img_bgr)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_str}"
