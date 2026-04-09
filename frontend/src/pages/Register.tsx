import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Stethoscope } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'radiologist' | 'patient'>('patient');
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Demo Mode: Mock registration delay and success
      await new Promise(resolve => setTimeout(resolve, 800));

      // Persist user profile for demo clinical reports fallback
      localStorage.setItem('user_profile', JSON.stringify({ 
        fullName, 
        email, 
        role,
        joinedDate: new Date().toISOString()
      }));
      
      console.log("Registration successful");
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center-vh bg-background">
      <div className="medical-card max-w-[460px] w-full p-10 animate-slide-up">
        
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 bg-indigo-500/10 rounded-2xl items-center justify-center mb-4 transition-transform hover:scale-110">
             <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-text-main">Create Account</h2>
          <p className="text-gray-500 mt-2 font-medium">Join the Radiology AI Network</p>
        </div>

        {/* Professional Role Selection */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-10">
          <button
            onClick={() => setRole('radiologist')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-bold rounded-xl transition-all ${
              role === 'radiologist' 
                ? 'medical-card !shadow-sm !rounded-xl text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Radiologist</span>
          </button>
          <button
            onClick={() => setRole('patient')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-bold rounded-xl transition-all ${
              role === 'patient' 
                ? 'medical-card !shadow-sm !rounded-xl text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient</span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold animate-slide-up">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 ml-1">Full Identity Name</label>
            <input
              type="text"
              required
              disabled={loading}
              className="medical-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Jane Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              disabled={loading}
              className="medical-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@institute.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 ml-1">Secure Password</label>
            <input
              type="password"
              required
              disabled={loading}
              className="medical-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="medical-button-primary mt-6 !py-4"
          >
            {loading ? (
               <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              `Register as ${role === 'radiologist' ? 'Radiologist' : 'Patient'}`
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold transition-all">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
