import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, LayoutDashboard, MapPin, Star, 
  Sparkles, Upload, LogOut, Scissors, Eye, ArrowRight, 
  Check, Heart, Plus, X, Clock, DollarSign, Zap, 
  Shield, Play, Crown, TrendingUp, Flame, Lock, Trash2, 
  Activity, Bell, Menu, User
} from 'lucide-react';

// --- DATA INITIALE ---
const INITIAL_SALONS = [
  {
    id: 1, name: "BlackBlade", category: "Barbier", rating: 4.9,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    badges: ["Elite"], location: "Payerne",
    description: "Le repère des gentlemen.",
    drop: { active: true, label: "DROP VENDREDI", slots: 3 },
    services: [{ id: 101, name: "Fade Master", price: 45, duration: 45, desc: "Dégradé chirurgical.", videoMode: true, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=60" }]
  },
  {
    id: 2, name: "Le Studio", category: "Coiffure", rating: 5.0,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
    badges: ["L'Oréal"], location: "Lausanne",
    description: "Expertise couleur.",
    drop: { active: false },
    services: [{ id: 201, name: "Blond Polaire", price: 220, duration: 180, desc: "Transformation.", videoMode: true, image: "https://images.unsplash.com/photo-1617391767668-45452d9c0228?auto=format&fit=crop&w=400&q=60" }]
  }
];

// --- STORIES RAIL (L'ADDICTION VISUELLE) ---
const StoriesRail = ({ salons, onSelect }) => (
  <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pt-2 pb-6">
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center bg-zinc-900/50 backdrop-blur">
            <Plus size={24} className="text-zinc-500"/>
        </div>
        <span className="text-[10px] text-zinc-500 font-medium">Recherche</span>
    </div>
    
    {salons.map((s, i) => (
      <div key={s.id} onClick={() => onSelect(s)} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
        <div className={`w-16 h-16 rounded-full p-[2px] ${s.drop?.active ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 animate-spin-slow' : 'bg-gradient-to-tr from-zinc-700 to-zinc-900'}`}>
            <div className="w-full h-full rounded-full border-[2px] border-black overflow-hidden relative">
                <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                {s.drop?.active && <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px]"/>}
            </div>
        </div>
        <span className="text-[10px] text-white font-medium truncate w-16 text-center">{s.name}</span>
      </div>
    ))}
  </div>
);

// --- DIVINE CARD (HOLOGRAPHIQUE) ---
const DivineCard = ({ salon, onBook, isFavorite, onToggleFavorite, onDelete }) => (
  <div className="relative w-full rounded-[32px] overflow-hidden mb-8 bg-zinc-900/60 border border-white/5 backdrop-blur-md shadow-2xl animate-scale-in">
    {/* Image Principale */}
    <div className="relative aspect-[4/3]">
      <img src={salon.image} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      
      {/* Header Flottant */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
         <div className="flex gap-2">
            {salon.badges && salon.badges.map(b => <span key={b} className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase">{b}</span>)}
            {salon.drop?.active && <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-bold uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse"><Flame size={10}/> {salon.drop.label}</span>}
         </div>
         <div className="flex gap-2">
            <button onClick={(e) => {e.stopPropagation(); onToggleFavorite(salon.id)}} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition"><Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""}/></button>
            <button onClick={(e) => {e.stopPropagation(); onDelete(salon.id)}} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-zinc-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
         </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
         <h2 className="text-4xl font-black text-white leading-none tracking-tighter mb-1">{salon.name}</h2>
         <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1"><MapPin size={12}/> {salon.location}</p>
      </div>
    </div>

    {/* Section Services Holographique */}
    <div className="p-4 pt-0">
       <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {salon.services.map(s => (
             <div key={s.id} onClick={() => onBook(salon, s)} className="flex-shrink-0 w-64 bg-white/5 border border-white/5 rounded-2xl p-3 flex gap-3 cursor-pointer hover:bg-white/10 transition group">
                <div className="w-16 h-16 rounded-xl bg-black overflow-hidden relative shadow-lg">
                   <img src={s.image || salon.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"/>
                   {s.videoMode && <div className="absolute inset-0 flex items-center justify-center"><Play size={12} fill="white" className="text-white"/></div>}
                </div>
                <div className="flex flex-col justify-center">
                   <div className="text-white font-bold text-sm leading-tight">{s.name}</div>
                   <div className="text-indigo-400 font-mono text-xs mt-1">{s.price} CHF • {s.duration} min</div>
                </div>
                <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-white text-black self-center opacity-0 group-hover:opacity-100 transition transform scale-0 group-hover:scale-100"><Plus size={16}/></div>
             </div>
          ))}
       </div>
    </div>
  </div>
);

// --- CREATOR STUDIO (NEURAL ENGINE) ---
const ProWizard = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', city: '', category: 'Coiffure', description: '', image: null, services: [] });
  const [tempService, setTempService] = useState({ name: '', price: '', duration: '30' });
  const [rarityScore, setRarityScore] = useState(0); // NEURAL METRIC
  const fileRef = useRef(null);

  // Calcul du score de rareté en temps réel
  useEffect(() => {
    let score = 20;
    if (data.name.length > 5) score += 10;
    if (data.image) score += 30;
    if (data.services.length > 0) score += 20;
    if (data.services.some(s => Number(s.price) > 100)) score += 20; 
    setRarityScore(Math.min(score, 99));
  }, [data]);

  const handleImage = (e) => {
    if (e.target.files[0]) setData({ ...data, image: URL.createObjectURL(e.target.files[0]) });
  };

  const addService = () => {
    if (tempService.name) {
      setData({ ...data, services: [...data.services, { ...tempService, id: Date.now() }] });
      setTempService({ name: '', price: '', duration: '30' });
    }
  };

  const handleDeploy = () => {
      const newSalon = {
          ...data,
          drop: { active: true, label: "NEW ARRIVAL" }, // Auto-Drop
          badges: ["Trendy"],
          services: data.services.map(s => ({ ...s, videoMode: false, image: data.image }))
      };
      onFinish(newSalon);
  };

  return (
    <div className="h-full flex flex-col bg-black font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black" />
      
      <div className="relative z-10 p-6 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Activity size={16} className="text-green-500 animate-pulse"/>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Neural Engine</span>
         </div>
         <button onClick={() => onFinish(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><X size={16}/></button>
      </div>

      <div className="flex-1 relative z-10 px-6 pt-10 pb-24 overflow-y-auto hide-scrollbar">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">Créons<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">l'Impossible.</span></h2>
            
            <div className="space-y-6">
                <div className="relative group">
                    <input placeholder="Nom de l'Empire" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-3xl font-bold text-white outline-none focus:border-white transition-colors placeholder:text-zinc-800"/>
                </div>
                <div className="relative group">
                    <input placeholder="Ville (QG)" value={data.city} onChange={e => setData({...data, city: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl font-bold text-white outline-none focus:border-white transition-colors placeholder:text-zinc-800"/>
                </div>
            </div>

            <div onClick={() => fileRef.current.click()} className="relative w-full aspect-video rounded-3xl border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-indigo-500 transition duration-500">
               {data.image ? <img src={data.image} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/> : <div className="text-center group-hover:scale-110 transition"><Upload className="mx-auto mb-2 text-zinc-600 group-hover:text-white"/><span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-white">Upload Cover</span></div>}
               <input type="file" ref={fileRef} onChange={handleImage} className="hidden" />
            </div>
            
            <div className="flex justify-end">
                <button onClick={() => setStep(2)} disabled={!data.name} className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 transition disabled:opacity-20 disabled:scale-100"><ArrowRight size={32}/></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-end">
                <h2 className="text-4xl font-black text-white leading-none">Design<br/>Services.</h2>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rarity Score</div>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{rarityScore}</div>
                </div>
             </div>

             <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-4">
                <input placeholder="Nom du Service" value={tempService.name} onChange={e => setTempService({...tempService, name: e.target.value})} className="w-full bg-transparent border-b border-zinc-700 py-2 text-white font-bold outline-none focus:border-white"/>
                <div className="flex gap-4">
                    <input type="number" placeholder="Prix" value={tempService.price} onChange={e => setTempService({...tempService, price: e.target.value})} className="w-1/2 bg-transparent border-b border-zinc-700 py-2 text-white font-mono outline-none focus:border-white"/>
                    <button onClick={addService} className="flex-1 bg-white text-black rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-400 hover:text-white transition">Ajouter</button>
                </div>
             </div>

             <div className="space-y-2">
                {data.services.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <span className="font-bold text-white">{s.name}</span>
                        <span className="font-mono text-indigo-400">{s.price}.-</span>
                    </div>
                ))}
             </div>

             <button onClick={handleDeploy} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(79,70,229,0.4)] hover:scale-[1.02] transition active:scale-95">
                DÉPLOYER
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP SHELL ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]); // Agenda state

  // --- LOGIQUE CŒUR ---
  const handleDeploy = (newSalon) => {
    if (newSalon) {
      setSalons([{ ...newSalon, id: Date.now() }, ...salons]);
    }
    setView('landing'); // On retourne voir le résultat
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) setFavorites(favorites.filter(i => i !== id));
    else setFavorites([...favorites, id]);
  };

  const handleDelete = (id) => {
    setSalons(salons.filter(s => s.id !== id));
  };

  // Pseudo-booking pour la démo
  const handleBook = (salon, service) => {
      const date = "Demain 14h"; // Simplification pour la démo V14
      setBookings([...bookings, { salon, service, date }]);
      setActiveTab('agenda');
  };

  if (view === 'landing') return (
    <div className="min-h-screen bg-black flex flex-col justify-end p-8 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"/>
      <div className="relative z-10 animate-fade-in">
        <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">DIVINE<span className="text-indigo-500">.</span></h1>
        <p className="text-zinc-400 font-medium text-lg mb-8 max-w-xs">L'OS de la beauté. Plus intelligent. Plus rapide. Plus beau.</p>
        <div className="flex gap-4">
            <button onClick={() => setView('client')} className="flex-1 h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition">Explorer</button>
            <button onClick={() => setView('pro')} className="flex-1 h-16 bg-zinc-900/80 backdrop-blur border border-zinc-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition">Créer</button>
        </div>
      </div>
    </div>
  );

  if (view === 'pro') return <ProWizard onFinish={handleDeploy} />;

  // VUE CLIENT V14
  return (
    <div className="bg-black min-h-screen flex justify-center text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md bg-black relative shadow-2xl min-h-screen flex flex-col border-x border-zinc-900">
        
        {/* HEADER FLOTTANT */}
        <div className="fixed top-0 w-full max-w-md z-40 p-4 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-xl border border-white/5 rounded-full px-6 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
                <div className="font-black text-xl tracking-tighter">QR<span className="text-indigo-500">.</span></div>
                <div className="flex gap-4">
                    <Bell size={20} className="text-zinc-400"/>
                    <button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-400 hover:text-white"/></button>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar pt-24 pb-32">
          {activeTab === 'home' && (
            <>
              {/* STORIES RAIL (La Nouveauté) */}
              <div className="mb-6">
                 <h3 className="px-6 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">À la une</h3>
                 <StoriesRail salons={salons} onSelect={() => {}} />
              </div>

              {/* FEED DIVIN */}
              <div className="px-4 space-y-2">
                 <h3 className="px-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Découvrir</h3>
                 {salons.map(s => (
                    <DivineCard 
                        key={s.id} 
                        salon={s} 
                        isFavorite={favorites.includes(s.id)}
                        onToggleFavorite={toggleFavorite}
                        onDelete={handleDelete}
                        onBook={handleBook}
                    />
                 ))}
              </div>
            </>
          )}

          {activeTab === 'agenda' && (
              <div className="px-6 pt-4">
                  <h2 className="text-3xl font-black mb-8">Agenda.</h2>
                  {bookings.map((b, i) => (
                      <div key={i} className="mb-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex gap-4 items-center">
                          <div className="w-12 h-12 bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-400"><Calendar size={20}/></div>
                          <div><div className="font-bold text-white">{b.service.name}</div><div className="text-xs text-zinc-500">{b.salon.name} • {b.date}</div></div>
                      </div>
                  ))}
                  {bookings.length === 0 && <div className="text-zinc-600 text-center mt-10">Vide. Réservez quelque chose.</div>}
              </div>
          )}

          {activeTab === 'likes' && (
              <div className="px-4 pt-4">
                  <h2 className="px-2 text-3xl font-black mb-8">Favoris.</h2>
                  {salons.filter(s => favorites.includes(s.id)).map(s => <DivineCard key={s.id} salon={s} isFavorite={true} onToggleFavorite={toggleFavorite} onDelete={handleDelete} onBook={handleBook}/>)}
              </div>
          )}
        </div>

        {/* NAVIGATION DOCK (Flottant) */}
        <div className="fixed bottom-8 w-full max-w-md px-6 z-50 flex justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-2 flex items-center gap-2 shadow-2xl pointer-events-auto">
            <button onClick={() => setActiveTab('home')} className={`p-4 rounded-xl transition ${activeTab === 'home' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}><Search size={24}/></button>
            <button onClick={() => setActiveTab('agenda')} className={`p-4 rounded-xl transition ${activeTab === 'agenda' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}><Calendar size={24}/></button>
            <button onClick={() => setActiveTab('likes')} className={`p-4 rounded-xl transition ${activeTab === 'likes' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}><Heart size={24}/></button>
          </div>
        </div>

      </div>
    </div>
  );
}
