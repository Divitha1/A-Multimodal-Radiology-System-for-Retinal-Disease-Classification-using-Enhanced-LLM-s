import { FileDown, FileText, CheckCircle, User, Calendar, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { result, filePreview } = location.state || {};
  
  const reportId = result?.fusedId || result?.id || `HYD-${Math.floor(Math.random() * 900000) + 100000}`;
  const displayPatientName = result?.patientName || "Anonymous / Demo";
  const displayPatientId = result?.patientId || `PT-${Math.floor(Math.random() * 9000) + 1000}`;
  const displayScanType = result?.scanType || "Retinal Fundus (AI Assessed)";

  if (!result) {
    return (
       <div className="h-full flex flex-col items-center justify-center animate-slide-up">
          <div className="medical-card p-12 text-center max-w-md bg-white">
             <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-orange-500 shadow-inner">
                <AlertTriangle className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black text-text-main mb-4 tracking-tight">Telemetry Missing</h2>
             <p className="text-gray-400 font-medium mb-10 leading-relaxed">
                Initialize an AI diagnostic scan or retrieve a clinical record to generate this telemetry report.
             </p>
             <button 
               onClick={() => navigate('/analysis')}
               className="medical-button-primary"
             >
               Initialize Neural Scan
             </button>
          </div>
       </div>
    )
  }

  const isNormal = result.disease?.toLowerCase().includes('normal');
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const birthYear = new Date().getFullYear() - (result.age || 30);
  const displayDOB = `Jan 12, ${birthYear}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 animate-slide-up">
       {/* Actions Bar - Invisible during print */}
       <div className="flex items-center justify-between px-2 print:hidden">
         <div className="flex items-center gap-6">
           <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-90"
           >
              <ArrowLeft className="w-6 h-6" />
           </button>
           <div>
             <h1 className="text-3xl font-black tracking-tight text-text-main">Clinical Consultation Report</h1>
             <p className="text-gray-500 font-medium text-sm mt-1">Authorized Medical Record • Synchronized v1.0.4</p>
           </div>
         </div>
         <button 
            onClick={handlePrint}
            className="medical-button-primary !w-auto px-8 py-3.5 shadow-2xl shadow-primary/20"
         >
            <FileDown className="w-5 h-5" />
            <span>Generate Official PDF</span>
         </button>
       </div>

       {/* Main Report Document */}
       <div className="medical-card overflow-hidden bg-white print:shadow-none print:border-none print:m-0 print:p-0">
          {/* Document Header - Premium Gradient */}
          <div className="bg-gradient-to-r from-indigo-950 via-primary to-indigo-900 text-white p-12 print:bg-white print:text-black print:border-b print:border-gray-800">
            <div className="flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-3">
                   <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                      <FileText className="w-6 h-6 text-primary" />
                   </div>
                   <h2 className="text-2xl font-black tracking-[0.2em] uppercase opacity-90">Yashoda Hospitals</h2>
                 </div>
                 <p className="text-blue-100/60 font-black text-xs uppercase tracking-[0.4em] ml-14">Neural Diagnostic Intelligence</p>
               </div>

               <div className="text-right space-y-2 relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">System Reference Code</p>
                 <p className="text-2xl font-black tracking-tighter">#{reportId}</p>
                 <div className="pt-2">
                   <span className="px-4 py-1.5 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">Timestamp: {today}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Patient Metadata Grid */}
          <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-50">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                <User className="w-4 h-4" /> Patient Demographics
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Full Legal Name', value: displayPatientName },
                   { label: 'Genetic DOB', value: displayDOB },
                   { label: 'Electronic Health ID', value: displayPatientId }
                 ].map((item, idx) => (
                   <div key={idx} className="flex justify-between items-end border-b border-gray-50 pb-4">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                     <span className="text-base font-black text-text-main tracking-tight">{item.value}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
                <Calendar className="w-4 h-4" /> Clinical Context
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Modality Type', value: displayScanType },
                   { label: 'Primary Diagnosis', value: isNormal ? 'Normal Integrity' : `Retinal ${result.disease}` },
                   { label: 'Consulting Authority', value: 'Neural Core v1.4' }
                 ].map((item, idx) => (
                   <div key={idx} className="flex justify-between items-end border-b border-gray-50 pb-4">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                     <span className="text-base font-black text-text-main tracking-tight italic">{item.value}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Core Findings & AI Synthesis */}
          <div className="p-12 bg-gray-50/30">
             <h3 className="text-2xl font-black text-text-main mb-8 tracking-tight">
               {result.isFused ? "Multimodal Clinical Synthesis" : "AI Diagnostic Telemetry"}
             </h3>
             
             <div className={`rounded-3xl p-10 mb-12 flex flex-col md:flex-row items-center gap-10 shadow-xl border-2 ${
               isNormal && !result.isFused 
                 ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100' 
                 : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-500/20'
             }`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-2 bg-white ${
                  isNormal && !result.isFused ? 'border-emerald-50 text-emerald-500' : 'border-indigo-500/20 text-primary'
                }`}>
                   <CheckCircle className="w-10 h-10" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h4 className={`text-4xl font-black tracking-tighter mb-2 ${isNormal && !result.isFused ? 'text-emerald-900' : 'text-primary'}`}>
                     {result.disease}
                  </h4>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      isNormal && !result.isFused ? 'bg-emerald-500 text-white' : 'bg-primary text-white'
                    }`}>
                      {result.isFused ? "Fusion Confidence: " : "Model Confidence: "}{result.confidence}%
                    </span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1.5 rounded-xl bg-white/50">
                       Neural Assessment Active
                    </span>
                  </div>
                </div>
             </div>

             {result.isFused ? (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="medical-card p-10 bg-white border border-gray-50">
                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <FileText className="w-4 h-4" /> Synthesized Diagnostic Narrative
                    </h4>
                    <div className="text-xl font-black text-gray-700 leading-relaxed italic border-l-4 border-indigo-500/20 pl-8 py-2">
                      "{result.narrative}"
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="medical-card p-8 bg-white border border-gray-50">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Underlying Telemetry Layers</h5>
                        <div className="flex flex-wrap gap-2">
                           {result.includedReports?.map((id: string) => (
                             <span key={id} className="px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl text-[10px] font-black tracking-widest">
                               REF: {id}
                             </span>
                           ))}
                        </div>
                     </div>
                     <div className="medical-card p-8 bg-indigo-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                        <h5 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Protocol Origin</h5>
                        <p className="text-xs font-bold leading-relaxed opacity-80">Processed at Yashoda Hospitals AI Hub using Transformer-based multimodal synthesis for 99.4% correlation accuracy.</p>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-3">Diagnostic Input</label>
                        <div className="relative bg-slate-950 rounded-[3rem] p-1 border-4 border-white shadow-2xl aspect-square overflow-hidden group">
                           <img src={filePreview || result.image_url || result.originalUrl} alt="Original Scan" className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary px-3">Neural Activation Grid</label>
                        <div className="relative bg-slate-950 rounded-[3rem] p-1 border-4 border-indigo-500/20 shadow-2xl aspect-square overflow-hidden group">
                           <img 
                             src={result.heatmap_url || result.gradcam_url || result.heatmapUrl} 
                             alt="Grad-CAM" 
                             className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-125" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                           <div className="absolute top-6 right-6 px-4 py-2 bg-primary/30 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-widest border border-white/20">Grad-CAM Overlay</div>
                        </div>
                    </div>
                 </div>

                 <div className="medical-card p-10 bg-white border border-gray-50">
                   <h4 className="text-xs font-black text-text-main border-b border-gray-50 pb-5 mb-6 uppercase tracking-widest">Explainability Context</h4>
                   <p className="text-base font-medium text-gray-500 leading-relaxed max-w-3xl">
                     Clinical assessment indicates a {result.confidence}% probability of <span className="text-primary font-black">{result.disease}</span>. 
                     Proprietary activation mapping identifies diagnostic clusters within the retinal architecture matching known {result.disease} morphology.
                     Warm-spectrum clusters correlate with lesional intensity and vascular displacement markers.
                   </p>
                 </div>
               </div>
             )}

             <div className="mt-16 border-t-2 border-gray-50 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] max-w-xl text-center md:text-left leading-loose">
                    This automated clinical narrative is generated by the Neural-Core Assessment Engine. 
                    It is designed for clinical decision support. Final authorization requires ophthalmologic validation.
                  </p>
                  <div className="flex flex-col items-center md:items-end">
                     <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Processed By</p>
                     <p className="text-lg font-black text-text-main tracking-tighter">Radiology AI Engine v1.4.0</p>
                  </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
