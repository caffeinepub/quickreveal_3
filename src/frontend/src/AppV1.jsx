import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, ChevronRight, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, 
  Camera, FileText, Trash2, Image as ImageIcon, Briefcase, 
  Wand2, Save, Gem, Crown, Check, Navigation, MessageSquare, Hourglass, Lock, Send,
  TrendingUp, Users, Target, Award, PlayCircle, Instagram, ExternalLink
} from 'lucide-react';

// --- DATA SOURCE ---
const INITIAL_SALONS = [
  {
    id: 1, name: "Barber du Lac", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=800&q=80",
    location: "Lausanne", type: "Domicile", distance: "Service Mobile",
    nextSlot: "Ce soir 20:00", tags: ["Nocturne", "VIP"],
    instagram: "@barberdulac", whatsapp: "0791234567", website: "https://barberdulac.ch",
    bio: "L'excellence masculine. Je transforme votre salon en barbershop privé. Service gants blancs.",
    services: [
        { id: 101, name: "Signature Cut", price: 90, time: 60, desc: "Coupe, soins visages, serviette chaude.", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=60" }
    ]
  }
];

// --- PRESETS INTELLIGENTS ---
const PRESETS = {
    Barber: [{name:"Coupe Classique",price:"40",time:"30",desc:"Ciseaux & tondeuse"},{name:"Dégradé",price:"50",time:"45",desc:"Finition rasoir"},{name:"Barbe",price:"30",time:"20",desc:"Taille & contours"}],
    Onglerie: [{name:"Semi-Permanent",price:"60",time:"45",desc:"Manucure russe"},{name:"Pose Gel",price:"120",time:"90",desc:"Rallongement chablis"}],
    Coiffure: [{name:"Brushing",price:"45",time:"30",desc:"Shampoing inclus"},{name:"Coupe Femme",price:"80",time:"60",desc:"Soins & coupe"}],
};

// --- COMPOSANTS UI ---
const CinematicCard = ({ salon, onSelect }) => {
    return (
        <div 
            onClick={() => onSelect(salon)}
            className="relative w-full aspect-[4/5] bg-black rounded-[32px] overflow-hidden mb-8 shadow-2xl group cursor-pointer border border-white/10"
        >
            <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
            <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                    {salon.type === 'Domicile' ? <Home size={10}/> : <MapPin size={10}/>} {salon.type}
                </span>
                {salon.verified && <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={10}/> Vérifié</span>}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
                <h3 className="text-4xl font-black text-white leading-none tracking-tighter mb-2 shadow-black drop-shadow-xl">{salon.name}</h3>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs font-bold text-zinc-300 flex items-center gap-1 mb-2"><Star size={12} className="text-yellow-500 fill-yellow-500"/> {salon.rating} ({salon.reviews} avis)</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/><span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{salon.nextSlot}</span></div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"><ArrowRight size={20}/></div>
                </div>
            </div>
        </div>
    );
};

// --- DÉTAIL CLIENT ---
const NexusDetail = ({ salon, onClose }) => {
    const [cart, setCart] = useState([]); 
    const [step, setStep] = useState('menu'); // menu -> calendar -> confirm
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);

    const toggleService = (service) => { if (cart.find(s => s.id === service.id)) setCart(cart.filter(s => s.id !== service.id)); else setCart([...cart, service]); };
    const totalPrice = cart.reduce((acc, s) => acc + Number(s.price), 0);

    const nextStep = () => {
        if (step === 'menu') setStep('calendar');
        else if (step === 'calendar') setStep('confirm');
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans">
            {step === 'confirm' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in zoom-in">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full animate-pulse"/>
                        <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-black rounded-full flex items-center justify-center border-2 border-yellow-500 relative z-10 shadow-2xl">
                            <Hourglass size={40} className="text-yellow-500 animate-spin-slow"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Demande Envoyée</h2>
                        <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                            <span className="text-white font-bold">{salon.name}</span> a reçu votre demande pour le <span className="text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">{date} à {time}</span>. Confirmation sous <span className="text-yellow-500 font-bold">2h00</span>.
                        </p>
                    </div>
                    <button onClick={onClose} className="w-full max-w-xs py-4 bg-white text-black font-black uppercase rounded-xl tracking-widest text-xs shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition">Retour à l'accueil</button>
                </div>
            ) : (
                <>
                    <div className="relative h-64 flex-shrink-0">
                        <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"/>
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20"><button onClick={step === 'menu' ? onClose : () => setStep('menu')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition"><ChevronLeft/></button></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h2 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{salon.name}</h2>
                            
                            {/* SOCIAL HUB CLIENT */}
                            <div className="flex gap-2 mb-4">
                                {salon.instagram && <button className="p-2 bg-white/10 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-white/20"><Instagram size={16}/></button>}
                                {salon.whatsapp && <button className="p-2 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30"><MessageSquare size={16}/></button>}
                                {salon.website && <button onClick={() => window.open(salon.website, '_blank')} className="p-2 bg-white/10 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-white/20"><ExternalLink size={16}/></button>}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300"><span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur">{salon.type}</span></div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 pb-40 pt-6">
                        {step === 'menu' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Prestations</h3>
                                <div className="space-y-3">
                                    {salon.services.map(s => { const isSelected = cart.find(i => i.id === s.id); return (<button key={s.id} onClick={() => toggleService(s)} className={`w-full p-4 rounded-2xl border flex gap-4 text-left transition-all group relative overflow-hidden ${isSelected ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800'}`}>{isSelected && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none"/>}{s.image ? <img src={s.image} className="w-20 h-20 rounded-xl object-cover bg-black flex-shrink-0 shadow-lg"/> : <div className="w-20 h-20 rounded-xl bg-black border border-zinc-800 flex items-center justify-center flex-shrink-0 shadow-lg"><Sparkles className="text-zinc-700"/></div>}<div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center"><div className="flex justify-between items-start mb-1"><div className="font-bold text-white text-base">{s.name}</div><div className="font-black text-white text-lg">{s.price}.-</div></div><div className="text-xs text-zinc-500 font-mono mb-2 flex items-center gap-1"><Clock size={10}/> {s.time} min</div>{s.desc && <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight font-medium">{s.desc}</p>}</div><div className={`w-8 h-8 rounded-full border flex items-center justify-center self-center flex-shrink-0 transition-all relative z-10 ${isSelected ? 'bg-indigo-500 border-indigo-500 scale-110 shadow-lg shadow-indigo-500/20' : 'border-zinc-700 bg-black/30'}`}>{isSelected && <Check size={16} className="text-white"/>}</div></button>); })}
                                </div>
                            </div>
                        )}

                        {step === 'calendar' && (
                            <div className="space-y-8 animate-in slide-in-from-right">
                                <div><h3 className="text-xl font-black text-white mb-4 tracking-tight">Choisissez la date</h3><div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">{['Auj.', 'Demain', 'Mer 14', 'Jeu 15', 'Ven 16'].map(d => (<button key={d} onClick={() => setDate(d)} className={`px-5 py-4 rounded-2xl border font-bold text-sm min-w-[90px] transition-all ${date === d ? 'bg-white text-black border-white scale-105 shadow-lg' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800'}`}>{d}</button>))}</div></div>
                                <div><h3 className="text-xl font-black text-white mb-4 tracking-tight">Choisissez l'heure</h3><div className="grid grid-cols-4 gap-3">{['10:00', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00', '21:00'].map(t => (<button key={t} onClick={() => setTime(t)} className={`py-4 rounded-2xl border font-bold text-sm transition-all ${time === t ? 'bg-indigo-600 border-indigo-600 text-white scale-105 shadow-lg shadow-indigo-600/20' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800'}`}>{t}</button>))}</div></div>
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-50 safe-area-pb">
                            <div className="bg-[#121212] border border-white/10 p-2 rounded-[20px] shadow-2xl flex gap-3 items-center pl-5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none"/>
                                <div className="flex-1 relative z-10">
                                    <div className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-1">{cart.length} SÉLECTION(S)</div>
                                    <div className="text-3xl font-black text-white tracking-tight">{totalPrice}.-</div>
                                </div>
                                <button 
                                    onClick={nextStep} 
                                    disabled={step === 'calendar' && (!date || !time)}
                                    className="flex-[2] py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.15em] text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 relative z-10"
                                >
                                    {step === 'menu' ? 'Choisir Créneau' : 'Envoyer Demande'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- PRO STUDIO (ULTRA COMPLET) ---
const ProToolsStudio = ({ onFinish }) => {
    const [welcome, setWelcome] = useState(true);
    const [preview, setPreview] = useState({ name: 'Mon Salon', category: 'Barber', rating: '5.0', reviews: 0, cover: null, images: [], location: 'Lausanne', type: 'Salon', distance: '1.2km', nextSlot: '20:00', tags: [], bio: '', contact: '', services: [], instagram: '', whatsapp: '', website: '' });
    const [step, setStep] = useState(1);
    const [newService, setNewService] = useState({ name: '', price: '', time: '30', desc: '', image: null });
    const [isEditingService, setIsEditingService] = useState(false);
    
    const fileRef = useRef(null);
    const serviceFileRef = useRef(null);
    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const selectPreset = (preset) => { setNewService({ ...preset, image: null, desc: preset.desc || '' }); setIsEditingService(true); };

    // --- ACCUEIL PRO MARKETING ---
    if (welcome) return (
        <div className="h-full bg-black relative overflow-hidden font-sans flex flex-col">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 animate-pulse-slow"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"/>
            <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-16 safe-area-pb">
                <div className="mb-8">
                    <span className="px-4 py-2 bg-indigo-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4 inline-block shadow-lg shadow-indigo-600/50">Version Pro</span>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-4">VOTRE EMPIRE<br/>DIGITAL.</h1>
                    <p className="text-zinc-300 text-sm font-medium max-w-xs leading-relaxed">Centralisez vos services, vos réseaux et vos RDV. Zéro commission. 100% Liberté.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"><div className="text-2xl font-black text-white mb-1">0%</div><div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Commission</div></div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"><div className="text-2xl font-black text-white mb-1">Hub</div><div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Insta/WhatsApp</div></div>
                </div>
                <button onClick={() => setWelcome(false)} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">Commencer <ArrowRight size={16}/></button>
                <button onClick={() => onFinish(null)} className="mt-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center hover:text-white transition">Retour</button>
            </div>
        </div>
    );

    // --- STUDIO EDITOR ---
    return (
        <div className="h-full bg-black text-white font-sans flex flex-col md:flex-row">
            <div className="flex-1 flex flex-col border-r border-white/10 bg-[#050505]">
                <div className="p-5 border-b border-white/10 flex justify-between items-center"><span className="font-black tracking-[0.2em] text-xs text-zinc-500 uppercase">PRO TOOLS</span><button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button></div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-10">
                    
                    {/* ETAPE 1 : IDENTITÉ & SOCIAL */}
                    <div className={step === 1 ? 'animate-in fade-in slide-in-from-bottom-4' : 'hidden'}>
                        <div className="flex justify-between items-center mb-6"><div className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14}/> 1. Identité & Connect</div></div>
                        <div className="space-y-6">
                            <div className="flex gap-5 items-start">
                                <div onClick={() => fileRef.current.click()} className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-white transition flex-shrink-0 overflow-hidden relative">{preview.cover ? <img src={preview.cover} className="w-full h-full object-cover"/> : <Camera size={20} className="text-zinc-600"/>}<input type="file" ref={fileRef} onChange={(e) => e.target.files[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/></div>
                                <div className="flex-1 space-y-4">
                                    <input placeholder="Nom du Salon" value={preview.name} onChange={e=>update('name', e.target.value)} className="w-full bg-transparent border-b border-zinc-800 py-2 text-xl font-black text-white outline-none focus:border-indigo-500 transition placeholder:text-zinc-800"/>
                                    <div className="flex gap-2"><select className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white outline-none flex-1 appearance-none" onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option></select><input placeholder="Ville" className="flex-[2] bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white outline-none" onChange={e=>update('location', e.target.value)}/></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2"><button onClick={()=>update('type', 'Salon')} className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${preview.type==='Salon' ? 'bg-white text-black border-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}>Salon</button><button onClick={()=>update('type', 'Domicile')} className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${preview.type==='Domicile' ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}>Domicile</button></div>
                            
                            {/* SOCIAL HUB */}
                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Vos Réseaux (Connect)</label>
                                <div className="space-y-2">
                                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3"><Instagram size={14} className="text-zinc-500 mr-2"/><input placeholder="@instagram" value={preview.instagram} className="bg-transparent py-3 text-xs font-bold text-white outline-none w-full" onChange={e=>update('instagram', e.target.value)}/></div>
                                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3"><Phone size={14} className="text-zinc-500 mr-2"/><input placeholder="WhatsApp" value={preview.whatsapp} className="bg-transparent py-3 text-xs font-bold text-white outline-none w-full" onChange={e=>update('whatsapp', e.target.value)}/></div>
                                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3"><Globe size={14} className="text-zinc-500 mr-2"/><input placeholder="https://votre-site.ch" value={preview.website} className="bg-transparent py-3 text-xs font-bold text-white outline-none w-full" onChange={e=>update('website', e.target.value)}/></div>
                                </div>
                            </div>

                            <textarea placeholder="Votre Bio (Soyez impactant)..." value={preview.bio} onChange={e=>update('bio', e.target.value)} className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs font-medium text-white outline-none resize-none focus:border-white transition"/>
                            <button onClick={()=>setStep(2)} className="w-full py-4 bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition">Étape Suivante</button>
                        </div>
                    </div>

                    {/* ETAPE 2 : SERVICES RICHES */}
                    <div className={step === 2 ? 'animate-in fade-in slide-in-from-bottom-4' : 'hidden'}>
                        <div className="flex justify-between items-center mb-6"><div className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Grid size={14}/> 2. Carte des Soins</div><button onClick={()=>setStep(1)} className="text-[10px] text-zinc-500 uppercase font-bold">Retour</button></div>
                        
                        {!isEditingService ? (
                            <div className="space-y-4">
                                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">{PRESETS[preview.category]?.map((p, i) => (<button key={i} onClick={() => selectPreset(p)} className="flex-shrink-0 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-600 transition flex items-center gap-2"><Plus size={12}/> {p.name}</button>))}</div>
                                <div className="space-y-3">{preview.services.map((s, i) => (<div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-center">{s.image && <img src={s.image} className="w-12 h-12 rounded-lg object-cover"/>}<div className="flex-1"><div className="font-bold text-sm text-white">{s.name}</div><div className="text-[10px] text-zinc-500">{s.time} min • {s.price}.-</div></div><button onClick={()=>update('services', preview.services.filter((_,x)=>x!==i))}><Trash2 size={16} className="text-zinc-500 hover:text-white"/></button></div>))}</div>
                                <button onClick={() => setIsEditingService(true)} className="w-full py-4 border border-dashed border-zinc-700 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:border-white transition uppercase tracking-widest">+ Créer sur mesure</button>
                                {preview.services.length > 0 && <button onClick={() => onFinish(preview)} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest shadow-xl hover:scale-[1.02] transition mt-4">Lancer mon Site</button>}
                            </div>
                        ) : (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 space-y-4">
                                <div className="flex justify-between items-center"><h3 className="text-white font-bold text-sm">Éditer Service</h3><button onClick={()=>setIsEditingService(false)}><X size={16} className="text-zinc-500"/></button></div>
                                <div className="flex gap-4">
                                    <div onClick={() => serviceFileRef.current.click()} className="w-20 h-20 bg-black/50 border border-dashed border-indigo-500/30 rounded-2xl flex items-center justify-center cursor-pointer hover:border-indigo-400 flex-shrink-0 overflow-hidden group transition">{newService.image ? <img src={newService.image} className="w-full h-full object-cover"/> : <ImageIcon size={20} className="text-indigo-500/50 group-hover:text-indigo-400 transition"/>}<input type="file" ref={serviceFileRef} onChange={(e) => e.target.files[0] && setNewService({...newService, image: URL.createObjectURL(e.target.files[0])})} className="hidden"/></div>
                                    <div className="flex-1 space-y-2"><input placeholder="Nom du service" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full bg-black/50 border border-indigo-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-400 transition font-bold"/><div className="flex gap-2"><input placeholder="Prix" type="number" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full bg-black/50 border border-indigo-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-400 transition font-black"/><input placeholder="Min" type="number" value={newService.time} onChange={e=>setNewService({...newService, time: e.target.value})} className="w-full bg-black/50 border border-indigo-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-400 transition font-bold"/></div></div>
                                </div>
                                <textarea placeholder="Description technique, produits, options..." value={newService.desc} onChange={e=>setNewService({...newService, desc: e.target.value})} className="w-full h-24 bg-black/50 border border-indigo-500/30 rounded-xl p-3 text-xs text-white outline-none resize-none mb-4 focus:border-indigo-400 transition font-medium"/>
                                <button onClick={() => { update('services', [...preview.services, { ...newService, id: Date.now() }]); setIsEditingService(false); setNewService({ name: '', price: '', time: '30', desc: '', image: null }); }} className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-xs tracking-widest">Valider</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PREVIEW LIVE */}
            <div className="hidden md:flex w-[450px] bg-black border-l border-white/5 flex-col items-center justify-center p-10 relative">
                <div className="absolute top-0 left-0 right-0 p-6 text-center border-b border-white/5 bg-black/80 backdrop-blur-md z-10"><h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em]">Aperçu Live</h3></div>
                <div className="w-full max-w-sm pointer-events-none transform scale-100 origin-top shadow-2xl mt-10"><CinematicCard salon={preview} onSelect={()=>{}} /></div>
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
          const newS = { ...data, id: Date.now(), verified: true, reviews: 0, distance: 0.1, distanceStr: "Nouveau" };
          setSalons(prev => [newS, ...prev]);
          setView('client');
      } else {
          setView('landing');
      }
  };

  const filtered = salons.filter(s => catFilter === 'Tout' || s.category === catFilter);

  if (view === 'landing') return (<div className="h-screen bg-[#09090b] flex flex-col justify-center items-center font-sans relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20 grayscale"/><div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-[#09090b]"/><div className="z-10 text-center space-y-10 w-full max-w-sm p-6"><h1 className="text-8xl font-black text-white tracking-tighter mix-blend-overlay drop-shadow-2xl">NEXUS<span className="text-indigo-500">.</span></h1><div className="flex flex-col gap-4"><button onClick={() => setView('client')} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] transition">Explorer</button><button onClick={() => setView('pro')} className="w-full py-5 bg-transparent border-2 border-white/20 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-white/10 hover:border-white transition backdrop-blur-sm">Espace Pro</button></div></div></div>);
  if (view === 'pro') return <ProToolsStudio onFinish={handleDeploy} />;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-[#050505] relative min-h-screen border-x border-white/5 shadow-2xl flex flex-col">
        <div className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 pb-4 pt-4"><div className="px-6 flex justify-between items-center mb-4"><span className="font-black text-2xl tracking-tighter text-white">NEXUS.</span><button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button></div><div className="flex gap-3 overflow-x-auto hide-scrollbar px-6">{['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => (<button key={c} onClick={() => setCatFilter(c)} className={`px-5 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap uppercase tracking-wider transition-all ${catFilter === c ? 'bg-white text-black' : 'bg-white/5 border border-white/5 text-zinc-500 hover:text-white'}`}>{c}</button>))}</div></div>
        <div className="flex-1 px-4 pt-6 pb-32">{filtered.map(s => <CinematicCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}</div>
        <div className="fixed bottom-0 w-full max-w-md bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 px-8 py-5 flex justify-between items-center z-30 safe-area-pb"><button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? "text-white scale-110" : "text-zinc-600"}`}><Grid size={24}/></button><button onClick={() => setActiveTab('likes')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'likes' ? "text-white scale-110" : "text-zinc-600"}`}><Heart size={24}/></button></div>
        {selectedSalon && <NexusDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}
      </div>
    </div>
  );
}
