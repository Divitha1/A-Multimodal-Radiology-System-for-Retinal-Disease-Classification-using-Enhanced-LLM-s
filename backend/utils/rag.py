import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class MedicalRAG:
    """
    A lightweight Retrieval-Augmented Generation (RAG) engine.
    Uses TF-IDF and Cosine Similarity to retrieve the most relevant 
    medical knowledge for a given user query.
    """
    def __init__(self, dataset_path=None):
        if dataset_path is None:
            # Use absolute path relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            dataset_path = os.path.join(base_dir, "data", "medical_knowledge.jsonl")
            
        self.dataset_path = dataset_path
        self.knowledge_base = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None
        self._load_knowledge()

    def _load_knowledge(self):
        """Loads and vectorizes the medical dataset."""
        if not os.path.exists(self.dataset_path):
            print(f"WARNING: Knowledge base not found at {self.dataset_path}")
            return

        with open(self.dataset_path, "r", encoding="utf-8") as f:
            for line in f:
                self.knowledge_base.append(json.loads(line))
        
        # Combine instructions and responses for better indexing context
        texts = [f"{item['instruction']} {item['response']}" for item in self.knowledge_base]
        if texts:
            self.tfidf_matrix = self.vectorizer.fit_transform(texts)
            print(f"RAG: Indexed {len(texts)} medical Q&A pairs.")

    def search(self, query, top_k=2):
        """Retrieves the top_k most relevant medical entries for a query."""
        if not self.knowledge_base or self.tfidf_matrix is None:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get indices of top_k most similar entries
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1: # Threshold for relevance
                results.append(self.knowledge_base[idx])
        
        return results

# Singleton instance for the application
rag_engine = MedicalRAG()
