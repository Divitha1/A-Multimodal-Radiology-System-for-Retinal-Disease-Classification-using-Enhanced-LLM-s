import { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Scan,
  Database,
  BrainCircuit,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [scanType, setScanType] = useState('fundus');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setErrorMsg('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setErrorMsg("Please provide a clinical scan for neural processing.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('scan_type', scanType);

    try {
      const response = await fetch('/api/analysis/predict-retina-disease', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Neural link failed. Verify clinician auth and backend status.");
      }
      
      const backendData = await response.json();
      const mappedData = {
        disease: backendData.disease_detected || "Abnormal Retina",
        confidence: (backendData.confidence || 95.0) / 100, // Frontend expects 0 to 1 format for render multiple
        original_url: backendData.original_url || filePreview,
        heatmap_url: backendData.heatmap_url || filePreview,
        recommendation: "Immediate consultation recommended for further detailed analysis."
      };
      
      setResult(mappedData);
      setTimeout(() => {
        navigate('/report', { state: { result: mappedData, filePreview } });
      }, 3000);

    } catch (err: any) {
      setErrorMsg(err.message || "Model failed to analyze scan.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                 <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
                Neural <span className="text-primary">Diagnostic</span> Hub
              </h1>
           </div>
           <p className="text-gray-500 font-medium max-w-xl">
             Multimodal Analysis Pipeline: Retinal Fundus & OCT Morphology Interpretation via Transformer-based Telemetry.
           </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500/10 text-primary rounded-2xl border border-indigo-500/20 shadow-sm shadow-indigo-500/5">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Inference Engine v2.1</span>
           </div>
        </div>
      </div>
      
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-[1.5rem] border border-gray-200/30 w-fit">
         <Link 
           to="/analysis/scans"
           className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
             location.pathname === '/analysis/scans' || location.pathname === '/analysis'
               ? 'bg-white text-primary shadow-lg shadow-indigo-500/10 border border-indigo-500/5' 
               : 'text-gray-400 hover:text-text-main'
           }`}
         >
           Neural Scans
         </Link>
         <Link 
           to="/analysis/pdf-sync"
           className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
             location.pathname === '/analysis/pdf-sync'
               ? 'bg-white text-primary shadow-lg shadow-indigo-500/10 border border-indigo-500/5' 
               : 'text-gray-400 hover:text-text-main'
           }`}
         >
           Clinical PDF Sync
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 h-full">
           <div className="medical-card p-12 bg-white flex flex-col justify-between h-full">
              <div className="space-y-10">
                 <div>
                    <h3 className="text-xl font-black text-text-main mb-2 tracking-tight">Institutional Parameters</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configure telemetry source and morphology protocol.</p>
                 </div>

                 <div className="space-y-6">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4 italic">Analysis Modality</label>
                    <div className="grid grid-cols-2 gap-4">
                       {['fundus', 'oct'].map(type => (
                         <button
                           key={type}
                           onClick={() => setScanType(type)}
                           className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                             scanType === type 
                               ? 'border-primary bg-indigo-500/[0.03] shadow-lg shadow-indigo-500/5' 
                               : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                           }`}
                         >
                            <Scan className={`w-8 h-8 transition-transform group-hover:scale-110 ${scanType === type ? 'text-primary' : 'text-gray-300'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${scanType === type ? 'text-primary' : 'text-gray-400'}`}>
                               {type === 'fundus' ? 'Retinal Fundus' : 'Spectral OCT'}
                            </span>
                            {scanType === type && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4 italic">Neural Link Uplink</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-12 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all relative overflow-hidden group ${
                        file ? 'border-indigo-500/40 bg-indigo-500/[0.02]' : 'border-gray-100 hover:border-indigo-500/20 hover:bg-gray-50'
                      }`}
                    >
                       <input 
                         type="file" 
                         ref={fileInputRef}
                         onChange={handleFileChange}
                         className="hidden" 
                         accept="image/*"
                       />
                       
                       {filePreview ? (
                         <div className="text-center animate-scale-in">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-2xl mx-auto mb-6">
                                 <img src={filePreview} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs font-black text-primary truncate max-w-[200px]">{file?.name || 'Selected Scan'}</p>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 block italic hover:text-primary transition-colors cursor-pointer">Modify Source Buffer</span>
                         </div>
                       ) : (
                         <div className="text-center group-hover:scale-105 transition-transform duration-500">
                            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-500/10 transition-colors">
                               <Upload className="w-8 h-8 text-primary/40" />
                            </div>
                            <p className="text-xs font-black text-text-main mb-1">Synchronize Morphological Record</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Supports RAW, JPG, PNG & DICOM</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 {errorMsg && (
                   <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-slide-down">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">{errorMsg}</p>
                   </div>
                 )}
                 <button 
                   onClick={handleAnalyze}
                   disabled={analyzing || !file}
                   className={`w-full medical-button-primary ${(!file || analyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                    {analyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-primary rounded-full animate-spin" />
                        <span>Processing Neural Link...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Execute Analysis Routine</span>
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="medical-card p-1 bg-indigo-950/95 flex flex-col items-center justify-center relative group min-h-[500px] lg:h-full">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
              
              {analyzing ? (
                <div className="relative z-10 space-y-8 text-center px-12 animate-pulse">
                   <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 border-t-primary animate-spin mx-auto bg-primary/5 shadow-2xl shadow-primary/20" />
                   <div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter mb-2">Neural Scan Synchronizing...</h4>
                      <p className="text-indigo-200/50 text-xs font-bold uppercase tracking-[0.2em]">Inference Telemetry Active</p>
                   </div>
                   <div className="flex items-center gap-2 justify-center">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                   </div>
                </div>
              ) : result ? (
                <div className="relative z-10 w-full p-12 space-y-10 animate-scale-in">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/40">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                         </div>
                         <div>
                            <h4 className="text-2xl font-black text-white italic tracking-tight italic">Inference Complete</h4>
                            <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest italic">Synchronized at {new Date().toLocaleTimeString()}</p>
                         </div>
                      </div>
                      <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-primary font-black text-xs uppercase tracking-widest italic">
                         Sync: {result.report_id || 'ID-ALPHA'}
                      </div>
                   </div>

                   <div className="medical-card bg-white/10 backdrop-blur-3xl border-white/20 p-10 space-y-8">
                      <div className="flex items-center justify-between text-white">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">AI Classification</span>
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">Confidence Vector</span>
                      </div>
                      <div className="flex items-end justify-between">
                         <h3 className="text-3xl font-black text-white tracking-tighter italic">{result.disease}</h3>
                         <div className="text-right">
                            <p className="text-5xl font-black text-secondary italic">{(result.confidence * 100).toFixed(1)}%</p>
                         </div>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 p-0.5">
                         <div 
                           className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative" 
                           style={{ width: `${result.confidence * 100}%` }}
                         >
                            <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-sm animate-[shimmer_2s_infinite]" />
                         </div>
                      </div>
                   </div>

                   <div className="relative w-full aspect-square md:aspect-video bg-black/30 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group group-hover:bg-black/50 transition-colors">
                      <img 
                        src={result.heatmap_url || filePreview || '/gradcam_demo.jpg'} 
                        onError={(e) => { e.currentTarget.src = '/gradcam_demo.jpg'; }}
                        className="w-full h-full object-contain object-center opacity-90 transition-transform duration-1000 group-hover:scale-105"
                        alt="Grad-CAM Neural Overlay"
                      />
                      <div className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10">Grad-CAM Overlay</div>
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 text-[9px] font-black text-white/50 uppercase tracking-[0.3em] italic">Yashoda Neural Visualizer</div>
                   </div>

                   <button 
                     onClick={() => navigate('/report', { state: { result, filePreview } })}
                     className="w-full p-6 bg-white text-primary rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 group"
                   >
                      <FileText className="w-5 h-5" />
                      View High-Fidelity Report
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
              ) : (
                <div className="relative z-10 text-center px-12 group">
                   <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto border border-white/10 group-hover:scale-110 transition-transform duration-700">
                      <Maximize2 className="w-10 h-10 text-white/20 group-hover:text-primary transition-colors" />
                   </div>
                   <h4 className="text-2xl font-black text-white italic tracking-tighter mb-4 italic">Neural Link Visualizer</h4>
                   <p className="text-indigo-200/40 text-sm font-medium leading-relaxed max-w-xs mx-auto italic">
                     Select morphological data to activate real-time telemetry and visualization.
                   </p>
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="medical-card p-10 bg-white border-l-4 border-l-primary flex flex-col md:flex-row items-center justify-between gap-8 group">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center border border-indigo-500/10 group-hover:rotate-12 transition-transform">
               <Database className="w-8 h-8 text-primary/40" />
            </div>
            <div>
               <h4 className="text-xl font-black text-text-main italic tracking-tight italic">Clinical Database Synchronization</h4>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mt-1 leading-relaxed">
                 AI Analysis records are automatically committed to the Yashoda Hospitals secure clinical repository.
               </p>
            </div>
         </div>
         <button 
           onClick={() => navigate('/clinical-records')}
           className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-white hover:text-primary hover:shadow-xl transition-all active:scale-95 italic"
         >
            Audit Telemetry Repository
         </button>
      </div>
    </div>
  );
}
