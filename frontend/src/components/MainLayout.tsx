import { type ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Activity, 
  ShieldCheck, 
  Bell,
  Menu,
  X,
  User
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const [profile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { fullName: 'Radiologist User', role: 'RADIOLOGIST' };
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Hub', path: '/doctor-dashboard' },
    { icon: Search, label: 'Analysis', path: '/analysis' },
    { icon: FileText, label: 'Records', path: '/clinical-records' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/chatbot' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-mesh relative">
      {/* Floating Glassmorphism Header */}
      <header className={`glass-header ${isScrolled ? 'top-4 w-[95%] py-3' : 'top-6 py-4'}`}>
        <div className="px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
               <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-text-main">
              RADIOLOGY<span className="text-primary italic">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-[1.5rem] border border-gray-200/30">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === item.path
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-400 hover:text-text-main hover:bg-white/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate('/settings')}
               className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-danger rounded-full border-2 border-white" />
             </button>
             
             <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                   <p className="text-[10px] font-black text-text-main tracking-tight leading-none mb-1">{profile.fullName}</p>
                   <div className="flex items-center justify-end gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-accent-success" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Verified {profile.role}</span>
                   </div>
                </div>
                <Link to="/settings" className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-primary transition-colors">
                   <User className="w-5 h-5" />
                </Link>
             </div>

             <button 
               onClick={handleLogout}
               className="lg:hidden p-2 text-gray-400 hover:text-accent-danger transition-colors"
             >
                <LogOut className="w-5 h-5" />
             </button>
             
             <button 
               onClick={() => setShowMobileMenu(!showMobileMenu)}
               className="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors"
             >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Navigation */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md" onClick={() => setShowMobileMenu(false)} />
           <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[2.5rem] p-8 shadow-2xl animate-slide-up">
              <div className="space-y-4">
                 {menuItems.map((item) => (
                   <Link
                     key={item.path}
                     to={item.path}
                     onClick={() => setShowMobileMenu(false)}
                     className={`flex items-center gap-4 p-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                       location.pathname === item.path
                         ? 'bg-indigo-500/10 text-primary border border-indigo-500/20'
                         : 'text-gray-500 hover:bg-gray-50'
                     }`}
                   >
                     <item.icon className="w-5 h-5" />
                     {item.label}
                   </Link>
                 ))}
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-4 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-accent-danger hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                 >
                    <LogOut className="w-5 h-5" />
                    Secure Sign Out
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Content Area with Page Transitions */}
      <main className="pt-24 pb-64 px-6 max-w-7xl mx-auto min-h-[110vh] relative">
        <div className="animate-slide-up h-full">
          {children}
        </div>
        {/* Force Motion Buffer */}
        <div className="deep-scroll-buffer" />
      </main>
    </div>
  );
}
