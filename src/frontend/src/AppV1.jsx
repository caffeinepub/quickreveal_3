import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, Star, Upload, LogOut, 
  Scissors, ArrowRight, Heart, Plus, X, Phone, 
  Home, Moon, Sun, ChevronLeft, Play, Sparkles, 
  Zap, User, Feather, Menu, Clock, Grid, Eye, Globe, 
  CheckCircle2, DollarSign, ShieldCheck, Filter, 
  Camera, FileText, Trash2, Image as ImageIcon, Briefcase, 
  Wand2, Save, Gem, Crown, Check, Navigation, MessageSquare, Hourglass, Lock, Send
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

// --- COMPOSANTS UI ---
const StatusBadge = ({ type, text }) => {
    const styles = { dispo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", tag: "bg-zinc-800 text-zinc-400 border-zinc-700", verified: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    return <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${styles[type] || styles.tag}`}>{type === 'dispo' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>}{type === 'verified' && <ShieldCheck size={10}/>}{text}</span>;
};

const NexusCard = ({ salon, onSelect }) => {
    const startPrice = salon.services.length > 0 ? Math.min(...salon.services.map(s => s.price)) : 0;
    return (
        <div onClick={() => onSelect(salon)} className="bg-[#121212] rounded-[24px] overflow-hidden border border-zinc-800 mb-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer group hover:border-zinc-600">
            <div className="flex h-40">
                <div className="w-[35%] relative overflow-hidden">
                    <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover"/>
                    {salon.type === 'Domicile' && <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/90 backdrop-blur py-1.5 text-[9px] font-black text-white text-center uppercase tracking-widest">Mobile</div>}
                </div>
                <div className="w-[65%] p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-1"><h3 className="font-black text-white text-lg leading-tight truncate pr-2">{salon.name}</h3>{salon.verified && <StatusBadge type="verified" text="Pro"/>}</div>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs font-medium"><MapPin size={10}/> {salon.location} • <span className="text-emerald-500 font-bold">{salon.distanceStr || "À proximité"}</span></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5"><StatusBadge type="dispo" text={salon.nextSlot} />{salon.tags.slice(0, 1).map(t => <StatusBadge key={t} type="tag" text={t}/>)}</div>
                        <div className="flex justify-between items-end pt-2 border-t border-zinc-800"><div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">À partir de</div><div className="flex items-center gap-2"><div className="text-xl font-black text-white">{startPrice}.-</div><div className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:rotate-[-45deg]"><ArrowRight size={16}/></div></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SECURE CHAT COMPONENT ---
const SecureChat = ({ onClose, proName }) => {
    const [msgs, setMsgs] = useState([
        {id: 1, text: "Bonjour ! Votre demande a bien été reçue.", sender: 'pro', time: '10:00'},
        {id: 2, text: "Avez-vous un parking visiteur ?", sender: 'pro', time: '10:01'}
    ]);
    const [input, setInput] = useState("");

    const send = () => {
        if(input.trim()) {
            setMsgs([...msgs, {id: Date.now(), text: input, sender: 'me', time: '10:05'}]);
            setInput("");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#09090b] flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                <div className="flex items-center gap-3">
                    <button onClick={onClose}><ChevronLeft className="text-white"/></button>
                    <div>
                        <div className="font-bold text-white text-sm">{proName}</div>
                        <div className="text-[10px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> En ligne</div>
                    </div>
                </div>
                <ShieldCheck size={16} className="text-zinc-500"/>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex justify-center"><span className="text-[9px] text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><Lock size={8}/> Chat Chiffré</span></div>
                {msgs.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-300 rounded-bl-none'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2 safe-area-pb">
                <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Écrire un message..." className="flex-1 bg-black border border-zinc-700 rounded-full px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"/>
                <button onClick={send} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition"><Send size={18}/></button>
            </div>
        </div>
    );
};

// --- DÉTAIL & FLOW DE COMMANDE ---
const NexusDetail = ({ salon, onClose }) => {
    const [cart, setCart] = useState([]); 
    const [step, setStep] = useState('menu'); // menu -> logistics -> confirm
    const [address, setAddress] = useState({ street: '', code: '', info: '' });
    const [showChat, setShowChat] = useState(false);

    const toggleService = (service) => { if (cart.find(s => s.id === service.id)) setCart(cart.filter(s => s.id !== service.id)); else setCart([...cart, service]); };
    const totalPrice = cart.reduce((acc, s) => acc + Number(s.price), 0);

    const handleNext = () => {
        if (step === 'menu') {
            if (salon.type === 'Domicile') {
                setStep('logistics');
            } else {
                setStep('confirm');
            }
        } else if (step === 'logistics') {
            // Validate address fields before proceeding
            if (!address.street.trim() || !address.code.trim()) {
                alert('Veuillez remplir l\'adresse complète et les infos d\'accès');
                return;
            }
            setStep('confirm');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans">
            {showChat && <SecureChat onClose={()=>setShowChat(false)} proName={salon.name}/>}
            
            {/* ETAPE 1 & 2 : CONTENU (NON-CONFIRMÉ) */}
            {step !== 'confirm' && (
                <>
                    <div className="relative h-52 flex-shrink-0">
                        <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/20 to-transparent"/>
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20"><button onClick={step === 'logistics' ? () => setStep('menu') : onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white"><ChevronLeft/></button></div>
                        <div className="absolute bottom-4 left-6 right-6"><h2 className="text-3xl font-black text-white mb-1">{salon.name}</h2><div className="flex items-center gap-2 text-xs font-bold text-zinc-300"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{salon.type}</span></div></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 pb-36">
                        {step === 'menu' && (
                            <div className="py-6 space-y-4 animate-in fade-in">
                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Prestations</h3>
                                <div className="space-y-3">
                                    {salon.services.map(s => { const isSelected = cart.find(i => i.id === s.id); return (<button key={s.id} onClick={() => toggleService(s)} className={`w-full p-4 rounded-2xl border flex gap-4 text-left transition-all group ${isSelected ? 'bg-indigo-600/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}>{s.image ? <img src={s.image} className="w-16 h-16 rounded-xl object-cover bg-black flex-shrink-0"/> : <div className="w-16 h-16 rounded-xl bg-black border border-zinc-800 flex items-center justify-center flex-shrink-0"><Sparkles className="text-zinc-700"/></div>}<div className="flex-1 min-w-0"><div className="flex justify-between items-start mb-1"><div className="font-bold text-white text-base">{s.name}</div><div className="font-black text-white text-lg">{s.price}.-</div></div><div className="text-xs text-zinc-500 font-mono mb-2 flex items-center gap-1"><Clock size={10}/> {s.time} min</div></div><div className={`w-6 h-6 rounded-full border flex items-center justify-center self-center flex-shrink-0 transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-700'}`}>{isSelected && <Check size={14} className="text-white"/>}</div></button>); })}
                                </div>
                            </div>
                        )}

                        {step === 'logistics' && (
                            <div className="py-6 space-y-6 animate-in slide-in-from-right">
                                <div>
                                    <h3 className="text-lg font-black text-white mb-2">Lieu du Rendez-vous</h3>
                                    <p className="text-xs text-zinc-400 mb-6">Le professionnel a besoin de ces infos pour valider le déplacement.</p>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Adresse Complète</label>
                                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><MapPin size={16} className="text-zinc-500 mr-3"/><input value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} placeholder="Rue, N°, Ville" className="bg-transparent flex-1 text-sm text-white outline-none"/></div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Infos d'accès (Code, Étage...)</label>
                                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><Lock size={16} className="text-zinc-500 mr-3"/><input value={address.code} onChange={e=>setAddress({...address, code: e.target.value})} placeholder="Digicode, Interphone..." className="bg-transparent flex-1 text-sm text-white outline-none"/></div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Note pour le pro</label>
                                            <textarea value={address.info} onChange={e=>setAddress({...address, info: e.target.value})} placeholder="Ex: J'ai un chien, garez-vous place 12..." className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"/>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] text-emerald-500 bg-emerald-900/10 p-3 rounded-lg border border-emerald-900/30"><ShieldCheck size={12}/> Ces informations sont chiffrées et partagées uniquement si la demande est acceptée.</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b] border-t border-zinc-800 safe-area-pb z-50">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{cart.length} SÉLECTION(S)</div>
                                    <div className="text-2xl font-black text-white">{totalPrice}.-</div>
                                </div>
                                <button onClick={handleNext} className="flex-[2] py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition hover:scale-[1.02]">
                                    {step === 'menu' ? 'Continuer' : 'Envoyer Demande'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ETAPE 3 : CONFIRMATION & ATTENTE */}
            {step === 'confirm' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in zoom-in">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"/>
                        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-yellow-500 relative z-10">
                            <Hourglass size={40} className="text-yellow-500 animate-spin-slow"/>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">Demande Envoyée</h2>
                        <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
                            <span className="text-white font-bold">{salon.name}</span> a reçu votre demande. Il a <span className="text-yellow-500 font-bold">2h00</span> pour confirmer le créneau et l'adresse.
                        </p>
                    </div>

                    <div className="w-full space-y-3">
                        <button onClick={() => setShowChat(true)} className="w-full py-4 bg-zinc-800 text-white font-bold rounded-xl border border-zinc-700 flex items-center justify-center gap-2 hover:bg-zinc-700 transition">
                            <MessageSquare size={18}/> Discuter avec le Pro
                        </button>
                        <button onClick={onClose} className="w-full py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white">Retour à l'accueil</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- GENESIS ARCHITECT (STUDIO PRO) ---
const GenesisArchitect = ({ onFinish }) => {
    const [preview, setPreview] = useState({ name: 'Mon Business', category: 'Barber', rating: '5.0', reviews: 0, cover: null, images: [], location: 'Lausanne', type: 'Salon', distance: '1.2km', nextSlot: '20:00', tags: [], bio: '', contact: '', services: [] });
    const [newService, setNewService] = useState({ name: '', price: '', time: '30', desc: '', image: null });
    const [isEditingService, setIsEditingService] = useState(false);
    const [step, setStep] = useState(1);
    const fileRef = useRef(null);
    const serviceFileRef = useRef(null);
    const portfolioRef = useRef(null);

    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const selectPreset = (preset) => { setNewService({ ...preset, image: null, desc: preset.desc || '' }); setIsEditingService(true); };

    return (
        <div className="h-full bg-black text-white font-sans flex flex-col md:flex-row">
            <div className="flex-1 flex flex-col border-r border-zinc-800">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900"><span className="font-black tracking-widest text-xs text-zinc-400 uppercase">GENESIS STUDIO</span><button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-black">
                    <div className={`transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
                        <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest"><Globe size={14}/> 1. Fondations</div>{step === 1 && <button onClick={()=>setStep(2)} className="text-[10px] border border-zinc-700 px-3 py-1 rounded hover:bg-white hover:text-black">Suivant</button>}</div>
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 space-y-5">
                            <div className="flex gap-5 items-start">
                                <div onClick={() => step === 1 && fileRef.current.click()} className="w-28 h-28 bg-black border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-white transition flex-shrink-0 overflow-hidden">{preview.cover ? <img src={preview.cover} className="w-full h-full object-cover"/> : <div className="text-center"><Camera size={24} className="text-zinc-600 mb-2"/><span className="text-[9px] text-zinc-600 font-bold uppercase">Cover</span></div>}<input type="file" ref={fileRef} onChange={(e) => e.target.files[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/></div>
                                <div className="flex-1 space-y-3">
                                    <input placeholder="Nom du Salon" value={preview.name} onChange={e=>update('name', e.target.value)} className="w-full bg-transparent border-b border-zinc-700 py-2 text-xl font-black text-white outline-none"/>
                                    <div className="flex gap-2"><select className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none font-bold" onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option><option>Esthétique</option><option>Massage</option><option>Tattoo</option></select><input placeholder="Ville" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none font-bold" onChange={e=>update('location', e.target.value)}/></div>
                                    <div className="flex gap-2"><button onClick={()=>update('type', 'Salon')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border ${preview.type==='Salon' ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-500'}`}>Salon</button><button onClick={()=>update('type', 'Domicile')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border ${preview.type==='Domicile' ? 'bg-emerald-500 text-black border-emerald-500' : 'border-zinc-700 text-zinc-500'}`}>Domicile</button></div>
                                </div>
                            </div>
                            <textarea placeholder="Votre Bio..." onChange={e=>update('bio', e.target.value)} className="w-full h-24 bg-black border border-zinc-700 rounded-xl p-4 text-xs text-white outline-none resize-none"/>
                        </div>
                    </div>

                    <div className={`transition-opacity duration-500 ${step === 2 ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
                        <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2 text-fuchsia-400 text-xs font-black uppercase tracking-widest"><ImageIcon size={14}/> 2. Galerie</div>{step === 2 && <button onClick={()=>setStep(3)} className="text-[10px] border border-zinc-700 px-3 py-1 rounded hover:bg-white hover:text-black">Suivant</button>}</div>
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5"><div className="grid grid-cols-4 gap-2 mb-3">{preview.images.map((img, i) => (<div key={i} className="aspect-square rounded-lg overflow-hidden relative group"><img src={img} className="w-full h-full object-cover"/><button onClick={()=>update('images', preview.images.filter((_,x)=>x!==i))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button></div>))}<div onClick={() => step === 2 && portfolioRef.current.click()} className="aspect-square bg-zinc-900 border border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white text-zinc-600 hover:text-white"><Plus size={20}/><input type="file" multiple ref={portfolioRef} onChange={(e) => update('images', [...preview.images, ...Array.from(e.target.files).map(f=>URL.createObjectURL(f))])} className="hidden"/></div></div></div>
                    </div>

                    <div className={`transition-opacity duration-500 ${step === 3 ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
                        <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest"><Grid size={14}/> 3. Carte des Soins</div>{step === 3 && <button onClick={()=>setStep(4)} className="text-[10px] border border-zinc-700 px-3 py-1 rounded hover:bg-white hover:text-black">Suivant</button>}</div>
                        {!isEditingService && (<div className="mb-4"><div className="text-[9px] text-zinc-500 font-bold uppercase mb-2">Suggestions</div><div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">{PRESETS[preview.category]?.map((p, i) => (<button key={i} onClick={() => selectPreset(p)} className="flex-shrink-0 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 hover:text-white transition flex items-center gap-2"><Wand2 size={10}/> {p.name}</button>))}</div></div>)}
                        {isEditingService && (<div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-4 overflow-hidden mb-4"><div className="flex justify-between mb-3"><span className="text-xs font-bold text-white">Nouveau Service</span><button onClick={()=>setIsEditingService(false)}><X size={14} className="text-zinc-500"/></button></div><div className="flex gap-4 mb-3"><div onClick={() => serviceFileRef.current.click()} className="w-20 h-20 bg-black border border-dashed border-zinc-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-white flex-shrink-0 overflow-hidden">{newService.image ? <img src={newService.image} className="w-full h-full object-cover"/> : <ImageIcon size={14} className="text-zinc-600"/>}<input type="file" ref={serviceFileRef} onChange={(e) => e.target.files[0] && setNewService({...newService, image: URL.createObjectURL(e.target.files[0])})} className="hidden"/></div><div className="flex-1 space-y-2"><input placeholder="Nom" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/><div className="flex gap-2"><input placeholder="Prix" type="number" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/><input placeholder="Min" type="number" value={newService.time} onChange={e=>setNewService({...newService, time: e.target.value})} className="w-full bg-black border border-zinc-600 rounded p-2 text-xs text-white outline-none"/></div></div></div><textarea placeholder="Description..." value={newService.desc} onChange={e=>setNewService({...newService, desc: e.target.value})} className="w-full h-16 bg-black border border-zinc-600 rounded-lg p-2 text-xs text-white outline-none resize-none mb-3"/><button onClick={() => { update('services', [...preview.services, { ...newService, id: Date.now() }]); setIsEditingService(false); }} className="w-full py-2 bg-white text-black font-bold text-xs rounded uppercase hover:bg-zinc-200">Ajouter</button></div>)}
                        <div className="space-y-2">{preview.services.map((s, i) => (<div key={i} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center">{s.image ? <img src={s.image} className="w-10 h-10 rounded-lg object-cover"/> : <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"><Scissors size={14} className="text-zinc-600"/></div>}<div className="flex-1 min-w-0"><div className="flex justify-between"><span className="font-bold text-sm text-white truncate">{s.name}</span><span className="text-xs font-black text-white">{s.price}.-</span></div><div className="text-[10px] text-zinc-500 truncate">{s.desc || "Pas de description"}</div></div><button onClick={()=>update('services', preview.services.filter(srv=>srv.id!==s.id))} className="opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} className="text-zinc-500 hover:text-red-500"/></button></div>))}{!isEditingService && (<button onClick={() => { setNewService({name:'',price:'',time:'30',desc:'',image:null}); setIsEditingService(true); }} className="w-full py-3 border border-dashed border-zinc-700 rounded-xl text-xs text-zinc-500 hover:text-white hover:border-white transition flex items-center justify-center gap-2">+ Créer un service personnalisé</button>)}</div>
                    </div>

                    {step === 4 && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-widest"><Crown size={14}/> 4. Membership Pro</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-zinc-700 rounded-2xl p-4 flex flex-col gap-2 opacity-50"><div className="text-xs font-black text-white">BASIC</div><div className="text-xl font-black text-white">0.-</div><ul className="text-[9px] text-zinc-400 space-y-1"><li>• 3 Services max</li><li>• Pas de portfolio</li></ul></div>
                                <div className="border border-indigo-500 bg-indigo-900/10 rounded-2xl p-4 flex flex-col gap-2"><div className="text-xs font-black text-indigo-400">ELITE</div><div className="text-xl font-black text-white">49.-<span className="text-[9px] font-normal text-zinc-500">/mois</span></div><ul className="text-[9px] text-zinc-300 space-y-1"><li>• Tout illimité</li><li>• Badge Pro</li></ul><button onClick={() => onFinish(preview)} className="mt-4 w-full py-2 bg-white text-black font-black text-[10px] uppercase rounded">Activer</button></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="hidden md:flex w-[400px] bg-black border-l border-zinc-800 flex-col items-center justify-center p-8 relative"><div className="absolute top-0 left-0 right-0 p-4 text-center border-b border-zinc-800 bg-zinc-900/50 backdrop-blur"><h3 className="text-white font-bold text-xs uppercase tracking-widest">Aperçu Client</h3></div><div className="w-full max-w-sm pointer-events-none transform scale-95 origin-top shadow-2xl mt-10"><NexusCard salon={preview} onSelect={()=>{}} /></div></div>
        </div>
    );
};

// --- APP ROOT ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('Tout');
  const [userLocation, setUserLocation] = useState(false);

  const handleDeploy = (data) => {
      if(data) {
          const newS = { ...data, id: Date.now(), verified: true, reviews: 0, distance: 0.1, distanceStr: "Nouveau" };
          setSalons([newS, ...salons]);
          setView('client');
      } else {
          setView('landing');
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

  if (view === 'landing') return (<div className="h-screen bg-black flex flex-col justify-center items-center font-sans relative"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20"/><div className="z-10 text-center space-y-8 w-full max-w-sm p-6"><h1 className="text-7xl font-black text-white tracking-tighter mix-blend-difference">NEXUS<span className="text-indigo-500">.</span></h1><div className="flex flex-col gap-3"><button onClick={() => setView('client')} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition shadow-xl">Rechercher</button><button onClick={() => setView('pro')} className="w-full py-4 bg-transparent border border-zinc-700 text-white font-black rounded-xl uppercase tracking-widest hover:bg-white/10 transition">Espace Pro</button></div></div></div>);
  if (view === 'pro') return <GenesisArchitect onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-900 pb-2">
            <div className="px-4 py-4 flex justify-between items-center"><span className="font-black text-xl tracking-tighter">NEXUS.</span><button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button></div>
            <div className="px-4 mb-3 flex gap-2"><div className="relative flex-1"><Search className="absolute left-4 top-3 text-zinc-500" size={18}/><input type="text" placeholder="Service, salon, ville..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-indigo-500 transition"/>{searchTerm && <button onClick={()=>{setSearchTerm(''); setCatFilter('Tout')}} className="absolute right-4 top-3 text-zinc-500 hover:text-white"><X size={18}/></button>}</div><button onClick={()=>setUserLocation(!userLocation)} className={`w-12 rounded-xl flex items-center justify-center border transition ${userLocation ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><Navigation size={20}/></button></div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-2">{['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique', 'Massage', 'Tattoo'].map(c => (<button key={c} onClick={() => setCatFilter(c)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${catFilter === c ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>))}</div>
        </div>
        <div className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
            {userLocation && <div className="mb-4 flex items-center gap-2 text-[10px] uppercase font-bold text-indigo-400 tracking-widest"><Navigation size={10}/> Trié par proximité</div>}
            {filtered.map(s => <NexusCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}
            {filtered.length === 0 && <div className="text-center py-20"><Search size={48} className="mx-auto text-zinc-800 mb-4"/><p className="text-zinc-500 font-medium">Aucun résultat.</p><button onClick={() => {setSearchTerm(''); setCatFilter('Tout');}} className="mt-4 text-indigo-500 text-sm font-bold">Tout effacer</button></div>}
        </div>
        <div className="fixed bottom-0 w-full max-w-md bg-black border-t border-zinc-900 px-8 py-4 flex justify-between items-center z-30 safe-area-pb"><button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? "text-white" : "text-zinc-600"}`}><Grid size={22}/><span className="text-[9px] font-bold uppercase">Explore</span></button><button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1 ${activeTab === 'agenda' ? "text-white" : "text-zinc-600"}`}><Calendar size={22}/><span className="text-[9px] font-bold uppercase">Agenda</span></button><button onClick={() => setActiveTab('likes')} className={`flex flex-col items-center gap-1 ${activeTab === 'likes' ? "text-white" : "text-zinc-600"}`}><Heart size={22}/><span className="text-[9px] font-bold uppercase">Favoris</span></button></div>
        {selectedSalon && <NexusDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}
      </div>
    </div>
  );
}
