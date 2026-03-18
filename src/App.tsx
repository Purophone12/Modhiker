import { useState, useEffect, useCallback } from 'react';
import { Compass, ExternalLink, RefreshCw, Layers, Download, Users } from 'lucide-react';
import { fetchRandomMod, getModUrl, type ModrinthProject } from './services/modrinth';

function App() {
  const [currentMod, setCurrentMod] = useState<ModrinthProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleHike = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const mod = await fetchRandomMod();
      setCurrentMod(mod);
    } catch (err) {
      console.error(err);
      setError('Failed to find a new path. Try again!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleHike();
  }, [handleHike]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-white font-sans bg-[#050505] selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Compass className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">ModHiker</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-0 max-w-5xl w-full">
        {loading ? (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="relative">
              <RefreshCw className="w-16 h-16 animate-spin text-emerald-500" />
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-gray-400 tracking-tight">Scouting the next trail...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/10 border border-red-500/20 p-10 rounded-3xl text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-red-400 mb-6">{error}</p>
            <button
              onClick={handleHike}
              className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-xl"
            >
              Try Again
            </button>
          </div>
        ) : currentMod && (
          <div className="w-full bg-white/[0.03] border border-white/10 rounded-[40px] p-10 md:p-14 backdrop-blur-3xl shadow-2xl flex flex-col lg:flex-row gap-12 items-center lg:items-start transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
            {/* Project Icon */}
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {currentMod.icon_url ? (
                <img
                  src={currentMod.icon_url}
                  alt={currentMod.title}
                  className="relative w-40 h-40 md:w-64 md:h-64 rounded-[32px] object-cover shadow-2xl border border-white/10"
                />
              ) : (
                <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-[32px] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center">
                  <Compass className="w-20 h-20 text-emerald-500/50" />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="flex-grow flex flex-col gap-6 text-center lg:text-left overflow-hidden">
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-full tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    {currentMod.project_type}
                  </span>
                  {currentMod.categories.slice(0, 4).map(cat => (
                    <span key={cat} className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase rounded-full border border-white/5 tracking-wider">
                      {cat}
                    </span>
                  ))}
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter truncate py-1">
                  {currentMod.title}
                </h2>

                <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed line-clamp-3">
                  {currentMod.description}
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-2.5">
                  <Download className="w-5 h-5 text-emerald-500" />
                  <span>{currentMod.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>{currentMod.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-purple-500" />
                  <span>{currentMod.game_versions[0]}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <a
                  href={getModUrl(currentMod)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-xl group"
                >
                  Explore Mod
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

                <button
                  onClick={handleHike}
                  className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all duration-300 active:scale-95 flex items-center gap-3 border border-white/10 shadow-xl"
                >
                  <RefreshCw className="w-5 h-5" />
                  Next Trail
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-10 text-center pointer-events-none">
        <p className="text-gray-700 text-xs font-bold uppercase tracking-[0.2em]">
          ModHiker &copy; 2024 &bull; Inspired by Cloud Hiker &bull; Modrinth Engine
        </p>
      </footer>
    </div>
  );
}

export default App;
