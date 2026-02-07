import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronUp, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, Fingerprint, Activity
} from 'lucide-react';

// --- QUANTUM DATA ---
const DATA = [
  {
    id: 1, name: "MIDNIGHT BARBER", category: "Barber", rating: "5.0",
    images: [
        "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Lausanne", type: "Domicile",
    tags: ["Soir", "Dimanche"],
    bio: "L'excellence ne dort jamais. Service exclusif.",
    services: [{ id: 101, name: "Prestige Cut", price: 80 }, { id: 102, name: "Beard Sculpt", price: 40 }]
  },
  {
    id: 2, name: "L'ATELIER NUIT", category: "Onglerie", rating: "4.9",
    images: [
        "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Genève", type: "Salon",
    tags: ["Lundi"],
    bio: "Nail art russe haute précision. Sanctuaire privé.",
    services: [{ id: 201, name: "Russe Complète", price: 120 }]
  },
  {
    id: 3, name: "SUZY GLOW", category: "Esthétique", rating: "5.0",
    images: ["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80"],
    location: "Montreux", type: "Salon",
    tags: ["Dimanche"],
    bio: "Technologies de pointe face au lac.",
    services: [{ id: 301, name: "HydraFacial", price: 150 }]
  }
];

// --- SINGULARITY LOADER (L'ENTRÉE) ---
const SingularityLoader = ({ onEnter }) => {
    const [progress, setProgress] = useState(0);
    const [isEntering, setIsEntering] = useState(false);
    const intervalRef = useRef(null);

    const startCharging = () => {
        intervalRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(intervalRef.current);
                    setIsEntering(true);
                    setTimeout(() => onEnter(), 500);
                    return 100;
                }
                return p + 2;
            });
        }, 20);
    };

    const stopCharging = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setProgress(0);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div 
            className={`h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans cursor-pointer transition-all duration-500 ${isEntering ? 'opacity-0 scale-95' : 'opacity-100'}`}
            onMouseDown={startCharging} 
            onMouseUp={stopCharging} 
            onMouseLeave={stopCharging}
            onTouchStart={startCharging} 
            onTouchEnd={stopCharging}
        >
            
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20 animate-pulse-slow mix-blend-overlay"/>
            
            {/* THE ORB */}
            <div className="relative mb-12">
                <div className="w-32 h-32 rounded-full border border-zinc-800 flex items-center justify-center relative animate-breathing">
                    <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"/>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                    <Fingerprint size={40} className={progress > 0 ? "animate-pulse" : ""}/>
                </div>
                {/* PROGRESS RING */}
                <svg className="absolute inset-[-20px] w-[168px] h-[168px] rotate-[-90deg]">
                    <circle 
                        cx="84" 
                        cy="84" 
                        r="80" 
                        stroke="white" 
                        strokeWidth="2" 
                        fill="transparent" 
                        strokeDasharray="502" 
                        strokeDashoffset={502 - (502 * progress) / 100} 
                        className="transition-all duration-75"
                    />
                </svg>
            </div>

            <div className="text-center z-10 space-y-2">
                <h1 className="text-6xl font-black text-white tracking-tighter mix-blend-difference">QUANTUM<span className="text-indigo-500">.</span></h1>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">{progress > 0 ? "INITIALISATION..." : "MAINTENIR POUR ENTRER"}</p>
            </div>
        </div>
    );
};

// --- QUANTUM CARD (LA CELLULE DE VIE) ---
const QuantumCard = ({ salon, onBook, isFavorite, onToggleFavorite }) => {
    const [activeImg, setActiveImg] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);
    
    return (
        <div 
            className={`relative w-full aspect-[3/4] bg-zinc-900 rounded-[40px] overflow-hidden mb-12 border border-white/5 shadow-2xl group snap-center transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
            {/* IMAGE FLUIDE */}
            <div className="relative w-full h-full">
                {salon.images.map((img, idx) => (
                    <img 
                        key={idx}
                        src={img} 
                        className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-500 ${idx === activeImg ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setActiveImg((p) => (p + 1) % salon.images.length)}
                        alt={salon.name}
                    />
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none"/>

            {/* HUD TOP */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2">
                    {salon.type === 'Domicile' && (
                        <span className="px-4 py-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                            <Home size={10}/> Domicile
                        </span>
                    )}
                    {salon.tags.includes('Soir') && (
                        <span className="px-4 py-2 bg-indigo-500/20 backdrop-blur-xl border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                            <Moon size={10}/> Nocturne
                        </span>
                    )}
                </div>
                <button 
                    onClick={(e) => {e.stopPropagation(); onToggleFavorite(salon.id)}} 
                    className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-500"
                >
                    <Heart size={20} className={isFavorite ? "fill-current" : ""}/>
                </button>
            </div>

            {/* HUD BOTTOM */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 flex flex-col gap-4">
                <div>
                    <h2 className="text-5xl font-black text-white leading-[0.85] tracking-tighter mb-2 shadow-black drop-shadow-lg">{salon.name}</h2>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-300 uppercase tracking-widest">
                        <MapPin size={12}/> {salon.location}
                        <span className="w-1 h-1 rounded-full bg-zinc-500"/>
                        <Star size={12} className="text-yellow-500 fill-current"/> {salon.rating}
                    </div>
                </div>
                
                <p className="text-sm text-zinc-200 font-medium leading-relaxed line-clamp-2 opacity-90 border-l-2 border-white/50 pl-4">
                    {salon.bio}
                </p>

                {/* ACTION BAR */}
                <div className="flex gap-3 mt-2">
                    {salon.services.slice(0,1).map(s => (
                        <button 
                            key={s.id} 
                            onClick={() => onBook(salon, s)} 
                            className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                        >
                            <span>Réserver • {s.price}.-</span>
                            <ArrowRight size={14}/>
                        </button>
                    ))}
                    <button className="w-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition">
                        <Phone size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ARCHITECT MODE (CRÉATEUR) ---
const ArchitectMode = ({ onFinish }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ name: '', city: '', category: 'Barber', bio: '', type: 'Salon', tags: [], services: [], images: [] });
    const [revenue, setRevenue] = useState(0);
    const fileRef = useRef(null);

    // Simulation de revenus en temps réel
    useEffect(() => {
        const base = data.services.reduce((acc, s) => acc + Number(s.price || 0), 0);
        setRevenue(base * 4 * 20); // 4 clients/jour * 20 jours
    }, [data.services]);

    const handleImage = (e) => { 
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, images: [...data.images, URL.createObjectURL(e.target.files[0])] }); 
        }
    };
    
    const addService = () => { 
        setData({...data, services: [...data.services, {id: Date.now(), name: "Service Signature", price: "80"}]}) 
    };

    return (
        <div className="h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-black to-black"/>
            
            {/* HUD HEADER */}
            <div className="relative z-20 p-8 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase">ARCHITECT OS</span>
                    <div className="text-xs font-bold text-zinc-500 mt-1 flex items-center gap-2">
                        <Activity size={12} className="animate-pulse text-green-500"/> SYSTÈME ACTIF
                    </div>
                </div>
                <button 
                    onClick={() => onFinish(null)} 
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition"
                >
                    <X size={18}/>
                </button>
            </div>

            <div className="flex-1 relative z-10 px-8 pb-32 overflow-y-auto hide-scrollbar">
                {step === 1 && (
                    <div className="space-y-12 animate-fade-in">
                        <h1 className="text-7xl font-black tracking-tighter leading-none text-white/90">
                            GENÈSE<br/><span className="text-zinc-700">MARQUE.</span>
                        </h1>
                        
                        <div className="space-y-8">
                            <div className="relative group">
                                <input 
                                    value={data.name} 
                                    onChange={e=>setData({...data, name: e.target.value})} 
                                    className="w-full bg-transparent border-b border-zinc-800 py-6 text-4xl font-black text-white outline-none focus:border-white transition-colors placeholder:text-zinc-800 uppercase" 
                                    placeholder="NOM DE CODE"
                                />
                                <span className="absolute right-0 bottom-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">PROJET ID</span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {['Barber', 'Coiffure', 'Nails', 'Skin'].map(c => (
                                    <button 
                                        key={c} 
                                        onClick={()=>setData({...data, category: c})} 
                                        className={`px-6 py-3 rounded-full text-xs font-bold border transition-all duration-300 ${data.category === c ? 'bg-white text-black border-white scale-105' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div 
                                    onClick={() => fileRef.current?.click()} 
                                    className="aspect-[3/4] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition text-zinc-600 hover:text-white bg-zinc-900/50"
                                >
                                    <Upload className="mb-2"/> 
                                    <span className="text-[9px] font-black uppercase">UPLOAD</span>
                                    <input type="file" ref={fileRef} onChange={handleImage} className="hidden" accept="image/*"/>
                                </div>
                                {data.images.map((img, i) => (
                                    <img 
                                        key={i} 
                                        src={img} 
                                        className="aspect-[3/4] object-cover rounded-3xl border border-zinc-800"
                                        alt={`Upload ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => setStep(2)} 
                            disabled={!data.name} 
                            className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Initialiser Phase 2
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-fade-in">
                        <h1 className="text-7xl font-black tracking-tighter leading-none text-white/90">
                            MODE<br/><span className="text-zinc-700">OPÉRATOIRE.</span>
                        </h1>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={()=>setData({...data, type:'Salon'})} 
                                className={`h-32 border rounded-[32px] font-black uppercase text-xs tracking-widest transition flex flex-col items-center justify-center gap-3 ${data.type === 'Salon' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500'}`}
                            >
                                <MapPin size={24}/> Salon
                            </button>
                            <button 
                                onClick={()=>setData({...data, type:'Domicile'})} 
                                className={`h-32 border rounded-[32px] font-black uppercase text-xs tracking-widest transition flex flex-col items-center justify-center gap-3 ${data.type === 'Domicile' ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-zinc-800 text-zinc-500'}`}
                            >
                                <Home size={24}/> Domicile
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input 
                                value={data.city} 
                                onChange={e => setData({...data, city: e.target.value})} 
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-5 text-white font-bold outline-none focus:border-white transition" 
                                placeholder="BASE OPÉRATIONNELLE (VILLE)"
                            />
                            <div className="flex gap-2">
                                {['Soir', 'Dimanche', 'Lundi'].map(t => (
                                    <button 
                                        key={t} 
                                        onClick={()=>{setData({...data, tags: data.tags.includes(t) ? data.tags.filter(x=>x!==t) : [...data.tags, t]})}} 
                                        className={`flex-1 py-4 border rounded-2xl text-[10px] font-black uppercase transition ${data.tags.includes(t) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-800 text-zinc-500'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => setStep(3)} 
                            className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition"
                        >
                            Initialiser Phase 3
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="flex justify-between items-end">
                            <h1 className="text-7xl font-black tracking-tighter leading-none text-white/90">
                                VALEUR<br/><span className="text-zinc-700">AJOUTÉE.</span>
                            </h1>
                            <div className="text-right">
                                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Potentiel Est.</div>
                                <div className="text-3xl font-black text-emerald-500 flex items-center gap-1">
                                    <Zap size={20} className="fill-current"/> {revenue} CHF
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {data.services.map((s, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-zinc-900/80 rounded-[24px] border border-zinc-800 backdrop-blur-md">
                                    <span className="font-bold text-white text-lg">{s.name}</span>
                                    <span className="font-mono font-black text-indigo-400 text-xl">{s.price}.-</span>
                                </div>
                            ))}
                            <button 
                                onClick={addService} 
                                className="w-full py-5 border border-dashed border-zinc-800 rounded-[24px] text-xs font-black uppercase text-zinc-500 hover:text-white hover:border-white transition flex items-center justify-center gap-2"
                            >
                                <Plus size={16}/> Ajouter Service
                            </button>
                        </div>

                        <button 
                            onClick={() => onFinish(data)} 
                            className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full font-black uppercase tracking-widest shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition"
                        >
                            ACTIVER LE FLUX
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- APP SHELL ---
export default function App() {
  const [view, setView] = useState('singularity');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(DATA);
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tout');
  
  // Modal Booking
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);

  const handleDeploy = (newSalon) => {
      if (newSalon) {
          const images = newSalon.images.length > 0 ? newSalon.images : ["https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80"];
          setSalons([{ id: Date.now(), ...newSalon, images, rating: "5.0", location: newSalon.city, services: newSalon.services }, ...salons]);
          setView('landing');
      } else {
          setView('landing');
      }
  };

  const filtered = salons.filter(s => activeCategory === 'Tout' || s.category === activeCategory);

  if (view === 'singularity') return <SingularityLoader onEnter={() => setView('landing')} />;

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20 animate-pulse-slow"/>
          <div className="z-10 text-center space-y-12 animate-scale-in">
              <h1 className="text-8xl font-black text-white tracking-tighter mix-blend-difference leading-none">
                  QUANTUM<span className="text-indigo-500">.</span>
              </h1>
              <div className="flex gap-6 justify-center">
                  <button 
                      onClick={() => setView('client')} 
                      className="px-10 py-5 bg-white text-black font-black rounded-full tracking-widest hover:scale-110 active:scale-95 transition shadow-2xl shadow-white/20"
                  >
                      EXPLORER
                  </button>
                  <button 
                      onClick={() => setView('pro')} 
                      className="px-10 py-5 border border-zinc-800 text-zinc-400 font-black rounded-full tracking-widest hover:border-white hover:text-white transition"
                  >
                      ARCHITECTE
                  </button>
              </div>
          </div>
      </div>
  );

  if (view === 'pro') return <ArchitectMode onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        
        {/* NAV HELIX */}
        <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 py-4 px-4 flex gap-4 overflow-x-auto hide-scrollbar">
            {[{id:'Tout', i:Sparkles}, {id:'Barber', i:Scissors}, {id:'Coiffure', i:User}, {id:'Onglerie', i:Feather}, {id:'Esthétique', i:Zap}].map(c => (
                <button 
                    key={c.id} 
                    onClick={() => setActiveCategory(c.id)} 
                    className={`flex flex-col items-center gap-2 min-w-[60px] group transition-all duration-500 ${activeCategory === c.id ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeCategory === c.id ? 'bg-white text-black shadow-lg' : 'bg-zinc-900 border border-white/10'}`}>
                        <c.i size={18} strokeWidth={2.5}/>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">{c.id}</span>
                </button>
            ))}
        </div>

        {/* FEED */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-6 pb-32">
            {activeTab === 'home' && filtered.map(s => (
                <QuantumCard 
                    key={s.id} 
                    salon={s} 
                    isFavorite={favorites.includes(s.id)} 
                    onToggleFavorite={(id)=>setFavorites(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])} 
                    onBook={(salon, service) => setSelectedService({ ...service, salon })} 
                />
            ))}
            {activeTab === 'likes' && filtered.filter(s => favorites.includes(s.id)).map(s => (
                <QuantumCard 
                    key={s.id} 
                    salon={s} 
                    isFavorite={true} 
                    onToggleFavorite={(id)=>setFavorites(p=>p.filter(x=>x!==id))} 
                    onBook={(salon, service) => setSelectedService({ ...service, salon })} 
                />
            ))}
        </div>

        {/* NAV BOTTOM ORBITAL */}
        <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-10 py-5 flex items-center gap-16 shadow-2xl pointer-events-auto">
                <button 
                    onClick={() => setActiveTab('home')} 
                    className={`transition-all duration-300 ${activeTab === 'home' ? "text-white scale-125" : "text-zinc-600 hover:text-white"}`}
                >
                    <Grid size={24} strokeWidth={2.5}/>
                </button>
                <button 
                    onClick={() => setActiveTab('likes')} 
                    className={`transition-all duration-300 ${activeTab === 'likes' ? "text-white scale-125" : "text-zinc-600 hover:text-white"}`}
                >
                    <Heart size={24} strokeWidth={2.5}/>
                </button>
            </div>
        </div>

        {/* MODAL BOOKING */}
        {selectedService && (
            <div className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center animate-slide-up`}>
                <div className="w-full max-w-md bg-[#0f0f0f] rounded-t-[40px] p-8 max-h-[70vh] flex flex-col border-t border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-4xl font-black tracking-tighter">Réserver.</h3>
                        <button 
                            onClick={() => {setSelectedService(null); setBookingDate(null);}} 
                            className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition"
                        >
                            <X/>
                        </button>
                    </div>
                    <div className="flex-1 space-y-8 overflow-y-auto">
                        <div className="flex gap-6 items-center bg-white/5 p-4 rounded-3xl">
                            <img 
                                src={selectedService.salon.images[0]} 
                                className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                                alt={selectedService.salon.name}
                            />
                            <div>
                                <div className="text-xl font-bold">{selectedService.name}</div>
                                <div className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-2">
                                    {selectedService.salon.name}
                                </div>
                                <div className="text-3xl font-black text-indigo-400">{selectedService.price}.-</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {["19:00", "20:00", "21:00", "Demain"].map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setBookingDate(t)} 
                                    className={`py-4 rounded-2xl font-bold text-sm border transition ${bookingDate === t ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => { alert('Confirmé !'); setSelectedService(null); setBookingDate(null); }} 
                        disabled={!bookingDate} 
                        className="w-full py-6 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest disabled:opacity-20 hover:scale-[1.02] active:scale-95 transition shadow-[0_0_40px_rgba(79,70,229,0.3)] mt-6"
                    >
                        CONFIRMER LE CRÉNEAU
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
