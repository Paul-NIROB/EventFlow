const LoadingSkeleton = () => {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/3" />
        <div className="h-6 bg-white/5 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-between">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-4 bg-white/5 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
