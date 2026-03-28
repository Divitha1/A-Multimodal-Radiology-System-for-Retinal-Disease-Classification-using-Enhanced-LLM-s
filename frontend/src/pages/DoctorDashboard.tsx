import { 
  Activity, 
  Search, 
  MessageSquare, 
  Settings, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Database,
  BrainCircuit,
  TrendingUp,
  User,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { fullName: 'Dr. Divitha Nuthakki', role: 'RADIOLOGIST' };
  });

  const cards = [
    { 
      id: 'analysis', 
      title: 'Neural Scan', 
      label: 'Execute Diagnostic Link', 
      action: '/analysis', 
      icon: Search, 
      color: 'bg-primary',
      desc: 'Multimodal Retinal Fundus & OCT Interpretation.'
    },
    { 
      id: 'records', 
      title: 'Clinical Repository', 
      label: 'Audit Metadata Hub', 
      action: '/clinical-records', 
      icon: Database, 
      color: 'bg-emerald-600',
      desc: 'Institutional Patient Dossiers & Fused Telemetry.'
    },
    { 
      id: 'assistant', 
      title: 'AI Intelligence', 
      label: 'Consult expert RAG', 
      action: '/chatbot', 
      icon: MessageSquare, 
      color: 'bg-indigo-600',
      desc: 'Synchronized Clinical Knowledge Base Interaction.'
    },
    { 
      id: 'settings', 
      title: 'Identity Profile', 
      label: 'Configure Auth Protocol', 
      action: '/settings', 
      icon: Settings, 
      color: 'bg-slate-800',
      desc: 'Manage Clinician Credentials & Neural Workspace.'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Area - Compact Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                 <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
                Mission <span className="text-primary">Hub</span>
              </h1>
           </div>
           <p className="text-gray-400 font-medium text-sm">Welcome back, <span className="text-text-main font-black underline decoration-primary/20 underline-offset-4">{profile.fullName}</span>. Neural telemetry is synchronized at Yashoda Hospitals.</p>
        </div>

        <div className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-2xl italic group hover:border-primary transition-all shadow-sm">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest italic text-gray-500">Telemetry Active | V-8003</span>
        </div>
      </div>

      {/* Main Mission Cards - 100vh Redirection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, idx) => (
          <div 
            key={item.id}
            onClick={() => navigate(item.action)}
            className="mission-hub-card animate-slide-up group glimmer-effect"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className={`p-4 rounded-2xl ${item.color}/5 mb-4 group-hover:${item.color} group-hover:text-white transition-all duration-700 shadow-sm border border-gray-100 group-hover:border-transparent group-hover:scale-110 group-hover:-rotate-3 relative overflow-hidden`}>
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
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                     <ArrowUpRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Panel - Content Restoration (Previously had stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 medical-card p-8 bg-indigo-950 text-white relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black italic tracking-tighter italic">Operational Telemetry</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-200/40 italic">Weekly Clinical Synchronicity</p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Neural Inferences', val: '1,284', grow: '+12.4%', icon: Activity },
                    { label: 'Dataset Sync', val: '432', grow: 'Optimal', icon: Database },
                    { label: 'Expert Consults', val: '89', grow: 'Secured', icon: BrainCircuit }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <p className="text-[9px] font-black uppercase tracking-widest text-indigo-100/30 flex items-center gap-2">
                         <stat.icon className="w-3 h-3" /> {stat.label}
                       </p>
                       <div>
                          <p className="text-2xl font-black italic">{stat.val}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mt-0.5">{stat.grow} Efficiency</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="inline-block h-10 w-10 rounded-xl ring-4 ring-indigo-950 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                         <User className="w-5 h-5" />
                      </div>
                    ))}
                    <div className="inline-block h-10 w-10 rounded-xl ring-4 ring-indigo-950 bg-primary flex items-center justify-center text-white text-[9px] font-black">+14</div>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-100/40 italic">Verified Clinician Network Active</p>
               </div>
            </div>
         </div>

         <div className="medical-card p-8 bg-white flex flex-col justify-between group">
            <div className="space-y-6">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 transition-transform group-hover:rotate-12">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-xs font-black text-text-main italic tracking-tight uppercase tracking-widest mb-1 italic">HIPAA Compliance</h4>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-relaxed">
                    Automated clinical telemetry security synchronized with AES-256 node encryption.
                  </p>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-400 font-bold">
                     <Clock className="w-3.5 h-3.5" />
                     <span className="text-[8px] font-black uppercase tracking-widest">Last Sync: {new Date().toLocaleTimeString()}</span>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => navigate('/chatbot')}
              className="mt-8 group/btn flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-500/20 hover:bg-primary/[0.02] transition-all"
            >
               <div className="flex items-center gap-4">
                  <BrainCircuit className="w-8 h-8 text-primary opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                  <div className="text-left">
                     <p className="text-[10px] font-black text-text-main group-hover/btn:text-primary transition-colors">AI Intelligence Hub</p>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Start Consultation</p>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-text-main opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all" />
            </button>
         </div>
      </div>
    </div>
  );
}
