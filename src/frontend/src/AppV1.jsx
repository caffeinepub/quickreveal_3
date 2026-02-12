import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, ChevronRight, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, 
  Camera, FileText, Trash2, Image as ImageIcon, Briefcase, 
  Wand2, Save, Gem, Crown, Check, Navigation, MessageSquare, Hourglass, Lock, Send,
  TrendingUp, Users, Target, Award, PlayCircle, Map, Smartphone, Instagram, Link as LinkIcon, BadgeCheck, Share2, Quote, ArrowUpRight
} from 'lucide-react';

// --- INTELLIGENCE GÉOGRAPHIQUE SUISSE ---
const SWISS_DB = [
    { zip: "1000", city: "Lausanne" }, { zip: "1003", city: "Lausanne" }, { zip: "1200", city: "Genève" },
    { zip: "1700", city: "Fribourg" }, { zip: "2000", city: "Neuchâtel" }, { zip: "1820", city: "Montreux" }
];

// --- DATA INITIALE ---
const INITIAL_SALONS = [
  {
    id: 1, name: "Barber du Lac", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"],
    location: "Lausanne", zip: "1000", type: "Domicile", distance: 0.5,
    nextSlot: "20:00", tags: ["Nocturne", "VIP"], instagram: "barberdulac", website: "www.barber.ch",
    bio: "L'excellence masculine à domicile. Je me déplace avec mon fauteuil et mes produits d'exception.",
    whatsapp: "41790000000",
    services: [
        { id: 101, name: "Signature Cut", price: 60, time: 45, desc: "Consultation visagiste, coupe aux ciseaux.", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=60" }
    ]
  }
];

// --- PRESETS ---
const PROFESSIONS = [
    { id: 'Barber', icon: Scissors, label: 'Barber' },
    { id: 'Coiffure', icon: Sparkles, label: 'Coiffure' },
    { id: 'Onglerie', icon: Feather, label: 'Onglerie' },
    { id: 'Esthétique', icon: Zap, label: 'Esthétique' },
];

const RICH_PRESETS = {
    Barber: [{name:"Coupe Classique",price:"40",time:"30",desc:"Coupe aux ciseaux."}],
    Onglerie: [{name:"Semi-Permanent",price:"60",time:"45",desc:"Manucure russe."}],
    Coiffure: [{name:"Brushing",price:"45",time:"30",desc:"Shampoing et soin."}],
    Esthétique: [{name:"HydraFacial",price:"150",time:"60",desc:"Nettoyage profond."}]
};

// --- UTILS ---
const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// --- COMPONENTS ---
const SmartLocationInput = ({ value, onChange, placeholder }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [show, setShow] = useState(false);
    const handleInput = (e) => { const val = e.target.value; onChange(val); if (val.length > 1) { const match = SWISS_DB.filter(l => l.zip.startsWith(val) || l.city.toLowerCase().includes(val.toLowerCase())); setSuggestions(match); setShow(true); } else { setShow(false); } };
    const select = (loc) => { onChange(`${loc.zip} ${loc.city}`); setShow(false); };
    return ( <div className="relative w-full"> <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition focus-within:border-indigo-500"> <MapPin size={16} className="mr-2 text-zinc-500"/> <input value={value} onChange={handleInput} placeholder={placeholder} className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-zinc-600"/> </div> {show && suggestions.length > 0 && ( <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-40 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-800 shadow-2xl"> {suggestions.map((s, i) => ( <button key={i} onClick={() => select(s)} className="flex w-full justify-between px-4 py-3 text-left text-sm text-white hover:bg-zinc-700"> <span>{s.city}</span><span className="font-mono text-zinc-400">{s.zip}</span> </button> ))} </div> )} </div> );
};

const WhatsAppButton = ({ salon, cart, date, time, address, total }) => {
    const generateLink = () => { const srv = cart.map(s => `• ${s.name}`).join('%0A'); const loc = salon.type === 'Domicile' ? `%0A🏠 Chez moi : ${address.street} (${address.code})` : `%0A📍 Au salon`; const msg = `Bonjour ${salon.name} !%0AJe souhaite réserver :%0A${srv}%0A%0A🗓 ${date} à ${time}${loc}%0A💰 Total : ${total}.-%0A%0AC'est dispo ?`; return `https://wa.me/${salon.whatsapp}?text=${msg}`; };
    return ( <a href={generateLink()} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-900/20 transition-transform hover:bg-[#1ebc57] active:scale-95"> <MessageSquare size={18} fill="currentColor"/> Envoyer par WhatsApp </a> );
};

const CinematicCard = ({ salon, onSelect }) => {
    const startPrice = salon.services.length > 0 ? Math.min(...salon.services.map(s => s.price)) : 0;
    return ( <div onClick={() => onSelect(salon)} className="group relative mb-6 aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[32px] border border-white/5 bg-zinc-900 shadow-2xl"> <img src={salon.cover} className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"/> <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/> <div className="absolute top-4 left-4 flex flex-wrap gap-2"> <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">{salon.type === 'Domicile' ? <Home size={10}/> : <MapPin size={10}/>} {salon.type}</span> {salon.verified && <span className="flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-300 backdrop-blur-md"><BadgeCheck size={12}/> Vérifié</span>} </div> <div className="absolute inset-x-0 bottom-0 p-6"> <h3 className="mb-2 text-3xl font-black leading-none text-white">{salon.name}</h3> <div className="flex items-end justify-between"> <div> <div className="mb-1 text-xs font-bold text-zinc-300">{salon.location} • <span className="text-emerald-400">À 2km</span></div> <div className="flex gap-1">{salon.tags.map(t=><span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[9px] text-zinc-300">{t}</span>)}</div> </div> <div className="text-right"> <div className="text-[10px] font-bold uppercase text-zinc-400">Dès</div> <div className="text-xl font-black text-white">{startPrice}.-</div> </div> </div> </div> </div> );
};

// --- NOUVEAU : MANIFESTO INTRO (CLARTÉ ABSOLUE) ---
const ManifestoIntro = ({ onEnter }) => {
    const [step, setStep] = useState(0);
    const texts = ["L'ÉLITE SUISSE.", "À DOMICILE OU SALON.", "RÉSERVEZ L'EXCELLENCE."];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % texts.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex h-screen flex-col justify-between overflow-hidden bg-black font-sans">
            {/* FOND VIDEO SIMULÉ HAUTE QUALITÉ */}
            <div className="absolute inset-0 animate-pulse-slow bg-[url('https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-50"/>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"/>

            {/* HEADER */}
            <div className="relative z-10 flex items-center justify-between p-6 pt-12">
                <h1 className="text-2xl font-black tracking-tighter text-white mix-blend-overlay">NEXUS.</h1>
                <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[9px] font-bold text-white backdrop-blur-md">Suisse Romande</div>
            </div>

            {/* CENTER : LE MANIFESTO */}
            <div className="relative z-10 px-6">
                <h2 
                    key={step}
                    className="animate-in fade-in slide-in-from-bottom-4 text-6xl font-black leading-[0.9] tracking-tighter text-white duration-700"
                >
                    {texts[step]}
                </h2>
                
                {/* LES MÉTIERS EN CLAIR */}
                <div className="animate-in fade-in delay-500 mt-8 flex gap-4 duration-1000">
                    {PROFESSIONS.map((p, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 opacity-70">
                            <div className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                                <p.icon size={16} className="text-white"/>
                            </div>
                            <span className="text-[8px] font-bold uppercase text-zinc-400">{p.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER : CTA ULTRA CLAIR */}
            <div className="relative z-10 mx-auto w-full max-w-md p-6 pb-12">
                <button 
                    onClick={onEnter} 
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-transform hover:scale-[1.02]"
                >
                    Entrer <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
                </button>
                <p className="mt-4 text-center text-[9px] font-medium uppercase tracking-widest text-zinc-500">Rejoignez la nouvelle ère</p>
            </div>
        </div>
    );
};

// --- DÉTAIL CLIENT ---
const NexusDetail = ({ salon, onClose }) => {
    const [cart, setCart] = useState([]); 
    const [step, setStep] = useState('menu'); 
    const [date, setDate] = useState('Auj.');
    const [time, setTime] = useState(null);
    const [address, setAddress] = useState({ street: '', code: '' });
    
    const now = new Date();
    const currentHour = now.getHours();
    const isSlotAvailable = (t) => (date !== 'Auj.' || parseInt(t.split(':')[0]) > currentHour);

    const toggleService = (service) => { if (cart.find(s => s.id === service.id)) setCart(cart.filter(s => s.id !== service.id)); else setCart([...cart, service]); };
    const totalPrice = cart.reduce((acc, s) => acc + Number(s.price), 0);

    const handleShare = async () => {
        const shareData = { title: `Découvre ${salon.name} sur Nexus`, text: `Regarde ce pro incroyable : ${salon.name}`, url: window.location.href };
        if (navigator.share) { try { await navigator.share(shareData); } catch (err) { console.log('Share failed'); } } else { alert("Lien copié !"); }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#09090b] font-sans">
            {step === 'confirm' ? (
                <div className="zoom-in animate-in flex flex-1 flex-col items-center justify-center space-y-8 p-8 text-center">
                    <div className="flex size-24 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.3)]"><Smartphone size={40} className="text-emerald-500"/></div>
                    <div><h2 className="mb-2 text-3xl font-black text-white">Presque fini !</h2><p className="mx-auto max-w-xs text-sm text-zinc-400">Pour sécuriser le créneau, envoyez la demande pré-remplie au pro.</p></div>
                    <div className="w-full max-w-xs space-y-4"><WhatsAppButton salon={salon} cart={cart} date={date} time={time} address={address} total={totalPrice} /><div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Réponse moyenne : &lt; 30 min</div></div>
                    <button onClick={onClose} className="mt-4 text-xs font-bold text-zinc-500 hover:text-white">Annuler</button>
                </div>
            ) : (
                <>
                    <div className="relative h-64 shrink-0">
                        <img src={salon.cover} className="absolute inset-0 size-full object-cover opacity-70"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"/>
                        <button onClick={step === 'menu' ? onClose : () => setStep('menu')} className="absolute top-6 left-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur"><ChevronLeft/></button>
                        <button onClick={handleShare} className="absolute top-6 right-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-black"><Share2 size={18}/></button>
                        <div className="absolute inset-x-6 bottom-6"><h2 className="mb-2 text-4xl font-black tracking-tight text-white">{salon.name}</h2><div className="mb-4 flex gap-3">{salon.instagram && <button className="rounded-lg border border-white/10 bg-white/10 p-2 text-white backdrop-blur hover:bg-white/20"><Instagram size={18}/></button>}{salon.website && <button className="rounded-lg border border-white/10 bg-white/10 p-2 text-white backdrop-blur hover:bg-white/20"><LinkIcon size={18}/></button>}</div><div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-300"><span className="flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/20 px-2 py-1 text-emerald-400"><CheckCircle2 size={10}/> Vérifié</span><span className="flex items-center gap-1 rounded bg-white/10 px-2 py-1"><MapPin size={10}/> {salon.location}</span></div></div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 pb-40 pt-4">
                        {step === 'menu' && (<div className="fade-in animate-in space-y-8"><div onClick={handleShare} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-600/10 p-4 transition hover:bg-indigo-600/20"><div className="flex size-10 items-center justify-center rounded-full bg-indigo-500 text-white"><Share2 size={20}/></div><div><div className="text-sm font-bold text-white">Recommander ce Pro</div><div className="text-[10px] text-zinc-400">Partagez ce profil à un ami sur WhatsApp/Insta</div></div></div><div><h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">À Propos</h3><p className="text-sm font-medium leading-relaxed text-zinc-300">{salon.bio}</p></div><div><h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Carte des Soins</h3><div className="space-y-4">{salon.services.map(s => { const isSelected = cart.find(i => i.id === s.id); return (<button key={s.id} onClick={() => toggleService(s)} className={`group relative flex w-full gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all ${isSelected ? 'border-indigo-500 bg-indigo-600/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}`}>{s.image ? <img src={s.image} className="size-20 shrink-0 rounded-xl bg-zinc-800 object-cover"/> : <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-zinc-800"><Sparkles className="text-zinc-600"/></div>}<div className="flex min-w-0 flex-1 flex-col justify-center"><div className="mb-1 flex items-start justify-between"><div className="text-base font-bold leading-tight text-white">{s.name}</div><div className="text-lg font-black text-white">{s.price}.-</div></div><div className="mb-2 flex items-center gap-1 font-mono text-xs text-zinc-500"><Clock size={10}/> {s.time} min</div>{s.desc && <p className="line-clamp-2 text-[11px] leading-tight text-zinc-400">{s.desc}</p>}</div><div className={`flex size-6 shrink-0 items-center justify-center self-center rounded-full border transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-700'}`}>{isSelected && <Check size={12} className="text-white"/>}</div></button>); })}</div></div></div>)}
                        {step === 'calendar' && (<div className="slide-in-from-right animate-in space-y-8"><div><h3 className="mb-4 text-xl font-black text-white">Date</h3><div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">{['Auj.', 'Demain', 'Mer 14', 'Jeu 15'].map(d => (<button key={d} onClick={() => setDate(d)} className={`min-w-[90px] rounded-2xl border px-5 py-4 text-sm font-bold transition-all ${date === d ? 'bg-white text-black' : 'border-zinc-800 bg-zinc-900/50 text-zinc-500'}`}>{d}</button>))}</div></div><div><h3 className="mb-4 text-xl font-black text-white">Heure</h3><div className="grid grid-cols-4 gap-3">{['10:00', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00', '21:00'].map(t => { const ok = isSlotAvailable(t); return (<button key={t} onClick={() => ok && setTime(t)} disabled={!ok} className={`rounded-2xl border py-4 text-sm font-bold transition-all ${!ok ? 'cursor-not-allowed opacity-20' : time === t ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'}`}>{t}</button>); })}</div></div></div>)}
                        {step === 'logistics' && (<div className="slide-in-from-right animate-in space-y-6"><h3 className="mb-2 text-xl font-black text-white">Lieu du RDV</h3><div className="space-y-4"><div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-500">Adresse Complète</label><input value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} placeholder="Rue, N°, Ville" className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 font-bold text-white outline-none"/></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-500">Infos d'accès</label><input value={address.code} onChange={e=>setAddress({...address, code: e.target.value})} placeholder="Code, Étage..." className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 font-bold text-white outline-none"/></div></div></div>)}
                    </div>
                    {cart.length > 0 && (<div className="slide-in-from-bottom animate-in safe-area-pb fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-black via-black to-transparent p-4 duration-300"><div className="relative flex items-center gap-3 overflow-hidden rounded-[20px] border border-white/10 bg-[#121212] p-2 pl-5 shadow-2xl"><div className="relative z-10 flex-1"><div className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{cart.length} PRESTATION(S)</div><div className="text-3xl font-black tracking-tight text-white">{totalPrice}.-</div></div><button onClick={() => { if (step === 'menu') setStep('calendar'); else if (step === 'calendar') setStep(salon.type === 'Domicile' ? 'logistics' : 'confirm'); else setStep('confirm'); }} disabled={step === 'calendar' && (!date || !time)} className="relative z-10 flex-[2] rounded-2xl bg-white py-5 text-xs font-black uppercase tracking-[0.15em] text-black shadow-xl transition hover:scale-[1.02] disabled:opacity-50">{step === 'menu' ? 'Choisir Créneau' : step === 'calendar' ? 'Valider' : 'Confirmer'}</button></div></div>)}
                </>
            )}
        </div>
    );
};

// --- PRO STUDIO (ULTIMATE) ---
const ProToolsStudio = ({ onFinish }) => {
    const [preview, setPreview] = useState({ name: 'Mon Business', category: '', rating: '5.0', reviews: 0, cover: null, images: [], location: '', type: 'Salon', tags: [], whatsapp: '', instagram: '', website: '', bio: '', services: [] });
    const [step, setStep] = useState(1);
    const [isEditingService, setIsEditingService] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', time: '', desc: '', image: null });
    
    const fileRef = useRef(null);
    const serviceFileRef = useRef(null);
    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const selectPreset = (p) => { setNewService({...p, image: null}); setIsEditingService(true); };

    return (
        <div className="flex h-full flex-col bg-black font-sans text-white md:flex-row">
            <div className="flex flex-1 flex-col border-r border-white/10 bg-[#050505]">
                <div className="flex items-center justify-between border-b border-white/10 p-5"><span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">STUDIO PRO</span><button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button></div>
                <div className="flex-1 space-y-10 overflow-y-auto p-6">
                    {step === 1 && (<div className="fade-in animate-in space-y-8"><div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">1. Votre Métier</label><div className="grid grid-cols-3 gap-2">{PROFESSIONS.map(p => (<button key={p.id} onClick={() => update('category', p.id)} className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${preview.category === p.id ? 'border-white bg-white text-black' : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-white'}`}><p.icon size={20}/><span className="text-[10px] font-bold uppercase">{p.label}</span></button>))}</div></div><div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">2. Identité & Lieu</label><div className="flex items-start gap-4"><div onClick={() => fileRef.current.click()} className="relative flex size-24 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-white">{preview.cover ? <img src={preview.cover} className="size-full object-cover"/> : <Camera size={20} className="text-zinc-600"/>}<input type="file" ref={fileRef} onChange={(e) => e.target.files[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/></div><div className="flex-1 space-y-3"><input placeholder="Nom du Business" value={preview.name} onChange={e=>update('name', e.target.value)} className="w-full border-b border-zinc-800 bg-transparent py-2 text-xl font-black text-white outline-none"/><SmartLocationInput value={preview.location} onChange={(val) => update('location', val)} placeholder="NPA ou Ville (ex: 1000)" /></div></div><div className="grid grid-cols-2 gap-2"><button onClick={()=>update('type', 'Salon')} className={`w-full rounded-xl border py-4 text-[10px] font-black uppercase tracking-widest transition-all ${preview.type==='Salon' ? 'border-white bg-white text-black' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>Salon</button><button onClick={()=>update('type', 'Domicile')} className={`w-full rounded-xl border py-4 text-[10px] font-black uppercase tracking-widest transition-all ${preview.type==='Domicile' ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>Domicile</button></div></div><div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">3. Social Hub</label><div className="flex gap-3"><div className="flex flex-1 items-center rounded-xl border border-zinc-800 bg-zinc-900 px-3"><Instagram size={14} className="mr-2 text-zinc-500"/><input placeholder="@insta" onChange={e=>update('instagram', e.target.value)} className="w-full bg-transparent py-3 text-xs font-bold text-white outline-none"/></div><div className="flex flex-1 items-center rounded-xl border border-zinc-800 bg-zinc-900 px-3"><LinkIcon size={14} className="mr-2 text-zinc-500"/><input placeholder="site.com" onChange={e=>update('website', e.target.value)} className="w-full bg-transparent py-3 text-xs font-bold text-white outline-none"/></div></div><div className="flex items-center rounded-xl border border-emerald-500/30 bg-emerald-900/10 px-4"><Phone size={14} className="mr-3 text-emerald-500"/><input placeholder="WhatsApp (ex: 4179...)" onChange={e=>update('whatsapp', e.target.value)} className="w-full bg-transparent py-4 text-sm font-bold text-emerald-400 outline-none placeholder:text-emerald-500/30"/></div></div><div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">4. Bio</label><textarea placeholder="Votre histoire, votre expertise..." onChange={e=>update('bio', e.target.value)} className="h-24 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xs text-white outline-none"/></div><button onClick={()=>setStep(2)} disabled={!preview.category} className="w-full rounded-xl bg-white py-4 text-xs font-black uppercase tracking-widest text-black transition hover:scale-[1.02] disabled:opacity-50">Suivant</button></div>)}
                    {step === 2 && (<div className="fade-in animate-in space-y-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400"><Grid size={14}/> Menu {preview.category}</div><button onClick={()=>setStep(1)} className="text-[10px] font-bold text-zinc-500">Retour</button></div>{!isEditingService ? (<div className="space-y-6"><div className="space-y-3"><div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Suggestions Rapides</div><div className="grid grid-cols-2 gap-2">{RICH_PRESETS[preview.category]?.map((p, i) => (<button key={i} onClick={() => selectPreset(p)} className="group rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-left transition hover:border-zinc-600"><div className="mb-1 text-[10px] font-bold text-white transition group-hover:text-emerald-400">{p.name}</div><div className="text-[9px] text-zinc-500">{p.time}min • {p.price}.-</div></button>))}</div></div><div className="space-y-3"><div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Vos Services Actifs</div>{preview.services.map((s, i) => (<div key={i} className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">{s.image ? <img src={s.image} className="size-12 rounded-lg object-cover"/> : <div className="flex size-12 items-center justify-center rounded-lg bg-black"><Sparkles size={16} className="text-zinc-600"/></div>}<div className="flex-1"><div className="text-sm font-bold text-white">{s.name}</div><div className="line-clamp-1 text-[10px] text-zinc-500">{s.desc}</div></div><div className="font-black text-white">{s.price}.-</div><button onClick={()=>update('services', preview.services.filter((_,x)=>x!==i))}><Trash2 size={16} className="text-zinc-600 group-hover:text-red-500"/></button></div>))}{preview.services.length === 0 && <div className="rounded-xl border-2 border-dashed border-zinc-900 py-8 text-center text-xs italic text-zinc-700">Aucun service. Cliquez sur une suggestion.</div>}</div><button onClick={() => setIsEditingService(true)} className="w-full rounded-xl border border-dashed border-zinc-700 py-4 text-xs font-bold uppercase text-zinc-400 transition hover:border-zinc-500 hover:text-white">+ Créer service sur mesure</button>{preview.services.length > 0 && <button onClick={() => onFinish(preview)} className="mt-4 w-full rounded-2xl bg-white py-5 font-black uppercase tracking-widest text-black shadow-xl transition hover:scale-[1.02]">Lancer mon Site</button>}</div>) : (<div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5"><div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-bold text-white">Éditer Service</h3><button onClick={()=>setIsEditingService(false)}><X size={16} className="text-zinc-500"/></button></div><div className="flex gap-4"><div onClick={() => serviceFileRef.current.click()} className="group flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-indigo-500/30 bg-black/50 transition hover:border-indigo-400">{newService.image ? <img src={newService.image} className="size-full object-cover"/> : <ImageIcon size={20} className="text-indigo-500/50 transition group-hover:text-indigo-400"/>}<input type="file" ref={serviceFileRef} onChange={(e) => e.target.files[0] && setNewService({...newService, image: URL.createObjectURL(e.target.files[0])})} className="hidden"/></div><div className="flex-1 space-y-2"><input placeholder="Nom du service" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-sm font-bold text-white outline-none"/><div className="flex gap-2"><input placeholder="Prix" type="number" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-sm font-black text-white outline-none transition focus:border-indigo-400"/><input placeholder="Min" type="number" value={newService.time} onChange={e=>setNewService({...newService, time: e.target.value})} className="w-full rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"/></div></div></div><textarea placeholder="Description technique, avantages, produits..." value={newService.desc} onChange={e=>setNewService({...newService, desc: e.target.value})} className="mb-4 h-24 w-full resize-none rounded-xl border border-indigo-500/30 bg-black/50 p-3 text-xs font-medium text-white outline-none transition focus:border-indigo-400"/><button onClick={() => { update('services', [...preview.services, { ...newService, id: Date.now() }]); setIsEditingService(false); }} className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg">Valider</button></div>)}</div>)}
                </div>
            </div>
            <div className="relative hidden w-[450px] flex-col items-center justify-center border-l border-white/5 bg-black p-10 md:flex"><div className="absolute top-0 inset-x-0 z-10 border-b border-white/5 bg-black/80 p-6 text-center backdrop-blur-md"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Aperçu Live</h3></div><div className="mt-10 w-full max-w-sm origin-top scale-100 shadow-2xl pointer-events-none"><CinematicCard salon={preview} onSelect={()=>{}} /></div></div>
        </div>
    );
};

// --- APP ROOT ---
export default function App() {
  const [view, setView] = useState('intro');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [catFilter, setCatFilter] = useState('Tout');
  
  const handleDeploy = (data) => {
      if(data) {
          const newS = { ...data, id: Date.now(), verified: true, reviews: 0, distance: 0.1, priceStart: data.services[0]?.price || 0 };
          setSalons(prev => [newS, ...prev]);
          setView('client');
      }
  };

  let filtered = salons.filter(s => {
      const matchCat = catFilter === 'Tout' || s.category === catFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = s.name.toLowerCase().includes(term) || s.location.toLowerCase().includes(term) || (s.zip && s.zip.includes(term));
      return matchCat && matchSearch;
  });

  if (view === 'intro') return <ManifestoIntro onEnter={() => setView('landing')} />;

  if (view === 'landing') return (
      <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20 grayscale"/>
          <div className="z-10 w-full max-w-md space-y-8 p-6 text-center">
              <h1 className="text-7xl font-black tracking-tighter text-white">NEXUS<span className="text-indigo-500">.</span></h1>
              <p className="text-sm font-medium tracking-wide text-zinc-400">Connect.</p>
              <button onClick={() => setView('client')} className="w-full rounded-2xl bg-white py-5 font-black uppercase tracking-[0.2em] text-black shadow-xl transition hover:scale-[1.02]">Explorer</button>
              <button onClick={() => setView('pro')} className="w-full rounded-2xl border-2 border-white/20 bg-white/10 py-5 font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm transition hover:bg-white/10">Espace Pro</button>
          </div>
      </div>
  );

  if (view === 'pro') return <ProToolsStudio onFinish={handleDeploy} />;

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-indigo-500"><div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-white/5 bg-[#050505] shadow-2xl"><div className="sticky top-0 z-30 border-b border-white/5 bg-[#050505]/90 py-4 pb-4 backdrop-blur-xl"><div className="mb-4 flex items-center justify-between px-6"><span className="text-2xl font-black tracking-tighter text-white">NEXUS.</span><button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button></div><div className="mb-4 flex gap-2 px-6"><div className="group relative flex-1"><Search className="absolute top-3.5 left-4 text-zinc-500" size={18}/><input type="text" placeholder="Salon, Ville, NPA..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-4 pl-12 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/50"/></div><button onClick={() => setShowFilter(!showFilter)} className={`flex w-14 items-center justify-center rounded-2xl border transition-all ${showFilter ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-white/10 bg-white/5 text-zinc-500'}`}><Filter size={20}/></button></div>{showFilter && (<div className="fade-in slide-in-from-top-2 animate-in mb-4 grid grid-cols-2 gap-2 px-6"><button className="rounded-lg border border-zinc-800 bg-zinc-900 py-2 text-xs font-bold text-zinc-400">Prix Croissant</button><button className="rounded-lg border border-zinc-800 bg-zinc-900 py-2 text-xs font-bold text-zinc-400">Meilleure Note</button></div>)}<div className="hide-scrollbar flex gap-3 overflow-x-auto px-6">{['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => (<button key={c} onClick={() => setCatFilter(c)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${catFilter === c ? 'bg-white text-black' : 'border border-white/5 bg-white/5 text-zinc-500 hover:text-white'}`}>{c}</button>))}</div></div><div className="flex-1 px-4 pb-32 pt-6">{filtered.map(s => <CinematicCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}{filtered.length === 0 && <div className="py-20 text-center opacity-50"><p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Aucun résultat.</p></div>}</div><div className="safe-area-pb fixed bottom-0 z-30 flex w-full max-w-md items-center justify-between border-t border-white/5 bg-[#050505]/90 px-8 py-5 backdrop-blur-xl"><button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? "scale-110 text-white" : "text-zinc-600"}`}><Grid size={24}/></button><button onClick={() => setActiveTab('likes')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'likes' ? "scale-110 text-white" : "text-zinc-600"}`}><Heart size={24}/></button></div>{selectedSalon && <NexusDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}</div></div>
  );
}
