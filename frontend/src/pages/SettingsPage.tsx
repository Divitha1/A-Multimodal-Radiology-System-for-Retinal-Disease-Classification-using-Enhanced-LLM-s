import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  CheckCircle, 
  Loader2, 
  Save, 
  Mail, 
  Phone, 
  Lock, 
  Monitor, 
  Sun, 
  ShieldCheck, 
  Key, 
  AlertTriangle,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Original Functional State Restoration
  const [profile, setProfile] = useState({
    full_name: 'Dr. Divitha Nuthakki',
    email: 'radiologist@test.com',
    bio: 'Senior Radiologist at Yashoda Hospitals. Specialized in multimodal diagnostic telemetry and retinal pathology synthesis.',
    notifications_enabled: true,
    theme: 'light',
    two_factor_enabled: true,
    email_alerts: true,
    urgent_sms: false
  });

  const handleSave = async (updates = {}) => {
    setLoading(true);
    setSaved(false);
    
    setTimeout(() => {
      setProfile(prev => ({ ...prev, ...updates }));
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Identity Protocol', icon: User },
    { id: 'notifications', label: 'Telemetry Alerts', icon: Bell },
    { id: 'security', label: 'Auth Protocols', icon: Shield },
    { id: 'appearance', label: 'Interface Optics', icon: Monitor }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      {/* Header - Content Restoration */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                 <Settings className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
                Account <span className="text-primary">Intelligence</span>
              </h1>
           </div>
           <p className="text-gray-400 font-medium text-sm">Synchronize clinician credentials and neural workspace optics.</p>
        </div>

        <div className="flex items-center gap-3">
           {saved && (
             <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 animate-slide-down">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Sync Complete</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Navigation Column - Animated Theme Motion */}
        <div className="lg:col-span-1 space-y-4">
           <div className="medical-card p-4 bg-white space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                      : 'text-gray-400 hover:text-text-main hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                </button>
              ))}
           </div>

           <div className="medical-card p-8 bg-indigo-950 text-white group overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/20 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
              <div className="relative z-10 space-y-4">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-40 italic">Institution Grade</p>
                 <h4 className="text-sm font-black italic tracking-tight italic leading-relaxed">Secure Node Synchronization Active</h4>
              </div>
           </div>
        </div>

        {/* Content Portal - Original Logic Restoration */}
        <div className="lg:col-span-3">
           <div className="medical-card p-12 bg-white animate-slide-up">
              {activeTab === 'profile' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="relative group">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 border-4 border-white shadow-2xl flex items-center justify-center text-gray-400 group-hover:rotate-6 transition-transform">
                            <User className="w-12 h-12" />
                         </div>
                         <button onClick={() => alert("Access Key Rotation Initiated")} className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-xl border-4 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                            <Key className="w-5 h-5" />
                         </button>
                      </div>
                      <div className="text-center md:text-left space-y-2">
                         <h3 className="text-2xl font-black text-text-main italic tracking-tight">{profile.full_name}</h3>
                         <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic underline decoration-primary/20 underline-offset-4">{profile.email}</p>
                         <p className="text-gray-400 text-xs font-medium">Yashoda Hospitals Radiologist-8003</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Full Forensic Name</label>
                         <input 
                           type="text" 
                           value={profile.full_name}
                           onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                           className="medical-input" 
                         />
                      </div>
                      <div className="space-y-4">
                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Verified Clinical Endpoint</label>
                         <input 
                           type="email" 
                           value={profile.email} 
                           disabled
                           className="medical-input opacity-60 cursor-not-allowed" 
                         />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Clinician Biography</label>
                         <textarea 
                           rows={4}
                           value={profile.bio}
                           onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                           className="medical-input resize-none" 
                         />
                      </div>
                   </div>

                   <button 
                     onClick={() => handleSave()}
                     disabled={loading}
                     className="medical-button-primary"
                   >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {loading ? 'Synchronizing Profile...' : 'Execute Profile Commit'}
                   </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-text-main tracking-tight italic">Telemetry Alert Matrix</h3>
                      <p className="text-gray-400 text-xs font-medium">Configure neural synchronization alerts and institutional reporting.</p>
                   </div>
                   
                   <div className="space-y-4">
                      {[
                        { id: 'notifications_enabled', label: 'Neural Platform Alerts', desc: 'Critical system heuristics and inference completion telemetry', icon: Bell },
                        { id: 'email_alerts', label: 'Diagnostic PDF Sync', desc: 'Automated clinical report delivery to primary verified endpoint', icon: Mail },
                        { id: 'urgent_sms', label: 'Priority Mobile Uplink', desc: 'Immediate notification for high-risk diagnostic classifications', icon: Phone }
                      ].map(pref => (
                        <div key={pref.id} className="group p-8 bg-gray-50/50 border border-transparent rounded-[2rem] hover:bg-white hover:border-gray-100 hover:shadow-xl transition-all flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary shadow-sm group-hover:rotate-12 transition-all">
                                 <pref.icon className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className="text-xs font-black text-text-main italic uppercase tracking-wider">{pref.label}</h4>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mt-0.5">{pref.desc}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleSave({ [pref.id]: !(profile as any)[pref.id] })}
                             className={`w-16 h-8 rounded-full transition-all relative p-1.5 shadow-inner ${
                             (profile as any)[pref.id] ? 'bg-primary shadow-primary/20' : 'bg-gray-200'
                           }`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
                                (profile as any)[pref.id] ? 'translate-x-8' : 'translate-x-0'
                              }`} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-12 animate-fade-in text-center py-10 max-w-xl mx-auto">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-100 shadow-xl shadow-emerald-500/10 mb-8">
                      <ShieldCheck className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-text-main italic tracking-tighter italic">Secure Node Protocol</h3>
                   <p className="text-gray-400 font-medium text-sm leading-relaxed italic">
                      Clinician identity is synchronized with AES-256 grade encryption. Access to retinal telemetry requires verified institutional authorization.
                   </p>
                   
                   <div className="grid grid-cols-1 gap-4 pt-10">
                      <button onClick={() => alert("Access Key Rotation Initiated")} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between group hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all">
                         <div className="flex items-center gap-4">
                            <Lock className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-text-main italic">Rotate Access Key</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-gray-300" />
                      </button>
                      <button onClick={() => alert("2FA Protocol Settings Accessed")} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between group hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all">
                         <div className="flex items-center gap-4">
                            <Key className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-text-main italic">Finalize 2FA Protocol</span>
                         </div>
                         <div className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest italic animate-pulse">
                            Active
                         </div>
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-text-main tracking-tight italic">Interface Optics</h3>
                      <p className="text-gray-400 text-xs font-medium italic">Configure visual synchronization for neural workspace precision.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {['light', 'dark'].map(theme => (
                        <button
                          key={theme}
                          onClick={() => handleSave({ theme })}
                          className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 group relative overflow-hidden ${
                            profile.theme === theme 
                              ? 'border-primary bg-primary/[0.03] shadow-2xl shadow-primary/10' 
                              : 'border-gray-50 bg-gray-50 hover:bg-white hover:shadow-xl'
                          }`}
                        >
                           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${
                             profile.theme === theme ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-gray-100 text-gray-300'
                           }`}>
                              {theme === 'light' ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
                           </div>
                           <h4 className={`text-xs font-black uppercase tracking-widest italic ${profile.theme === theme ? 'text-primary' : 'text-gray-400'}`}>
                              {theme === 'light' ? 'Solar Interface (Standard)' : 'Deep Neural (Dark)'}
                           </h4>
                           {profile.theme === theme && (
                             <div className="absolute top-4 right-4 text-primary">
                                <CheckCircle className="w-5 h-5" />
                             </div>
                           )}
                        </button>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* Bottom Warning Matix (Content Restoration) */}
           <div className="mt-10 p-10 bg-red-50/50 border border-red-100 rounded-[2.5rem] flex items-center justify-between group">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-100 group-hover:rotate-12 transition-transform">
                    <AlertTriangle className="w-8 h-8" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-red-600 italic uppercase tracking-widest italic leading-none mb-1">Danger Zone Protocol</h4>
                    <p className="text-[9px] font-black text-red-400/60 uppercase tracking-widest italic">Revoke institutional clinician credentials and wipe neural buffer.</p>
                 </div>
              </div>
              <button onClick={() => alert("Systems Deactivation Initiated... Admin Override Required.")} className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95 italic">
                 Deactivate Sync
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
