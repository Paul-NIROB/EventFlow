import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  useEffect(() => {
    document.title = "EventFlow — Login";
  }, []);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await login(formData);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="glass p-8 md:p-10 rounded-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-heading">Welcome Back</h1>
          <p className="text-text/60">Login to manage your events and registrations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-accent uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com" 
              className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-colors`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-accent uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-colors`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password}</p>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-lg transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-text/60">
          Don't have an account? {' '}
          <Link to="/register" className="text-accent font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
