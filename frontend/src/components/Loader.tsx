const Loader = () => {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-400">
            Loading...
          </span>
        </div>
      </div>
    );
  };
  
  export default Loader;
  