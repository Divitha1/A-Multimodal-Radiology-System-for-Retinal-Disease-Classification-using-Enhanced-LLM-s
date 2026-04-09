import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Demo Mode: Mock login delay and success
      await new Promise(resolve => setTimeout(resolve, 800));

      localStorage.setItem('token', 'demo_token_123');
      
      // Fallback profile if none exists from register
      let userProfile = localStorage.getItem('user_profile');
      let profileObj = userProfile ? JSON.parse(userProfile) : null;
      
      if (!profileObj) {
        profileObj = {
          fullName: 'Demo Doctor',
          email: email,
          role: 'doctor', // default to doctor for dashboard demo
          bio: 'Radiology Specialist',
          theme: 'light'
        };
        localStorage.setItem('user_profile', JSON.stringify(profileObj));
      }

      if (profileObj.role === 'radiologist' || profileObj.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err: any) {
      setError(err.message || "An unexpected telemetry error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center-vh bg-background">
      <div className="medical-card max-w-[440px] w-full p-10 animate-slide-up">
        
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 bg-indigo-500/10 rounded-2xl items-center justify-center mb-4">
             <span className="text-3xl">🏥</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-text-main">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Healthcare Dashboard Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold animate-slide-up">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              disabled={loading}
              className="medical-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. srinivas@hospital.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 ml-1">Protected Password</label>
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
            className="medical-button-primary mt-4"
          >
            {loading ? (
               <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Authorize & Sign In"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Don't have clinical access?{' '}
            <Link to="/register" className="text-primary hover:underline font-bold transition-all">
              Request Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
