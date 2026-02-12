import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, ArrowRight, X, Phone, Scissors, Sparkles, Feather, Zap, 
  CheckCircle2, Star, BadgeCheck, Smartphone, Instagram, Link as LinkIcon, 
  Share2, ChevronLeft, ArrowUpRight, Home, Clock, Gem, Camera, Calendar, Check, Hourglass, User, Navigation, Briefcase
} from 'lucide-react';

// --- STYLE UTILS ---
const serifFont = { fontFamily: '"Times New Roman", Didot, serif', letterSpacing: '-0.03em' };

// --- DATA INITIALE (DÉMO) ---
const CATEGORIES = [
    { id: 'Barber', label: 'Barber', icon: Scissors },
    { id: 'Coiffure', label: 'Coiffure', icon: Sparkles },
    { id: 'Onglerie', label: 'Onglerie', icon: Feather },
    { id: 'Esthétique', label: 'Esthétique', icon: Zap }
];

const INITIAL_ARTISTS = [
  {
    id: 1, name: "JULIEN ROSSI", category: "Barber", rating: "5.0", reviews: 42, verified: true,
    cover: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    location: "Lausanne & Environs", type: "Mobile & Studio",
    acceptsMobile: true, acceptsStudio: true,
    priceStart: 40, nextSlot: "Demain 14:00", instagram: "@juju_barber",
    bio: "Barbier indépendant. Je me déplace chez vous avec mon équipement complet ou je vous reçois dans mon studio privé au Flon.",
    services: [
        { id: 1, name: "Coupe & Barbe (Domicile)", price: 60, time: 60, desc: "Frais de déplacement inclus." },
        { id: 2, name: "Coupe Studio", price: 40, time: 45, desc: "Au studio privé." }
    ]
  }
];

const PRESETS = {
    Barber: [{name:"Coupe Homme",price:"40",time:"30"},{name:"Barbe Sculptée",price:"30",time:"20"}],
    Onglerie: [{name:"Semi-Permanent",price:"50",time:"45"},{name:"Remplissage",price:"60",time:"60"}],
    Coiffure: [{name:"Brushing",price:"45",time:"30"},{name:"Coupe & Soin",price:"80",time:"60"}],
    Esthétique: [{name:"Soin Visage",price:"90",time:"60"}]
};

// --- COMPONENT: MIRROR PROTOCOL (TERMINAL PAIEMENT) ---
const MirrorProtocol = ({ onFinish, onClose, amount }) => {
    const [step, setStep] = useState('camera'); 
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    const handleRecord = () => { setStep('recording'); setTimeout(() => setStep('review'), 2000); };
    const startHold = () => {
        if(step !== 'review') return;
        intervalRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(intervalRef.current); setStep('success'); return 100; }
                return p + 4;
            });
        }, 16);
    };
    const endHold = () => { clearInterval(intervalRef.current); if (progress < 100) setProgress(0); };

    return (
        <div className="fixed inset-0 z-[80] bg-black flex flex-col font-sans">
            {step === 'camera' && (
                <div className="flex-1 relative flex flex-col justify-end p-8">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351431202-6e0000000000?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 grayscale"/>
                    <div className="relative z-10 text-center space-y-8">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Encaissement Sécurisé</h3>
                        <p className="text-zinc-400 text-xs">Filmez le résultat pour débloquer les fonds vers le Talent.</p>
                        <button onClick={handleRecord} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mx-auto hover:scale-110 transition-transform"><div className="w-16 h-16 bg-red-500 rounded-full"/></button>
                    </div>
                    <button onClick={onClose} className="absolute top-6 right-6 text-white"><X/></button>
                </div>
            )}
            {step === 'recording' && <div className="flex-1 flex items-center justify-center flex-col"><div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"/><p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Sécurisation...</p></div>}
            {step === 'review' && (
                <div className="flex-1 relative" onMouseDown={startHold} onMouseUp={endHold} onTouchStart={startHold} onTouchEnd={endHold}>
                    <div className="absolute inset-0"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKrEzvLbsVAud8I/giphy.gif" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"/></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col items-center">
                        <div className="relative mb-6">
                            <svg className="w-24 h-24 rotate-[-90deg]"><circle cx="48" cy="48" r="46" stroke="#333" strokeWidth="4" fill="none"/><circle cx="48" cy="48" r="46" stroke="#E5D0AC" strokeWidth="4" fill="none" strokeDasharray="289" strokeDashoffset={289 - (289 * progress) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.016s linear' }}/></svg>
                            <div className="absolute inset-0 flex items-center justify-center"><div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all ${progress > 0 ? 'scale-90' : 'scale-100 animate-pulse'}`}><Gem size={24} className={progress > 0 ? "text-[#E5D0AC]" : "text-white"}/></div></div>
                        </div>
                        <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Maintenir pour Valider</p>
                        <p className="text-zinc-400 text-[10px]">Montant à payer : {amount}.-</p>
                    </div>
                </div>
            )}
            {step === 'success' && (
                <div className="flex-1 bg-[#E5D0AC] flex flex-col items-center justify-center p-8 text-black text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-2xl"><Check size={40} className="text-[#E5D0AC]"/></div>
                    <h2 style={serifFont} className="text-5xl font-black mb-2">SUBLIME.</h2>
                    <p className="text-sm font-bold opacity-70 mb-12 uppercase tracking-widest">Transaction Réussie</p>
                    <button onClick={onFinish} className="w-full py-5 border-2 border-black text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/5">Terminer</button>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: CREATOR STUDIO (ESPACE PRO) ---
const CreatorStudio = ({ onFinish, onBack }) => {
    const [preview, setPreview] = useState({ 
        name: '', category: 'Barber', rating: '5.0', reviews: 0, cover: null, 
        location: '', acceptsMobile: false, acceptsStudio: false,
        bio: '', services: [] 
    });
    const [step, setStep] = useState(1);
    const fileRef = useRef(null);
    const update = (k, v) => setPreview(p => ({...p, [k]: v}));

    return (
        <div className="h-screen bg-[#020202] text-white flex flex-col font-sans overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#020202]">
                <span className="font-black tracking-widest text-xs text-zinc-400">ESPACE CRÉATEUR</span>
                <button onClick={onBack}><X className="text-zinc-500 hover:text-white"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h2 style={serifFont} className="text-3xl text-white mb-6">Votre Profil Talent.</h2>
                        <div onClick={() => fileRef.current.click()} className="w-full h-40 bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#E5D0AC] transition mb-6 overflow-hidden relative">
                             {preview.cover ? <img src={preview.cover} className="w-full h-full object-cover"/> : <><Camera className="mb-2 text-zinc-500"/><span className="text-[10px] uppercase font-bold text-zinc-500">Photo de Couverture</span></>}
                             <input type="file" ref={fileRef} onChange={(e) => e.target.files[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/>
                        </div>
                        <div className="space-y-4">
                            <input placeholder="Votre Nom (ou Nom d'artiste)" onChange={e=>update('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-white outline-none"/>
                            <div className="flex gap-2">
                                <select className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-zinc-300 outline-none flex-1" onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option></select>
                                <input placeholder="Ville de base" onChange={e=>update('location', e.target.value)} className="flex-[2] bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none"/>
                            </div>
                            
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">Modes de travail</span>
                                <div className="flex gap-4">
                                    <button onClick={() => update('acceptsMobile', !preview.acceptsMobile)} className={`flex-1 py-3 rounded-lg border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${preview.acceptsMobile ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-transparent border-white/10 text-zinc-500'}`}><Briefcase size={16}/> Je me déplace</button>
                                    <button onClick={() => update('acceptsStudio', !preview.acceptsStudio)} className={`flex-1 py-3 rounded-lg border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${preview.acceptsStudio ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-transparent border-white/10 text-zinc-500'}`}><Home size={16}/> Home Studio</button>
                                </div>
                            </div>

                            <textarea placeholder="Votre Bio : Parlez de votre style, votre expérience..." onChange={e=>update('bio', e.target.value)} className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium text-white outline-none resize-none"/>
                        </div>
                        <button onClick={()=>setStep(2)} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs mt-6">Suivant</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h2 style={serifFont} className="text-3xl text-white mb-6">Vos Prestations.</h2>
                        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                            {PRESETS[preview.category]?.map((p, i) => (
                                <button key={i} onClick={() => update('services', [...preview.services, {...p, id: Date.now()}])} className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 hover:bg-white/10 transition">+ {p.name}</button>
                            ))}
                        </div>
                        <div className="space-y-3 mb-8">
                            {preview.services.map((s, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                    <div><div className="font-bold text-sm text-white">{s.name}</div><div className="text-[10px] text-zinc-500">{s.price}.- • {s.time} min</div></div>
                                    <button onClick={()=>update('services', preview.services.filter((_,x)=>x!==i))} className="text-zinc-600 hover:text-red-500"><X size={16}/></button>
                                </div>
                            ))}
                            {preview.services.length === 0 && <div className="text-center py-8 text-zinc-600 text-xs italic">Aucune prestation ajoutée.</div>}
                        </div>
                        <button onClick={() => onFinish(preview)} className="w-full py-5 bg-[#E5D0AC] text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#E5D0AC]/20">Lancer mon activité</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTS: INTRO & CARD ---
const EtherealIntro = ({ onEnter, onPro }) => (
    <div className="relative h-screen w-full bg-[#050505] overflow-hidden flex flex-col justify-between font-sans">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-60 grayscale animate-pulse-slow"/>
        <div className="absolute inset-0 bg-black/40"/>
        <div className="relative z-10 p-6 flex justify-between items-center pt-12">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/><span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Suisse</span></div>
            <button onClick={onPro} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/20 transition">Espace Créateur</button>
        </div>
        <div className="relative z-10 px-6"><h1 style={serifFont} className="text-7xl text-white leading-[0.85] tracking-tighter mb-4 mix-blend-overlay opacity-90">FREE<br/>DOM.</h1><p className="text-zinc-300 text-sm font-medium border-l-[1.5px] border-emerald-500 pl-4 max-w-xs">La plateforme des talents indépendants. Réservez l'élite, chez vous ou au studio.</p></div>
        <div className="relative z-10 p-6 pb-12"><button onClick={onEnter} className="w-full h-20 bg-white text-black rounded-[32px] flex items-center justify-between px-2 pl-8 hover:scale-[1.01] transition-transform"><span className="text-xs font-black uppercase tracking-[0.2em]">Explorer</span><div className="h-16 w-16 bg-black text-white rounded-[24px] flex items-center justify-center"><ArrowUpRight size={24}/></div></button></div>
    </div>
);

const ArtistCard = ({ artist, onSelect }) => (
    <div onClick={() => onSelect(artist)} className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden mb-6 group cursor-pointer shadow-2xl border border-white/5">
        <img src={artist.cover} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"/>
        <div className="absolute top-4 left-4 flex gap-2">
            {artist.acceptsMobile && <div className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1"><Briefcase size={10}/> Mobile</div>}
            {artist.acceptsStudio && <div className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1"><Home size={10}/> Studio</div>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 style={serifFont} className="text-4xl text-white leading-none mb-2 tracking-tight">{artist.name}</h3>
            <div className="flex justify-between items-end"><div className="text-zinc-300 text-xs font-medium">{artist.location}</div><div style={serifFont} className="text-2xl text-white">dès {artist.priceStart}.-</div></div>
        </div>
    </div>
);

// --- MAIN APP ---
export default function App() {
  const [view, setView] = useState('intro');
  const [activeCat, setActiveCat] = useState('Barber');
  const [artists, setArtists] = useState(INITIAL_ARTISTS);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [cart, setCart] = useState([]);
  
  // BOOKING STATES
  const [bookingStep, setBookingStep] = useState('selection'); // selection, location, datetime, identity, pending, booked
  const [locationType, setLocationType] = useState(null); // 'client' or 'pro'
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showMirror, setShowMirror] = useState(false);

  const handleProDeploy = (newArtist) => {
      if(newArtist) {
          const artistWithId = { ...newArtist, id: Date.now(), verified: true, priceStart: newArtist.services[0]?.price || 0 };
          setArtists(prev => [artistWithId, ...prev]);
          setView('app');
      } else {
          setView('intro');
      }
  };

  const handleRequest = () => {
      setBookingStep('pending');
      setTimeout(() => setBookingStep('booked'), 3000);
  };

  const closeDetail = () => {
      setSelectedArtist(null); setCart([]); setBookingStep('selection'); setLocationType(null); setSelectedDate(null); setSelectedTime(null); setClientInfo({name:'', phone:'', address:''});
  };

  if (view === 'intro') return <EtherealIntro onEnter={() => setView('app')} onPro={() => setView('pro')} />;
  if (view === 'pro') return <CreatorStudio onFinish={handleProDeploy} onBack={() => setView('intro')} />;

  return (
    <div className="bg-[#020202] min-h-screen text-white font-sans selection:bg-indigo-500 relative">
        {showMirror && <MirrorProtocol amount={cart.reduce((a,b)=>a+Number(b.price),0)} onFinish={() => { setShowMirror(false); closeDetail(); }} onClose={() => setShowMirror(false)} />}

        <div className="sticky top-0 z-30 px-6 py-4 pt-6 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
            <h1 style={serifFont} className="text-2xl text-white tracking-tight">NEXUS.</h1>
            <button onClick={() => setView('intro')} className="text-zinc-500 hover:text-white"><X size={20}/></button>
        </div>

        <div className="pb-32 px-6 pt-8">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8">{CATEGORIES.map(cat => (<button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${activeCat === cat.id ? 'bg-white text-black border-white' : 'bg-transparent border-zinc-800/50 text-zinc-500'}`}><cat.icon size={14}/><span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span></button>))}</div>
            {artists.filter(a => activeCat === 'Barber' ? a.category === 'Barber' : true).map(artist => (<ArtistCard key={artist.id} artist={artist} onSelect={setSelectedArtist} />))}
        </div>

        {selectedArtist && (
            <div className="fixed inset-0 z-50 bg-[#020202] flex flex-col">
                <div className="relative w-full flex-shrink-0" style={{ height: bookingStep === 'selection' ? '40vh' : '20vh' }}>
                    <img src={selectedArtist.cover} className="w-full h-full object-cover transition-all duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent"/>
                    <button onClick={closeDetail} className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white z-20"><ChevronLeft size={20}/></button>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h2 style={serifFont} className="text-4xl text-white mb-2 leading-none tracking-tight">{selectedArtist.name}</h2>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {bookingStep === 'selection' ? 'MENU' : bookingStep === 'location' ? 'LIEU' : bookingStep === 'datetime' ? 'DATE' : 'VALIDATION'}
                        </p>
                    </div>
                </div>

                {/* ETAPE 1 : SERVICES */}
                {bookingStep === 'selection' && (
                    <div className="flex-1 overflow-y-auto px-8 pt-4 pb-40">
                        <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-8 border-l-[2px] border-emerald-500/30 pl-4">{selectedArtist.bio}</p>
                        <div className="space-y-4">{selectedArtist.services.map(s => {
                            const active = cart.includes(s);
                            return (
                                <button key={s.id} onClick={() => { if(!cart.includes(s)) setCart([...cart, s]); else setCart(cart.filter(x=>x!==s)); }} className={`w-full p-6 rounded-[24px] border text-left flex justify-between items-center transition-all duration-300 group ${active ? 'border-[#E5D0AC]/50 bg-white/5' : 'bg-transparent border-zinc-800'}`}>
                                    <div><div className={`font-bold text-lg mb-1 ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.name}</div><div className="text-[10px] text-zinc-500">{s.time} min</div></div>
                                    <div style={serifFont} className={`text-2xl ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.price}.-</div>
                                </button>
                            );
                        })}</div>
                        {cart.length > 0 && <div className="fixed bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent z-50"><button onClick={() => setBookingStep('location')} className="w-full h-20 bg-white text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs flex items-center justify-center gap-4">Choisir le Lieu <ArrowRight size={16}/></button></div>}
                    </div>
                )}

                {/* ETAPE 2 : LIEU (CRUCIAL POUR FREELANCE) */}
                {bookingStep === 'location' && (
                    <div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in">
                        <h3 className="text-white font-bold text-lg mb-6">Où se déroule la prestation ?</h3>
                        <div className="space-y-4 mb-8">
                            {selectedArtist.acceptsMobile && (
                                <button onClick={() => setLocationType('client')} className={`w-full p-6 rounded-3xl border text-left flex items-center gap-4 transition-all ${locationType === 'client' ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center"><Home size={20}/></div>
                                    <div><div className="font-bold text-sm uppercase tracking-widest">Chez Moi</div><div className="text-[10px] opacity-70">Le talent se déplace à votre domicile</div></div>
                                </button>
                            )}
                            {selectedArtist.acceptsStudio && (
                                <button onClick={() => setLocationType('pro')} className={`w-full p-6 rounded-3xl border text-left flex items-center gap-4 transition-all ${locationType === 'pro' ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center"><Briefcase size={20}/></div>
                                    <div><div className="font-bold text-sm uppercase tracking-widest">Chez {selectedArtist.name}</div><div className="text-[10px] opacity-70">Vous allez au studio du talent</div></div>
                                </button>
                            )}
                        </div>
                        <button disabled={!locationType} onClick={() => setBookingStep('datetime')} className="w-full h-20 bg-white disabled:opacity-50 text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs mt-auto mb-8 flex items-center justify-center">Suivant</button>
                    </div>
                )}

                {/* ETAPE 3 : DATE & HEURE */}
                {bookingStep === 'datetime' && (
                    <div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in">
                        <div className="mb-6"><h3 className="text-zinc-500 font-bold text-[10px] mb-4 uppercase tracking-widest">Jour</h3><div className="flex gap-3 overflow-x-auto pb-2">{['Auj', 'Dem', 'Lun', 'Mar'].map(d=><button key={d} onClick={()=>setSelectedDate(d)} className={`px-6 py-4 rounded-xl border text-xs font-bold ${selectedDate===d?'bg-[#E5D0AC] text-black':'bg-white/5 text-zinc-500'}`}>{d}</button>)}</div></div>
                        <div className="mb-6"><h3 className="text-zinc-500 font-bold text-[10px] mb-4 uppercase tracking-widest">Heure</h3><div className="grid grid-cols-3 gap-3">{['10:00','11:00','14:00','16:00'].map(t=><button key={t} onClick={()=>setSelectedTime(t)} className={`py-4 rounded-xl border text-xs font-bold ${selectedTime===t?'bg-white text-black':'bg-white/5 text-zinc-500'}`}>{t}</button>)}</div></div>
                        <button disabled={!selectedTime || !selectedDate} onClick={() => setBookingStep('identity')} className="w-full h-20 bg-white disabled:opacity-50 text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs mt-auto mb-8 flex items-center justify-center">Suivant</button>
                    </div>
                )}

                {/* ETAPE 4 : IDENTITÉ & VALIDATION */}
                {bookingStep === 'identity' && (
                    <div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in">
                        <div className="space-y-4 mb-8">
                            <input placeholder="Prénom Nom" onChange={e=>setClientInfo({...clientInfo, name:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none"/>
                            <input placeholder="Téléphone" onChange={e=>setClientInfo({...clientInfo, phone:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none"/>
                            {locationType === 'client' && <input placeholder="Adresse Complète" onChange={e=>setClientInfo({...clientInfo, address:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none"/>}
                        </div>
                        <button disabled={!clientInfo.name || !clientInfo.phone} onClick={handleRequest} className="w-full h-20 bg-[#E5D0AC] text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs mt-auto mb-8 shadow-[0_0_30px_rgba(229,208,172,0.3)]">Envoyer la Demande</button>
                    </div>
                )}

                {/* ETAPE 5 : PENDING */}
                {bookingStep === 'pending' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in">
                        <div className="w-16 h-16 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-6"><div className="w-10 h-10 bg-zinc-800 rounded-full animate-pulse"/></div>
                        <h3 className="text-lg font-bold text-white mb-2 text-center">En attente de {selectedArtist.name}...</h3>
                        <p className="text-zinc-500 text-xs text-center">Le talent vérifie ses disponibilités.</p>
                    </div>
                )}

                {/* ETAPE 6 : BOOKED & MIRROR */}
                {bookingStep === 'booked' && (
                    <div className="flex-1 px-8 pt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8">
                        <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500"/>
                            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20"><Check size={20}/></div>
                            <h3 className="text-xl font-black text-white mb-1">Confirmé !</h3>
                            <p className="text-zinc-400 text-xs mb-6">{selectedDate} à {selectedTime} • {locationType === 'client' ? 'À Domicile' : 'Au Studio'}</p>
                            <div className="space-y-2 border-t border-white/5 pt-4">
                                {cart.map(s => (<div key={s.id} className="flex justify-between text-sm text-zinc-300"><span>{s.name}</span><span>{s.price}.-</span></div>))}
                                <div className="flex justify-between text-lg font-black pt-2 text-[#E5D0AC]"><span>Total</span><span>{cart.reduce((a,b)=>a+Number(b.price),0)}.-</span></div>
                            </div>
                        </div>
                        <div className="w-full mt-auto pb-12">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mb-4">À la fin de la prestation</p>
                            <button onClick={() => setShowMirror(true)} className="w-full h-20 bg-[#E5D0AC] text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs shadow-[0_15px_40px_-10px_rgba(229,208,172,0.5)] flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform"><Camera size={20}/> Payer (Mirror)</button>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}
