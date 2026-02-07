import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe
} from 'lucide-react';
import { generateAura } from './utils/auraGenerator';

// --- DATA SOURCE (L'ÉLITE) ---
const DATA = [
  {
    id: 1, name: "MIDNIGHT BARBER", category: "Barber", rating: "5.0",
    images: [
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Lausanne", type: "Domicile",
    tags: ["Soir", "Dimanche"],
    bio: "L'excellence ne dort jamais. Je sculpte votre image quand la ville s'éteint. Service mobile premium.",
    contact: "+41 79 123 45 67",
    services: [{ id: 101, name: "Prestige Cut", price: 80, time: "1h" }, { id: 102, name: "Beard Sculpt", price: 40, time: "30m" }],
    availabilities: [
      { time: "19:00", available: true },
      { time: "20:30", available: true },
      { time: "22:00", available: false },
    ]
  },
  {
    id: 2, name: "L'ATELIER NUIT", category: "Onglerie", rating: "4.9",
    images: [
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Genève", type: "Salon",
    tags: ["Lundi"],
    bio: "Sanctuaire privé caché. Nail art russe haute précision pour celles qui exigent la perfection.",
    contact: "+41 78 999 00 00",
    services: [{ id: 201, name: "Russe Complète", price: 120, time: "1h30" }],
    availabilities: [
      { time: "10:00", available: true },
      { time: "14:00", available: true },
      { time: "16:00", available: true },
    ]
  },
  {
    id: 3, name: "SUZY GLOW", category: "Esthétique", rating: "5.0",
    images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"],
    location: "Montreux", type: "Salon",
    tags: ["Dimanche"],
    bio: "Technologies de pointe et massages ancestraux face au lac. Le glow ultime.",
    contact: "+41 21 000 00 00",
    services: [{ id: 301, name: "HydraFacial", price: 150, time: "1h" }],
    availabilities: [
      { time: "09:00", available: true },
      { time: "11:00", available: false },
      { time: "15:00", available: true },
    ]
  }
];

// --- HELIX NAV (FILTRAGE SUPÉRIEUR) ---
const HelixNav = ({ active, onSelect }) => {
    const cats = [
        { id: 'Tout', label: 'Tout', icon: Sparkles },
        { id: 'Barber', label: 'Barber', icon: Scissors },
        { id: 'Coiffure', label: 'Coiffure', icon: User },
        { id: 'Onglerie', label: 'Ongles', icon: Feather },
        { id: 'Esthétique', label: 'Soin', icon: Zap },
    ];

    return (
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6">
                {cats.map((c) => (
                    <button 
                        key={c.id} 
                        onClick={() => onSelect(c.id)}
                        className={`flex flex-col items-center gap-2 min-w-[60px] group transition-all duration-500 ${active === c.id ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${active === c.id ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-zinc-900 border border-white/10 text-white'}`}>
                            <c.icon size={20} strokeWidth={active === c.id ? 2.5 : 1.5}/>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest">{c.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- AETHER CARD (L'UNITÉ DE VIE) ---
const AetherCard = ({ salon, onExpand, isFavorite, onToggleFavorite }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentImageIndex < salon.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
        if (isRightSwipe && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <div 
            onClick={() => onExpand(salon)}
            className="relative w-full aspect-[4/5] bg-zinc-900 rounded-[32px] overflow-hidden mb-8 group cursor-pointer border border-white/5 shadow-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <img 
                src={salon.images[currentImageIndex]} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* GALLERY INDICATORS */}
            {salon.images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {salon.images.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${i === currentImageIndex ? 'w-6 bg-white' : 'w-1 bg-white/30'}`} />
                    ))}
                </div>
            )}

            {/* HEADER FLOTTANT */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2 items-start">
                    {salon.type === 'Domicile' && <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Home size={10}/> Mobile</span>}
                    {salon.tags.includes('Soir') && <span className="px-3 py-1 bg-indigo-500/20 backdrop-blur border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Moon size={10}/> Night</span>}
                </div>
                <button onClick={(e) => {e.stopPropagation(); onToggleFavorite(salon.id)}} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-black transition">
                    <Heart size={18} className={isFavorite ? "fill-current" : ""}/>
                </button>
            </div>

            {/* INFO (BOTTOM) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black to-transparent">
                <h2 className="text-4xl font-black text-white leading-[0.9] tracking-tighter mb-2">{salon.name}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    <MapPin size={12}/> {salon.location}
                </div>
                
                {/* PREVIEW SERVICES (PILLS) */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                    {salon.services.slice(0,2).map(s => (
                        <div key={s.id} className="px-3 py-2 bg-white/10 backdrop-blur rounded-lg text-[10px] font-bold text-white whitespace-nowrap border border-white/5">
                            {s.name} <span className="opacity-50">•</span> {s.price}.-
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- EXPANDED DIMENSION (DETAILS VIEW) ---
const ExpandedDimension = ({ salon, onClose }) => {
    const [booking, setBooking] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-y-auto">
            {/* HERO */}
            <div className="relative h-[50vh] w-full flex-shrink-0">
                <img src={salon.images[currentImageIndex]} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"/>
                <button onClick={onClose} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-50 hover:bg-white hover:text-black transition"><ChevronLeft/></button>
                
                {/* IMAGE GALLERY NAVIGATION */}
                {salon.images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {salon.images.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentImageIndex(i)}
                                className={`h-2 rounded-full transition-all ${i === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                            />
                        ))}
                    </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-6xl font-black text-white leading-none tracking-tighter mb-2">{salon.name}</h2>
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-white"><MapPin size={12}/> {salon.location}</span>
                        {salon.contact && <span className="flex items-center gap-1"><Phone size={12}/> {salon.contact}</span>}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 px-8 pb-32">
                {/* BIO & CONTACT EDITORIAL BLOCK */}
                <div className="py-8 border-b border-zinc-900">
                    <p className="text-xl text-zinc-300 font-medium leading-relaxed font-serif italic mb-4">"{salon.bio}"</p>
                    {salon.contact && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Phone size={14}/> 
                            <span>{salon.contact}</span>
                        </div>
                    )}
                </div>

                {/* AVAILABILITY HEARTBEATS */}
                {salon.availabilities && salon.availabilities.length > 0 && (
                    <div className="py-6 border-b border-zinc-900">
                        <div className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">Disponibilités</div>
                        <div className="flex gap-3 flex-wrap">
                            {salon.availabilities.map((slot, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className={`w-2 h-2 rounded-full ${slot.available ? 'bg-emerald-500 animate-heartbeat' : 'bg-zinc-700'}`} />
                                    <span className={`text-sm font-mono ${slot.available ? 'text-white' : 'text-zinc-600'}`}>{slot.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SERVICES GRID */}
                <div className="py-8 space-y-4">
                    <div className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">Menu Expérientiel</div>
                    {salon.services.map(s => (
                        <button key={s.id} onClick={() => setBooking(s)} className="w-full flex items-center justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl group hover:border-white/20 transition">
                            <div className="text-left">
                                <div className="font-bold text-white text-lg">{s.name}</div>
                                <div className="text-xs text-zinc-500 font-mono mt-1">{s.time}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-black text-white">{s.price}.-</span>
                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition transform scale-0 group-hover:scale-100"><ArrowRight size={14}/></div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* GALERIE SECONDAIRE */}
                {salon.images.length > 1 && (
                    <div className="py-4">
                        <div className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">Portfolio</div>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                            {salon.images.map((img, i) => (
                                <img 
                                    key={i} 
                                    src={img} 
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`w-48 h-64 object-cover rounded-2xl border flex-shrink-0 cursor-pointer transition ${i === currentImageIndex ? 'border-white' : 'border-zinc-800'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL BOOKING INTERNE */}
            {booking && (
                <div className="fixed inset-x-0 bottom-0 z-[60] bg-[#0f0f0f] rounded-t-[32px] p-8 border-t border-white/10 shadow-2xl animate-slide-up">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-black text-white">Créneaux.</h3>
                        <button onClick={()=>setBooking(null)} className="p-2 bg-zinc-900 rounded-full"><X/></button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {["19:00", "20:30", "22:00", "Dim 10h", "Dim 14h", "Lun 18h"].map(t => (
                            <button key={t} onClick={() => {alert("Confirmé!"); setBooking(null); onClose();}} className="py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold hover:bg-white hover:text-black transition">{t}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- CREATOR COCKPIT (L'OUTIL ULTIME) ---
const CreatorCockpit = ({ onFinish }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ name: '', city: '', category: 'Barber', bio: '', type: 'Salon', tags: [], services: [], images: [] });
    const [showPreview, setShowPreview] = useState(false);
    const fileRef = useRef(null);

    const handleImage = (e) => { 
        if (e.target.files[0]) {
            setData({ ...data, images: [...data.images, URL.createObjectURL(e.target.files[0])] }); 
        }
    };
    
    const addService = () => { 
        setData({...data, services: [...data.services, {id: Date.now(), name: "Service Premium", price: "80", time: "1h"}]}) 
    };

    const handleAIAssist = () => {
        const generatedAura = generateAura(data);
        setData({ ...data, bio: generatedAura });
    };

    // Live Preview Component
    const LivePreview = () => (
        <div className="h-full bg-zinc-950 p-6 overflow-y-auto">
            <div className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">Live Preview</div>
            <div className="relative w-full aspect-[4/5] bg-zinc-900 rounded-[32px] overflow-hidden border border-white/5">
                {data.images.length > 0 ? (
                    <img src={data.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-80"/>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                        <Upload size={48}/>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                    {data.type === 'Domicile' && <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Home size={10}/> Mobile</span>}
                    {data.tags.includes('Soir') && <span className="px-3 py-1 bg-indigo-500/20 backdrop-blur border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Moon size={10}/> Night</span>}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-4xl font-black text-white leading-[0.9] tracking-tighter mb-2">{data.name || "Nom du salon"}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                        <MapPin size={12}/> {data.city || "Ville"}
                    </div>
                    {data.bio && (
                        <p className="text-xs text-zinc-400 line-clamp-2">{data.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-black text-white font-sans flex relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-10 blur-3xl animate-pulse-slow"/>
            
            {/* MAIN EDITOR */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* HEADER */}
                <div className="p-8 flex justify-between items-center border-b border-white/5">
                    <span className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase">Creator V25</span>
                    <div className="flex gap-2">
                        <button onClick={() => setShowPreview(!showPreview)} className="lg:hidden px-4 py-2 bg-zinc-900 rounded-full text-xs font-bold uppercase hover:bg-white hover:text-black transition flex items-center gap-2">
                            <Eye size={14}/> Preview
                        </button>
                        <button onClick={() => onFinish(null)} className="text-zinc-500 hover:text-white transition"><X/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    {step === 1 && (
                        <div className="space-y-10 animate-fade-in">
                            <h1 className="text-6xl font-black tracking-tighter leading-none">Bâtir<br/><span className="text-zinc-700">L'Image.</span></h1>
                            <div className="space-y-6">
                                <input value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-3xl font-bold text-white outline-none placeholder:text-zinc-800 transition focus:border-white" placeholder="NOM DU PROJET"/>
                                <div className="flex gap-2 flex-wrap">
                                    {['Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => <button key={c} onClick={()=>setData({...data, category: c})} className={`px-5 py-2 rounded-full text-xs font-bold border transition-all ${data.category === c ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500'}`}>{c}</button>)}
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Galerie ({data.images.length})</div>
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        <div onClick={() => fileRef.current.click()} className="w-24 h-32 flex-shrink-0 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-white transition text-zinc-600 hover:text-white"><Upload className="mb-2"/> <input type="file" ref={fileRef} onChange={handleImage} className="hidden" accept="image/*"/></div>
                                        {data.images.map((img, i) => <img key={i} src={img} className="w-24 h-32 object-cover rounded-2xl border border-zinc-800"/>)}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition">Suivant</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 animate-fade-in">
                            <h1 className="text-6xl font-black tracking-tighter leading-none">Définir<br/><span className="text-zinc-700">L'Offre.</span></h1>
                            <div className="flex gap-4">
                                <button onClick={()=>setData({...data, type:'Salon'})} className={`flex-1 py-6 border rounded-3xl font-black uppercase text-xs transition ${data.type === 'Salon' ? 'bg-white text-black' : 'border-zinc-800 text-zinc-500'}`}>Salon</button>
                                <button onClick={()=>setData({...data, type:'Domicile'})} className={`flex-1 py-6 border rounded-3xl font-black uppercase text-xs transition ${data.type === 'Domicile' ? 'bg-emerald-500 text-black border-emerald-500' : 'border-zinc-800 text-zinc-500'}`}>Domicile</button>
                            </div>
                            <div className="space-y-3">
                                <input value={data.city} onChange={e => setData({...data, city: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-white" placeholder="Ville"/>
                                <div className="relative">
                                    <textarea value={data.bio} onChange={e=>setData({...data, bio: e.target.value})} className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 text-white outline-none focus:border-white resize-none" placeholder="Votre Bio..."/>
                                    <button 
                                        onClick={handleAIAssist}
                                        className="absolute bottom-3 right-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:scale-105 transition shadow-lg"
                                    >
                                        <Sparkles size={14}/> AI Assist
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-zinc-600 uppercase">Horaires Rares</div>
                                <div className="flex gap-2">
                                    {['Soir', 'Dimanche', 'Lundi'].map(t => <button key={t} onClick={()=>{setData({...data, tags: data.tags.includes(t) ? data.tags.filter(x=>x!==t) : [...data.tags, t]})}} className={`px-4 py-2 border rounded-full text-xs font-bold transition ${data.tags.includes(t) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>{t}</button>)}
                                </div>
                            </div>
                            <button onClick={() => setStep(3)} className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition">Dernière étape</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10 animate-fade-in">
                            <h1 className="text-6xl font-black tracking-tighter leading-none">Lancer<br/><span className="text-zinc-700">Le Flux.</span></h1>
                            <div className="border border-zinc-800 rounded-3xl p-6 space-y-4 bg-zinc-900/30">
                                <h3 className="text-2xl font-black">Services</h3>
                                {data.services.map((s, i) => <div key={i} className="text-zinc-400 border-b border-zinc-800 pb-2 flex justify-between"><span>{s.name}</span><span>{s.price}.-</span></div>)}
                                <button onClick={addService} className="w-full py-4 bg-zinc-900 rounded-2xl text-xs font-bold uppercase hover:bg-white hover:text-black transition">Ajouter Service</button>
                            </div>
                            <button onClick={() => onFinish(data)} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-black uppercase tracking-widest shadow-[0_0_60px_rgba(79,70,229,0.5)] hover:scale-105 transition">DÉPLOYER AETHER</button>
                        </div>
                    )}
                </div>
            </div>

            {/* LIVE PREVIEW PANEL (Desktop) */}
            <div className="hidden lg:block w-96 border-l border-white/5 relative z-10">
                <LivePreview />
            </div>

            {/* LIVE PREVIEW MODAL (Mobile) */}
            {showPreview && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black animate-slide-up">
                    <div className="p-6 flex justify-between items-center border-b border-white/5">
                        <span className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase">Preview</span>
                        <button onClick={() => setShowPreview(false)} className="text-zinc-500 hover:text-white transition"><X/></button>
                    </div>
                    <LivePreview />
                </div>
            )}
        </div>
    );
};

// --- APP SHELL ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(DATA);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // DEPLOY with functional state update
  const handleDeploy = (newSalon) => {
      if (newSalon) {
          const images = newSalon.images.length > 0 ? newSalon.images : ["https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80"];
          const deployedSalon = { 
              id: Date.now(), 
              ...newSalon, 
              images, 
              rating: "5.0", 
              location: newSalon.city, 
              services: newSalon.services.length > 0 ? newSalon.services : [{id: Date.now(), name: "Service Premium", price: 80, time: "1h"}],
              availabilities: [
                  { time: "09:00", available: true },
                  { time: "14:00", available: true },
                  { time: "18:00", available: true },
              ]
          };
          setSalons(prev => [deployedSalon, ...prev]);
          setView('client');
      } else {
          setView('landing');
      }
  };

  const filtered = salons.filter(s => activeCategory === 'Tout' || s.category === activeCategory);

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-30 animate-pulse-slow"/>
          <h1 className="text-9xl font-black text-white tracking-tighter mix-blend-difference z-10 leading-none">AETHER<span className="text-indigo-500">.</span></h1>
          <p className="text-zinc-500 font-medium tracking-[0.5em] text-xs uppercase z-10 mt-4 mb-12">Genesis System V25</p>
          <div className="flex flex-col gap-4 w-72 z-10">
              <button onClick={() => setView('client')} className="py-5 bg-white text-black font-black rounded-full uppercase tracking-widest hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.3)]">Entrer</button>
              <button onClick={() => setView('pro')} className="py-5 border border-white/20 backdrop-blur text-white font-bold rounded-full uppercase tracking-widest hover:bg-white/10 transition">Créateur</button>
          </div>
      </div>
  );

  if (view === 'pro') return <CreatorCockpit onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="px-6 py-6 flex justify-between items-center bg-black sticky top-0 z-20">
            <span className="font-black text-xl tracking-tighter">AETHER.</span>
            <button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
            {activeTab === 'home' && (
                <>
                    <HelixNav active={activeCategory} onSelect={setActiveCategory} />
                    <div className="px-4 mt-6">
                        {filtered.map(s => (
                            <AetherCard 
                                key={s.id} 
                                salon={s} 
                                onExpand={setSelectedSalon} 
                                isFavorite={favorites.includes(s.id)}
                                onToggleFavorite={(id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                            />
                        ))}
                        {filtered.length === 0 && <div className="text-center text-zinc-600 py-20">Vide.</div>}
                    </div>
                </>
            )}
            {activeTab === 'likes' && (
                <div className="px-4 mt-6">
                    <h2 className="text-5xl font-black mb-8 px-2 tracking-tighter">Collection.</h2>
                    {salons.filter(s => favorites.includes(s.id)).map(s => <AetherCard key={s.id} salon={s} onExpand={setSelectedSalon} isFavorite={true} onToggleFavorite={(id) => setFavorites(prev => prev.filter(x => x !== id))} />)}
                    {salons.filter(s => favorites.includes(s.id)).length === 0 && <div className="text-center text-zinc-600 py-20">Aucun favori.</div>}
                </div>
            )}
            {activeTab === 'agenda' && <div className="px-4 mt-6 text-center text-zinc-500 py-20">Aucun rendez-vous.</div>}
        </div>

        {/* NAVIGATION BOTTOM */}
        <div className="fixed bottom-8 w-full max-w-md px-6 z-30 flex justify-center pointer-events-none">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-5 flex items-center gap-12 shadow-2xl pointer-events-auto">
                <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? "text-white scale-125 transition" : "text-zinc-600 hover:text-zinc-400"}><Search size={24} strokeWidth={2.5}/></button>
                <button onClick={() => setActiveTab('agenda')} className={activeTab === 'agenda' ? "text-white scale-125 transition" : "text-zinc-600 hover:text-zinc-400"}><Calendar size={24} strokeWidth={2.5}/></button>
                <button onClick={() => setActiveTab('likes')} className={activeTab === 'likes' ? "text-white scale-125 transition" : "text-zinc-600 hover:text-zinc-400"}><Heart size={24} strokeWidth={2.5}/></button>
            </div>
        </div>

        {/* EXPANDED VIEW (MORPHING) */}
        {selectedSalon && <ExpandedDimension salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}

      </div>
    </div>
  );
}
