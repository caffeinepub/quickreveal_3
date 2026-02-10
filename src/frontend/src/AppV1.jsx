import React, { useState, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, BarChart3
} from 'lucide-react';

// --- DATA SOURCE (RICHE) ---
const INITIAL_SALONS = [
  {
    id: 1, name: "Midnight Barber", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    location: "Lausanne", type: "Domicile", distance: "Service Mobile",
    nextSlot: "Ce soir 20:00",
    tags: ["Nocturne", "Dimanche"],
    bio: "L'art du rasage traditionnel revisité. Je me déplace avec mon fauteuil et mes produits d'exception pour une expérience VIP à domicile.",
    contact: "079 123 45 67",
    services: [{ id: 101, name: "Coupe Prestige", price: 80, time: "1h" }, { id: 102, name: "Barbe & Soin", price: 45, time: "30min" }]
  },
  {
    id: 2, name: "L'Atelier Russe", category: "Onglerie", rating: "4.9", reviews: 89, verified: true,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    location: "Genève", type: "Salon", distance: "1.2km",
    nextSlot: "Demain 10:00",
    tags: ["Lundi", "Privé"],
    bio: "Spécialiste de la manucure russe combinée. Architecture de l'ongle et renforcement. Un résultat parfait qui dure 4 semaines.",
    contact: "078 999 00 00",
    services: [{ id: 201, name: "Manucure Russe", price: 100, time: "1h30" }, { id: 202, name: "Pose Gel", price: 140, time: "2h" }]
  },
  {
    id: 3, name: "Suzy Glow", category: "Esthétique", rating: "5.0", reviews: 52, verified: false,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    location: "Montreux", type: "Salon", distance: "0.5km",
    nextSlot: "Dimanche 14h",
    tags: ["Dimanche"],
    bio: "Technologies de pointe (Hydrafacial, RF) pour une peau de verre. Vue sur le lac.",
    contact: "021 000 00 00",
    services: [{ id: 301, name: "HydraFacial Gold", price: 180, time: "1h" }]
  }
];

// --- COMPOSANTS UTILITAIRES ---

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

// --- NEXUS CARD (PERFORMANCE & CLARTÉ) ---
const NexusCard = ({ salon, onSelect }) => {
    const startPrice = Math.min(...salon.services.map(s => s.price));

    return (
        <div 
            onClick={() => onSelect(salon)}
            className="bg-[#121212] rounded-[20px] overflow-hidden border border-zinc-800 mb-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer group hover:border-zinc-600"
        >
            <div className="flex h-36">
                {/* IMAGE (30%) */}
                <div className="w-[30%] relative overflow-hidden">
                    <img src={salon.image} className="absolute inset-0 w-full h-full object-cover"/>
                    {salon.type === 'Domicile' && <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 backdrop-blur py-1 text-[8px] font-bold text-white text-center uppercase">Mobile</div>}
                </div>

                {/* INFO (70%) */}
                <div className="w-[70%] p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-black text-white text-base leading-tight truncate pr-2">{salon.name}</h3>
                            {salon.verified && <StatusBadge type="verified" text="Vérifié"/>}
                        </div>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs font-medium mt-1">
                            <MapPin size={10}/> {salon.location} • <Star size={10} className="text-yellow-500 fill-current"/> <span className="text-white">{salon.rating}</span> ({salon.reviews})
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                            <StatusBadge type="dispo" text={salon.nextSlot} />
                            {salon.tags.slice(0, 1).map(t => <StatusBadge key={t} type="tag" text={t}/>)}
                        </div>
                        
                        <div className="flex justify-between items-end pt-2 border-t border-zinc-800">
                            <div className="text-[10px] text-zinc-400 font-medium">À partir de</div>
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-black text-white">{startPrice}.-</div>
                                <div className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center"><ChevronLeft className="rotate-180" size={14}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DÉTAIL MODAL (CONVERSION) ---
const NexusDetail = ({ salon, onClose }) => {
    const [selectedService, setSelectedService] = useState(null);

    return (
        <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans">
            {/* HERO */}
            <div className="relative h-56 flex-shrink-0">
                <img src={salon.image} className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"/>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><ChevronLeft/></button>
                    <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><Heart size={18}/></button>
                </div>
                <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-3xl font-black text-white mb-1">{salon.name}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{salon.type}</span>
                        <span>•</span>
                        <span>{salon.category}</span>
                    </div>
                </div>
            </div>

            {/* CONTENU */}
            <div className="flex-1 overflow-y-auto px-6 pb-32">
                <div className="py-6 border-b border-zinc-800">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 tracking-widest">À Propos</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">{salon.bio}</p>
                </div>

                <div className="py-6 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                        Services
                        {selectedService && <span className="text-indigo-400">1 sélectionné</span>}
                    </h3>
                    <div className="space-y-2">
                        {salon.services.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedService(s)}
                                className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selectedService?.id === s.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'}`}
                            >
                                <div className="text-left">
                                    <div className="font-bold text-white">{s.name}</div>
                                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1"><Clock size={10}/> {s.time}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-white">{s.price}.-</span>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedService?.id === s.id ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                                        {selectedService?.id === s.id && <CheckCircle2 size={12} className="text-white"/>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b] border-t border-zinc-800 safe-area-pb">
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <div className="text-xs text-zinc-500 uppercase font-bold">Total</div>
                        <div className="text-2xl font-black text-white">{selectedService ? selectedService.price : '0'}.-</div>
                    </div>
                    <button 
                        disabled={!selectedService}
                        onClick={() => { alert("Réservation lancée !"); onClose(); }}
                        className="flex-[2] py-4 bg-white text-black rounded-xl font-black uppercase tracking-wide disabled:opacity-50 disabled:scale-95 transition shadow-lg hover:bg-zinc-200"
                    >
                        Réserver
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- STUDIO PRO (GAMIFIÉ & SPLIT) ---
const PrimeStudio = ({ onFinish }) => {
    const [preview, setPreview] = useState({ 
        name: 'Mon Business', category: 'Barber', rating: '5.0', reviews: 0,
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
        location: 'Lausanne', type: 'Salon', distance: '1.2km',
        nextSlot: '20:00', tags: [], bio: '', contact: '', services: [], verified: true
    });
    const fileRef = useRef(null);

    // Calcul du score de complétion
    const completion = [preview.name !== 'Mon Business', preview.bio, preview.services.length > 0, preview.image].filter(Boolean).length * 25;

    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const handleImg = (e) => { if(e.target.files[0]) update('image', URL.createObjectURL(e.target.files[0])) };
    const addSrv = () => update('services', [...preview.services, {id: Date.now(), name: "Service Standard", price: 50, time: "45min"}]);

    return (
        <div className="h-full bg-black text-white font-sans flex flex-col md:flex-row">
            {/* GAUCHE : ÉDITEUR */}
            <div className="flex-1 flex flex-col border-r border-zinc-800">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                    <span className="font-black tracking-widest text-xs text-zinc-400 uppercase">NEXUS STUDIO</span>
                    <button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button>
                </div>

                <div className="p-4 bg-zinc-900/50 border-b border-zinc-800">
                    <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2 uppercase">
                        <span>Qualité du profil</span>
                        <span>{completion}%</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style={{width: `${completion}%`}}/>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <section>
                        <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Globe size={14}/> Identité</h3>
                        <div className="space-y-4">
                            <input placeholder="Nom de l'établissement" value={preview.name === 'Mon Business' ? '' : preview.name} onChange={e=>update('name', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 font-bold text-white outline-none focus:border-indigo-500 transition"/>
                            <div className="grid grid-cols-2 gap-3">
                                <select className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white outline-none" onChange={e=>update('category', e.target.value)}>
                                    <option>Barber</option><option>Coiffure</option><option>Onglerie</option><option>Esthétique</option>
                                </select>
                                <input placeholder="Ville" value={preview.location === 'Lausanne' ? '' : preview.location} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white outline-none" onChange={e=>update('location', e.target.value)}/>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>update('type', 'Salon')} className={`flex-1 py-3 border rounded-lg text-xs font-bold uppercase transition ${preview.type === 'Salon' ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-500'}`}>Salon</button>
                                <button onClick={()=>update('type', 'Domicile')} className={`flex-1 py-3 border rounded-lg text-xs font-bold uppercase transition ${preview.type === 'Domicile' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-zinc-700 text-zinc-500'}`}>Domicile</button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Grid size={14}/> Contenu</h3>
                        <textarea placeholder="Votre Bio (Soyez convaincant)..." value={preview.bio} onChange={e=>update('bio', e.target.value)} className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white outline-none resize-none focus:border-white"/>
                        <div onClick={() => fileRef.current.click()} className="mt-4 h-32 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition text-zinc-600">
                            <span className="text-xs font-bold uppercase flex items-center gap-2"><Upload size={14}/> Photo Cover</span>
                            <input type="file" ref={fileRef} onChange={handleImg} className="hidden"/>
                        </div>
                        
                        <div className="mt-6 border-t border-zinc-800 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-zinc-500 uppercase">Vos Services</span>
                                <button onClick={addSrv} className="text-indigo-400 text-xs font-bold hover:text-white flex items-center gap-1"><Plus size={12}/> Ajouter</button>
                            </div>
                            {preview.services.map((s, i) => (
                                <div key={i} className="flex justify-between bg-zinc-900 p-3 rounded-lg mb-2 text-sm text-zinc-300">
                                    <span>{s.name}</span>
                                    <span className="font-bold">{s.price}.-</span>
                                </div>
                            ))}
                            {preview.services.length === 0 && <div className="text-xs text-zinc-600 italic">Aucun service ajouté.</div>}
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-zinc-800">
                    <button onClick={() => onFinish(preview)} className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-lg">Mettre en Ligne</button>
                </div>
            </div>

            {/* DROITE : PREVIEW (FIXE DESKTOP, CACHÉ MOBILE) */}
            <div className="hidden md:flex w-[400px] bg-black border-l border-zinc-800 flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black">
                <div className="mb-8 text-center">
                    <h3 className="text-white font-black text-xl">Aperçu Client</h3>
                    <p className="text-zinc-500 text-xs">Voici comment vous apparaissez</p>
                </div>
                <div className="w-full max-w-sm pointer-events-none transform scale-100">
                    <NexusCard salon={preview} onSelect={()=>{}} />
                </div>
            </div>
        </div>
    );
};

// --- APP ROOT ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [selectedSalon, setSelectedSalon] = useState(null);
  
  // NOUVEAU : RECHERCHE INTELLIGENTE
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('Tout');

  const handleDeploy = (data) => {
      if(data) {
          const newS = { ...data, id: Date.now(), verified: true };
          setSalons(prev => [newS, ...prev]);
          setView('client');
      } else {
          setView('client');
      }
  };

  // LOGIQUE DE FILTRAGE AVANCÉE
  const filtered = salons.filter(s => {
      const matchCat = catFilter === 'Tout' || s.category === catFilter;
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.services.some(srv => srv.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
  });

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center font-sans relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20 animate-pulse-slow"/>
          <div className="z-10 text-center space-y-8 w-full max-w-sm p-6">
              <h1 className="text-7xl font-black text-white tracking-tighter mix-blend-difference">NEXUS<span className="text-indigo-500">.</span></h1>
              <p className="text-zinc-400 font-medium">La plateforme de référence.</p>
              <div className="flex flex-col gap-3">
                  <button onClick={() => setView('client')} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-xl">Rechercher</button>
                  <button onClick={() => setView('pro')} className="w-full py-4 bg-transparent border border-zinc-700 text-white font-black rounded-xl uppercase tracking-widest hover:bg-white/10 transition">Espace Pro</button>
              </div>
          </div>
      </div>
  );

  if (view === 'pro') return <PrimeStudio onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        
        {/* HEADER & SEARCH (LE CERVEAU DE L'APP) */}
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-900 pb-2">
            <div className="px-4 py-4 flex justify-between items-center">
                <span className="font-black text-xl tracking-tighter">NEXUS.</span>
                <button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button>
            </div>
            
            {/* BARRE DE RECHERCHE RÉELLE */}
            <div className="px-4 mb-3">
                <div className="relative">
                    <Search className="absolute left-4 top-3 text-zinc-500" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Service, salon, ville..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
            </div>

            {/* FILTRES RAPIDES */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-2">
                {['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => (
                    <button 
                        key={c} 
                        onClick={() => setCatFilter(c)} 
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${catFilter === c ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>

        {/* FEED */}
        <div className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{filtered.length} Résultats</span>
                <button className="text-xs font-bold text-indigo-400 flex items-center gap-1"><Filter size={12}/> Trier</button>
            </div>
            
            {filtered.map(s => <NexusCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}
            
            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <Search size={48} className="mx-auto text-zinc-800 mb-4"/>
                    <p className="text-zinc-500 font-medium">Aucun résultat trouvé.</p>
                    <button onClick={() => {setSearchTerm(''); setCatFilter('Tout');}} className="mt-4 text-indigo-500 text-sm font-bold">Réinitialiser</button>
                </div>
            )}
        </div>

        {/* BOTTOM NAV (CONTROL PANEL) */}
        <div className="fixed bottom-0 w-full max-w-md bg-black border-t border-zinc-900 px-8 py-4 flex justify-between items-center z-30 safe-area-pb">
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? "text-white" : "text-zinc-600"}`}>
                <Grid size={22}/>
                <span className="text-[9px] font-bold uppercase">Explore</span>
            </button>
            <button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1 ${activeTab === 'agenda' ? "text-white" : "text-zinc-600"}`}>
                <Calendar size={22}/>
                <span className="text-[9px] font-bold uppercase">Agenda</span>
            </button>
            <button onClick={() => setActiveTab('likes')} className={`flex flex-col items-center gap-1 ${activeTab === 'likes' ? "text-white" : "text-zinc-600"}`}>
                <Heart size={22}/>
                <span className="text-[9px] font-bold uppercase">Favoris</span>
            </button>
        </div>

        {/* DETAIL VIEW */}
        {selectedSalon && <NexusDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}

      </div>
    </div>
  );
}
