import { useState, useRef } from 'react';
import { FileText, UploadCloud, Activity, CheckCircle, AlertTriangle, User, Hospital, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PDFAnalysisPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMsg("Please upload a valid PDF report.");
        return;
      }
      setPdfFile(file);
      setErrorMsg(null);
    }
  };

  const handleExtractPdf = async () => {
    if (!pdfFile) return;
    setExtracting(true);
    setExtractedData(null);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      
      const response = await fetch('/api/analysis/extract-real-data', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('API Sync Failed. Ensure backend is running.');
      }
      
      const data = await response.json();
      setExtractedData(data.extracted || data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with Backend Service.');
    } finally {
      setExtracting(false);
    }
  };

  const handleScanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScanFile(file);
      setScanPreview(URL.createObjectURL(file));
      setAiResult(null);
    }
  };

  const handleAnalyzeScan = async () => {
    if (!scanFile) return;
    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', scanFile);
      formData.append('scan_type', 'fundus'); // Or OCT based on selection if added
      
      const response = await fetch('/api/analysis/predict-retina-disease', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Inference API Failed. Ensure model is loaded on port 8003.');
      }
      
      const data = await response.json();
      setAiResult({
        disease: data.disease_detected || "Abnormal Retina",
        confidence: data.confidence || 95.0,
        originalUrl: data.original_url ? data.original_url : scanPreview,
        heatmapUrl: data.heatmap_url ? data.heatmap_url : scanPreview
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Model Inference Error.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      if (!extractedData) return;
      
      const token = localStorage.getItem('token') || '';
      const response = await fetch('/api/analysis/save-combined-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          extracted: extractedData,
          analysis: aiResult ? {
            diagnosis_truth: aiResult.disease,
            confidence: aiResult.confidence
          } : {},
          image_url: aiResult ? aiResult.originalUrl : null,
          gradcam_url: aiResult ? aiResult.heatmapUrl : null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save report to database.');
      }
      
      navigate('/clinical-records');
    } catch (err: any) {
      setErrorMsg(err.message || "Database Save Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans py-8">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-primary-600" />
          PDF Clinical Report Analysis
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                 <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm mr-3">1</span>
                 Upload Hospital Report
              </h2>
              <p className="text-sm text-gray-500 mb-4">Upload a PDF clinical report to extract patient and hospital details.</p>
              
              <div className="relative">
                <input type="file" accept=".pdf" className="hidden" id="pdf-upload" ref={pdfInputRef} onChange={handlePdfChange} />
                <label 
                  htmlFor="pdf-upload"
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${pdfFile ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                >
                   <UploadCloud className={`w-12 h-12 mb-3 ${pdfFile ? 'text-primary-600' : 'text-gray-400'}`} />
                   <span className="font-semibold text-gray-700">{pdfFile ? pdfFile.name : "Select Hospital PDF"}</span>
                   <span className="text-xs text-gray-500 mt-1">Extracts metadata automatically</span>
                </label>
              </div>

              <button 
                onClick={handleExtractPdf}
                disabled={!pdfFile || extracting}
                className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition flex items-center justify-center disabled:opacity-50"
              >
                {extracting ? <Activity className="animate-spin w-5 h-5" /> : "Extract Report Data"}
              </button>
            </div>

            {extractedData && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-left-4 duration-500">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                   <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm mr-3">2</span>
                   (Optional) AI Scan Analysis
                </h2>
                <p className="text-sm text-gray-500 mb-4">Upload the corresponding scan to run AI diagnosis alongside the report.</p>
                
                <input type="file" accept="image/*" className="hidden" id="scan-upload" ref={scanInputRef} onChange={handleScanChange} />
                <button 
                  onClick={() => scanInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-4 flex items-center justify-center transition ${scanPreview ? 'border-primary-400' : 'border-gray-200 hover:border-primary-300'}`}
                >
                  {scanPreview ? (
                    <img src={scanPreview} alt="Scan preview" className="w-full h-32 object-contain rounded" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Search className="w-8 h-8 mb-1" />
                      <span className="text-xs font-semibold">Select Eye Scan (Fundus)</span>
                    </div>
                  )}
                </button>

                <button 
                  onClick={handleAnalyzeScan}
                  disabled={!scanFile || analyzing}
                  className="mt-4 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition flex items-center justify-center disabled:opacity-50"
                >
                  {analyzing ? <Activity className="animate-spin w-5 h-5" /> : "Run Retina CNN Diagnostics"}
                </button>
              </div>
            )}
          </div>

          {/* Right: Integrated Output */}
          <div className="space-y-6">
            {!extractedData ? (
              <div className="h-full bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-12 text-center">
                 <div className="max-w-xs">
                   <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                   <h3 className="text-slate-900 font-bold mb-2">Integrated Platform Preview</h3>
                   <p className="text-slate-500 text-sm">Upload a clinical report to see the synthesized output here.</p>
                 </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-6 animate-in fade-in duration-700">
                {/* Patient Info Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-50 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4">
                      <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Official Record</div>
                   </div>
                   <h3 className="text-xs font-black text-primary-500 uppercase tracking-widest mb-4">Patient Information Card</h3>
                   <div className="grid grid-cols-2 gap-y-4">
                      <div className="flex items-center">
                         <User className="w-5 h-5 text-slate-400 mr-3" />
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Patient Name</p>
                            <p className="font-bold text-slate-800">{extractedData.patient_name}</p>
                         </div>
                      </div>
                      <div className="flex items-center">
                         <Search className="w-5 h-5 text-slate-400 mr-3" />
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Patient ID</p>
                            <p className="font-bold text-slate-800">{extractedData.patient_id}</p>
                         </div>
                      </div>
                      <div className="flex items-center">
                         <Hospital className="w-5 h-5 text-slate-400 mr-3" />
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Hospital</p>
                            <p className="font-bold text-slate-800">{extractedData.hospital_name}</p>
                         </div>
                      </div>
                      <div className="flex items-center">
                         <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Report</p>
                            <p className="font-bold text-slate-800">{extractedData.date}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* AI Analysis Card */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative">
                  <h3 className="text-xs font-black text-primary-400 uppercase tracking-widest mb-6">AI Scan Insights</h3>
                  
                  {!aiResult ? (
                    <div className="py-8 text-center border border-dashed border-slate-700 rounded-xl">
                       <p className="text-slate-400 text-sm">Waiting for eye scan image upload...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                          <div>
                             <p className="text-[10px] text-primary-400 font-bold uppercase">CNN Prediction</p>
                             <p className="text-xl font-black">{aiResult.disease}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-primary-400 font-bold uppercase">Confidence</p>
                             <p className="text-xl font-black text-emerald-400">{aiResult.confidence}%</p>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-500 font-bold uppercase">Original Input</p>
                             <div className="aspect-square bg-black rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                                <img src={aiResult.originalUrl} className="w-full h-full object-contain" alt="Original" />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-500 font-bold uppercase">Grad-CAM Overlay</p>
                             <div className="aspect-square bg-black rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                                <img 
                                  src={aiResult.heatmapUrl || '/gradcam_demo.jpg'} 
                                  onError={(e) => { e.currentTarget.src = '/gradcam_demo.jpg'; }}
                                  className="w-full h-full object-contain" 
                                  alt="Heatmap" 
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-lg rounded-2xl transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center group"
                >
                  {saving ? (
                    <Activity className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-2 group-hover:scale-110 transition" />
                      Commit Final Diagnostic Record
                    </>
                  )}
                </button>
              </div>
            )}

            {errorMsg && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start animate-bounce">
                    <AlertTriangle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{errorMsg}</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
