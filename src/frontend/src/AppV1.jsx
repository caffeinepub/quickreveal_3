import React, { useState, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid
} from 'lucide-react';

// --- DATA ---
const DATA = [
  {
    id: 1, name: "MIDNIGHT BARBER", category: "Barber", rating: "5.0",
    cover: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    images: [
        "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Lausanne", type: "Domicile",
    tags: ["Soir", "Dimanche"],
    bio: "L'excellence ne dort jamais. Service de nuit exclusif pour gentlemen.",
    services: [{ id: 101, name: "Prestige Cut", price: 80, time: "1h" }, { id: 102, name: "Beard Sculpt", price: 40, time: "30m" }]
  },
  {
    id: 2, name: "ATELIER NUIT", category: "Onglerie", rating: "4.9",
    cover: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"],
    location: "Genève", type: "Salon",
    tags: ["Lundi"],
    bio: "Sanctuaire privé. Nail art russe haute précision.",
    services: [{ id: 201, name: "Russe Complète", price: 120, time: "1h30" }]
  },
  {
    id: 3, name: "SUZY GLOW", category: "Esthétique", rating: "5.0",
    cover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80"],
    location: "Montreux", type: "Salon",
    tags: ["Dimanche"],
    bio: "Soins visage technologiques face au lac.",
    services: [{ id: 301, name: "HydraFacial", price: 150, time: "1h" }]
  }
];

// --- COMPOSANTS ATOMIQUES ---

// LE "CORE" (Navigation Orbitale)
const CoreNav = ({ activeTab, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
            <div className="relative pointer-events-auto">
                {/* MENU EXPANDED */}
                {isOpen && (
                    <>
                        <button 
                            onClick={() => {onChange('home'); setIsOpen(false)}} 
                            className="absolute w-12 h-12 bg-black border border-zinc-800 rounded-full flex items-center justify-center text-white shadow-xl animate-orbital-1"
                            style={{ '--orbital-x': '-50px', '--orbital-y': '-60px' }}
                        >
                            <Grid size={20}/>
                        </button>
                        <button 
                            onClick={() => {onChange('agenda'); setIsOpen(false)}} 
                            className="absolute w-12 h-12 bg-black border border-zinc-800 rounded-full flex items-center justify-center text-white shadow-xl animate-orbital-2"
                            style={{ '--orbital-x': '0px', '--orbital-y': '-80px' }}
                        >
                            <Calendar size={20}/>
                        </button>
                        <button 
                            onClick={() => {onChange('likes'); setIsOpen(false)}} 
                            className="absolute w-12 h-12 bg-black border border-zinc-800 rounded-full flex items-center justify-center text-white shadow-xl animate-orbital-3"
                            style={{ '--orbital-x': '50px', '--orbital-y': '-60px' }}
                        >
                            <Heart size={20}/>
                        </button>
                    </>
                )}

                {/* BOUTON CENTRAL (PULSAR) */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500 z-50 active:scale-90 ${isOpen ? 'bg-white text-black rotate-45' : 'bg-black border border-zinc-700 text-white'}`}
                >
                    <Plus size={28} strokeWidth={isOpen ? 3 : 1.5}/>
                </button>
            </div>
        </div>
    );
};

// CATEGORY SLIDER
const CatSlider = ({ active, onSelect }) => (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6 py-4 sticky top-0 z-30 bg-gradient-to-b from-black via-black/95 to-transparent">
        {[{id:'Tout', i:Sparkles}, {id:'Barber', i:Scissors}, {id:'Coiffure', i:User}, {id:'Onglerie', i:Feather}, {id:'Soin', i:Zap}].map(c => (
            <button key={c.id} onClick={() => onSelect(c.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${active === c.id ? 'bg-white text-black border-white scale-105 shadow-lg' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-white backdrop-blur-md'}`}>
                <c.i size={14}/> <span className="text-xs font-black uppercase tracking-wider">{c.id}</span>
            </button>
        ))}
    </div>
);

// CARTE COMPACTE (VUE LISTE)
const CompactCard = ({ salon, onExpand }) => (
    <div 
        onClick={() => onExpand(salon)}
        className="w-full aspect-[4/5] bg-zinc-900 rounded-[32px] relative overflow-hidden mb-6 cursor-pointer group animate-scale-in"
    >
        <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {salon.type === 'Domicile' && <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Home size={10}/> Mobile</span>}
            {salon.tags.includes('Soir') && <span className="px-3 py-1 bg-indigo-500/20 backdrop-blur border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Moon size={10}/> Night</span>}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-4xl font-black text-white leading-none tracking-tighter mb-2">{salon.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest"><MapPin size={12}/> {salon.location}</div>
        </div>
    </div>
);

// VUE EXPANDED (DETAILS EN PLEIN ECRAN)
const ExpandedCard = ({ salon, onClose, onBook }) => {
    return (
        <div className="fixed inset-0 z-40 bg-black flex flex-col overflow-y-auto animate-slide-up">
            {/* HERO IMAGE EXPANDED */}
            <div className="relative h-[50vh] w-full flex-shrink-0">
                <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"/>
                
                <button onClick={onClose} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-50 hover:bg-white hover:text-black transition"><ChevronLeft/></button>
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter mb-2">{salon.name}</h2>
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-white"><MapPin size={12}/> {salon.location}</span>
                        <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500"/> {salon.rating}</span>
                    </div>
                </div>
            </div>

            {/* CONTENT SCROLLABLE */}
            <div className="flex-1 px-8 pb-32 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="py-6 border-b border-zinc-800">
                    <p className="text-lg text-zinc-300 font-medium leading-relaxed">"{salon.bio}"</p>
                </div>

                {/* SERVICES */}
                <div className="py-8 space-y-6">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Services Signature</div>
                    {salon.services.map(s => (
                        <div key={s.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onBook(s)}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-white group-hover:text-white transition"><Scissors size={18}/></div>
                                <div>
                                    <div className="font-bold text-white text-lg">{s.name}</div>
                                    <div className="text-xs text-zinc-500 font-mono">{s.time}</div>
                                </div>
                            </div>
                            <div className="text-xl font-black text-white">{s.price}.-</div>
                        </div>
                    ))}
                </div>

                {/* GALERIE SECONDAIRE */}
                {salon.images.length > 0 && (
                    <div className="py-4">
                        <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Portfolio</div>
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                            {salon.images.map((img, i) => (
                                <img key={i} src={img} className="w-40 h-56 object-cover rounded-2xl border border-zinc-800 flex-shrink-0"/>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* BOUTON FLOTTANT FIXE */}
            <div className="fixed bottom-8 left-8 right-8 z-50">
                <button onClick={() => onBook(salon.services[0])} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition active:scale-95">Réserver maintenant</button>
            </div>
        </div>
    );
};

// --- GENESIS WIZARD (PRO V24) ---
const GenesisEngine = ({ onFinish }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ name: '', city: '', category: 'Barber', bio: '', type: 'Salon', tags: [], services: [], cover: null });
    const fileRef = useRef(null);

    const handleImage = (e) => { if (e.target.files[0]) setData({ ...data, cover: URL.createObjectURL(e.target.files[0]) }); };
    const addService = () => { setData({...data, services: [...data.services, {id: Date.now(), name: "Service Base", price: "50", time: "1h"}]}) };

    return (
        <div className="h-full bg-black text-white font-sans flex flex-col p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"/>
            <div className="relative z-10 flex justify-between items-center mb-10">
                <span className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase">System OMEGA</span>
                <button onClick={() => onFinish(null)}><X/></button>
            </div>

            <div className="flex-1 relative z-10 overflow-y-auto hide-scrollbar pb-20">
                {step === 1 && (
                    <div className="space-y-8 animate-slide-up">
                        <div onClick={() => fileRef.current.click()} className="w-full aspect-[4/3] bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center cursor-pointer hover:border-white transition overflow-hidden">
                            {data.cover ? <img src={data.cover} className="w-full h-full object-cover"/> : <span className="text-xs font-bold uppercase text-zinc-600">Cover Image</span>}
                            <input type="file" ref={fileRef} onChange={handleImage} className="hidden"/>
                        </div>
                        <input value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-4xl font-black text-white outline-none placeholder:text-zinc-800" placeholder="NOM DU PROJET"/>
                        <div className="flex gap-2 flex-wrap">
                            {['Barber', 'Coiffure', 'Nails', 'Skin'].map(c => <button key={c} onClick={()=>setData({...data, category: c})} className={`px-4 py-2 border rounded-full text-xs font-bold ${data.category === c ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500'}`}>{c}</button>)}
                        </div>
                        <button onClick={() => setStep(2)} className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-widest">Suivant</button>
                    </div>
                )}
                
                {step === 2 && (
                    <div className="space-y-8 animate-slide-up">
                        <div className="flex gap-4">
                            <button onClick={()=>setData({...data, type:'Salon'})} className={`flex-1 py-6 border rounded-2xl font-black uppercase text-xs ${data.type === 'Salon' ? 'bg-white text-black' : 'border-zinc-800 text-zinc-500'}`}>Salon</button>
                            <button onClick={()=>setData({...data, type:'Domicile'})} className={`flex-1 py-6 border rounded-2xl font-black uppercase text-xs ${data.type === 'Domicile' ? 'bg-emerald-500 text-black border-emerald-500' : 'border-zinc-800 text-zinc-500'}`}>Domicile</button>
                        </div>
                        <textarea value={data.bio} onChange={e=>setData({...data, bio: e.target.value})} className="w-full h-32 bg-transparent border border-zinc-800 rounded-2xl p-4 text-white outline-none resize-none" placeholder="Votre manifeste..."/>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-600 uppercase">Golden Hours</label>
                            <div className="flex gap-2">
                                {['Soir', 'Dimanche', 'Lundi'].map(t => <button key={t} onClick={()=>{setData({...data, tags: data.tags.includes(t) ? data.tags.filter(x=>x!==t) : [...data.tags, t]})}} className={`px-4 py-2 border rounded-full text-xs font-bold ${data.tags.includes(t) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>{t}</button>)}
                            </div>
                        </div>
                        <button onClick={() => setStep(3)} className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-widest">Dernière étape</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-slide-up">
                        <div className="border border-zinc-800 rounded-3xl p-6 space-y-4">
                            <h3 className="text-2xl font-black">Services</h3>
                            {data.services.map((s, i) => <div key={i} className="text-zinc-400 border-b border-zinc-900 pb-2">{s.name} - {s.price}.-</div>)}
                            <button onClick={addService} className="w-full py-3 bg-zinc-900 rounded-xl text-xs font-bold uppercase hover:bg-white hover:text-black transition">Ajouter Service</button>
                        </div>
                        <button onClick={() => onFinish(data)} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-black uppercase tracking-widest shadow-[0_0_50px_rgba(79,70,229,0.5)]">LANCER OMEGA</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- ROOT APP ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(DATA);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [catFilter, setCatFilter] = useState('Tout');

  // DEPLOY
  const handleDeploy = (newOne) => {
      if (newOne) {
          const s = { 
              id: Date.now(), 
              ...newOne, 
              images: newOne.cover ? [newOne.cover] : [], 
              cover: newOne.cover || "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1000&q=80",
              rating: "5.0", 
              location: newOne.city || "Lausanne",
              services: newOne.services.length > 0 ? newOne.services : [{id: Date.now(), name: "Signature Service", price: 80, time: "1h"}]
          };
          setSalons([s, ...salons]);
          setView('landing');
      } else {
          setView('landing');
      }
  };

  // BOOKING MOCK
  const handleBook = () => { alert("Réservation confirmée via OMEGA."); setSelectedSalon(null); };

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1000&q=80')] bg-cover opacity-20 animate-pulse-slow"/>
          <h1 className="text-9xl font-black text-white tracking-tighter mix-blend-difference z-10">OMEGA<span className="text-indigo-500">.</span></h1>
          <div className="flex gap-6 mt-12 z-10">
              <button onClick={() => setView('client')} className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-110 transition active:scale-95">ENTRER</button>
              <button onClick={() => setView('pro')} className="px-10 py-4 border border-zinc-700 text-white font-black rounded-full hover:bg-white hover:text-black transition active:scale-95">STUDIO</button>
          </div>
      </div>
  );

  if (view === 'pro') return <GenesisEngine onFinish={handleDeploy} />;

  const filtered = salons.filter(s => catFilter === 'Tout' || s.category === catFilter);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="px-6 py-6 flex justify-between items-center bg-black sticky top-0 z-20">
            <span className="font-black text-xl tracking-tighter">OMEGA.</span>
            <button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button>
        </div>

        {/* CONTENU */}
        <div className="flex-1">
            {activeTab === 'home' && (
                <>
                    <CatSlider active={catFilter} onSelect={setCatFilter} />
                    <div className="px-4 mt-6 pb-32">
                        {filtered.map(s => <CompactCard key={s.id} salon={s} onExpand={setSelectedSalon} />)}
                    </div>
                </>
            )}
            {activeTab === 'likes' && (
                <div className="px-4 mt-6">
                    <h2 className="text-4xl font-black mb-8">Collection.</h2>
                    {salons.slice(0,1).map(s => <CompactCard key={s.id} salon={s} onExpand={setSelectedSalon} />)}
                </div>
            )}
            {activeTab === 'agenda' && <div className="px-4 mt-6 text-center text-zinc-500 py-20">Aucun rendez-vous futur.</div>}
        </div>

        {/* CORE NAVIGATION */}
        <CoreNav activeTab={activeTab} onChange={setActiveTab} />

        {/* EXPANDED VIEW */}
        {selectedSalon && <ExpandedCard salon={selectedSalon} onClose={() => setSelectedSalon(null)} onBook={handleBook} />}

      </div>
    </div>
  );
}
