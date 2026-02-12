import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, ArrowRight, X, Phone, Scissors, Sparkles, Feather, Zap, 
  CheckCircle2, Star, BadgeCheck, Smartphone, Instagram, Link as LinkIcon, 
  Share2, ChevronLeft, ArrowUpRight, Home, Clock, Gem, Camera, Calendar, Check, Hourglass, User
} from 'lucide-react';

// --- STYLE UTILS ---
const serifFont = { fontFamily: '"Times New Roman", Didot, serif', letterSpacing: '-0.03em' };

// --- DATA ---
const CATEGORIES = [
    { id: 'Barber', label: 'Barber', icon: Scissors },
    { id: 'Coiffure', label: 'Coiffure', icon: Sparkles },
    { id: 'Onglerie', label: 'Onglerie', icon: Feather },
    { id: 'Esthétique', label: 'Esthétique', icon: Zap }
];

const SALONS = [
  {
    id: 1, name: "MAGESTE LABS", category: "Barber", rating: "5.0", reviews: 124, verified: true,
    cover: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    location: "PAYERNE", type: "SALON", distance: "2 KM",
    priceStart: 30, nextSlot: "14:00", instagram: "@mageste", website: "mageste.ch",
    bio: "L'art du rasage royal. Une précision chirurgicale pour une élite exigeante. Nous redéfinissons les codes de l'élégance masculine dans un cadre privé.",
    services: [
        { id: 1, name: "Dégradé Supreme", price: 50, time: 45, desc: "Skin Fade haute précision, finitions lame." },
        { id: 2, name: "Barbe Sculptée", price: 30, time: 20, desc: "Rituel serviette chaude et huiles essentielles." }
    ]
  }
];

// --- COMPONENT: MIRROR PROTOCOL ---
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
        <div className="fixed inset-0 z-[70] bg-black flex flex-col font-sans">
            {step === 'camera' && (
                <div className="flex-1 relative flex flex-col justify-end p-8">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351431202-6e0000000000?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 grayscale"/>
                    <div className="relative z-10 text-center space-y-8">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Le Reveal</h3>
                        <p className="text-zinc-400 text-xs">Filmez le résultat pour valider la prestation.</p>
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
                        <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Maintenir pour Payer</p>
                        <p className="text-zinc-400 text-[10px]">Montant total : {amount}.-</p>
                    </div>
                </div>
            )}
            {step === 'success' && (
                <div className="flex-1 bg-[#E5D0AC] flex flex-col items-center justify-center p-8 text-black text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-2xl"><Check size={40} className="text-[#E5D0AC]"/></div>
                    <h2 style={serifFont} className="text-5xl font-black mb-2">SUBLIME.</h2>
                    <p className="text-sm font-bold opacity-70 mb-12 uppercase tracking-widest">Paiement Validé</p>
                    <button onClick={onFinish} className="w-full py-5 border-2 border-black text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/5">Fermer</button>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTS ---
const EtherealCard = ({ salon, onSelect }) => (
    <div 
        onClick={() => onSelect(salon)}
        className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden mb-6 group cursor-pointer shadow-2xl border border-white/5"
    >
        <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"/>
        <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">{salon.type}</div>
            {salon.verified && <div className="px-3 py-1.5 bg-emerald-500/30 backdrop-blur-xl border border-emerald-400/30 rounded-full text-[9px] font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1"><BadgeCheck size={10}/> Vérifié</div>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 style={serifFont} className="text-4xl text-white leading-none mb-2 tracking-tight">{salon.name}</h3>
            <div className="flex justify-between items-end"><div className="text-zinc-300 text-xs font-medium">{salon.location} • <span className="text-emerald-400">Next: {salon.nextSlot}</span></div><div style={serifFont} className="text-2xl text-white">{salon.priceStart}.-</div></div>
        </div>
    </div>
);

// --- MAIN APP ---
export default function App() {
  const [activeCat, setActiveCat] = useState('Barber');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [cart, setCart] = useState([]);
  const [bookingStep, setBookingStep] = useState('selection'); // selection, datetime, identity, pending, booked
  const [showMirror, setShowMirror] = useState(false);
  
  // FORM DATA
  const [selectedDate, setSelectedDate] = useState('Demain');
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });

  // SLOTS
  const DAYS = ['Aujourd\'hui', 'Demain', 'Mercredi', 'Jeudi'];
  const SLOTS = ['10:00', '11:00', '13:00', '14:30', '16:00', '17:30', '19:00'];

  const handleRequest = () => {
      setBookingStep('pending');
      setTimeout(() => setBookingStep('booked'), 3000); // Simulation acceptation Pro
  };

  const closeDetail = () => {
      setSelectedSalon(null);
      setCart([]);
      setBookingStep('selection');
      setSelectedTime(null);
      setClientInfo({name:'', phone:''});
  };

  return (
    <div className="bg-[#020202] min-h-screen text-white font-sans selection:bg-indigo-500 relative">
        {showMirror && <MirrorProtocol amount={cart.reduce((a,b)=>a+b.price,0)} onFinish={() => { setShowMirror(false); closeDetail(); }} onClose={() => setShowMirror(false)} />}

        <div className="sticky top-0 z-30 px-6 py-4 pt-6 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
            <h1 style={serifFont} className="text-2xl text-white tracking-tight">NEXUS.</h1>
        </div>

        <div className="pb-32 px-6 pt-8">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8">{CATEGORIES.map(cat => (<button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${activeCat === cat.id ? 'bg-white text-black border-white' : 'bg-transparent border-zinc-800/50 text-zinc-500'}`}><cat.icon size={14}/><span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span></button>))}</div>
            {SALONS.map(salon => (<EtherealCard key={salon.id} salon={salon} onSelect={setSelectedSalon} />))}
        </div>

        {/* DÉTAIL MODAL */}
        {selectedSalon && (
            <div className="fixed inset-0 z-50 bg-[#020202] flex flex-col">
                <div className="relative w-full flex-shrink-0" style={{ height: bookingStep === 'selection' ? '40vh' : '20vh' }}>
                    <img src={selectedSalon.cover} className="w-full h-full object-cover transition-all duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent"/>
                    <button onClick={closeDetail} className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white z-20 hover:bg-white hover:text-black transition-all"><ChevronLeft size={20}/></button>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h2 style={serifFont} className="text-4xl text-white mb-2 leading-none tracking-tight">{selectedSalon.name}</h2>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {bookingStep === 'selection' ? 'CARTE DES SOINS' : bookingStep === 'datetime' ? 'DISPONIBILITÉS' : bookingStep === 'identity' ? 'VOS COORDONNÉES' : bookingStep === 'booked' ? 'CONFIRMÉ' : 'EN ATTENTE'}
                        </p>
                    </div>
                </div>

                {/* ETAPE 1 : SELECTION */}
                {bookingStep === 'selection' && (
                    <>
                        <div className="flex-1 overflow-y-auto px-8 pt-4 pb-40">
                            <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-8 border-l-[2px] border-emerald-500/30 pl-4">{selectedSalon.bio}</p>
                            <div className="space-y-4">
                                {selectedSalon.services.map(s => {
                                    const active = cart.includes(s);
                                    return (
                                        <button key={s.id} onClick={() => { if(!cart.includes(s)) setCart([...cart, s]); else setCart(cart.filter(x=>x!==s)); }} className={`w-full p-6 rounded-[24px] border text-left flex justify-between items-center transition-all duration-300 group ${active ? 'border-[#E5D0AC]/50 bg-white/5' : 'bg-transparent border-zinc-800'}`}>
                                            <div><div className={`font-bold text-lg mb-1 ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.name}</div><div className="text-[10px] text-zinc-500">{s.time} min</div></div>
                                            <div style={serifFont} className={`text-2xl ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.price}.-</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {cart.length > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pt-12">
                                <button onClick={() => setBookingStep('datetime')} className="w-full h-20 bg-white text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform">
                                    <Calendar size={20}/> Choisir Créneau ({cart.reduce((a,b)=>a+b.price,0)}.-)
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ETAPE 2 : DATE & TIME (TIME SLOTTING) */}
                {bookingStep === 'datetime' && (
                    <div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in">
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Jour</h3>
                            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                                {DAYS.map(day => (
                                    <button key={day} onClick={() => setSelectedDate(day)} className={`px-6 py-4 rounded-2xl border flex-shrink-0 text-xs font-bold uppercase tracking-wider transition-all ${selectedDate === day ? 'bg-[#E5D0AC] text-black border-[#E5D0AC]' : 'bg-white/5 border-white/10 text-zinc-500'}`}>{day}</button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Heure</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {SLOTS.map(time => (
                                    <button key={time} onClick={() => setSelectedTime(time)} className={`py-4 rounded-xl border text-sm font-bold transition-all ${selectedTime === time ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-400 hover:border-white/30'}`}>{time}</button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pb-8">
                            <button disabled={!selectedTime} onClick={() => setBookingStep('identity')} className="w-full h-20 bg-white disabled:opacity-50 text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs flex items-center justify-center gap-4">
                                Suivant <ArrowRight size={16}/>
                            </button>
                        </div>
                    </div>
                )}

                {/* ETAPE 3 : IDENTITÉ (KYC) */}
                {bookingStep === 'identity' && (
                    <div className="flex-1 px-8 pt-6 flex flex-col animate-in slide-in-from-right-8 fade-in">
                        <p className="text-zinc-400 text-xs mb-8 leading-relaxed">Le professionnel a besoin de ces informations pour valider votre rendez-vous.</p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block mb-2">Prénom & Nom</label>
                                <input value={clientInfo.name} onChange={e=>setClientInfo({...clientInfo, name:e.target.value})} placeholder="Ex: Julien Rossi" className="w-full bg-transparent text-lg text-white font-bold outline-none placeholder:text-zinc-700"/>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block mb-2">Téléphone</label>
                                <input value={clientInfo.phone} onChange={e=>setClientInfo({...clientInfo, phone:e.target.value})} placeholder="Ex: 079 123 45 67" className="w-full bg-transparent text-lg text-white font-bold outline-none placeholder:text-zinc-700"/>
                            </div>
                        </div>

                        <div className="mt-auto pb-8">
                            <button disabled={!clientInfo.name || !clientInfo.phone} onClick={handleRequest} className="w-full h-20 bg-[#E5D0AC] disabled:opacity-50 text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(229,208,172,0.2)]">
                                Confirmer la demande
                            </button>
                        </div>
                    </div>
                )}

                {/* ETAPE 4 : PENDING */}
                {bookingStep === 'pending' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in">
                        <div className="w-20 h-20 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-6"><div className="w-12 h-12 bg-zinc-800 rounded-full animate-pulse"/></div>
                        <h3 className="text-xl font-bold text-white mb-2">Validation en cours...</h3>
                        <p className="text-center text-zinc-500 text-xs leading-relaxed max-w-xs">Nous contactons {selectedSalon.name}.<br/>Réponse estimée : &lt; 2 min.</p>
                    </div>
                )}

                {/* ETAPE 5 : BOOKED (TICKET + MIRROR) */}
                {bookingStep === 'booked' && (
                    <div className="flex-1 px-8 pt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8">
                        <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500"/>
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20"><Check size={32}/></div>
                            <h3 className="text-xl font-black text-white mb-1">C'est validé !</h3>
                            <p className="text-zinc-400 text-xs mb-6 font-medium">{selectedDate} à {selectedTime} • {clientInfo.name}</p>
                            <div className="space-y-2 border-t border-white/5 pt-4">
                                {cart.map(s => (<div key={s.id} className="flex justify-between text-sm text-zinc-300"><span>{s.name}</span><span>{s.price}.-</span></div>))}
                                <div className="flex justify-between text-lg font-black pt-2 text-[#E5D0AC]"><span>Total</span><span>{cart.reduce((a,b)=>a+b.price,0)}.-</span></div>
                            </div>
                        </div>

                        <div className="w-full mt-auto pb-12">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mb-4">À la fin du rendez-vous</p>
                            <button onClick={() => setShowMirror(true)} className="w-full h-20 bg-[#E5D0AC] text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs shadow-[0_15px_40px_-10px_rgba(229,208,172,0.5)] flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform">
                                <Camera size={20}/> Payer & Révéler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}
