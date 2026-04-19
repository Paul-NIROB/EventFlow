import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-40 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-heading font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
          EventFlow
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-accent transition-colors font-medium">Explore</Link>
          {user ? (
            <>
              <Link to="/my-events" className="hover:text-accent transition-colors font-medium">My Events</Link>
              <Link to="/create-event" className="bg-accent hover:bg-accent-hover px-5 py-2 rounded-xl transition-all font-bold shadow-lg shadow-accent/20">
                Create Event
              </Link>
              <button onClick={handleLogout} className="text-text/60 hover:text-text transition-colors">
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
              <Link to="/register" className="bg-accent/10 border border-accent/30 hover:bg-accent/20 px-5 py-2 rounded-xl transition-all">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button could be added here */}
      </div>
    </nav>
  );
};

export default Navbar;
