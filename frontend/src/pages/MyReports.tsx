import { useState } from 'react';
import { FileText, Search, Filter, ArrowLeft, Eye, Download, Layers, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyReports() {
  const navigate = useNavigate();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const reports = [
    { id: 'RPT-HYD-001', patient: 'Ramesh Kumawat', date: '2026-03-12', diagnosis: 'Proliferative Diabetic Retinopathy', confidence: '99.2%', status: 'Critical', location: 'Banjara Hills, Hyderabad' },
    { id: 'RPT-HYD-002', patient: 'Sushila Devi', date: '2026-03-11', diagnosis: 'Normal Fundus', confidence: '98.5%', status: 'Completed', location: 'Gachibowli, Hyderabad' },
    { id: 'RPT-HYD-003', patient: 'Anwar Siddiqui', date: '2026-03-10', diagnosis: 'Age-related Macular Degeneration (Dry)', confidence: '91.4%', status: 'Reviewed', location: 'Secunderabad, Hyderabad' },
    { id: 'RPT-HYD-004', patient: 'Kavitha Reddy', date: '2026-03-09', diagnosis: 'Early Stage Glaucoma', confidence: '87.9%', status: 'Pending', location: 'Madhapur, Hyderabad' },
    { id: 'RPT-HYD-005', patient: 'Praveen Rao', date: '2026-03-08', diagnosis: 'Normal Fundus', confidence: '96.2%', status: 'Completed', location: 'Jubilee Hills, Hyderabad' },
  ];

  const handleSelect = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMultimodalFusion = async () => {
    if (selectedReports.length < 2) return;
    
    const selectedData = reports.filter(r => selectedReports.includes(r.id)).map(r => ({
      id: r.id,
      patient: r.patient,
      disease: r.diagnosis,
      scan_type: r.id.includes('OCT') ? 'oct' : 'fundus' // Simulating scan types based on ID
    }));

    try {
      const response = await fetch('https://your-backend-url.onrender.comhttps://your-backend-url.onrender.com/api/analysis/fuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findings: selectedData }),
      });

      if (!response.ok) throw new Error('Fusion failed');
      const data = await response.json();

      // Navigate to report page with fused data
      navigate('/report', { 
        state: { 
          result: { 
            disease: "Fused Multimodal Analysis", 
            confidence: 94.5, // Simulated aggregate confidence
            isFused: true,
            narrative: data.narrative,
            fusedId: data.fused_report_id,
            includedReports: data.included_reports
          }, 
          filePreview: null 
        } 
      });
    } catch (err) {
      alert("Error during multimodal fusion. Please ensure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-primary-600" />
                Hyderabad Diagnostic Hub
              </h1>
              <p className="text-gray-500 text-sm mt-1">Yashoda Hospitals & Affiliated Centers | Telangana, India</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
             {selectedReports.length >= 2 && (
               <button 
                 onClick={handleMultimodalFusion}
                 className="flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all animate-in slide-in-from-right-4"
               >
                 <Layers className="w-4 h-4 mr-2" />
                 Perform Multimodal Fusion ({selectedReports.length})
               </button>
             )}
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by Patient..." 
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                />
             </div>
             <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition">
                <Filter className="w-4 h-4 mr-2" /> Filter
             </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Select</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Report ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">AI Diagnosis</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reports.map((rpt) => (
                  <tr key={rpt.id} className={`transition-colors cursor-pointer ${selectedReports.includes(rpt.id) ? 'bg-primary-50/50' : 'hover:bg-gray-50/50'}`} onClick={() => handleSelect(rpt.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedReports.includes(rpt.id) ? 'bg-primary-600 border-primary-600' : 'border-gray-300 bg-white'}`}>
                          {selectedReports.includes(rpt.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-700">{rpt.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{rpt.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rpt.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rpt.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${rpt.diagnosis.includes('Normal') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {rpt.diagnosis}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{rpt.confidence}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => navigate('/report', { state: { result: { disease: rpt.diagnosis, confidence: parseFloat(rpt.confidence) }, filePreview: null } })}
                            className="text-primary-600 hover:text-primary-800 transition p-1 rounded-lg hover:bg-primary-50" 
                            title="View Report"
                          >
                             <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100" title="Download Full PDF">
                             <Download className="w-5 h-5" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-6 bg-slate-50 border-t border-gray-100">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 font-medium text-center sm:text-left">
                   Viewing 5 active clinical records at Hyderabad Diagnostic Hub.
                </p>
                <div className="flex items-center text-xs text-primary-700 font-bold bg-primary-100/50 px-4 py-1.5 rounded-full border border-primary-200">
                   <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                   Fully Encrypted (AES-256) HIPAA Compliant
                </div>
             </div>
          </div>
        </div>

        {/* Informative area about multimodal fusion */}
        <div className="bg-gradient-to-br from-indigo-900 to-primary-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                 <Layers className="w-16 h-16 text-white" />
              </div>
              <div className="flex-grow">
                 <h2 className="text-2xl font-bold mb-2 text-white">Advanced Multimodal AI Fusion</h2>
                 <p className="text-primary-100 max-w-2xl leading-relaxed">
                    Select two or more diagnostic reports (e.g., Fundus + OCT) to generate a unified clincal narrative. 
                    Our fusion engine uses transformer-based medical LLMs to synthesize findings, identify cross-modality correlations, and generate a comprehensive diagnostic summary.
                 </p>
                 <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg">
                       <CheckCircle2 className="w-4 h-4 mr-2" /> Image Synthesis
                    </div>
                    <div className="flex items-center text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg">
                       <CheckCircle2 className="w-4 h-4 mr-2" /> Structural Correlation
                    </div>
                    <div className="flex items-center text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg">
                       <CheckCircle2 className="w-4 h-4 mr-2" /> AI Clinical Narration
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

