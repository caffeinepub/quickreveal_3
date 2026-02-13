import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, X, Scissors, Sparkles, Feather, Zap, 
  CheckCircle2, Calendar as CalIcon, Clock, User, Users, 
  Briefcase, Plus, Trash2, LayoutGrid, Wallet, Home, 
  ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, 
  Settings, Edit3, Image as ImageIcon, LogOut, Bell, Star, 
  CreditCard, QrCode, Smartphone, Map as MapIcon, List,
  Lock, ShieldCheck, Globe, Check, Printer, ShoppingBag, 
  Megaphone, Menu, Store, PenTool, Filter, Navigation as NavIcon, Heart
} from 'lucide-react';

// --- DESIGN TOKENS ---
const fontTitle = { fontFamily: '"Playfair Display", "Didot", serif', letterSpacing: '-0.02em' };
const fontBody = { fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' };

// --- MOCK DATA ---
const CATEGORIES = [
    { id: 'ALL', label: 'Tout', icon: GridIcon },
    { id: 'Barber', label: 'Barber', icon: Scissors },
    { id: 'Coiffure', label: 'Coiffure', icon: Sparkles },
    { id: 'Onglerie', label: 'Onglerie', icon: Feather },
    { id: 'Esthétique', label: 'Esthétique', icon: Zap },
    { id: 'Massage', label: 'Massage', icon: User }
];

// Helper Icons
function GridIcon({size}) { return <LayoutGrid size={size}/> }

// PRO DATABASE (MOCK)
const PRO_DB = [
    { id: 'p1', name: "Maison Or", cat: 'Barber', city: 'Genève', dist: 0.8, price: 50, rating: 5.0, lat: 40, lng: 30, cover: "https://images.unsplash.com/photo-1503951914875-452162b7f304", services: [{name:'Coupe', price:50}] },
    { id: 'p2', name: "L'Atelier", cat: 'Coiffure', city: 'Lausanne', dist: 12.5, price: 80, rating: 4.8, lat: 60, lng: 70, cover: "https://images.unsplash.com/photo-1562322140-8baeececf3df", services: [{name:'Brushing', price:80}] },
    { id: 'p3', name: "Nails Bar", cat: 'Onglerie', city: 'Genève', dist: 1.2, price: 60, rating: 4.9, lat: 45, lng: 25, cover: "https://images.unsplash.com/photo-1604654894610-df63bc536371", services: [{name:'Semi', price:60}] },
    { id: 'p4', name: "Skin Studio", cat: 'Esthétique', city: 'Nyon', dist: 25.0, price: 120, rating: 5.0, lat: 20, lng: 80, cover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881", services: [{name:'Soin', price:120}] },
];

// --- BRAIN (STATE MANAGEMENT) ---
const useNexusBrain = () => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('nexus_v7000');
        return saved ? JSON.parse(saved) : { 
            view: 'LANDING', // LANDING, CLIENT_APP, PRO_APP
            userRole: null, 
            proProfile: null, 
            bookings: [], favorites: [],
            ledger: { total: 0, cash: 0, card: 0, history: [] }
        };
    });

    useEffect(() => { localStorage.setItem('nexus_v7000', JSON.stringify(state)); }, [state]);

    const actions = {
        goLanding: () => setState(s => ({...s, view: 'LANDING'})),
        
        // AUTH & ROUTING
        login: (role) => setState(s => ({...s, userRole: role, view: role === 'PRO' ? 'PRO_APP' : 'CLIENT_APP'})),
        
        // PRO LOGIC
        saveProfile: (p) => setState(s => ({...s, proProfile: p})),
        
        // CLIENT LOGIC
        toggleFav: (id) => setState(s => ({...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x=>x!==id) : [...s.favorites, id]})),
        addBooking: (b) => setState(s => ({...s, bookings: [...s.bookings, {...b, id: Date.now(), status: 'CONFIRMED'}]})),
        
        logout: () => setState(s => ({...s, view: 'LANDING', userRole: null}))
    };
    return { state, actions };
};

// --- COMPONENT: LANDING PAGE (PORTAL) ---
const HeroLanding = ({ onEnter }) => (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40 grayscale"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/40"/>
        
        <nav className="relative z-10 p-8 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tighter" style={fontTitle}>NEXUS.</div>
            <div className="flex gap-4">
                <button onClick={()=>onEnter('PRO')} className="text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition">Business</button>
                <button onClick={()=>onEnter('CLIENT')} className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition">Entrer</button>
            </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 items-center text-center">
            <h1 className="text-7xl md:text-9xl mb-8 leading-[0.9] animate-fade-in" style={fontTitle}>
                Discover<br/>Excellence.
            </h1>
            <p className="max-w-md text-zinc-400 mb-12 text-sm">Trouvez les meilleurs talents autour de vous. <br/>Réservez en un clic.</p>
            <div className="flex gap-4">
                <button onClick={()=>onEnter('CLIENT')} className="h-14 px-10 bg-[#D4AF37] text-black rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-2"><Search size={16}/> Trouver un Pro</button>
            </div>
        </div>
    </div>
);

// --- COMPONENT: CLIENT EXPLORER (THE CORE) ---
const ClientExplorer = ({ brain, actions }) => {
    const [tab, setTab] = useState('EXPLORE'); // EXPLORE, BOOKINGS, PROFILE
    const [viewMode, setViewMode] = useState('LIST'); // LIST, MAP
    const [activeCat, setActiveCat] = useState('ALL');
    const [geoSort, setGeoSort] = useState(false); // Sort by distance
    const [selectedPro, setSelectedPro] = useState(null);
    const [bookingStep, setBookingStep] = useState(null); // SERVICE, STAFF, TIME, CONFIRM

    // --- FILTER ENGINE ---
    const filteredPros = PRO_DB
        .filter(p => activeCat === 'ALL' || p.cat === activeCat)
        .sort((a,b) => geoSort ? a.dist - b.dist : 0);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative">
            
            {/* 1. HEADER & FILTERS (Sticky) */}
            {tab === 'EXPLORE' && (
                <div className="pt-6 bg-black/90 backdrop-blur sticky top-0 z-30 border-b border-white/5">
                    {/* Top Bar */}
                    <div className="px-6 flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Localisation</div>
                            <div className="flex items-center gap-1 font-bold text-sm text-white"><MapPin size={12} className="text-[#D4AF37]"/> Genève, Suisse <ChevronRight size={12} className="text-zinc-600"/></div>
                        </div>
                        <button onClick={()=>setGeoSort(!geoSort)} className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase flex items-center gap-1 transition ${geoSort ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-zinc-800 text-zinc-400'}`}>
                            <NavIcon size={10}/> {geoSort ? 'Proche' : 'Distance'}
                        </button>
                    </div>

                    {/* Category Rail */}
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4">
                        {CATEGORIES.map(c => (
                            <button key={c.id} onClick={()=>setActiveCat(c.id)} className={`flex flex-col items-center gap-2 min-w-[64px] group`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition ${activeCat===c.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-white/5 text-zinc-500 group-hover:border-white/20'}`}>
                                    <c.icon size={20}/>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${activeCat===c.id ? 'text-white' : 'text-zinc-600'}`}>{c.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] relative">
                
                {/* EXPLORE TAB */}
                {tab === 'EXPLORE' && (
                    <>
                        {viewMode === 'LIST' ? (
                            <div className="p-6 space-y-6 pb-32">
                                {filteredPros.map(pro => (
                                    <div key={pro.id} onClick={()=>{setSelectedPro(pro); setBookingStep('SERVICE')}} className="group cursor-pointer">
                                        {/* Card Image */}
                                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-3 border border-white/10 shadow-lg">
                                            <img src={pro.cover} className="w-full h-full object-cover transition duration-700 group-hover:scale-105"/>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
                                            <button onClick={(e)=>{e.stopPropagation(); actions.toggleFav(pro.id)}} className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition">
                                                <Heart size={14} className={brain.favorites.includes(pro.id)?'fill-white':''}/>
                                            </button>
                                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 flex items-center gap-1">
                                                <Star size={10} className="text-[#D4AF37] fill-[#D4AF37]"/> {pro.rating}
                                            </div>
                                            {/* Bottom Info */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h3 style={fontTitle} className="text-2xl text-white mb-1">{pro.name}</h3>
                                                        <p className="text-xs text-zinc-300 font-medium">{pro.cat} • <span className="text-zinc-500">{pro.dist} km</span></p>
                                                    </div>
                                                    <div className="bg-white text-black px-3 py-1.5 rounded-lg font-bold text-xs">dès {pro.price}.-</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-[#111]">
                                {/* MOCK MAP */}
                                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3}}></div>
                                {filteredPros.map(pro => (
                                    <div key={pro.id} onClick={()=>{setSelectedPro(pro); setBookingStep('SERVICE')}} className="absolute cursor-pointer flex flex-col items-center" style={{top: `${pro.lat}%`, left: `${pro.lng}%`}}>
                                        <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-1">{pro.price}.-</div>
                                        <div className="w-3 h-3 bg-[#D4AF37] rounded-full border-2 border-black shadow-[0_0_15px_#D4AF37]"/>
                                    </div>
                                ))}
                                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-4 py-2 rounded-full text-xs text-white border border-white/10 shadow-xl flex items-center gap-2">
                                    <MapPin size={12} className="text-[#D4AF37]"/> Déplacez la carte pour chercher
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* BOOKINGS TAB */}
                {tab === 'BOOKINGS' && (
                    <div className="p-6">
                        <h2 style={fontTitle} className="text-3xl mb-6">Mes RDV.</h2>
                        {brain.bookings.length === 0 ? <div className="text-center text-zinc-600 text-xs py-20 border border-dashed border-zinc-800 rounded-2xl">Aucun rendez-vous.</div> :
                            brain.bookings.map(b => (
                                <div key={b.id} className="bg-zinc-900 border border-white/5 p-5 rounded-2xl mb-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-lg">{b.proName}</div>
                                        <div className="text-xs text-zinc-500">{b.service}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[#D4AF37] font-bold">{b.price}.-</div>
                                        <div className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded mt-1">Confirmé</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>

            {/* 3. FLOATING ACTION BUTTON (MAP TOGGLE) */}
            {tab === 'EXPLORE' && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40">
                    <button onClick={()=>setViewMode(viewMode==='LIST'?'MAP':'LIST')} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl border border-white/20 hover:scale-105 transition">
                        {viewMode === 'LIST' ? <><MapIcon size={14}/> Carte</> : <><List size={14}/> Liste</>}
                    </button>
                </div>
            )}

            {/* 4. BOTTOM DOCK (NAVIGATION) */}
            <div className="p-4 pb-8 bg-black/90 backdrop-blur border-t border-white/5 flex justify-around items-center z-50">
                <button onClick={()=>setTab('EXPLORE')} className={`flex flex-col items-center gap-1 ${tab==='EXPLORE'?'text-[#D4AF37]':'text-zinc-600'}`}><Search size={20}/><span className="text-[9px] font-bold uppercase">Explorer</span></button>
                <button onClick={()=>setTab('BOOKINGS')} className={`flex flex-col items-center gap-1 ${tab==='BOOKINGS'?'text-[#D4AF37]':'text-zinc-600'}`}><CalIcon size={20}/><span className="text-[9px] font-bold uppercase">Agenda</span></button>
                <button onClick={()=>setTab('PROFILE')} className={`flex-1 max-w-[40px] flex flex-col items-center gap-1 ${tab==='PROFILE'?'text-[#D4AF37]':'text-zinc-600'}`}><User size={20}/><span className="text-[9px] font-bold uppercase">Moi</span></button>
            </div>

            {/* 5. BOOKING MODAL (OVERLAY) */}
            {selectedPro && (
                <div className="fixed inset-0 z-[60] bg-[#0F0F11] flex flex-col animate-slide-in-from-bottom">
                    {/* Header Image */}
                    <div className="relative h-48 flex-shrink-0">
                        <img src={selectedPro.cover} className="w-full h-full object-cover opacity-70"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] to-transparent"/>
                        <button onClick={()=>{setSelectedPro(null); setBookingStep(null)}} className="absolute top-6 left-6 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"><ChevronLeft/></button>
                        <div className="absolute bottom-4 left-6">
                            <h2 style={fontTitle} className="text-3xl">{selectedPro.name}</h2>
                            <p className="text-zinc-400 text-xs">{selectedPro.cat} • {selectedPro.city}</p>
                        </div>
                    </div>

                    {/* Booking Flow */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {bookingStep === 'SERVICE' && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4">Choisir un soin</h3>
                                {selectedPro.services.map((s,i) => (
                                    <button key={i} onClick={()=>setBookingStep({name: s.name, price: s.price})} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center hover:border-[#D4AF37]">
                                        <span className="font-bold">{s.name}</span>
                                        <span className="text-[#D4AF37] font-bold">{s.price}.-</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {bookingStep?.name && (
                            <div className="space-y-6 animate-slide-in-from-right">
                                <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 text-center">
                                    <div className="text-zinc-500 text-xs uppercase mb-2">Récapitulatif</div>
                                    <div className="text-xl font-bold text-white mb-6">{bookingStep.name}</div>
                                    <div className="text-4xl font-bold mb-2 text-[#D4AF37]" style={fontTitle}>{bookingStep.price}.-</div>
                                    <div className="text-xs text-zinc-500">Paiement sur place</div>
                                </div>
                                <button onClick={()=>{actions.addBooking({proName:selectedPro.name, service:bookingStep.name, price:bookingStep.price}); setSelectedPro(null); setBookingStep(null); setTab('BOOKINGS');}} className="w-full py-4 bg-white text-black font-black uppercase rounded-xl">Confirmer</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: PRO APP (OPS & STUDIO) ---
const ProApp = ({ brain, actions }) => {
    const [section, setSection] = useState('DASHBOARD'); // DASHBOARD, SERVICES, SETTINGS

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
            <div className="p-6 pt-12 flex justify-between items-center border-b border-white/5 bg-black sticky top-0 z-20">
                <div><h2 className="font-bold text-white text-lg">Nexus Pro</h2><p className="text-[9px] text-[#D4AF37] uppercase font-bold">Cockpit</p></div>
                <button onClick={actions.logout} className="p-2 rounded-full bg-zinc-900 hover:text-red-500"><LogOut size={16}/></button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-zinc-500">
                <LayoutGrid size={48} className="mb-4 opacity-20"/>
                <p className="text-sm">Espace Pro (Ops & Studio)</p>
                <p className="text-xs mt-2 max-w-xs">Gérez votre agenda, vos services et votre caisse ici. (Architecture complète disponible en mode V6000).</p>
            </div>

            <div className="flex border-t border-white/5 bg-black">
                <button className="flex-1 py-4 text-[10px] font-bold uppercase text-[#D4AF37] flex flex-col items-center gap-1"><LayoutGrid size={18}/> Ops</button>
                <button className="flex-1 py-4 text-[10px] font-bold uppercase text-zinc-600 flex flex-col items-center gap-1"><PenTool size={18}/> Studio</button>
            </div>
        </div>
    );
};

// --- ROOT ---
export default function App() {
    const { state, actions } = useNexusBrain();
    if(state.view === 'LANDING') return <HeroLanding onEnter={actions.login}/>;
    if(state.view === 'CLIENT_APP') return <ClientExplorer brain={state} actions={actions}/>;
    if(state.view === 'PRO_APP') return <ProApp brain={state} actions={actions}/>;
    return null;
}
