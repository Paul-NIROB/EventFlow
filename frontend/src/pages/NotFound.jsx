import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative">
        <h1 className="text-[150px] font-bold font-heading leading-none opacity-10">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold font-heading">Page Not Found</p>
        </div>
      </div>
      
      <p className="text-text/60 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link 
        to="/" 
        className="bg-accent hover:bg-accent-hover px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-accent/20"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
