import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, ChevronRight, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, 
  Camera, FileText, Trash2, Image as ImageIcon, Briefcase, 
  Wand2, Save, Gem, Crown, Check, Navigation, MessageSquare, Hourglass, Lock, Send,
  TrendingUp, Users, Target, Award
} from 'lucide-react';

// --- DATA SOURCE ---
const INITIAL_SALONS = [
  {
    id: 1, name: "Barber du Lac", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"],
    location: "Lausanne", type: "Domicile", distance: 0.5, distanceStr: "À 500m",
    nextSlot: "Ce soir 20:00",
    tags: ["Nocturne", "Dimanche"],
    bio: "Service de barbier premium sur la riviera vaudoise.",
    contact: "079 123 45 67",
    services: [
        { id: 101, name: "Coupe Prestige", price: 80, time: 60, desc: "Coupe aux ciseaux, shampoing, coiffage.", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=60" }
    ]
  }
];

// --- PRESETS ---
const PRESETS = {
    Barber: [{name:"Coupe Classique",price:"40",time:"30"},{name:"Dégradé",price:"50",time:"45"}],
    Onglerie: [{name:"Semi-Permanent",price:"60",time:"45"},{name:"Pose Gel",price:"120",time:"90"}],
    Coiffure: [{name:"Brushing",price:"45",time:"30"},{name:"Coupe Femme",price:"80",time:"60"}],
    Esthétique: [{name:"Soin Visage",price:"100",time:"60"},{name:"Massage",price:"120",time:"60"}]
};

// --- UTILS ---
const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// --- COMPOSANTS UI PREMIUM ---
const StatusBadge = ({ type, text }) => {
    const styles = { dispo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", tag: "bg-zinc-800/50 text-zinc-400 border-zinc-700/50", verified: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    return <span className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${styles[type] || styles.tag}`}>{type === 'dispo' && <span className="size-1.5 animate-pulse rounded-full bg-emerald-500"/>}{type === 'verified' && <ShieldCheck size={10}/>}{text}</span>;
};

const NexusCard = ({ salon, onSelect }) => {
    const startPrice = salon.services.length > 0 ? Math.min(...salon.services.map(s => s.price)) : 0;
    return (
        <div onClick={() => onSelect(salon)} className="group relative mb-4 cursor-pointer overflow-hidden rounded-[24px] border border-white/5 bg-gradient-to-br from-[#121212] to-[#0a0a0a] shadow-xl transition-all hover:border-zinc-600/50 active:scale-[0.98]">
             <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"/>
            <div className="flex h-40">
                <div className="relative w-[35%] overflow-hidden">
                    <img src={salon.cover} className="absolute inset-0 size-full object-cover"/>
                    {salon.type === 'Domicile' && <div className="absolute inset-x-0 bottom-0 bg-emerald-900/90 py-1.5 text-center text-[8px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">Mobile</div>}
                </div>
                <div className="relative z-10 flex w-[65%] flex-col justify-between p-5">
                    <div>
                        <div className="mb-1 flex items-start justify-between"><h3 className="truncate pr-2 text-lg font-black leading-tight text-white">{salon.name}</h3>{salon.verified && <StatusBadge type="verified" text="Pro"/>}</div>
                        <div className="flex items-center gap-1 text-xs font-medium text-zinc-500"><MapPin size={10}/> {salon.location} • <span className="font-bold text-emerald-500">{salon.distanceStr || "À proximité"}</span></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5"><StatusBadge type="dispo" text={salon.nextSlot} />{salon.tags.slice(0, 1).map(t => <StatusBadge key={t} type="tag" text={t}/>)}</div>
                        <div className="flex items-end justify-between border-t border-white/5 pt-2"><div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">À partir de</div><div className="flex items-center gap-2"><div className="text-xl font-black text-white">{startPrice}.-</div><div className="flex size-8 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:-rotate-45 group-hover:shadow-white/20"><ArrowRight size={16}/></div></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DÉTAIL, CALENDRIER & FLOW ---
const NexusDetail = ({ salon, onClose }) => {
    const [cart, setCart] = useState([]); 
    const [step, setStep] = useState('menu');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [address, setAddress] = useState({ street: '', code: '', info: '' });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const toggleService = (service) => { if (cart.find(s => s.id === service.id)) setCart(cart.filter(s => s.id !== service.id)); else setCart([...cart, service]); };
    const totalPrice = cart.reduce((acc, s) => acc + Number(s.price), 0);

    const nextStep = () => {
        if (step === 'menu') setStep('calendar');
        else if (step === 'calendar') setStep(salon.type === 'Domicile' ? 'logistics' : 'confirm');
        else if (step === 'logistics') setStep('confirm');
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col bg-[#09090b] font-sans transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {step === 'confirm' ? (
                <div className="zoom-in flex flex-1 flex-col items-center justify-center space-y-8 p-8 text-center animate-in">
                    <div className="relative">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/20 blur-2xl"/>
                        <div className="relative z-10 flex size-24 items-center justify-center rounded-full border-2 border-yellow-500 bg-gradient-to-br from-zinc-800 to-black shadow-2xl shadow-yellow-500/10">
                            <Hourglass size={40} className="animate-spin-slow text-yellow-500"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-3 text-4xl font-black tracking-tight text-white">Demande Envoyée</h2>
                        <p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-zinc-400">
                            <span className="font-bold text-white">{salon.name}</span> a reçu votre demande pour le <span className="rounded bg-zinc-800 px-2 py-0.5 font-bold text-white">{date} à {time}</span>. Confirmation sous <span className="font-bold text-yellow-500">2h00</span>.
                        </p>
                    </div>
                    <button onClick={handleClose} className="w-full max-w-xs rounded-xl bg-white px-4 py-4 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] transition hover:scale-[1.02]">Retour à l'accueil</button>
                </div>
            ) : (
                <>
                    <div className="relative h-56 shrink-0">
                        <img src={salon.cover} className="absolute inset-0 size-full object-cover opacity-60"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"/>
                        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4"><button onClick={step === 'menu' ? handleClose : () => setStep('menu')} className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"><ChevronLeft/></button></div>
                        <div className="absolute inset-x-6 bottom-6"><h2 className="mb-2 text-4xl font-black tracking-tight text-white drop-shadow-lg">{salon.name}</h2><div className="flex items-center gap-2 text-xs font-bold text-zinc-300"><span className="rounded-full border border-emerald-500/20 bg-emerald-500/20 px-3 py-1 backdrop-blur">{salon.type}</span></div></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 pb-40 pt-6">
                        
                        {step === 'menu' && (
                            <div className="fade-in space-y-6 animate-in">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Prestations</h3>
                                <div className="space-y-3">
                                    {salon.services.map(s => { const isSelected = cart.find(i => i.id === s.id); return (<button key={s.id} onClick={() => toggleService(s)} className={`group relative flex w-full gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all ${isSelected ? 'border-indigo-500/50 bg-indigo-600/20' : 'border-zinc-800/50 bg-zinc-900/50 hover:bg-zinc-800'}`}>{isSelected && <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent"/>}{s.image ? <img src={s.image} className="size-16 shrink-0 rounded-xl bg-black object-cover shadow-lg"/> : <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-black shadow-lg"><Sparkles className="text-zinc-700"/></div>}<div className="relative z-10 min-w-0 flex-1"><div className="mb-1 flex items-start justify-between"><div className="text-base font-bold text-white">{s.name}</div><div className="text-lg font-black text-white">{s.price}.-</div></div><div className="mb-2 flex items-center gap-1 font-mono text-xs text-zinc-500"><Clock size={10}/> {s.time} min</div></div><div className={`relative z-10 flex size-8 shrink-0 items-center justify-center self-center rounded-full border transition-all ${isSelected ? 'scale-110 border-indigo-500 bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-zinc-700 bg-black/30'}`}>{isSelected && <Check size={16} className="text-white"/>}</div></button>); })}
                                </div>
                            </div>
                        )}

                        {step === 'calendar' && (
                            <div className="slide-in-from-right space-y-8 animate-in">
                                <div><h3 className="mb-4 text-xl font-black tracking-tight text-white">Choisissez la date</h3><div className="hide-scrollbar flex gap-3 overflow-x-auto pb-4">{['Auj.', 'Demain', 'Mer 14', 'Jeu 15', 'Ven 16'].map(d => (<button key={d} onClick={() => setDate(d)} className={`min-w-[90px] rounded-2xl border px-5 py-4 text-sm font-bold transition-all ${date === d ? 'scale-105 border-white bg-white text-black shadow-lg' : 'border-zinc-800/50 bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800'}`}>{d}</button>))}</div></div>
                                <div><h3 className="mb-4 text-xl font-black tracking-tight text-white">Choisissez l'heure</h3><div className="grid grid-cols-4 gap-3">{['10:00', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00', '21:00'].map(t => (<button key={t} onClick={() => setTime(t)} className={`rounded-2xl border py-4 text-sm font-bold transition-all ${time === t ? 'scale-105 border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'border-zinc-800/50 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800'}`}>{t}</button>))}</div></div>
                            </div>
                        )}

                        {step === 'logistics' && (
                            <div className="slide-in-from-right space-y-8 animate-in">
                                <div><h3 className="mb-2 text-xl font-black tracking-tight text-white">Lieu du Rendez-vous</h3><p className="mb-6 text-xs text-zinc-400">Infos chiffrées, partagées uniquement après confirmation.</p><div className="space-y-5"><div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Adresse</label><div className="flex items-center rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-4 transition focus-within:border-indigo-500/50"><MapPin size={18} className="mr-3 text-zinc-500"/><input value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} placeholder="Rue, N°, Ville" className="flex-1 bg-transparent text-sm font-medium text-white outline-none"/></div></div><div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Accès</label><div className="flex items-center rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-4 transition focus-within:border-indigo-500/50"><Lock size={18} className="mr-3 text-zinc-500"/><input value={address.code} onChange={e=>setAddress({...address, code: e.target.value})} placeholder="Digicode, Interphone..." className="flex-1 bg-transparent text-sm font-medium text-white outline-none"/></div></div></div></div>
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className={`safe-area-pb fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-black via-black to-transparent p-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                            <div className="relative flex items-center gap-3 overflow-hidden rounded-[20px] border border-white/10 bg-[#121212] p-2 pl-5 shadow-2xl">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent"/>
                                <div className="relative z-10 flex-1">
                                    <div className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{cart.length} SÉLECTION(S)</div>
                                    <div className="text-3xl font-black tracking-tight text-white">{totalPrice}.-</div>
                                </div>
                                <button 
                                    onClick={nextStep} 
                                    disabled={step === 'calendar' && (!date || !time)}
                                    className="relative z-10 flex-[2] rounded-2xl bg-white py-5 text-xs font-black uppercase tracking-[0.15em] text-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
                                >
                                    {step === 'menu' ? 'Choisir Créneau' : step === 'calendar' ? 'Valider' : 'Envoyer Demande'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- GENESIS ARCHITECT (STUDIO PRO - PREMIUM POLISH) ---
const GenesisArchitect = ({ onFinish }) => {
    const [welcome, setWelcome] = useState(true);
    const [preview, setPreview] = useState({ name: 'Mon Business', category: 'Barber', rating: '5.0', reviews: 0, cover: null, images: [], location: 'Lausanne', type: 'Salon', distance: '1.2km', nextSlot: '20:00', tags: [], bio: '', contact: '', services: [] });
    const [newService, setNewService] = useState({ name: '', price: '', time: '30', desc: '', image: null });
    const [isEditingService, setIsEditingService] = useState(false);
    const [step, setStep] = useState(1);
    const fileRef = useRef(null);
    const serviceFileRef = useRef(null);
    const portfolioRef = useRef(null);

    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const selectPreset = (preset) => { setNewService({ ...preset, image: null, desc: preset.desc || '' }); setIsEditingService(true); };

    if (welcome) return (
        <div className="fade-in relative h-full overflow-hidden bg-black font-sans text-white duration-700 animate-in">
            {/* BACKGROUND PREMIUM */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633681926022-84c23e8cb226?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30 grayscale mix-blend-overlay"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"/>
            
            <div className="safe-area-pb relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-8 flex size-24 items-center justify-center rounded-[24px] border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 shadow-2xl shadow-indigo-500/10 backdrop-blur-md">
                    <Award size={40} className="text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"/>
                </div>
                <h1 className="mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-black tracking-tighter text-transparent">Devenez un Pro<br/>NEXUS.</h1>
                <p className="mb-12 max-w-xs text-sm font-medium leading-relaxed text-zinc-300">Rejoignez l'élite. Visibilité maximale, zéro commission, 100% de contrôle.</p>
                
                <div className="mb-10 grid w-full max-w-sm grid-cols-2 gap-3 text-left">
                    {[
                        {icon: TrendingUp, color: "text-emerald-400", title: "Boostez votre CA", sub: "Clients qualifiés"},
                        {icon: Users, color: "text-blue-400", title: "Visibilité Premium", sub: "Profil mis en avant"},
                        {icon: Target, color: "text-purple-400", title: "Ciblage Local", sub: "Géolocalisation"},
                        {icon: ShieldCheck, color: "text-orange-400", title: "Sécurité Totale", sub: "Chat & Données"},
                    ].map((item, i) => (
                        <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition duration-300 hover:bg-white/10">
                            <item.icon size={22} className={`mb-3 ${item.color}`}/>
                            <div className="mb-0.5 text-sm font-black text-white">{item.title}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">{item.sub}</div>
                        </div>
                    ))}
                </div>

                <button onClick={() => setWelcome(false)} className="group relative w-full max-w-sm overflow-hidden rounded-2xl bg-white py-5 font-black uppercase tracking-[0.15em] text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"/>
                    Créer mon Espace
                </button>
                <button onClick={() => onFinish(null)} className="mt-6 text-xs font-bold uppercase tracking-widest text-zinc-500 transition hover:text-white">Retour</button>
            </div>
        </div>
    );

    return (
        <div className="flex h-full flex-col bg-[#09090b] font-sans text-white md:flex-row">
            <div className="flex flex-1 flex-col border-r border-white/5 bg-[#09090b]">
                <div className="flex items-center justify-between border-b border-white/5 bg-[#09090b]/50 p-5 backdrop-blur-md"><span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">GENESIS STUDIO</span><button onClick={() => onFinish(null)}><X className="text-zinc-500 transition hover:text-white"/></button></div>
                <div className="flex-1 space-y-10 overflow-y-auto bg-gradient-to-b from-[#09090b] to-black p-6">
                    
                    {/* ETAPE 1 : FONDATIONS (FIX DU BOUTON DOMICILE ICI) */}
                    <div className={`transition-all duration-500 ${step === 1 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-30 grayscale'}`}>
                        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400"><Globe size={14}/> 1. Fondations</div>{step === 1 && <button onClick={()=>setStep(2)} className="rounded border border-zinc-700 px-3 py-1 text-[10px] transition hover:bg-white hover:text-black">Suivant</button>}</div>
                        <div className="space-y-5 rounded-3xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                            <div className="flex items-start gap-5">
                                <div onClick={() => step === 1 && fileRef.current.click()} className="group flex size-28 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700/50 bg-black/50 transition hover:border-white">{preview.cover ? <img src={preview.cover} className="size-full object-cover"/> : <div className="text-center"><Camera size={24} className="mb-2 text-zinc-600 transition group-hover:text-white"/><span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 transition group-hover:text-white">Cover</span></div>}<input type="file" ref={fileRef} onChange={(e) => e.target.files[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/></div>
                                <div className="flex-1 space-y-4">
                                    <input placeholder="Nom du Salon" value={preview.name} onChange={e=>update('name', e.target.value)} className="w-full border-b border-zinc-700/50 bg-transparent py-2 text-xl font-black text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-500"/>
                                    <div className="flex gap-2"><select className="appearance-none rounded-xl border border-zinc-700/50 bg-black/50 p-3 text-xs font-bold text-white outline-none" onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option></select><input placeholder="Ville" className="flex-1 rounded-xl border border-zinc-700/50 bg-black/50 p-3 text-xs font-bold text-white outline-none placeholder:text-zinc-700" onChange={e=>update('location', e.target.value)}/></div>
                                    
                                    {/* --- FIX DU BOUTON DOMICILE (GRID 50/50) --- */}
                                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-700/50 bg-black/50 p-1">
                                        <button onClick={()=>update('type', 'Salon')} className={`rounded-lg py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${preview.type==='Salon' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-white'}`}>Salon</button>
                                        <button onClick={()=>update('type', 'Domicile')} className={`rounded-lg py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${preview.type==='Domicile' ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}>Domicile</button>
                                    </div>
                                    {/* ------------------------------------------- */}

                                </div>
                            </div>
                            <textarea placeholder="Votre Bio : Convaincre en 2 phrases..." onChange={e=>update('bio', e.target.value)} className="h-24 w-full resize-none rounded-xl border border-zinc-700/50 bg-black/50 p-4 text-xs font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-500"/>
                        </div>
                    </div>

                    {/* ETAPE 2 : GALERIE (PREMIUM UI) */}
                    <div className={`transition-all duration-500 ${step === 2 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-30 grayscale'}`}>
                        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-fuchsia-400"><ImageIcon size={14}/> 2. Galerie</div>{step === 2 && <button onClick={()=>setStep(3)} className="rounded border border-zinc-700 px-3 py-1 text-[10px] transition hover:bg-white hover:text-black">Suivant</button>}</div>
                        <div className="rounded-3xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm"><div className="mb-3 grid grid-cols-4 gap-3">{preview.images.map((img, i) => (<div key={i} className="group relative aspect-square overflow-hidden rounded-xl shadow-lg"><img src={img} className="size-full object-cover"/><button onClick={()=>update('images', preview.images.filter((_,x)=>x!==i))} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"><Trash2 size={16} className="text-white"/></button></div>))}<div onClick={() => step === 2 && portfolioRef.current.click()} className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 bg-black/50 text-zinc-600 transition hover:border-white hover:text-white"><Plus size={24} className="transition group-hover:scale-110"/><input type="file" multiple ref={portfolioRef} onChange={(e) => update('images', [...preview.images, ...Array.from(e.target.files).map(f=>URL.createObjectURL(f))])} className="hidden"/></div></div><p className="text-center text-[9px] font-medium uppercase tracking-wider text-zinc-500">Ajoutez des photos de votre univers</p></div>
                    </div>

                    {/* ETAPE 3 : SERVICES (PREMIUM UI) */}
                    <div className={`transition-all duration-500 ${step === 3 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-30 grayscale'}`}>
                        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400"><Grid size={14}/> 3. Carte des Soins</div>{step === 3 && <button onClick={()=>setStep(4)} className="rounded border border-zinc-700 px-3 py-1 text-[10px] transition hover:bg-white hover:text-black">Suivant</button>}</div>
                        {!isEditingService && (<div className="mb-4"><div className="mb-3 text-[9px] font-black uppercase tracking-widest text-zinc-500">Suggestions Rapides</div><div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">{PRESETS[preview.category]?.map((p, i) => (<button key={i} onClick={() => selectPreset(p)} className="flex shrink-0 items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-[10px] font-bold text-zinc-300 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"><Wand2 size={12} className="text-indigo-400"/> {p.name}</button>))}</div></div>)}
                        {isEditingService && (<div className="mb-4 overflow-hidden rounded-3xl border border-indigo-500/30 bg-indigo-600/10 p-5 backdrop-blur-md"><div className="mb-4 flex justify-between"><span className="text-xs font-black uppercase tracking-widest text-indigo-300">Nouveau Service</span><button onClick={()=>setIsEditingService(false)}><X size={14} className="text-indigo-300 transition hover:text-white"/></button></div><div className="mb-4 flex gap-4"><div onClick={() => serviceFileRef.current.click()} className="group flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-indigo-500/30 bg-black/50 transition hover:border-indigo-400">{newService.image ? <img src={newService.image} className="size-full object-cover"/> : <ImageIcon size={20} className="text-indigo-500/50 transition group-hover:text-indigo-400"/>}<input type="file" ref={serviceFileRef} onChange={(e) => e.target.files[0] && setNewService({...newService, image: URL.createObjectURL(e.target.files[0])})} className="hidden"/></div><div className="flex-1 space-y-3"><input placeholder="Nom du service" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-xs font-bold text-white outline-none transition placeholder:text-indigo-500/50 focus:border-indigo-400"/><div className="flex gap-3"><input placeholder="Prix" type="number" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-xs font-black text-indigo-300 outline-none transition placeholder:text-indigo-500/50 focus:border-indigo-400"/><input placeholder="Min" type="number" value={newService.time} onChange={e=>setNewService({...newService, time: e.target.value})} className="w-full rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-xs font-bold text-white outline-none transition placeholder:text-indigo-500/50 focus:border-indigo-400"/></div></div></div><textarea placeholder="Description technique, produits utilisés..." value={newService.desc} onChange={e=>setNewService({...newService, desc: e.target.value})} className="mb-4 h-20 w-full resize-none rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-xs font-medium text-white outline-none transition placeholder:text-indigo-500/50 focus:border-indigo-400"/><button onClick={() => { update('services', [...preview.services, { ...newService, id: Date.now() }]); setIsEditingService(false); }} className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">Ajouter au Menu</button></div>)}
                        <div className="space-y-2">{preview.services.map((s, i) => (<div key={i} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm transition hover:bg-white/10">{s.image ? <img src={s.image} className="size-14 rounded-xl object-cover shadow-sm"/> : <div className="flex size-14 items-center justify-center rounded-xl bg-black/50 shadow-sm"><Scissors size={16} className="text-zinc-600"/></div>}<div className="min-w-0 flex-1"><div className="mb-1 flex justify-between"><span className="truncate text-sm font-bold text-white">{s.name}</span><span className="text-sm font-black text-white">{s.price}.-</span></div><div className="truncate text-[10px] font-medium text-zinc-500">{s.time} min • {s.desc || "Pas de description"}</div></div><button onClick={()=>update('services', preview.services.filter(srv=>srv.id!==s.id))} className="rounded-lg p-2 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10"><Trash2 size={16} className="text-zinc-500 transition hover:text-red-500"/></button></div>))}{!isEditingService && (<button onClick={() => { setNewService({name:'',price:'',time:'30',desc:'',image:null}); setIsEditingService(true); }} className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700/50 bg-black/30 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-zinc-500 hover:text-white"><Plus size={16} className="transition group-hover:scale-110"/> Créer un service</button>)}</div>
                    </div>

                    {/* ETAPE 4 : PLAN (PREMIUM UI) */}
                    {step === 4 && <div className="fade-in translate-y-0 space-y-6 animate-in"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-400"><Crown size={14}/> 4. Plan Pro</div><div className="grid grid-cols-2 gap-4"><div className="flex flex-col gap-3 rounded-3xl border border-white/5 bg-white/5 p-5 opacity-50 backdrop-blur-sm"><div className="text-xs font-black tracking-widest text-white">BASIC</div><div className="text-3xl font-black text-white">0.-</div><ul className="space-y-2 text-[10px] font-medium text-zinc-400"><li>• 3 Services max</li><li>• Pas de portfolio</li></ul></div><div className="relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-indigo-500/50 bg-indigo-600/10 p-5 backdrop-blur-md"><div className="absolute right-0 top-0 rounded-bl-xl bg-indigo-500 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-white">Populaire</div><div className="text-xs font-black tracking-widest text-indigo-300">ELITE</div><div className="text-3xl font-black text-white">49.-<span className="text-sm text-indigo-300">/mois</span></div><ul className="space-y-2 text-[10px] font-medium text-indigo-200"><li>• Tout illimité</li><li>• Badge Pro Vérifié</li><li>• Zéro commission</li></ul><button onClick={() => onFinish(preview)} className="mt-4 w-full rounded-xl bg-white py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-white/10 transition hover:scale-[1.02]">Activer Maintenant</button></div></div></div>}
                </div>
            </div>
            <div className="relative hidden w-[450px] flex-col items-center justify-center overflow-hidden border-l border-white/5 bg-[#09090b] p-10 md:flex">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10"/>
                <div className="absolute inset-x-0 top-0 z-10 border-b border-white/5 bg-[#09090b]/80 p-6 text-center backdrop-blur-md"><h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Aperçu en temps réel</h3></div>
                <div className="relative z-0 mt-20 w-full max-w-sm origin-top scale-100 shadow-2xl pointer-events-none"><NexusCard salon={preview} onSelect={()=>{}} /></div>
            </div>
        </div>
    );
};

// --- APP ROOT (PREMIUM POLISH) ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('Tout');
  const [userLocation, setUserLocation] = useState(false);
  const [isLandingVisible, setIsLandingVisible] = useState(false);

  useEffect(() => {
    if (view === 'landing') {
      setIsLandingVisible(true);
    }
  }, [view]);

  const handleDeploy = (data) => {
      if(data) {
          const newS = { ...data, id: Date.now(), verified: true, reviews: 0, distance: 0.1, distanceStr: "Nouveau" };
          setSalons([newS, ...salons]);
          setView('client');
      }
  };

  const filtered = salons.filter(s => {
      const matchCat = catFilter === 'Tout' || s.category === catFilter;
      const term = normalize(searchTerm.trim());
      if (!term) return matchCat;
      const matchName = normalize(s.name).includes(term);
      const matchLoc = normalize(s.location).includes(term);
      const matchSrv = s.services.some(srv => normalize(srv.name).includes(term));
      return matchCat && (matchName || matchLoc || matchSrv);
  });

  if (userLocation) filtered.sort((a, b) => a.distance - b.distance);

  if (view === 'landing') return (
      <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[#09090b] font-sans">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20 grayscale"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-[#09090b]"/>
          <div className={`z-10 w-full max-w-sm space-y-10 p-6 text-center transition-all duration-800 ${isLandingVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <h1 className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl mix-blend-overlay">NEXUS<span className="text-indigo-500">.</span></h1>
              <div className="flex flex-col gap-4">
                  <button onClick={() => setView('client')} className="group relative w-full overflow-hidden rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"><div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"/>Explorer</button>
                  <button onClick={() => setView('pro')} className="w-full rounded-2xl border-2 border-white/20 bg-transparent py-5 text-sm font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10">Espace Pro</button>
              </div>
          </div>
      </div>
  );
  
  if (view === 'pro') return <GenesisArchitect onFinish={handleDeploy} />;

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-white selection:bg-indigo-500/30">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-white/5 bg-[#09090b] shadow-2xl shadow-black">
        <div className="sticky top-0 z-30 border-b border-white/5 bg-[#09090b]/80 pb-4 pt-2 backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-4"><span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-2xl font-black tracking-tighter text-transparent">NEXUS.</span><button onClick={() => setView('landing')} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"><LogOut size={18}/></button></div>
            <div className="mb-4 flex gap-3 px-5"><div className="group relative flex-1"><Search className="absolute left-4 top-3.5 text-zinc-500 transition group-focus-within:text-white" size={18}/><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-white/10"/>{searchTerm && <button onClick={()=>{setSearchTerm(''); setCatFilter('Tout')}} className="absolute right-4 top-3.5 text-zinc-500 transition hover:text-white"><X size={18}/></button>}</div><button onClick={()=>setUserLocation(!userLocation)} className={`flex w-14 items-center justify-center rounded-2xl border transition-all ${userLocation ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}><Navigation size={20}/></button></div>
            <div className="hide-scrollbar flex gap-2 overflow-x-auto px-5 pb-2">{['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => (<button key={c} onClick={() => setCatFilter(c)} className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[11px] font-black uppercase tracking-wider backdrop-blur-md transition-all ${catFilter === c ? 'border-white bg-white text-black shadow-md' : 'border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}>{c}</button>))}</div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-28 pt-6">
            {userLocation && <div className="mb-6 flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 fade-in animate-in"><Navigation size={12}/> Trié par proximité</div>}
            {filtered.map(s => <NexusCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}
            {filtered.length === 0 && <div className="py-28 text-center opacity-50"><Search size={48} className="mx-auto mb-4 text-zinc-700"/><p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Aucun résultat.</p><button onClick={() => {setSearchTerm(''); setCatFilter('Tout');}} className="mt-6 border-b border-indigo-500/30 pb-1 text-xs font-black uppercase tracking-widest text-indigo-400 transition hover:text-indigo-300">Effacer les filtres</button></div>}
        </div>
        <div className="safe-area-pb fixed bottom-0 z-30 flex w-full max-w-md items-center justify-between border-t border-white/5 bg-[#09090b]/90 px-8 py-4 backdrop-blur-xl"><button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? "scale-105 text-white" : "text-zinc-600 hover:text-zinc-400"}`}><Grid size={24}/><span className="text-[9px] font-black uppercase tracking-widest">Explore</span></button><button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'agenda' ? "scale-105 text-white" : "text-zinc-600 hover:text-zinc-400"}`}><Calendar size={24}/><span className="text-[9px] font-black uppercase tracking-widest">Agenda</span></button><button onClick={() => setActiveTab('likes')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'likes' ? "scale-105 text-white" : "text-zinc-600 hover:text-zinc-400"}`}><Heart size={24}/><span className="text-[9px] font-black uppercase tracking-widest">Favoris</span></button></div>
        {selectedSalon && <NexusDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}
      </div>
    </div>
  );
}
