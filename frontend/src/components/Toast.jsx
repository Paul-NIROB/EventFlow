import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    info: 'bg-accent/20 border-accent/50 text-accent-light',
  }[type] || 'bg-dark-lighter border-white/10 text-text';

  return (
    <div className={`${bgColor} glass backdrop-blur-lg px-6 py-3 rounded-xl border flex items-center justify-between min-w-[300px] animate-fade-in-up`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white/50 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
