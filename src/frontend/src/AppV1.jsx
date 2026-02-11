import React, { useState, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, 
  Camera, FileText, Trash2, Image as ImageIcon, Briefcase, 
  Wand2, Save, MoreHorizontal
} from 'lucide-react';

// --- DATA SOURCE ---
const INITIAL_SALONS = [
  {
    id: 1, name: "Midnight Barber", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"],
    location: "Lausanne", type: "Domicile", distance: "Service Mobile",
    nextSlot: "Ce soir 20:00",
    tags: ["Nocturne", "Dimanche"],
    bio: "L'art du rasage traditionnel revisité. Je me déplace avec mon fauteuil et mes produits d'exception.",
    contact: "079 123 45 67",
    services: [
        { id: 101, name: "Coupe Prestige", price: 80, time: 60, desc: "Coupe aux ciseaux, shampoing, coiffage.", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=60" }, 
        { id: 102, name: "Barbe & Soin", price: 45, time: 30, desc: "Taille, contours, serviette chaude.", image: "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=400&q=60" }
    ]
  }
];

// --- PRESETS INTELLIGENTS (L'IA SIMULÉE) ---
const PRESETS = {
    Barber: [
        { name: "Coupe Classique", price: "40", time: "30", desc: "Ciseaux et tondeuse." },
        { name: "Dégradé à Blanc", price: "50", time: "45", desc: "Finition rasoir, précision chirurgicale." },
        { name: "Taille Barbe", price: "30", time: "20", desc: "Contours et homogénéisation." }
    ],
    Onglerie: [
        { name: "Semi-Permanent", price: "60", time: "45", desc: "Manucure russe + Pose couleur." },
        { name: "Pose Gel Complète", price: "120", time: "90", desc: "Rallongement chablis et architecture." },
        { name: "Nail Art (par ongle)", price: "5", time: "10", desc: "Dessin main levée." }
    ],
    Coiffure: [
        { name: "Brushing", price: "45", time: "30", desc: "Lissage et volume." },
        { name: "Balayage", price: "180", time: "180", desc: "Technique airtouch, patine incluse." }
    ]
};

// --- COMPOSANTS CLIENT ---
const StatusBadge = ({ type, text }) => {
    const styles = {
        dispo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        tag: "bg-zinc-800 text-zinc-400 border-zinc-700",
        verified: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${styles[type] || styles.tag}`}>
            {type === 'dispo' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>}
            {type === 'verified' && <ShieldCheck size={10}/>}
            {text}
        </span>
    );
};

const NexusCard = ({ salon, onSelect }) => {
    const startPrice = salon.services.length > 0 ? Math.min(...salon.services.map(s => s.price)) : 0;
    return (
        <div onClick={() => onSelect(salon)} className="bg-[#121212] rounded-[20px] overflow-hidden border border-zinc-800 mb-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer group hover:border-zinc-600">
            <div className="flex h-36">
                <div className="w-[30%] relative overflow-hidden">
                    <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover" alt={salon.name}/>
                    {salon.type === 'Domicile' && <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 backdrop-blur py-1 text-[8px] font-bold text-white text-center uppercase">Mobile</div>}
                </div>
                <div className="w-[70%] p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start"><h3 className="font-black text-white text-base leading-tight truncate pr-2">{salon.name}</h3>{salon.verified && <StatusBadge type="verified" text="Vérifié"/>}</div>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs font-medium mt-1"><MapPin size={10}/> {salon.location} • <Star size={10} className="text-yellow-500 fill-current"/> <span className="text-white">{salon.rating}</span></div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5"><StatusBadge type="dispo" text={salon.nextSlot} />{salon.tags.slice(0, 1).map(t => <StatusBadge key={t} type="tag" text={t}/>)}</div>
                        <div className="flex justify-between items-end pt-2 border-t border-zinc-800"><div className="text-[10px] text-zinc-400 font-medium">À partir de</div><div className="flex items-center gap-2"><div className="text-lg font-black text-white">{startPrice}.-</div><div className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center"><ChevronLeft className="rotate-180" size={14}/></div></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NexusDetail = ({ salon, onClose }) => {
    const [cart, setCart] = useState([]); 

    const toggleService = (service) => {
        if (cart.find(s => s.id === service.id)) setCart(cart.filter(s => s.id !== service.id));
        else setCart([...cart, service]);
    };

    const totalPrice = cart.reduce((acc, s) => acc + Number(s.price), 0);
    const totalTime = cart.reduce((acc, s) => acc + Number(s.time), 0);

    return (
        <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans">
            <div className="relative h-56 flex-shrink-0">
                <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={salon.name}/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"/>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20"><button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><ChevronLeft/></button><button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><Heart size={18}/></button></div>
                <div className="absolute bottom-4 left-6 right-6"><h2 className="text-3xl font-black text-white mb-1">{salon.name}</h2><div className="flex items-center gap-2 text-xs font-bold text-zinc-300"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{salon.type}</span><span>•</span><span>{salon.category}</span></div></div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-36">
                <div className="py-6 border-b border-zinc-800"><h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 tracking-widest">Le Concept</h3><p className="text-sm text-zinc-300 leading-relaxed">{salon.bio}</p></div>
                
                {salon.images && salon.images.length > 0 && (
                    <div className="py-6 border-b border-zinc-800">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 tracking-widest">Portfolio</h3>
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                            {salon.images.map((img, i) => <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-zinc-800" alt={`Portfolio ${i + 1}`}/>)}
                        </div>
                    </div>
                )}

                <div className="py-6 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Menu des Services</h3>
                    <div className="space-y-3">
                        {salon.services.map(s => {
                            const isSelected = cart.find(i => i.id === s.id);
                            return (
                                <button key={s.id} onClick={() => toggleService(s)} className={`w-full p-3 rounded-xl border flex gap-3 text-left transition-all ${isSelected ? 'bg-indigo-600/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}>
                                    {s.image && <img src={s.image} className="w-16 h-16 rounded-lg object-cover bg-black flex-shrink-0" alt={s.name}/>}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start"><div className="font-bold text-white text-sm truncate">{s.name}</div><div className="font-bold text-white text-sm">{s.price}.-</div></div>
                                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1"><Clock size={10}/> {s.time} min</div>
                                        {s.desc && <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{s.desc}</p>}
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center self-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>{isSelected && <CheckCircle2 size={12} className="text-white"/>}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b] border-t border-zinc-800 safe-area-pb z-50">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="text-xs text-zinc-500 uppercase font-bold">{cart.length} Soins</div>
                            <div className="text-xl font-black text-white flex items-baseline gap-2">{totalPrice}.- <span className="text-sm font-medium text-zinc-500">({Math.floor(totalTime/60)}h{totalTime%60})</span></div>
                        </div>
                        <button onClick={() => { alert("Réservation lancée !"); onClose(); }} className="flex-[2] py-4 bg-white text-black rounded-xl font-black uppercase tracking-wide transition shadow-lg hover:bg-zinc-200">Continuer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- GENESIS ARCHITECT (LE STUDIO) ---
const GenesisArchitect = ({ onFinish }) => {
    const [preview, setPreview] = useState({ 
        name: 'Nom du Projet', category: 'Barber', rating: '5.0', reviews: 0,
        cover: null, images: [], location: 'Lausanne', type: 'Salon', distance: '1.2km',
        nextSlot: '20:00', tags: [], bio: '', contact: '', services: [] 
    });
    
    // Service Editor State
    const [newService, setNewService] = useState({ name: '', price: '', time: '30', desc: '', image: null });
    const [isEditingService, setIsEditingService] = useState(false);
    
    const fileRef = useRef(null);
    const serviceFileRef = useRef(null);

    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    
    const addPreset = (preset) => {
        update('services', [...preview.services, { ...preset, id: Date.now(), image: null }]);
    };

    return (
        <div className="h-full bg-black text-white font-sans flex flex-col md:flex-row">
            {/* GAUCHE : TOOLS */}
            <div className="flex-1 flex flex-col border-r border-zinc-800">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                    <span className="font-black tracking-widest text-xs text-zinc-400 uppercase">GENESIS ARCHITECT</span>
                    <button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-black">
                    
                    {/* SECTION 1: FONDATIONS */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest"><Globe size={12}/> Fondations</div>
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 space-y-4">
                            <div className="flex gap-4 items-start">
                                <div onClick={() => fileRef.current?.click()} className="w-24 h-24 bg-black border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white transition group flex-shrink-0 overflow-hidden">
                                    {preview.cover ? <img src={preview.cover} className="w-full h-full object-cover" alt="Cover"/> : <div className="text-center"><Camera size={20} className="text-zinc-600 mb-1 group-hover:text-white"/><span className="text-[8px] text-zinc-600 font-bold uppercase">Cover</span></div>}
                                    <input type="file" ref={fileRef} onChange={(e) => e.target.files?.[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input placeholder="Nom du Salon" value={preview.name} onChange={e=>update('name', e.target.value)} className="w-full bg-transparent border-b border-zinc-700 py-2 text-lg font-bold text-white outline-none focus:border-indigo-500"/>
                                    <div className="flex gap-2">
                                        <select className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none" value={preview.category} onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option></select>
                                        <input placeholder="Ville" value={preview.location} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none" onChange={e=>update('location', e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <textarea placeholder="Votre Bio : Convaincre en 2 phrases..." value={preview.bio} onChange={e=>update('bio', e.target.value)} className="w-full h-20 bg-black border border-zinc-700 rounded-xl p-3 text-xs text-white outline-none resize-none focus:border-white"/>
                        </div>
                    </div>

                    {/* SECTION 2: SERVICES (LE CŒUR) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest"><Grid size={12}/> Carte des Soins</div>
                            <button onClick={() => setIsEditingService(true)} className="text-[10px] bg-white text-black px-3 py-1 rounded font-bold hover:bg-zinc-200">+ Créer</button>
                        </div>

                        {/* SUGGESTIONS INTELLIGENTES */}
                        {!isEditingService && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {PRESETS[preview.category]?.map((p, i) => (
                                    <button key={i} onClick={() => addPreset(p)} className="flex-shrink-0 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 hover:text-white hover:border-zinc-600 transition flex items-center gap-1">
                                        <Wand2 size={10}/> {p.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* FORMULAIRE SERVICE DÉTAILLÉ */}
                        {isEditingService && (
                            <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-4 overflow-hidden">
                                <div className="flex justify-between mb-3"><span className="text-xs font-bold text-white">Nouveau Service</span><button onClick={()=>setIsEditingService(false)}><X size={14} className="text-zinc-500"/></button></div>
                                
                                <div className="flex gap-4 mb-3">
                                    <div onClick={() => serviceFileRef.current?.click()} className="w-16 h-16 bg-black border border-dashed border-zinc-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-white overflow-hidden">
                                        {newService.image ? <img src={newService.image} className="w-full h-full object-cover" alt="Service"/> : <ImageIcon size={16} className="text-zinc-500"/>}
                                        <input type="file" ref={serviceFileRef} onChange={(e) => e.target.files?.[0] && setNewService({...newService, image: URL.createObjectURL(e.target.files[0])})} className="hidden"/>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input placeholder="Nom (ex: Coupe)" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/>
                                        <div className="flex gap-2">
                                            <input placeholder="Prix" type="number" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/>
                                            <input placeholder="Min" type="number" value={newService.time} onChange={e=>setNewService({...newService, time: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/>
                                        </div>
                                    </div>
                                </div>
                                <textarea placeholder="Description technique (produits, étapes)..." value={newService.desc} onChange={e=>setNewService({...newService, desc: e.target.value})} className="w-full h-16 bg-black border border-zinc-600 rounded-lg p-2 text-xs text-white outline-none resize-none mb-3"/>
                                <button onClick={() => { update('services', [...preview.services, { ...newService, id: Date.now() }]); setNewService({ name: '', price: '', time: '30', desc: '', image: null }); setIsEditingService(false); }} className="w-full py-2 bg-white text-black font-bold text-xs rounded uppercase hover:bg-zinc-200">Enregistrer</button>
                            </div>
                        )}

                        {/* LISTE DES SERVICES */}
                        <div className="space-y-2">
                            {preview.services.map((s, i) => (
                                <div key={i} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center">
                                    {s.image ? <img src={s.image} className="w-10 h-10 rounded-lg object-cover" alt={s.name}/> : <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"><Scissors size={14} className="text-zinc-600"/></div>}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-sm text-white truncate">{s.name}</span>
                                            <span className="text-xs font-mono text-zinc-400">{s.price}.-</span>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 truncate">{s.desc || "Pas de description"}</div>
                                    </div>
                                    <button onClick={()=>update('services', preview.services.filter(srv=>srv.id!==s.id))} className="opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} className="text-zinc-500 hover:text-red-500"/></button>
                                </div>
                            ))}
                            {preview.services.length === 0 && !isEditingService && <div className="text-center py-6 text-zinc-600 text-xs italic border border-dashed border-zinc-800 rounded-xl">Aucun service. Utilisez l&apos;assistant ou créez-en un.</div>}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900">
                    <button onClick={() => onFinish(preview)} className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2"><RocketLaunchIcon/> Déployer</button>
                </div>
            </div>

            {/* DROITE : LIVE PREVIEW */}
            <div className="hidden md:flex w-[400px] bg-black border-l border-zinc-800 flex-col items-center justify-center p-8 relative">
                <div className="absolute top-0 left-0 right-0 p-4 text-center border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest">Aperçu Client</h3>
                </div>
                <div className="w-full max-w-sm pointer-events-none transform scale-95 origin-top shadow-2xl mt-10">
                    <NexusCard salon={preview} onSelect={()=>{}} />
                    <div className="mt-4 space-y-2 opacity-60 grayscale">
                        {preview.services.slice(0,3).map(s => (
                            <div key={s.id} className="p-3 bg-zinc-900 rounded-lg flex justify-between items-center border border-zinc-800">
                                <span className="text-xs font-bold text-white">{s.name}</span>
                                <span className="text-xs text-zinc-400">{s.price}.-</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ICONE MANQUANTE ---
const RocketLaunchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;

// --- APP ROOT ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('Tout');

  const handleDeploy = (data) => {
      if(data) {
          const newS = { ...data, id: Date.now(), verified: true, reviews: 0 };
          setSalons(prev => [newS, ...prev]);
          setView('client');
      } else {
          setView('landing');
      }
  };

  const filtered = salons.filter(s => {
      const matchCat = catFilter === 'Tout' || s.category === catFilter;
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.services.some(srv => srv.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
  });

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center font-sans relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20"/>
          <div className="z-10 text-center space-y-8 w-full max-w-sm p-6">
              <h1 className="text-7xl font-black text-white tracking-tighter mix-blend-difference">NEXUS<span className="text-indigo-500">.</span></h1>
              <div className="flex flex-col gap-3">
                  <button onClick={() => setView('client')} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-xl">Rechercher</button>
                  <button onClick={() => setView('pro')} className="w-full py-4 bg-transparent border border-zinc-700 text-white font-black rounded-xl uppercase tracking-widest hover:bg-white/10 transition">Espace Pro</button>
              </div>
          </div>
      </div>
  );

  if (view === 'pro') return <GenesisArchitect onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-900 pb-2">
            <div className="px-4 py-4 flex justify-between items-center"><span className="font-black text-xl tracking-tighter">NEXUS.</span><button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button></div>
            <div className="px-4 mb-3"><div className="relative"><Search className="absolute left-4 top-3 text-zinc-500" size={18}/><input type="text" placeholder="Service, salon, ville..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-indigo-500 transition"/></div></div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-2">{['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => (<button key={c} onClick={() => setCatFilter(c)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${catFilter === c ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>))}</div>
        </div>
        <div className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
            {filtered.map(s => <NexusCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}
            {filtered.length === 0 && <div className="text-center py-20 text-zinc-500">Aucun résultat.</div>}
        </div>
        <div className="fixed bottom-0 w-full max-w-md bg-black border-t border-zinc-900 px-8 py-4 flex justify-between items-center z-30 safe-area-pb"><button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? "text-white" : "text-zinc-600"}`}><Grid size={22}/><span className="text-[9px] font-bold uppercase">Explore</span></button><button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1 ${activeTab === 'agenda' ? "text-white" : "text-zinc-600"}`}><Calendar size={22}/><span className="text-[9px] font-bold uppercase">Agenda</span></button><button onClick={() => setActiveTab('likes')} className={`flex flex-col items-center gap-1 ${activeTab === 'likes' ? "text-white" : "text-zinc-600"}`}><Heart size={22}/><span className="text-[9px] font-bold uppercase">Favoris</span></button></div>
        {selectedSalon && <NexusDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}
      </div>
    </div>
  );
}
