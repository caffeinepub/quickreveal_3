import React, { useState, useRef } from 'react';
import { 
  MapPin, ArrowRight, X, Scissors, Sparkles, Feather, Zap, 
  ChevronLeft, ArrowUpRight, Home, Gem, Camera, Check, Navigation, Briefcase, Plus, Trash2, Globe
} from 'lucide-react';

// --- STYLE UTILS ---
const serifFont = { fontFamily: '"Times New Roman", Didot, serif', letterSpacing: '-0.03em' };

// --- LOGIC UTILS ---
const CITIES = ["Lausanne", "Genève", "Fribourg", "Neuchâtel", "Montreux", "Sion"];

// Simulation de distance matricielle (juste pour la démo)
const getDistance = (userCity, proCity) => {
    if (userCity === proCity) return 1.2; // Même ville
    if ((userCity === "Lausanne" && proCity === "Genève") || (userCity === "Genève" && proCity === "Lausanne")) return 62;
    if ((userCity === "Lausanne" && proCity === "Montreux") || (userCity === "Montreux" && proCity === "Lausanne")) return 25;
    return 45; // Défaut
};

const generateDates = () => {
    const dates = [];
    const today = new Date();
    for(let i=0; i<5; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({ label: i === 0 ? 'Auj' : i === 1 ? 'Dem' : d.toLocaleDateString('fr-FR', {weekday:'short'}), fullDate: d, isToday: i === 0 });
    }
    return dates;
};

const generateSlots = (isToday) => {
    const allSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    if (!isToday) return allSlots.map(t => ({ time: t, available: true }));
    const nowHour = new Date().getHours();
    return allSlots.map(t => ({ time: t, available: parseInt(t.split(':')[0]) > nowHour }));
};

const SWISS_ADDRESSES = ["Rue de Bourg, Lausanne", "Place St-François, Lausanne", "Gare Cornavin, Genève", "Rue du Rhône, Genève", "Bahnhofstrasse, Zurich"];

// --- DATA INITIALE ---
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
    city: "Lausanne", location: "Lausanne Flon", type: "Mobile & Studio",
    acceptsMobile: true, acceptsStudio: true,
    priceStart: 40, instagram: "@juju_barber",
    bio: "Barbier indépendant. Studio privé au Flon ou déplacement VIP.",
    services: [{ id: 1, name: "Coupe & Barbe", studioPrice: 40, mobilePrice: 60, time: 45 }]
  },
  {
    id: 2, name: "SARAH NAILS", category: "Onglerie", rating: "4.9", reviews: 18, verified: true,
    cover: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    city: "Genève", location: "Genève Eaux-Vives", type: "Mobile Uniquement",
    acceptsMobile: true, acceptsStudio: false,
    priceStart: 80, instagram: "@sarah_nails",
    bio: "Prothésiste ongulaire de stars. Je traverse la Suisse pour vous.",
    services: [{ id: 1, name: "Semi-Permanent", studioPrice: 0, mobilePrice: 80, time: 45 }]
  },
  {
    id: 3, name: "MAGESTE LABS", category: "Barber", rating: "4.8", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    city: "Lausanne", location: "Payerne / Lausanne", type: "Studio Only",
    acceptsMobile: false, acceptsStudio: true,
    priceStart: 30, instagram: "@mageste",
    bio: "L'art du rasage royal. Une précision chirurgicale.",
    services: [{ id: 1, name: "Dégradé Supreme", studioPrice: 30, mobilePrice: 0, time: 45 }]
  }
];

const PRESETS = {
    Barber: [{name:"Coupe Homme", studioPrice:"30", mobilePrice:"50", time:"30"}],
    Onglerie: [{name:"Semi-Permanent", studioPrice:"50", mobilePrice:"70", time:"45"}],
    Coiffure: [{name:"Brushing", studioPrice:"40", mobilePrice:"60", time:"30"}],
    Esthétique: [{name:"Soin Visage", studioPrice:"80", mobilePrice:"120", time:"60"}]
};

// --- COMPONENTS ---

const MirrorProtocol = ({ onFinish, onClose, amount }) => {
    const [step, setStep] = useState('camera'); 
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const handleRecord = () => { setStep('recording'); setTimeout(() => setStep('review'), 2000); };
    const startHold = () => { if(step !== 'review') return; intervalRef.current = setInterval(() => { setProgress(p => { if (p >= 100) { clearInterval(intervalRef.current); setStep('success'); return 100; } return p + 4; }); }, 16); };
    const endHold = () => { clearInterval(intervalRef.current); if (progress < 100) setProgress(0); };
    return (
        <div className="fixed inset-0 z-[80] bg-black flex flex-col font-sans">
            {step === 'camera' && (<div className="flex-1 relative flex flex-col justify-end p-8"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351431202-6e0000000000?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 grayscale"/><div className="relative z-10 text-center space-y-8"><h3 className="text-white font-bold text-sm uppercase tracking-widest">Encaissement Sécurisé</h3><p className="text-zinc-400 text-xs">Filmez le résultat pour débloquer les fonds ({amount}.-)</p><button onClick={handleRecord} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mx-auto"><div className="w-16 h-16 bg-red-500 rounded-full"/></button></div><button onClick={onClose} className="absolute top-6 right-6 text-white"><X/></button></div>)}
            {step === 'recording' && <div className="flex-1 flex items-center justify-center flex-col"><div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"/><p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Sécurisation...</p></div>}
            {step === 'review' && (<div className="flex-1 relative" onMouseDown={startHold} onMouseUp={endHold} onTouchStart={startHold} onTouchEnd={endHold}><div className="absolute inset-0"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKrEzvLbsVAud8I/giphy.gif" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"/></div><div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col items-center"><div className="relative mb-6"><svg className="w-24 h-24 rotate-[-90deg]"><circle cx="48" cy="48" r="46" stroke="#333" strokeWidth="4" fill="none"/><circle cx="48" cy="48" r="46" stroke="#E5D0AC" strokeWidth="4" fill="none" strokeDasharray="289" strokeDashoffset={289 - (289 * progress) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.016s linear' }}/></svg><div className="absolute inset-0 flex items-center justify-center"><div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all ${progress > 0 ? 'scale-90' : 'scale-100 animate-pulse'}`}><Gem size={24} className={progress > 0 ? "text-[#E5D0AC]" : "text-white"}/></div></div></div><p className="text-white font-black text-sm uppercase tracking-widest mb-1">Maintenir pour Valider</p><p className="text-zinc-400 text-[10px]">Montant à payer : {amount}.-</p></div></div>)}
            {step === 'success' && (<div className="flex-1 bg-[#E5D0AC] flex flex-col items-center justify-center p-8 text-black text-center animate-in zoom-in duration-500"><div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-2xl"><Check size={40} className="text-[#E5D0AC]"/></div><h2 style={serifFont} className="text-5xl font-black mb-2">SUBLIME.</h2><p className="text-sm font-bold opacity-70 mb-12 uppercase tracking-widest">Transaction Réussie</p><button onClick={onFinish} className="w-full py-5 border-2 border-black text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/5">Terminer</button></div>)}
        </div>
    );
};

const CreatorStudio = ({ onFinish, onBack }) => {
    const [preview, setPreview] = useState({ name: '', category: 'Barber', rating: '5.0', reviews: 0, cover: null, city: 'Lausanne', acceptsMobile: false, acceptsStudio: false, bio: '', services: [] });
    const [step, setStep] = useState(1);
    const [editingService, setEditingService] = useState(null);
    const fileRef = useRef(null);
    const update = (k, v) => setPreview(p => ({...p, [k]: v}));

    return (
        <div className="h-screen bg-[#020202] text-white flex flex-col font-sans overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#020202]"><span className="font-black tracking-widest text-xs text-zinc-400">ESPACE CRÉATEUR</span><button onClick={onBack}><X className="text-zinc-500 hover:text-white"/></button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h2 style={serifFont} className="text-3xl text-white mb-6">Profil & Ville.</h2>
                        <div onClick={() => fileRef.current.click()} className="w-full h-40 bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#E5D0AC] transition mb-6 overflow-hidden relative">{preview.cover ? <img src={preview.cover} className="w-full h-full object-cover"/> : <><Camera className="mb-2 text-zinc-500"/><span className="text-[10px] uppercase font-bold text-zinc-500">Photo de Couverture</span></>}<input type="file" ref={fileRef} onChange={(e) => e.target.files[0] && update('cover', URL.createObjectURL(e.target.files[0]))} className="hidden"/></div>
                        <div className="space-y-4">
                            <input placeholder="Nom d'artiste" onChange={e=>update('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-white outline-none"/>
                            <div className="flex gap-2">
                                <select className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-zinc-300 outline-none flex-1" onChange={e=>update('category', e.target.value)}><option>Barber</option><option>Coiffure</option><option>Onglerie</option></select>
                                <select className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none flex-[2]" onChange={e=>update('city', e.target.value)} value={preview.city}>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">Zone d'intervention</span>
                                <div className="flex gap-4 mb-4">
                                    <button onClick={() => update('acceptsMobile', !preview.acceptsMobile)} className={`flex-1 py-3 rounded-lg border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${preview.acceptsMobile ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500'}`}><Briefcase size={16}/> Mobile</button>
                                    <button onClick={() => update('acceptsStudio', !preview.acceptsStudio)} className={`flex-1 py-3 rounded-lg border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${preview.acceptsStudio ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500'}`}><Home size={16}/> Studio</button>
                                </div>
                            </div>
                            <textarea placeholder="Votre Bio..." onChange={e=>update('bio', e.target.value)} className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium text-white outline-none resize-none"/>
                        </div>
                        <button onClick={()=>setStep(2)} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs mt-6">Suivant</button>
                    </div>
                )}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h2 style={serifFont} className="text-3xl text-white mb-6">Tarification.</h2>
                        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">{PRESETS[preview.category]?.map((p, i) => (<button key={i} onClick={() => setEditingService({...p, id: Date.now()})} className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 hover:bg-white/10 transition">+ {p.name}</button>))}</div>
                        {editingService && (<div className="bg-zinc-900 border border-[#E5D0AC] rounded-xl p-4 mb-4 space-y-3 animate-in fade-in"><div className="flex justify-between"><span className="text-xs font-bold text-[#E5D0AC]">Édition: {editingService.name}</span><button onClick={()=>setEditingService(null)}><X size={14}/></button></div><div className="grid grid-cols-2 gap-3"><div><label className="text-[9px] text-zinc-500 uppercase font-bold">Prix Studio</label><input type="number" value={editingService.studioPrice} onChange={e=>setEditingService({...editingService, studioPrice:e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-2 text-white text-sm font-bold"/></div><div><label className="text-[9px] text-zinc-500 uppercase font-bold">Prix Domicile</label><input type="number" value={editingService.mobilePrice} onChange={e=>setEditingService({...editingService, mobilePrice:e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-2 text-white text-sm font-bold"/></div></div><button onClick={() => { update('services', [...preview.services, editingService]); setEditingService(null); }} className="w-full py-3 bg-[#E5D0AC] text-black text-xs font-bold rounded-lg uppercase">Ajouter</button></div>)}
                        <div className="space-y-3 mb-8">{preview.services.map((s, i) => (<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="flex justify-between items-center mb-2"><div className="font-bold text-sm text-white">{s.name}</div><button onClick={()=>update('services', preview.services.filter((_,x)=>x!==i))} className="text-zinc-600 hover:text-red-500"><Trash2 size={14}/></button></div><div className="flex gap-4 text-[10px] text-zinc-400"><div className="flex items-center gap-1"><Home size={10}/> Studio: <span className="text-white font-bold">{s.studioPrice}.-</span></div><div className="flex items-center gap-1"><Briefcase size={10}/> Mobile: <span className="text-white font-bold">{s.mobilePrice}.-</span></div></div></div>))}</div>
                        <button onClick={() => onFinish(preview)} className="w-full py-5 bg-[#E5D0AC] text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#E5D0AC]/20">Lancer mon activité</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ArtistCard = ({ artist, onSelect, distance }) => (
    <div onClick={() => onSelect(artist)} className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden mb-6 group cursor-pointer shadow-2xl border border-white/5">
        <img src={artist.cover} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"/>
        
        {/* BADGES INTELLIGENTS */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
             <div className={`px-3 py-1.5 backdrop-blur-xl border rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${distance < 15 ? 'bg-[#E5D0AC] border-[#E5D0AC] text-black' : 'bg-black/60 border-white/10 text-white'}`}>
                {distance < 15 ? <MapPin size={10} className="fill-black"/> : <Navigation size={10}/>} 
                {distance < 2 ? 'À Proximité' : `${distance} km`}
            </div>
            {distance > 15 && artist.acceptsMobile && (
                 <div className="px-3 py-1.5 bg-white/20 border border-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                    <Globe size={10}/> Se déplace
                </div>
            )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 style={serifFont} className="text-4xl text-white leading-none mb-2 tracking-tight">{artist.name}</h3>
            <div className="flex justify-between items-end"><div className="text-zinc-300 text-xs font-medium">{artist.location}</div><div style={serifFont} className="text-2xl text-white">dès {artist.priceStart}.-</div></div>
        </div>
    </div>
);

const EtherealIntro = ({ onEnter, onPro }) => (
    <div className="relative h-screen w-full bg-[#050505] overflow-hidden flex flex-col justify-between font-sans">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-60 grayscale animate-pulse-slow"/>
        <div className="absolute inset-0 bg-black/40"/>
        <div className="relative z-10 p-6 flex justify-between items-center pt-12"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/><span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Suisse</span></div><button onClick={onPro} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/20 transition">Espace Créateur</button></div>
        <div className="relative z-10 px-6"><h1 style={serifFont} className="text-7xl text-white leading-[0.85] tracking-tighter mb-4 mix-blend-overlay opacity-90">OMNI<br/>PRESENCE.</h1><p className="text-zinc-300 text-sm font-medium border-l-[1.5px] border-emerald-500 pl-4 max-w-xs">Partout où vous êtes, l'excellence vous suit. Changez de ville, changez de style.</p></div>
        <div className="relative z-10 p-6 pb-12"><button onClick={onEnter} className="w-full h-20 bg-white text-black rounded-[32px] flex items-center justify-between px-2 pl-8 hover:scale-[1.01] transition-transform"><span className="text-xs font-black uppercase tracking-[0.2em]">Entrer</span><div className="h-16 w-16 bg-black text-white rounded-[24px] flex items-center justify-center"><ArrowUpRight size={24}/></div></button></div>
    </div>
);

// --- MAIN APP ---
export default function App() {
  const [view, setView] = useState('intro');
  const [activeCat, setActiveCat] = useState('Barber');
  const [artists, setArtists] = useState(INITIAL_ARTISTS);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [cart, setCart] = useState([]);
  const [bookingStep, setBookingStep] = useState('selection');
  const [locationType, setLocationType] = useState(null);
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showMirror, setShowMirror] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  
  // LOCATION STATE
  const [userCity, setUserCity] = useState("Lausanne");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // LOGIC
  const dates = generateDates();
  const timeSlots = selectedDate ? generateSlots(selectedDate.isToday) : [];

  // FILTERED & SORTED ARTISTS
  const getCategorizedArtists = () => {
      const filtered = artists.filter(a => activeCat === 'Barber' ? a.category === 'Barber' : true);
      const withDistance = filtered.map(a => ({...a, currentDistance: getDistance(userCity, a.city)}));
      
      const local = withDistance.filter(a => a.currentDistance < 20).sort((a,b) => a.currentDistance - b.currentDistance);
      const others = withDistance.filter(a => a.currentDistance >= 20).sort((a,b) => a.currentDistance - b.currentDistance);
      
      return { local, others };
  };

  const { local, others } = getCategorizedArtists();

  const handleProDeploy = (newArtist) => {
      if(newArtist) {
          const artistWithId = { ...newArtist, id: Date.now(), verified: true, priceStart: newArtist.services[0]?.studioPrice || 0 };
          setArtists(prev => [artistWithId, ...prev]);
          setView('app');
      } else { setView('intro'); }
  };

  const handleRequest = () => { setBookingStep('pending'); setTimeout(() => setBookingStep('booked'), 3000); };
  const closeDetail = () => { setSelectedArtist(null); setCart([]); setBookingStep('selection'); setLocationType(null); setSelectedDate(null); setSelectedTime(null); setClientInfo({name:'', phone:'', address:''}); };
  const getTotal = () => { if (!locationType) return cart.reduce((a,b)=>a+Number(b.studioPrice),0); return cart.reduce((a,b) => a + Number(locationType === 'client' ? b.mobilePrice : b.studioPrice), 0); };
  const handleAddressType = (val) => { setClientInfo({...clientInfo, address: val}); if(val.length > 3) setAddressSuggestions(SWISS_ADDRESSES.filter(a => a.toLowerCase().includes(val.toLowerCase()))); else setAddressSuggestions([]); };
  const selectAddress = (addr) => { setClientInfo({...clientInfo, address: addr}); setAddressSuggestions([]); };

  if (view === 'intro') return <EtherealIntro onEnter={() => setView('app')} onPro={() => setView('pro')} />;
  if (view === 'pro') return <CreatorStudio onFinish={handleProDeploy} onBack={() => setView('intro')} />;

  return (
    <div className="bg-[#020202] min-h-screen text-white font-sans selection:bg-indigo-500 relative">
        {showMirror && <MirrorProtocol amount={getTotal()} onFinish={() => { setShowMirror(false); closeDetail(); }} onClose={() => setShowMirror(false)} />}

        {/* HEADER LOCATION */}
        <div className="sticky top-0 z-30 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5">
            <div className="px-6 py-4 pt-6 flex justify-between items-center">
                <div onClick={() => setShowLocationPicker(!showLocationPicker)} className="flex items-center gap-2 cursor-pointer group">
                    <MapPin size={16} className="text-[#E5D0AC]"/>
                    <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Actuellement à</div>
                        <div className="text-sm font-bold text-white group-hover:text-[#E5D0AC] transition flex items-center gap-1">{userCity} <ChevronLeft size={12} className="rotate-[-90deg]"/></div>
                    </div>
                </div>
                <button onClick={() => setView('intro')} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            
            {/* LOCATION PICKER DROPDOWN */}
            {showLocationPicker && (
                <div className="overflow-hidden bg-[#111] border-b border-white/10 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 grid grid-cols-2 gap-2">
                        {CITIES.map(c => (
                            <button key={c} onClick={() => { setUserCity(c); setShowLocationPicker(false); }} className={`p-3 rounded-lg text-xs font-bold text-left transition ${userCity === c ? 'bg-[#E5D0AC] text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="pb-32 px-6 pt-6">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8">{CATEGORIES.map(cat => (<button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${activeCat === cat.id ? 'bg-white text-black border-white' : 'bg-transparent border-zinc-800/50 text-zinc-500'}`}><cat.icon size={14}/><span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span></button>))}</div>
            
            {/* LOCAL SECTION */}
            {local.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-[#E5D0AC] rounded-full animate-pulse"/>
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Autour de vous</h3>
                    </div>
                    {local.map(artist => (<ArtistCard key={artist.id} artist={artist} onSelect={setSelectedArtist} distance={artist.currentDistance} />))}
                </div>
            )}

            {/* OTHERS SECTION */}
            {others.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4 pt-4 border-t border-white/5">
                        <Globe size={12} className="text-zinc-600"/>
                        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Ailleurs en Suisse</h3>
                    </div>
                    {others.map(artist => (<ArtistCard key={artist.id} artist={artist} onSelect={setSelectedArtist} distance={artist.currentDistance} />))}
                </div>
            )}
        </div>

        {/* DETAIL MODAL (COPIED & CLEANED) */}
        {selectedArtist && (
            <div className="fixed inset-0 z-50 bg-[#020202] flex flex-col animate-in fade-in slide-in-from-bottom-8">
                <div className="relative w-full flex-shrink-0" style={{ height: bookingStep === 'selection' ? '35vh' : '15vh' }}>
                    <img src={selectedArtist.cover} className="w-full h-full object-cover transition-all duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent"/>
                    <button onClick={closeDetail} className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white z-20"><ChevronLeft size={20}/></button>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h2 style={serifFont} className="text-3xl text-white mb-2 leading-none tracking-tight">{selectedArtist.name}</h2>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{bookingStep}</p>
                    </div>
                </div>
                {bookingStep === 'selection' && (<div className="flex-1 overflow-y-auto px-8 pt-4 pb-40"><p className="text-sm text-zinc-300 font-medium leading-relaxed mb-8 border-l-[2px] border-emerald-500/30 pl-4">{selectedArtist.bio}</p><div className="space-y-4">{selectedArtist.services.map(s => { const active = cart.includes(s); return (<button key={s.id} onClick={() => { if(!cart.includes(s)) setCart([...cart, s]); else setCart(cart.filter(x=>x!==s)); }} className={`w-full p-5 rounded-[20px] border text-left flex justify-between items-center transition-all duration-300 group ${active ? 'border-[#E5D0AC]/50 bg-white/5' : 'bg-transparent border-zinc-800'}`}><div><div className={`font-bold text-md mb-1 ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.name}</div><div className="text-[10px] text-zinc-500">{s.time} min</div></div><div className="text-right"><div style={serifFont} className={`text-xl ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>dès {s.studioPrice}.-</div><div className="text-[9px] text-zinc-600">Mobile: {s.mobilePrice}.-</div></div></button>); })}</div>{cart.length > 0 && <div className="fixed bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent z-50"><button onClick={() => setBookingStep('location')} className="w-full h-20 bg-white text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs flex items-center justify-center gap-4">Choisir Lieu & Prix <ArrowRight size={16}/></button></div>}</div>)}
                {bookingStep === 'location' && (<div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in"><h3 className="text-white font-bold text-lg mb-6">Lieu de prestation</h3><div className="space-y-4 mb-8">{selectedArtist.acceptsMobile && (<button onClick={() => setLocationType('client')} className={`w-full p-6 rounded-3xl border text-left flex items-center gap-4 transition-all ${locationType === 'client' ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-white/5 border-white/10 text-zinc-400'}`}><div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center"><Briefcase size={20}/></div><div><div className="font-bold text-sm uppercase tracking-widest">Chez Moi</div><div className="text-[10px] opacity-70">Tarif Mobile appliqué</div></div><div className="ml-auto font-black text-lg">{cart.reduce((a,b)=>a+Number(b.mobilePrice),0)}.-</div></button>)}{selectedArtist.acceptsStudio && (<button onClick={() => setLocationType('pro')} className={`w-full p-6 rounded-3xl border text-left flex items-center gap-4 transition-all ${locationType === 'pro' ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-white/5 border-white/10 text-zinc-400'}`}><div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center"><Home size={20}/></div><div><div className="font-bold text-sm uppercase tracking-widest">Au Studio</div><div className="text-[10px] opacity-70">Tarif Standard</div></div><div className="ml-auto font-black text-lg">{cart.reduce((a,b)=>a+Number(b.studioPrice),0)}.-</div></button>)}</div><button disabled={!locationType} onClick={() => setBookingStep('datetime')} className="w-full h-20 bg-white disabled:opacity-50 text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs mt-auto mb-8 flex items-center justify-center">Suivant</button></div>)}
                {bookingStep === 'datetime' && (<div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in"><div className="mb-6"><h3 className="text-zinc-500 font-bold text-[10px] mb-4 uppercase tracking-widest">Jour</h3><div className="flex gap-3 overflow-x-auto pb-2">{dates.map(d => (<button key={d.label} onClick={()=>setSelectedDate(d)} className={`px-6 py-4 rounded-xl border text-xs font-bold ${selectedDate?.label===d.label ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-white/5 text-zinc-500'}`}>{d.label}</button>))}</div></div><div className="mb-6"><h3 className="text-zinc-500 font-bold text-[10px] mb-4 uppercase tracking-widest">Heure</h3><div className="grid grid-cols-3 gap-3">{timeSlots.map(s => (<button disabled={!s.available} key={s.time} onClick={()=>setSelectedTime(s.time)} className={`py-4 rounded-xl border text-xs font-bold transition-all ${selectedTime===s.time ? 'bg-white text-black border-white' : s.available ? 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30' : 'bg-transparent border-white/5 text-zinc-800 cursor-not-allowed'}`}>{s.time}</button>))}</div></div><button disabled={!selectedTime || !selectedDate} onClick={() => setBookingStep('identity')} className="w-full h-20 bg-white disabled:opacity-50 text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs mt-auto mb-8 flex items-center justify-center">Suivant</button></div>)}
                {bookingStep === 'identity' && (<div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in"><div className="space-y-4 mb-8"><input placeholder="Prénom Nom" onChange={e=>setClientInfo({...clientInfo, name:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none"/><input placeholder="Téléphone" onChange={e=>setClientInfo({...clientInfo, phone:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none"/>{locationType === 'client' && (<div className="relative"><div className="flex items-center gap-2 mb-2"><Navigation size={12} className="text-[#E5D0AC]"/><span className="text-[10px] font-bold text-[#E5D0AC] uppercase">Adresse Précise Requise</span></div><input placeholder="Rue, NPA, Ville..." value={clientInfo.address} onChange={e=>handleAddressType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-[#E5D0AC] transition"/>{addressSuggestions.length > 0 && (<div className="absolute top-full left-0 right-0 bg-[#111] border border-white/10 rounded-xl mt-2 z-50 overflow-hidden shadow-2xl">{addressSuggestions.map(addr => (<button key={addr} onClick={()=>selectAddress(addr)} className="w-full text-left p-3 text-xs text-zinc-300 hover:bg-white/10 border-b border-white/5 last:border-0">{addr}</button>))}</div>)}</div>)}</div><button disabled={!clientInfo.name || !clientInfo.phone || (locationType === 'client' && !clientInfo.address)} onClick={handleRequest} className="w-full h-20 bg-[#E5D0AC] text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs mt-auto mb-8 shadow-[0_0_30px_rgba(229,208,172,0.3)]">Envoyer la Demande</button></div>)}
                {bookingStep === 'pending' && (<div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in"><div className="w-16 h-16 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-6"><div className="w-10 h-10 bg-zinc-800 rounded-full animate-pulse"/></div><h3 className="text-lg font-bold text-white mb-2 text-center">En attente de {selectedArtist.name}...</h3><p className="text-zinc-500 text-xs text-center">Le talent vérifie ses disponibilités.</p></div>)}
                {bookingStep === 'booked' && (<div className="flex-1 px-8 pt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8"><div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-center relative overflow-hidden"><div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500"/><div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20"><Check size={20}/></div><h3 className="text-xl font-black text-white mb-1">Confirmé !</h3><p className="text-zinc-400 text-xs mb-6">{selectedDate?.label} à {selectedTime} • {locationType === 'client' ? clientInfo.address : 'Au Studio'}</p><div className="space-y-2 border-t border-white/5 pt-4">{cart.map(s => (<div key={s.id} className="flex justify-between text-sm text-zinc-300"><span>{s.name}</span><span>{locationType==='client'?s.mobilePrice:s.studioPrice}.-</span></div>))}<div className="flex justify-between text-lg font-black pt-2 text-[#E5D0AC]"><span>Total</span><span>{getTotal()}.-</span></div></div></div><div className="w-full mt-auto pb-12"><button onClick={() => setShowMirror(true)} className="w-full h-20 bg-[#E5D0AC] text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs shadow-[0_15px_40px_-10px_rgba(229,208,172,0.5)] flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform"><Camera size={20}/> Encaisser (Mirror)</button></div></div>)}
            </div>
        )}
    </div>
  );
}
