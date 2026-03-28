import { useState, useEffect } from 'react';
import { 
  Search, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Database,
  Activity
} from 'lucide-react';

export default function ClinicalRecords() {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initializing with original sample data + fetching from backend if available
    const initialReports = [
      { id: 'RPT-HYD-001', patient: 'Ramesh Kumawat', date: '2026-03-12', diagnosis: 'Proliferative Diabetic Retinopathy', confidence: '99.2%', status: 'Critical', location: 'Banjara Hills, Hyderabad' },
      { id: 'RPT-HYD-002', patient: 'Sushila Devi', date: '2026-03-11', diagnosis: 'Normal Fundus', confidence: '98.5%', status: 'Completed', location: 'Gachibowli, Hyderabad' },
      { id: 'RPT-HYD-003', patient: 'Anwar Siddiqui', date: '2026-03-10', diagnosis: 'Age-related Macular Degeneration (Dry)', confidence: '91.4%', status: 'Reviewed', location: 'Secunderabad, Hyderabad' },
      { id: 'RPT-HYD-004', patient: 'Kavitha Reddy', date: '2026-03-09', diagnosis: 'Early Stage Glaucoma', confidence: '87.9%', status: 'Pending', location: 'Madhapur, Hyderabad' },
      { id: 'RPT-HYD-005', patient: 'Praveen Rao', date: '2026-03-08', diagnosis: 'Normal Fundus', confidence: '96.2%', status: 'Completed', location: 'Jubilee Hills, Hyderabad' },
    ];
    setReports(initialReports);
    setLoading(false);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMultimodalFusion = async () => {
    if (selectedReports.length < 2) return;
    
    // Original Fusion Logic
    const selectedData = reports.filter(r => selectedReports.includes(r.id)).map(r => ({
      id: r.id,
      patient: r.patient,
      disease: r.diagnosis,
      scan_type: r.id.includes('OCT') ? 'oct' : 'fundus'
    }));

    try {
      const response = await fetch('https://your-backend-url.onrender.comhttps://your-backend-url.onrender.com/api/analysis/fuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findings: selectedData }),
      });

      if (!response.ok) throw new Error('Fusion failed');
      await response.json();
      
      // Update reports with fused state
      setReports(prev => prev.map(r => 
        selectedReports.includes(r.id) ? { ...r, status: 'Fused' } : r
      ));
      setSelectedReports([]);
    } catch (err) {
      console.error('Fusion error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header - Clinical Hub Restoration */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                 <Database className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
                Clinical <span className="text-primary italic">Repository</span>
              </h1>
           </div>
           <p className="text-gray-400 font-medium text-sm">Secure clinician access to multimodal diagnostic telemetry and neural reports.</p>
        </div>

        <div className="flex items-center gap-4">
           {selectedReports.length >= 2 && (
             <button 
               onClick={handleMultimodalFusion}
               className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all animate-bounce italic font-black text-[10px] uppercase tracking-widest"
             >
                <Layers className="w-4 h-4" />
                Execute Multimodal Fusion
             </button>
           )}
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Search telemetry..." 
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-64 italic"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
           </div>
        </div>
      </div>

      {/* Main Clinical Registry */}
      <div className="medical-card p-8 bg-white animate-slide-up relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
             <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse italic">Synchronizing Neural Records...</p>
          </div>
        ) : (
          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h2 className="text-xl font-black text-text-main italic tracking-tighter italic leading-none">Diagnostic Dossier</h2>
                   <p className="text-gray-400 font-medium text-[10px] italic">Verify clinical telemetry and execute multimodal fusion protocols.</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black italic">
                           DR
                        </div>
                      ))}
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-text-main italic leading-none">{reports.length} Verified Nodes</p>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic mt-1">Yashoda Hospitals sync active</p>
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="p-4 text-left">
                        <input 
                          type="checkbox" 
                          onChange={() => {
                            if (selectedReports.length === reports.length) setSelectedReports([]);
                            else setSelectedReports(reports.map(r => r.id));
                          }}
                          className="w-4 h-4 rounded border-gray-200 text-primary focus:ring-primary/20 transition-all" 
                        />
                      </th>
                      <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Node ID</th>
                      <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Identity</th>
                      <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Stamp</th>
                      <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Inference</th>
                      <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Confidence</th>
                      <th className="p-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.map((rpt) => (
                      <tr 
                        key={rpt.id} 
                        className={`group hover:bg-gray-50/50 transition-all ${selectedReports.includes(rpt.id) ? 'bg-primary/[0.02]' : ''}`}
                      >
                        <td className="p-4">
                           <input 
                             type="checkbox" 
                             checked={selectedReports.includes(rpt.id)}
                             onChange={() => handleSelect(rpt.id)}
                             className="w-4 h-4 rounded border-gray-200 text-primary focus:ring-primary/20 transition-all" 
                           />
                        </td>
                        <td className="p-4">
                           <span className="text-[10px] font-black text-primary italic uppercase tracking-wider">{rpt.id}</span>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-black italic text-gray-400">
                                 {rpt.patient.charAt(0)}
                              </div>
                              <span className="text-xs font-black text-text-main italic tracking-tight">{rpt.patient}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2 text-gray-400 font-medium text-[10px] italic">
                              <Clock className="w-3 h-3 opacity-40" />
                              {rpt.date}
                           </div>
                        </td>
                        <td className="p-4">
                           <span className="text-[9px] font-black text-text-main uppercase tracking-widest italic">{rpt.diagnosis}</span>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                                 <div 
                                   className="h-full bg-primary rounded-full" 
                                   style={{ width: rpt.confidence }} 
                                 />
                              </div>
                              <span className="text-[9px] font-black text-primary italic">{rpt.confidence}</span>
                           </div>
                        </td>
                        <td className="p-4 text-right">
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest italic ${
                             rpt.status === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                             rpt.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                             'bg-blue-50 border-blue-100 text-blue-600'
                           }`}>
                              {rpt.status === 'Critical' && <Activity className="w-2.5 h-2.5 animate-pulse" />}
                              {rpt.status}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {/* Institutional Support Matrix - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="medical-card p-8 bg-indigo-950 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            <ShieldCheck className="w-8 h-8 text-secondary mb-4 relative z-10" />
            <h4 className="text-lg font-black italic tracking-tighter mb-1 relative z-10 italic">Institutional Trust</h4>
            <p className="text-indigo-100/40 text-[9px] font-black uppercase tracking-widest italic relative z-10">Yashoda Hospitals verified node</p>
         </div>
         <div className="medical-card p-8 bg-white group">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4 group-hover:rotate-12 transition-transform" />
            <h4 className="text-lg font-black italic tracking-tighter mb-1 italic">Data Integrity</h4>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest italic">99.9% Accuracy</p>
         </div>
         <div className="medical-card p-8 bg-gray-50 group border-transparent hover:border-primary/10 transition-all">
            <Layers className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-black italic tracking-tighter mb-1 italic">Hybrid Fusion</h4>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest italic">Multimodal sync</p>
         </div>
      </div>
    </div>
  );
}
