import { useState, useEffect, useCallback, useRef } from 'react';
import { Compass, ExternalLink, RefreshCw, Layers, Download, Users, Filter } from 'lucide-react';
import { fetchRandomMod, getModUrl, type ModrinthProject } from './services/modrinth';

const PROJECT_TYPES = [
  { id: 'any', name: 'All Types' },
  { id: 'mod', name: 'Mods' },
  { id: 'resourcepack', name: 'Resource Packs' },
  { id: 'shader', name: 'Shaders' },
  { id: 'modpack', name: 'Modpacks' },
];

const CATEGORIES = [
  { id: 'any', name: 'All Categories' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'magic', name: 'Magic' },
  { id: 'technology', name: 'Technology' },
  { id: 'optimization', name: 'Optimization' },
  { id: 'decoration', name: 'Decoration' },
  { id: 'utility', name: 'Utility' },
  { id: 'worldgen', name: 'World Generation' },
];

function App() {
  const [currentMod, setCurrentMod] = useState<ModrinthProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectType, setProjectType] = useState('mod');
  const [category, setCategory] = useState('any');

  const initialFetchDone = useRef(false);

  const handleHike = useCallback(async (forcedFilters?: { projectType: string, category: string }) => {
    setLoading(true);
    setError(null);
    try {
      const filters = forcedFilters
        ? { project_type: forcedFilters.projectType, category: forcedFilters.category }
        : { project_type: projectType, category: category };

      const mod = await fetchRandomMod(filters);
      setCurrentMod(mod);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to find a new path. Try again!');
    } finally {
      setLoading(false);
    }
  }, [projectType, category]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      handleHike();
      initialFetchDone.current = true;
    }
  }, [handleHike]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-white font-sans bg-[#050505] selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Compass className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">ModHiker</h1>
        </div>

        {/* Quick Filters */}
        <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-3">
            <Filter className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Filters</span>
          </div>

          <select
            value={projectType}
            onChange={(e) => {
              setProjectType(e.target.value);
              handleHike({ projectType: e.target.value, category });
            }}
            className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer hover:text-emerald-400 transition-colors outline-none"
          >
            {PROJECT_TYPES.map(type => (
              <option key={type.id} value={type.id} className="bg-[#0a0a0a]">{type.name}</option>
            ))}
          </select>

          <div className="w-px h-4 bg-white/10" />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleHike({ projectType, category: e.target.value });
            }}
            className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer hover:text-emerald-400 transition-colors outline-none pr-4"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">{cat.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl w-full">
        {loading ? (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="relative">
              <RefreshCw className="w-16 h-16 animate-spin text-emerald-500" />
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-gray-400 tracking-tight">Scouting the next trail...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/10 border border-red-500/20 p-10 rounded-3xl text-center backdrop-blur-md max-w-lg mx-auto">
            <p className="text-2xl font-bold text-red-400 mb-6">{error}</p>
            <button
              onClick={() => handleHike()}
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
                  onClick={() => handleHike()}
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

      {/* Mobile Filters */}
      <div className="md:hidden fixed bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
         <select
            value={projectType}
            onChange={(e) => {
              setProjectType(e.target.value);
              handleHike({ projectType: e.target.value, category });
            }}
            className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
          >
            {PROJECT_TYPES.map(type => (
              <option key={type.id} value={type.id} className="bg-[#0a0a0a]">{type.name}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleHike({ projectType, category: e.target.value });
            }}
            className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">{cat.name}</option>
            ))}
          </select>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-10 text-center pointer-events-none">
        <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.3em]">
          ModHiker &copy; 2024 &bull; Inspired by Cloud Hiker &bull; Modrinth Engine
        </p>
      </footer>
    </div>
  );
}

export default App;
