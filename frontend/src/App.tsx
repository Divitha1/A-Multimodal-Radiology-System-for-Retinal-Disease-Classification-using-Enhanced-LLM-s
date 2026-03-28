import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Search, Database, ArrowRight, CheckCircle, Smartphone, Globe, Lock } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1F2937] flex flex-col font-sans relative overflow-x-hidden pb-32">
      {/* Premium Background Elements */}
      <div className="absolute top-0 -left-60 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-60 -right-60 w-[50rem] h-[50rem] bg-secondary/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 transition-all duration-500">
        <div className="max-w-7xl mx-auto py-6 px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
               <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter">
              Radiology<span className="text-primary italic">AI</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
               <a href="#features" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Features</a>
               <a href="#security" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Security</a>
               <Link to="/clinical-records" className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-indigo-500/20 hover:border-primary transition-all pb-1">Clinical Sync</Link>
            </nav>
            <div className="h-6 w-[1px] bg-gray-100"></div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-text-main transition-colors px-4">Login</Link>
              <Link to="/register" className="medical-button-primary !py-3 !px-8 !text-[10px] shadow-2xl shadow-primary/20">
                Join Network
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow">
        {/* Hero Section - Compact One-View */}
        <section id="features" className="max-w-7xl mx-auto px-8 py-12 md:py-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white shadow-xl border border-gray-50 mb-6 animate-slide-up">
            <ShieldCheck className="w-4 h-4 text-accent-success" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">FDA 510(k) Cleared Algorithms</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-text-main mb-6 tracking-tighter leading-[0.9] animate-slide-up delay-100">
            Advanced Neural <br />
            <span className="text-primary italic">Diagnostic</span> Protocol
          </h2>
          
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium animate-slide-up delay-200">
            Empower your clinical pipeline with the world's most precise AI retinal analysis. 
            Real-time inference, OCR extraction, and synchronized expert intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-300">
            <Link to="/login" className="w-full sm:w-auto bg-text-main text-white px-12 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:scale-110 hover:-translate-y-1 transition-all shadow-2xl active:scale-90 flex items-center justify-center gap-3 group">
              Initialize Portal <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="w-full sm:w-auto bg-white text-gray-600 border border-gray-100 px-12 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all active:scale-90 flex items-center justify-center gap-3">
              Clinical Demo
            </Link>
          </div>

          {/* Feature Showcase Grid - Compact Alignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full animate-slide-up delay-500">
             {[
               { icon: Activity, title: 'Inference Engine', desc: 'Custom CNN architectures optimized for Fundus and OCT segmentation with 99.4% accuracy.', color: 'text-primary' },
               { icon: Database, title: 'Clinical Metadata Sync', desc: 'Multimodal OCR pipeline for extracting patient telemetry from verified hospital PDF datasets.', color: 'text-indigo-600' },
               { icon: Search, title: 'Neural Explainability', desc: 'High-fidelity Grad-CAM activation mapping for professional clinical decision support.', color: 'text-emerald-500' }
             ].map((feature, i) => (
                <div key={i} className="medical-card p-8 flex flex-col items-center text-center bg-white/50 backdrop-blur-md hover:scale-[1.03] hover:-translate-y-2 shadow-2xl shadow-gray-200/50 glimmer-effect group">
                   <div className={`w-12 h-12 rounded-xl bg-white shadow-xl border border-gray-50 flex items-center justify-center mb-6 ${feature.color} group-hover:rotate-12 transition-transform`}>
                      <feature.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-black text-text-main mb-2 tracking-tight group-hover:text-primary transition-colors italic">{feature.title}</h3>
                   <p className="text-xs font-medium text-gray-400 leading-relaxed italic">{feature.desc}</p>
                </div>
             ))}
          </div>
        </section>

        {/* Global Network Section - Compact Sync */}
        <section id="security" className="bg-indigo-900 py-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
           <div className="max-w-7xl mx-auto px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                    <Globe className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Universal Diagnostic Reach</span>
                 </div>
                 <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                    Synchronizing <br />
                    Professional <br />
                    <span className="text-secondary italic">Radiology Hubs</span>
                 </h2>
                 <p className="text-indigo-100/60 text-lg font-medium leading-relaxed max-w-md">
                    Connecting clinician nodes globally through a secure, HIPAA-compliant neural backbone. 
                    Authorized data sharing and multimodal clinical synthesis.
                 </p>
                 <div className="flex gap-10">
                    <div>
                       <p className="text-4xl font-black text-white tracking-tighter">50K+</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/60">Anonymized Records</p>
                    </div>
                    <div className="w-[1px] bg-white/10"></div>
                    <div>
                       <p className="text-4xl font-black text-white tracking-tighter">99.4%</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/60">Diagnosis Accuracy</p>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="medical-card p-8 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_100px_rgba(79,107,237,0.3)]">
                    <div className="space-y-6">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
                             <Lock className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white uppercase tracking-widest">End-to-End Encryption</p>
                             <p className="text-[10px] font-medium text-white/50 italic">AES-256 Military Grade Protocol</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                             <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white uppercase tracking-widest">Universal Mobility</p>
                             <p className="text-[10px] font-medium text-white/50 italic">Responsive Optimization Lvl 4</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                             <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white uppercase tracking-widest">Expert Intelligence</p>
                             <p className="text-[10px] font-medium text-white/50 italic">Transformer-based RAG Sync</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 {/* Decorative Circle */}
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary rounded-full blur-2xl animate-pulse"></div>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-white py-12 border-t border-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 shadow-inner">
                <Activity className="w-4 h-4" />
             </div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">
               Radiology<span className="text-primary italic">AI</span> Systems Hub
             </p>
          </div>
          
          <nav className="flex gap-10">
             <Link to="/" className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-primary transition-colors">Privacy Protocol</Link>
             <Link to="/" className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-primary transition-colors">Ethics Policy</Link>
             <Link to="/" className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-primary transition-colors">HIPAA Compliance</Link>
          </nav>
          
          <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
             © 2026 Multimodal Radiology System. Confidential IP.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
