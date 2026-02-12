import React, { useState } from 'react';
import { 
  Search, MapPin, ArrowRight, X, Phone, Scissors, Sparkles, Feather, Zap, 
  CheckCircle2, Star, BadgeCheck, Smartphone, Instagram, Link as LinkIcon, 
  Share2, ChevronLeft, ArrowUpRight, Home, Clock, Gem
} from 'lucide-react';

// --- STYLE UTILS ---
// Simulation d'une police serif élégante pour le luxe
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
        { id: 2, name: "Barbe Sculptée", price: 30, time: 20, desc: "Rituel serviette chaude et huiles essentielles." },
        { id: 3, name: "Soin Visage Black Mask", price: 25, time: 15, desc: "Purification intense après coupe." }
    ]
  },
  {
    id: 2, name: "L'ATELIER GOLD", category: "Coiffure", rating: "4.9", reviews: 82, verified: true,
    cover: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    location: "LAUSANNE", type: "DOMICILE", distance: "5 KM",
    priceStart: 80, nextSlot: "DEMAIN", instagram: "@ateliergold", website: "atelier.ch",
    bio: "La haute coiffure s'invite chez vous. Service palace, confort absolu.",
    services: [
        { id: 4, name: "Balayage Signature", price: 180, time: 120, desc: "Éclaircissement naturel et patine sur-mesure." },
        { id: 5, name: "Coupe Création", price: 90, time: 60, desc: "Diagnostic visagiste et coiffage." }
    ]
  }
];

// --- COMPONENTS ---
const DivineCard = ({ salon, onSelect }) => (
    <div 
        onClick={() => onSelect(salon)}
        className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden mb-8 group cursor-pointer shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/5 divine-card-enter active:scale-[0.98] transition-transform"
    >
        <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={salon.name}/>
        {/* Le "Glow" Divin */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90"/>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent mix-blend-overlay"/>
        
        {/* Badges Flottants (Glass Light) */}
        <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-lg">
                {salon.type === 'DOMICILE' ? <Home size={10}/> : <MapPin size={10}/>} {salon.type}
            </div>
            {salon.verified && <div className="px-3 py-1.5 bg-emerald-500/30 backdrop-blur-xl border border-emerald-400/30 rounded-full text-[9px] font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-emerald-500/10"><BadgeCheck size={10}/> Vérifié</div>}
        </div>

        {/* Info Bas */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 style={serifFont} className="text-4xl text-white leading-none mb-3 tracking-tight">{salon.name}</h3>
            <div className="flex justify-between items-end">
                <div className="text-zinc-300 text-xs font-medium flex items-center gap-2">
                    <span>{salon.location}</span>
                    <span className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"/>
                    <span className="text-emerald-300">Prochain : {salon.nextSlot}</span>
                </div>
                <div style={serifFont} className="text-2xl text-white">{salon.priceStart}.-</div>
            </div>
        </div>
    </div>
);

// --- INTRO SCREEN (DIVINE LIGHT) ---
const DivineIntro = ({ onEnter, onPro }) => {
    return (
        <div className="relative h-screen w-full bg-[#020202] overflow-hidden flex flex-col justify-between font-sans">
            {/* FOND LUMIÈRE VIVANTE */}
            <div className="absolute inset-0 z-0 divine-bg-breathe">
                <img src="https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover grayscale contrast-125" alt="Background"/>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#020202] z-0"/>

            {/* Top Bar */}
            <div className="relative z-10 p-6 flex justify-between items-center pt-12 divine-fade-in-down">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_#34d399]"/>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Suisse Romande</span>
                </div>
                <button onClick={onPro} className="px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-bold text-zinc-300 uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all">
                    Espace Partenaire
                </button>
            </div>

            {/* Center : Manifesto */}
            <div className="relative z-10 px-8">
                <div className="divine-fade-in-up">
                    <h1 style={serifFont} className="text-7xl text-white leading-[0.85] tracking-tight mb-8 mix-blend-overlay opacity-90">
                        PURE<br/>BEAUTY.
                    </h1>
                    <div className="pl-6 border-l-[1.5px] border-emerald-500/50">
                        <p className="text-zinc-300 text-sm font-medium max-w-[280px] leading-relaxed">
                            L'application qui élève les standards de l'élégance. Réservez l'élite, instantanément.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom : The Golden Trigger */}
            <div className="relative z-10 p-6 pb-12 divine-fade-in-up-delayed">
                <button 
                    onClick={onEnter}
                    className="w-full h-20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-[32px] flex items-center justify-between px-2 pl-8 group hover:border-white/40 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]"
                >
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Entrer</span>
                    <div className="h-16 w-16 bg-[#E5D0AC] rounded-[24px] flex items-center justify-center text-black shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        <ArrowUpRight size={24} strokeWidth={2.5}/>
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- PRO STUDIO ---
const ProStudio = ({ onBack }) => {
    return (
        <div className="h-screen bg-[#020202] text-white flex flex-col font-sans">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <span className="font-black tracking-widest text-xs text-zinc-400">ESPACE PARTENAIRE</span>
                <button onClick={onBack}><X className="text-zinc-500 hover:text-white"/></button>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-center max-w-md mx-auto w-full divine-zoom-in">
                <h2 style={serifFont} className="text-4xl mb-4 text-white">Rejoignez<br/>L'Élite.</h2>
                <p className="text-zinc-400 text-sm mb-10 pl-4 border-l border-zinc-700">Créez votre page Nexus en 2 minutes et touchez une clientèle premium.</p>
                
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md focus-within:border-white/30 transition-colors">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-3 tracking-widest">Nom du Salon</label>
                        <input className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-zinc-700 text-white" placeholder="Ex: Mageste Labs"/>
                    </div>
                    <button onClick={onBack} className="w-full py-6 bg-[#E5D0AC] text-black rounded-3xl font-black uppercase tracking-widest text-xs mt-4 shadow-[0_10px_30px_-10px_rgba(229,208,172,0.3)] hover:scale-[1.01] transition-transform">Lancer mon studio</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP (DIVINE FEED) ---
export default function App() {
  const [view, setView] = useState('intro');
  const [activeCat, setActiveCat] = useState('Barber');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [cart, setCart] = useState([]);

  const enterApp = () => setView('app');
  const enterPro = () => setView('pro');

  if (view === 'intro') return <DivineIntro onEnter={enterApp} onPro={enterPro} />;
  if (view === 'pro') return <ProStudio onBack={() => setView('intro')} />;

  return (
    <div className="bg-[#020202] min-h-screen text-white font-sans selection:bg-emerald-500 relative bg-gradient-to-b from-[#050505] to-[#020202]">
        {/* HEADER FLOTTANT */}
        <div className="sticky top-0 z-30 px-6 py-4 pt-6 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
            <h1 style={serifFont} className="text-2xl text-white tracking-tight">NEXUS<span className="text-emerald-400">.</span></h1>
            <button onClick={() => setView('intro')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-colors"><X size={18}/></button>
        </div>

        {/* CONTENU APP */}
        <div className="pb-32">
            {/* Catégories */}
            <div className="px-6 py-6 overflow-x-auto hide-scrollbar flex gap-4 sticky top-[70px] z-20 bg-[#020202]/95 backdrop-blur-md pb-4 border-b border-white/5">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${activeCat === cat.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-transparent border-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'}`}
                    >
                        <cat.icon size={14}/>
                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Liste Salons */}
            <div className="px-6 pt-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 style={serifFont} className="text-2xl text-white">L'Élite <span className="text-emerald-400">{activeCat}</span></h2>
                    <div className="text-[9px] font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-wider">Suisse</div>
                </div>
                
                {SALONS.filter(s => activeCat === 'Barber' ? s.category === 'Barber' : true).map(salon => (
                    <DivineCard key={salon.id} salon={salon} onSelect={setSelectedSalon} />
                ))}
            </div>
        </div>

        {/* DÉTAIL MODAL (IMMERSIVE) */}
        {selectedSalon && (
            <div className="fixed inset-0 z-50 bg-[#020202] flex flex-col font-sans divine-modal-enter">
                {/* Header Image */}
                <div className="relative h-[50vh]">
                    <img src={selectedSalon.cover} className="w-full h-full object-cover" alt={selectedSalon.name}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent"/>
                    <button onClick={() => setSelectedSalon(null)} className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white z-20 hover:bg-white hover:text-black transition-all"><ChevronLeft size={20}/></button>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h2 style={serifFont} className="text-6xl text-white mb-4 leading-none tracking-tight shadow-lg">{selectedSalon.name}</h2>
                        <div className="flex gap-3 text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                            <span className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 flex items-center gap-1"><Gem size={10}/> {selectedSalon.category}</span>
                            <span className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 flex items-center gap-1"><MapPin size={10}/> {selectedSalon.location}</span>
                        </div>
                    </div>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto px-8 pt-6 pb-40 bg-gradient-to-b from-[#020202] to-black relative z-10">
                    {/* BIO */}
                    <div className="mb-12 pl-6 border-l-[2px] border-emerald-500/30">
                        <p className="text-sm text-zinc-300 font-medium leading-relaxed">{selectedSalon.bio}</p>
                    </div>
                    
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Sparkles size={12}/> Carte des Soins</h3>
                    <div className="space-y-4">
                        {selectedSalon.services.map(s => {
                            const active = cart.includes(s);
                            return (
                                <button 
                                    key={s.id} 
                                    onClick={() => { if(!cart.includes(s)) setCart([...cart, s]); else setCart(cart.filter(x=>x!==s)); }}
                                    className={`w-full p-6 rounded-[24px] border text-left flex justify-between items-center transition-all duration-500 group relative overflow-hidden ${active ? 'border-[#E5D0AC]/50 shadow-[0_10px_40px_-10px_rgba(229,208,172,0.2)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                >
                                    {/* Fond Lumineux Actif - L'EFFET "OR LIQUIDE" */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-[#E5D0AC]/20 via-transparent to-transparent transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}/>
                                    
                                    <div className="relative z-10">
                                        <div className={`font-bold text-lg mb-2 transition-colors ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.name}</div>
                                        <div className="text-[10px] text-zinc-500 mb-2 flex items-center gap-1 uppercase tracking-wider"><Clock size={10}/> {s.time} min</div>
                                        {s.desc && <div className="text-xs text-zinc-400 font-medium leading-tight pr-4">{s.desc}</div>}
                                    </div>
                                    <div style={serifFont} className={`text-2xl transition-colors relative z-10 ${active ? 'text-[#E5D0AC]' : 'text-white'}`}>{s.price}.-</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Action (GOLD BUTTON - CHAMPAGNE OR) */}
                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pt-12 divine-slide-up">
                        <a 
                            href={`https://wa.me/?text=Demande pour ${selectedSalon.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-20 bg-[#E5D0AC] text-black font-black uppercase rounded-[32px] tracking-[0.2em] text-xs shadow-[0_15px_40px_-10px_rgba(229,208,172,0.5)] flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                            <Smartphone size={20}/> Confirmer la demande ({cart.reduce((a,b)=>a+b.price,0)}.-)
                        </a>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}
