import React, { useState, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, 
  Camera, FileText, Trash2, Image as ImageIcon, Briefcase, Info, ShoppingBag
} from 'lucide-react';

// --- DATA SOURCE ---
const INITIAL_SALONS = [
  {
    id: 1, name: "Midnight Barber", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"],
    location: "Lausanne", type: "Domicile", distance: "Service Mobile",
    nextSlot: "Ce soir 20:00",
    tags: ["Nocturne", "Dimanche"],
    bio: "L'art du rasage traditionnel revisité. Je me déplace avec mon fauteuil et mes produits d'exception.",
    contact: "079 123 45 67",
    services: [
        { id: 101, name: "Coupe Prestige", price: 80, time: 60, desc: "Coupe aux ciseaux, shampoing, coiffage.", image: "https://images.unsplash.com/photo-1593487568720-92097fb460bf?auto=format&fit=crop&w=400&q=60" }, 
        { id: 102, name: "Barbe & Soin", price: 45, time: 30, desc: "Taille, contours, serviette chaude.", image: "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=400&q=60" }
    ]
  }
];

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
    const startPrice = Math.min(...salon.services.map(s => s.price));
    return (
        <div onClick={() => onSelect(salon)} className="bg-[#121212] rounded-[20px] overflow-hidden border border-zinc-800 mb-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer group hover:border-zinc-600">
            <div className="flex h-36">
                <div className="w-[30%] relative overflow-hidden">
                    <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover"/>
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
    const [cart, setCart] = useState([]); // PANIER MULTIPLE

    const toggleService = (service) => {
        if (cart.find(s => s.id === service.id)) {
            setCart(cart.filter(s => s.id !== service.id));
        } else {
            setCart([...cart, service]);
        }
    };

    const totalPrice = cart.reduce((acc, s) => acc + Number(s.price), 0);
    const totalTime = cart.reduce((acc, s) => acc + Number(s.time), 0);

    return (
        <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans">
            <div className="relative h-56 flex-shrink-0">
                <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"/>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20"><button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><ChevronLeft/></button><button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><Heart size={18}/></button></div>
                <div className="absolute bottom-4 left-6 right-6"><h2 className="text-3xl font-black text-white mb-1">{salon.name}</h2><div className="flex items-center gap-2 text-xs font-bold text-zinc-300"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{salon.type}</span><span>•</span><span>{salon.category}</span></div></div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-36">
                <div className="py-6 border-b border-zinc-800"><h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 tracking-widest">Le Concept</h3><p className="text-sm text-zinc-300 leading-relaxed">{salon.bio}</p></div>
                
                {/* GALERIE DANS DETAIL */}
                {salon.images && salon.images.length > 0 && (
                    <div className="py-6 border-b border-zinc-800">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 tracking-widest">Portfolio</h3>
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                            {salon.images.map((img, i) => <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-zinc-800"/>)}
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
                                    {s.image && <img src={s.image} className="w-16 h-16 rounded-lg object-cover bg-black flex-shrink-0"/>}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-white text-sm truncate">{s.name}</div>
                                            <div className="font-bold text-white text-sm">{s.price}.-</div>
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1"><Clock size={10}/> {s.time} min</div>
                                        {s.desc && <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{s.desc}</p>}
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center self-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                                        {isSelected && <CheckCircle2 size={12} className="text-white"/>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* PANIER FLOTTANT (SMART CART) */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b] border-t border-zinc-800 safe-area-pb z-50">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="text-xs text-zinc-500 uppercase font-bold flex items-center gap-2">
                                <ShoppingBag size={12}/> {cart.length} Prestations
                            </div>
                            <div className="text-xl font-black text-white flex items-baseline gap-2">
                                {totalPrice}.- <span className="text-sm font-medium text-zinc-500">({Math.floor(totalTime/60)}h{totalTime%60 > 0 ? totalTime%60 : ''})</span>
                            </div>
                        </div>
                        <button onClick={() => { alert("Réservation lancée !"); onClose(); }} className="flex-[2] py-4 bg-white text-black rounded-xl font-black uppercase tracking-wide transition shadow-lg hover:bg-zinc-200">
                            Continuer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- NOUVEAU STUDIO PRO (ARCHITECT MODE) ---
const TitanStudio = ({ onFinish }) => {
    const [step, setStep] = useState('menu'); // 'menu' | 'identity' | 'schedule'
    const [preview, setPreview] = useState({ 
        name: 'Mon Business', category: 'Barber', rating: '5.0', reviews: 0,
        cover: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
        images: [], location: 'Lausanne', type: 'Salon', distance: '1.2km',
        nextSlot: '20:00', tags: [], bio: '', contact: '', services: [] 
    });
    
    // Service Builder State
    const [isEditingService, setIsEditingService] = useState(false);
    const [tempService, setTempService] = useState({ name: '', price: '', time: '30', desc: '', image: null });
    
    const fileRef = useRef(null);
    const serviceFileRef = useRef(null);

    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const handleImg = (e) => { if(e.target.files[0]) update('cover', URL.createObjectURL(e.target.files[0])) };
    const handleSrvImg = (e) => { if(e.target.files[0]) setTempService({...tempService, image: URL.createObjectURL(e.target.files[0])}) };

    const saveService = () => {
        if(tempService.name && tempService.price) {
            update('services', [...preview.services, { ...tempService, id: Date.now() }]);
            setTempService({ name: '', price: '', time: '30', desc: '', image: null });
            setIsEditingService(false);
        }
    };

    const toggleTag = (tag) => {
        const newTags = preview.tags.includes(tag) ? preview.tags.filter(t => t !== tag) : [...preview.tags, tag];
        update('tags', newTags);
    };

    return (
        <div className="h-full bg-black text-white font-sans flex flex-col md:flex-row">
            {/* GAUCHE : NAVIGATION & CONFIG */}
            <div className="flex-1 flex flex-col border-r border-zinc-800">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                    <span className="font-black tracking-widest text-xs text-zinc-400 uppercase">STUDIO PRO MAX</span>
                    <button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button>
                </div>

                {/* MENU PRINCIPAL DU STUDIO */}
                <div className="flex border-b border-zinc-800">
                    <button onClick={() => setStep('identity')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider ${step === 'identity' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500'}`}>Identité</button>
                    <button onClick={() => setStep('menu')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider ${step === 'menu' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500'}`}>Services</button>
                    <button onClick={() => setStep('schedule')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider ${step === 'schedule' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500'}`}>Dispo</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-black">
                    
                    {step === 'identity' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Nom & Visuel</label>
                                <div className="flex gap-4">
                                    <div onClick={() => fileRef.current.click()} className="w-24 h-24 flex-shrink-0 bg-zinc-900 rounded-xl border border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-white overflow-hidden">
                                        {preview.cover ? <img src={preview.cover} className="w-full h-full object-cover"/> : <Camera size={20} className="text-zinc-500"/>}
                                        <input type="file" ref={fileRef} onChange={handleImg} className="hidden"/>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input placeholder="Nom du Salon" value={preview.name === 'Mon Business' ? '' : preview.name} onChange={e=>update('name', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white outline-none"/>
                                        <div className="flex gap-2">
                                            <select className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none flex-1" onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option></select>
                                            <input placeholder="Ville" className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none flex-1" onChange={e=>update('location', e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Votre Histoire (Bio)</label>
                                <textarea placeholder="Décrivez votre expertise, votre ambiance..." onChange={e=>update('bio', e.target.value)} className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white outline-none resize-none focus:border-white"/>
                            </div>
                        </div>
                    )}

                    {step === 'menu' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Vos Prestations</label>
                                <button onClick={() => setIsEditingService(true)} className="text-xs bg-white text-black px-3 py-1.5 rounded font-bold hover:bg-zinc-200 flex items-center gap-1"><Plus size={12}/> Ajouter</button>
                            </div>

                            {isEditingService && (
                                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-4">
                                    <div className="flex gap-4">
                                        <div onClick={() => serviceFileRef.current.click()} className="w-16 h-16 bg-black border border-dashed border-zinc-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-white flex-shrink-0 overflow-hidden">
                                            {tempService.image ? <img src={tempService.image} className="w-full h-full object-cover"/> : <Camera size={16} className="text-zinc-500"/>}
                                            <input type="file" ref={serviceFileRef} onChange={handleSrvImg} className="hidden"/>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input placeholder="Nom (ex: Coupe)" value={tempService.name} onChange={e=>setTempService({...tempService, name: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/>
                                            <div className="flex gap-2">
                                                <input placeholder="Prix" type="number" value={tempService.price} onChange={e=>setTempService({...tempService, price: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/>
                                                <input placeholder="Min" type="number" value={tempService.time} onChange={e=>setTempService({...tempService, time: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea placeholder="Description technique (produits, étapes)..." value={tempService.desc} onChange={e=>setTempService({...tempService, desc: e.target.value})} className="w-full h-16 bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none resize-none"/>
                                    <div className="flex gap-2">
                                        <button onClick={saveService} className="flex-1 py-2 bg-indigo-600 text-white rounded text-xs font-bold uppercase">Enregistrer</button>
                                        <button onClick={() => setIsEditingService(false)} className="px-4 py-2 border border-zinc-600 text-zinc-400 rounded text-xs font-bold uppercase">Annuler</button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {preview.services.map((s, i) => (
                                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center">
                                        {s.image ? <img src={s.image} className="w-12 h-12 rounded-lg object-cover"/> : <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center"><Scissors size={16} className="text-zinc-600"/></div>}
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-white">{s.name}</div>
                                            <div className="text-xs text-zinc-500">{s.time}min • {s.price}.-</div>
                                        </div>
                                        <button onClick={()=>update('services', preview.services.filter(srv=>srv.id!==s.id))}><Trash2 size={16} className="text-zinc-600 hover:text-red-500"/></button>
                                    </div>
                                ))}
                                {preview.services.length === 0 && !isEditingService && <div className="text-center py-8 text-zinc-600 text-xs italic border border-dashed border-zinc-800 rounded-xl">Votre carte est vide.</div>}
                            </div>
                        </div>
                    )}

                    {step === 'schedule' && (
                        <div className="space-y-6 animate-in fade-in">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Configuration Business</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={()=>update('type', 'Salon')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${preview.type==='Salon'?'bg-zinc-800 border-white text-white':'border-zinc-800 text-zinc-500'}`}><Grid/> <span className="text-xs font-bold">SALON</span></button>
                                <button onClick={()=>update('type', 'Domicile')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${preview.type==='Domicile'?'bg-emerald-900/30 border-emerald-500 text-emerald-500':'border-zinc-800 text-zinc-500'}`}><Home/> <span className="text-xs font-bold">MOBILE</span></button>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Disponibilités Spéciales</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Nocturne', 'Dimanche', 'Lundi'].map(t => (
                                        <button key={t} onClick={() => toggleTag(t)} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase transition ${preview.tags.includes(t) ? 'bg-indigo-900 border-indigo-500 text-white' : 'border-zinc-700 text-zinc-500'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <input placeholder="Contact Direct (WhatsApp)" onChange={e=>update('contact', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white outline-none"/>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900">
                    <button onClick={() => onFinish(preview)} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-lg">Publier l'Offre</button>
                </div>
            </div>

            {/* DROITE : LIVE PREVIEW */}
            <div className="hidden md:flex w-[400px] bg-black border-l border-zinc-800 flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black">
                <div className="mb-6 text-center">
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Visualisation Client</h3>
                    <p className="text-zinc-600 text-[10px]">C'est ce que vos clients verront</p>
                </div>
                <div className="w-full max-w-sm pointer-events-none transform scale-95 origin-top shadow-2xl">
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

  const filtered = salons.filter(s => catFilter === 'Tout' || s.category === catFilter);

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center font-sans relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20"/>
          <div className="z-10 text-center space-y-8 w-full max-w-sm p-6">
              <h1 className="text-7xl font-black text-white tracking-tighter mix-blend-difference">NEXUS<span className="text-indigo-500">.</span></h1>
              <p className="text-zinc-400 font-medium text-sm uppercase tracking-widest">Utilité Absolue</p>
              <div className="flex flex-col gap-3">
                  <button onClick={() => setView('client')} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-xl">Rechercher</button>
                  <button onClick={() => setView('pro')} className="w-full py-4 bg-transparent border border-zinc-700 text-white font-black rounded-xl uppercase tracking-widest hover:bg-white/10 transition">Espace Pro</button>
              </div>
          </div>
      </div>
  );

  if (view === 'pro') return <TitanStudio onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-900 pb-2">
            <div className="px-4 py-4 flex justify-between items-center"><span className="font-black text-xl tracking-tighter">NEXUS.</span><button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button></div>
            <div className="px-4 mb-3"><div className="relative"><Search className="absolute left-4 top-3 text-zinc-500" size={18}/><input type="text" placeholder="Service, salon, ville..." className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-indigo-500 transition"/></div></div>
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
