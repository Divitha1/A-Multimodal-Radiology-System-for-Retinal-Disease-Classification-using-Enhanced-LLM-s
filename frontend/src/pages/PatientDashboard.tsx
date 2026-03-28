import { 
  Upload, 
  FileText, 
  Clock, 
  MessageSquare, 
  Settings, 
  Activity, 
  ShieldCheck, 
  BrainCircuit,
  ArrowUpRight,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [profile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { fullName: 'Divitha Nuthakki', role: 'PATIENT' };
  });

  const cards = [
    { 
      id: 'analysis', 
      title: 'Inference Scan', 
      label: 'Start AI Analysis', 
      action: '/analysis', 
      icon: Upload, 
      color: 'bg-primary',
      desc: 'Submit your clinical scans for neural processing.'
    },
    { 
      id: 'assistant', 
      title: 'AI Assistant', 
      label: 'Consult Intel Hub', 
      action: '/chatbot', 
      icon: MessageSquare, 
      color: 'bg-indigo-600',
      desc: 'Get expert interpretation of your diagnostic data.'
    },
    { 
      id: 'records', 
      title: 'Digital Records', 
      label: 'View Telemetry', 
      action: '/clinical-records', 
      icon: FileText, 
      color: 'bg-emerald-500',
      desc: 'Access your secure Yashoda Hospitals clinical dossier.'
    },
    { 
      id: 'settings', 
      title: 'Profile Settings', 
      label: 'Identity Config', 
      action: '/settings', 
      icon: Settings, 
      color: 'bg-slate-800',
      desc: 'Manage your patient credentials and optics.'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Dashboard Header - Synchronized Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                 <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
                Patient <span className="text-primary italic">Mission</span> Control
              </h1>
           </div>
           <p className="text-gray-400 font-medium text-sm">Welcome back, <span className="text-text-main font-black underline decoration-primary/20 underline-offset-4">{profile.fullName}</span>. Your diagnostic telemetry is active.</p>
        </div>

        <div className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-2xl italic group hover:border-primary transition-all shadow-sm">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest italic text-gray-500">Neural Link Active | V-8003</span>
        </div>
      </div>

      {/* Main Mission Cards - 100vh Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, idx) => (
          <div 
            key={item.id}
            onClick={() => navigate(item.action)}
            className="mission-hub-card animate-slide-up group border-none glimmer-effect"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className={`p-4 rounded-2xl ${item.color}/5 mb-4 group-hover:${item.color} group-hover:text-white transition-all duration-700 shadow-sm border border-gray-100 group-hover:border-transparent group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden`}>
              <item.icon className={`w-6 h-6 ${item.color.replace('bg-', 'text-')} group-hover:text-white transition-all duration-500`} />
              <div className="absolute inset-0 bg-white/10 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            </div>
            
            <div className="space-y-2 relative z-10 w-full">
               <div>
                  <h3 className="text-lg font-black text-text-main group-hover:text-primary transition-colors tracking-tight italic">{item.title}</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 italic">{item.desc}</p>
               </div>
               
               <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 group-hover:border-primary/10 transition-colors">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-primary transition-colors italic">{item.label}</span>
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2">
                     <ArrowUpRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Timeline - Compact Sync */}
      <div className="medical-card p-8 bg-white flex flex-col justify-between group">
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 transition-transform group-hover:rotate-12">
                     <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-text-main italic tracking-tighter italic">Timeline Sync</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Yashoda Hospitals</p>
                  </div>
               </div>
               <button 
                 onClick={() => navigate('/clinical-records')}
                 className="px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-gray-100 hover:bg-white hover:text-primary hover:shadow-xl transition-all"
               >
                  Audit Telemetry
               </button>
            </div>

            <div className="group/item flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-2xl hover:border-primary/10 transition-all duration-700">
               <div className="flex items-center gap-6">
                  <div className="relative">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse" />
                     <div className="absolute inset-0 bg-emerald-500/20 rounded-full scale-[4] animate-ping opacity-10" />
                  </div>
                  <div>
                     <p className="text-lg font-black text-text-main tracking-tight group-hover/item:text-primary transition-colors italic">Neural Fundus Identification</p>
                     <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Node ID</span>
                           <span className="px-2 py-0.5 bg-white border border-gray-100 rounded-md text-[9px] font-black text-primary italic">#LV-94821</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Status</span>
                           <span className="text-[9px] font-black text-emerald-600 italic">Synchronized</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary group-hover/item:scale-110 shadow-sm transition-transform">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Promotion Panel - Compact Hub */}
      <div className="medical-card p-10 bg-indigo-950 text-white relative group overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-6 max-w-xl text-center md:text-left">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-3xl rounded-xl border border-white/20 text-[8px] font-black uppercase tracking-[0.3em] italic">
                  <Activity className="w-3 h-3 text-secondary animate-pulse" />
                  Neural Telemetry Active
               </div>
               <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic leading-[1.1]">
                  Expert <span className="text-secondary italic">Intelligence Hub</span>
               </h2>
               <p className="text-indigo-100/60 font-medium text-sm italic">
                 Connect with clinical AI for interpretation of your diagnostic data.
               </p>
            </div>
            
            <button 
              onClick={() => navigate('/chatbot')}
              className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-110 hover:shadow-primary/20 active:scale-95 transition-all flex items-center gap-4 italic"
            >
               <BrainCircuit className="w-5 h-5" />
               Join Intel Hub
            </button>
         </div>
         <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}
