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
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('https://your-backend-url.onrender.comhttps://your-backend-url.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let data: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.detail || `Diagnostic node returned status ${response.status}. Verify backend link.`);
      }

      localStorage.setItem('token', data.access_token);
      
      // Fetch user profile to ensure localStorage is in sync for demo features
      const meResponse = await fetch('https://your-backend-url.onrender.comhttps://your-backend-url.onrender.com/api/auth/me', {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      
      if (!meResponse.ok) {
        throw new Error("Neural profile synchronization failed. Re-authenticating...");
      }
      
      const meData = await meResponse.json();
      
      localStorage.setItem('user_profile', JSON.stringify({
        fullName: meData.full_name,
        email: meData.email,
        role: meData.role,
        bio: meData.bio,
        theme: meData.theme
      }));

      if (meData.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err: any) {
      if (err.name === 'SyntaxError') {
        setError("Neural Hub returned an invalid payload. The backend link may be interrupted.");
      } else {
        setError(err.message || "An unexpected telemetry error occurred.");
      }
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
