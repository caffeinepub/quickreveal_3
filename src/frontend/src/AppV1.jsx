import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, X, Scissors, Sparkles, Feather, Zap, 
  CheckCircle2, Calendar as CalIcon, Clock, User, Users, 
  Briefcase, Plus, Trash2, LayoutGrid, Wallet, Home, 
  ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, 
  Settings, Edit3, Image as ImageIcon, LogOut, Bell, Star, 
  CreditCard, QrCode, Smartphone, Map as MapIcon, List,
  Lock, ShieldCheck, Globe, Check, Printer, ShoppingBag, 
  Megaphone, Menu, Store, PenTool, Filter, Navigation as NavIcon, Heart, UserCheck, Package, History
} from 'lucide-react';

// --- DESIGN TOKENS ---
const fontTitle = { fontFamily: '"Playfair Display", "Didot", serif', letterSpacing: '-0.02em' };
const fontBody = { fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' };

// --- DATA CONSTANTS ---
const CITIES = ["Lausanne", "Genève", "Montreux", "Zurich", "Sion", "Monaco"];
const CATEGORIES = [
    { id: 'ALL', label: 'Tout', icon: LayoutGrid },
    { id: 'Barber', label: 'Barber', icon: Scissors },
    { id: 'Coiffure', label: 'Coiffure', icon: Sparkles },
    { id: 'Onglerie', label: 'Onglerie', icon: Feather },
    { id: 'Esthétique', label: 'Esthétique', icon: Zap }
];
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// --- MOCK DATABASE (SEED) ---
const SEED_PRO = {
    id: 'p1', name: "Maison Or", category: 'Barber', city: 'Genève', lat: 45, lng: 30, rating: 5.0, reviews: 124,
    cover: "https://images.unsplash.com/photo-1503951914875-452162b7f304?auto=format&fit=crop&w=800&q=80",
    bio: "L'excellence masculine. Coupe, barbe et soins visage.",
    address: "Rue du Rhône 42",
    hours: { 'Lun':null, 'Mar':'09:00-19:00', 'Mer':'09:00-19:00', 'Jeu':'09:00-21:00', 'Ven':'09:00-21:00', 'Sam':'09:00-17:00', 'Dim':null },
    services: [
        { id: 's1', name: "Coupe Signature", time: 45, sPrice: 50, mPrice: 90, cover: "https://images.unsplash.com/photo-1621605815971-fbc98d665033", addons: [{name:"Barbe", price:20}, {name:"Masque", price:15}] }
    ],
    staff: [{id: 'st1', name: 'Julien', role: 'Master'}, {id: 'st2', name: 'Thomas', role: 'Junior'}]
};

// --- BRAIN (STATE MANAGEMENT) ---
const useNexusBrain = () => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('nexus_omniverse_v10000');
        return saved ? JSON.parse(saved) : { 
            view: 'LANDING', 
            searchCtx: { city: 'Genève', category: 'ALL' },
            userRole: null, 
            proProfile: null, 
            bookings: [], // {id, status: PENDING|CONFIRMED|COMPLETED, ...}
            clients: [], // CRM
            inventory: [{id: 'prod1', name: 'Cire Mat', price: 25, stock: 12}, {id: 'prod2', name: 'Huile Barbe', price: 30, stock: 5}], 
            campaigns: [],
            favorites: [],
            ledger: { total: 0, cash: 0, card: 0, history: [] }
        };
    });

    useEffect(() => { localStorage.setItem('nexus_omniverse_v10000', JSON.stringify(state)); }, [state]);

    const actions = {
        setSearch: (ctx) => setState(s => ({...s, searchCtx: {...s.searchCtx, ...ctx}})),
        
        // NAVIGATION
        go: (view) => setState(s => ({...s, view})),
        login: (role) => setState(s => ({...s, userRole: role, view: role === 'PRO' ? (s.proProfile ? 'PRO_COCKPIT' : 'PRO_STUDIO') : 'CLIENT_EXPLORER'})),
        
        // PRO CONFIG (STUDIO)
        saveProfile: (p) => setState(s => ({...s, proProfile: p})),
        updateServices: (svcs) => setState(s => ({...s, proProfile: {...s.proProfile, services: svcs}})),
        updateStaff: (staff) => setState(s => ({...s, proProfile: {...s.proProfile, staff}})),
        
        // PRO OPS (COCKPIT)
        addInventory: (prod) => setState(s => ({...s, inventory: [...s.inventory, {...prod, id: Date.now()}]})),
        sendCampaign: (c) => setState(s => ({...s, campaigns: [...s.campaigns, c]})),
        goProStudio: () => setState(s => ({...s, view: 'PRO_STUDIO'})),
        
        // BOOKING ENGINE
        addBooking: (b) => setState(s => {
            // CRM Update
            let newClients = [...s.clients];
            if(!newClients.find(c=>c.name===b.clientName)) newClients.push({id:Date.now(), name:b.clientName, visits:1, total:0, last: new Date().toLocaleDateString()});
            return {...s, bookings: [...s.bookings, {...b, id: Date.now(), status: 'CONFIRMED'}], clients: newClients};
        }),
        
        // POS ENGINE (RETAIL + SERVICE)
        checkout: (bookingId, method, amount, items) => setState(s => {
            const b = s.bookings.find(x => x.id === bookingId);
            const newLedger = {
                total: s.ledger.total + amount,
                cash: method === 'CASH' ? s.ledger.cash + amount : s.ledger.cash,
                card: method !== 'CASH' ? s.ledger.card + amount : s.ledger.card,
                history: [{id: Date.now(), amount, method, label: b?.clientName || 'Vente Directe', items}, ...s.ledger.history]
            };
            // Update booking status if linked
            const newBookings = bookingId ? s.bookings.map(x => x.id === bookingId ? {...x, status: 'COMPLETED', paid: true} : x) : s.bookings;
            
            return {...s, ledger: newLedger, bookings: newBookings};
        }),

        addReview: (id, rating) => setState(s => ({...s, bookings: s.bookings.map(b => b.id === id ? {...b, reviewed: true, rating} : b)})),
        toggleFav: (id) => setState(s => ({...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x=>x!==id) : [...s.favorites, id]})),

        logout: () => setState(s => ({...s, view: 'LANDING', userRole: null}))
    };
    return { state, actions };
};

// --- COMPONENT: HERO LANDING (VOGUE) ---
const LandingPage = ({ onSearch, context }) => {
    const [city, setCity] = useState(context.city || "Genève");
    const [cat, setCat] = useState("ALL");
    
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 grayscale"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/40"/>
            
            <nav className="relative z-10 p-8 flex justify-between items-center">
                <div className="text-2xl font-bold tracking-tighter" style={fontTitle}>NEXUS.</div>
                <div className="flex gap-4">
                    <button onClick={()=>onSearch({role:'PRO'})} className="text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition">Business</button>
                    <button onClick={()=>onSearch({role:'CLIENT'})} className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition">Connexion</button>
                </div>
            </nav>

            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 items-center text-center">
                <h1 className="text-7xl md:text-9xl mb-8 leading-[0.9] animate-fade-in" style={fontTitle}>
                    Omniverse<br/>Edition.
                </h1>
                
                {/* SEARCH CONTINUITY */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-full flex flex-col md:flex-row gap-2 w-full max-w-xl shadow-2xl">
                    <div className="flex-1 bg-black/60 rounded-full px-6 py-4 flex items-center gap-3 border border-white/5">
                        <MapPin size={16} className="text-[#D4AF37]"/>
                        <select value={city} onChange={e=>setCity(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-full appearance-none text-white">
                            <option disabled>Ville</option>
                            {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 bg-black/60 rounded-full px-6 py-4 flex items-center gap-3 border border-white/5">
                        <Filter size={16} className="text-[#D4AF37]"/>
                        <select value={cat} onChange={e=>setCat(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-full appearance-none text-white">
                            <option value="ALL">Tout</option>
                            {CATEGORIES.filter(c=>c.id!=='ALL').map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>
                    <button onClick={() => onSearch({ city, category: cat, role:'CLIENT' })} className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center gap-2"><Search size={14}/> Explorer</button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: PRO STUDIO (CONFIG & SETUP) ---
const ProStudio = ({ profile, actions }) => {
    const [tab, setTab] = useState('SERVICES'); // SERVICES, TEAM, HOURS, INFO
    const [local, setLocal] = useState(profile || {name:'', services:[], staff:[], hours:{}});
    const [editSvc, setEditSvc] = useState(null);

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900">
                <div><h2 className="font-bold text-lg">Studio</h2><p className="text-[10px] text-zinc-500 uppercase">Configuration</p></div>
                <div className="flex gap-2">
                    <button onClick={actions.logout} className="p-2 bg-black rounded-full"><LogOut size={16}/></button>
                    <button onClick={()=>{actions.saveProfile(local); actions.go('PRO_COCKPIT')}} className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg text-xs font-bold uppercase">Sauvegarder & Go Ops</button>
                </div>
            </div>
            <div className="flex border-b border-white/5">
                {['SERVICES', 'EQUIPE', 'HORAIRES', 'INFOS'].map(t => (
                    <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-4 text-[10px] font-bold uppercase ${tab===t?'text-[#D4AF37] border-b-2 border-[#D4AF37]':'text-zinc-500'}`}>{t}</button>
                ))}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                {tab === 'SERVICES' && (
                    <div className="space-y-4">
                        {!editSvc ? (
                            <>
                                <button onClick={()=>setEditSvc({name:'', price:0, addons:[]})} className="w-full py-3 border border-dashed border-zinc-700 text-zinc-500 rounded-xl text-xs uppercase hover:text-white hover:border-white">+ Nouveau Service</button>
                                {local.services?.map((s,i)=><div key={i} onClick={()=>setEditSvc(s)} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 cursor-pointer hover:border-[#D4AF37]"><div><span className="font-bold block">{s.name}</span><span className="text-xs text-zinc-500">{s.time} min • {s.addons?.length} options</span></div><span className="text-[#D4AF37] font-bold">{s.price || s.sPrice}.-</span></div>)}
                            </>
                        ) : (
                            <div className="space-y-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-slide-in-from-right">
                                <div className="flex justify-between"><h3 className="font-bold text-sm">Édition Service</h3><X size={16} className="cursor-pointer" onClick={()=>setEditSvc(null)}/></div>
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-black rounded-lg border border-dashed border-zinc-700 flex items-center justify-center"><ImageIcon className="text-zinc-600"/></div>
                                    <div className="flex-1 space-y-2">
                                        <input value={editSvc.name} onChange={e=>setEditSvc({...editSvc, name:e.target.value})} placeholder="Nom" className="w-full bg-black p-3 rounded-lg text-white text-sm font-bold"/>
                                        <div className="flex gap-2">
                                            <input type="number" value={editSvc.sPrice} onChange={e=>setEditSvc({...editSvc, sPrice:Number(e.target.value)})} placeholder="Prix Studio" className="bg-black p-2 rounded-lg text-white text-xs w-full"/>
                                            <input type="number" value={editSvc.mPrice} onChange={e=>setEditSvc({...editSvc, mPrice:Number(e.target.value)})} placeholder="Prix Domicile" className="bg-black p-2 rounded-lg text-white text-xs w-full"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-2">
                                    <label className="text-[9px] uppercase text-zinc-500">Options (Upsell)</label>
                                    {editSvc.addons?.map((ad,k)=><div key={k} className="flex justify-between text-xs py-1"><span>{ad.name}</span><span>+{ad.price}</span></div>)}
                                    <button onClick={()=>setEditSvc({...editSvc, addons:[...(editSvc.addons||[]), {name:'Option Extra', price:10}]})} className="text-xs text-[#D4AF37] underline">+ Ajouter Option</button>
                                </div>
                                <button onClick={()=>{
                                    const newSvcs = editSvc.id ? local.services.map(s=>s.id===editSvc.id?editSvc:s) : [...(local.services||[]), {...editSvc, id:Date.now()}];
                                    setLocal({...local, services: newSvcs}); setEditSvc(null);
                                }} className="w-full py-3 bg-white text-black font-bold uppercase rounded-lg text-xs">Sauvegarder</button>
                            </div>
                        )}
                    </div>
                )}
                {tab === 'EQUIPE' && (
                    <div className="space-y-4">
                        {local.staff?.map((s,i)=><div key={i} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl"><span>{s.name}</span><span className="text-xs text-zinc-500">{s.role}</span></div>)}
                        <button onClick={()=>setLocal({...local, staff:[...(local.staff||[]), {id:Date.now(), name:'Nouveau', role:'Staff'}]})} className="w-full py-3 border border-zinc-800 rounded-xl text-xs text-zinc-500 uppercase">+ Ajouter Membre</button>
                    </div>
                )}
                {tab === 'HORAIRES' && (
                    <div className="space-y-2">
                        {DAYS.map(d=>(<div key={d} className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg"><span className="text-sm font-bold w-10">{d}</span><input placeholder="Fermé" value={local.hours[d]||''} onChange={e=>setLocal({...local, hours:{...local.hours, [d]:e.target.value}})} className="bg-transparent text-right outline-none text-zinc-400 text-sm"/></div>))}
                    </div>
                )}
                {tab === 'INFOS' && (
                    <div className="space-y-4">
                        <input value={local.name} onChange={e=>setLocal({...local, name:e.target.value})} className="w-full bg-zinc-900 p-4 rounded-xl text-white font-bold" placeholder="Nom du Salon"/>
                        <input value={local.address} onChange={e=>setLocal({...local, address:e.target.value})} className="w-full bg-zinc-900 p-4 rounded-xl text-white" placeholder="Adresse"/>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: PRO COCKPIT (OPS & POS & CRM) ---
const ProCockpit = ({ profile, bookings, ledger, inventory, campaigns, clients, actions }) => {
    const [view, setView] = useState('AGENDA'); // AGENDA, POS, CRM, MARKETING
    const [posOrder, setPosOrder] = useState(null); // { booking, items: [] }

    const hours = Array.from({length:11},(_,i)=>9+i);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
            <div className="p-4 pt-8 flex justify-between items-center bg-zinc-900 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-[#D4AF37] overflow-hidden"><img src={profile.cover} className="w-full h-full object-cover"/></div>
                    <div><h2 className="font-bold text-sm">{profile.name}</h2><p className="text-[9px] text-green-500 uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"/> Cockpit</p></div>
                </div>
                <div className="flex gap-2">
                    <button onClick={actions.goProStudio} className="p-2 bg-black border border-zinc-700 rounded-full text-zinc-400 hover:text-white"><Settings size={16}/></button>
                    <button onClick={actions.logout} className="p-2 bg-black border border-zinc-700 rounded-full hover:text-red-500"><LogOut size={16}/></button>
                </div>
            </div>

            <div className="flex p-2 gap-2 bg-black overflow-x-auto">
                {[
                    {id:'AGENDA', icon:CalIcon, label:'Agenda'}, {id:'POS', icon:Printer, label:'Caisse'}, 
                    {id:'CRM', icon:Users, label:'Clients'}, {id:'MARKETING', icon:Megaphone, label:'Pub'}
                ].map(v => (
                    <button key={v.id} onClick={()=>setView(v.id)} className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 ${view===v.id?'bg-zinc-800 text-[#D4AF37]':'text-zinc-600 border border-zinc-900'}`}><v.icon size={18}/><span className="text-[9px] font-bold uppercase">{v.label}</span></button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4">
                {/* AGENDA VISUEL */}
                {view === 'AGENDA' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-lg">Aujourd'hui</h3><button onClick={()=>setPosOrder({items:[], total:0})} className="text-xs bg-zinc-800 px-3 py-1 rounded">+ Vente Directe</button></div>
                        <div className="relative border-l border-zinc-800 ml-4 space-y-4 py-2">
                            {hours.map(h => {
                                const b = bookings.find(x => parseInt(x.time) === h);
                                return (
                                    <div key={h} className="relative pl-6 min-h-[70px]">
                                        <span className="absolute -left-3 top-0 text-[10px] text-zinc-600 bg-[#0a0a0a] py-1">{h}:00</span>
                                        {b ? (
                                            <div onClick={()=>setPosOrder({booking:b, items:[], total:b.total})} className={`p-3 rounded-lg border-l-4 cursor-pointer shadow-lg ${b.paid?'border-green-500 bg-zinc-900/50':'border-[#D4AF37] bg-zinc-800'}`}>
                                                <div className="flex justify-between"><span className="font-bold text-sm">{b.clientName}</span><span>{b.total}.-</span></div>
                                                <div className="text-[10px] text-zinc-400 mt-1">{b.serviceName} • {b.staffName}</div>
                                                {!b.paid && <div className="mt-2 text-[9px] font-bold text-[#D4AF37] flex items-center gap-1"><Printer size={10}/> Encaisser</div>}
                                            </div>
                                        ) : <div className="h-full border-b border-zinc-900/50"/>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* POS RETAIL & SERVICE */}
                {view === 'POS' && (
                    <div className="text-center py-20 text-zinc-500 text-xs">
                        <Printer size={48} className="mx-auto mb-4 opacity-50"/>
                        <p>Sélectionnez un RDV dans l'agenda ou créez une vente.</p>
                        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><span className="text-[10px] uppercase text-zinc-500">CA Jour</span><div className="text-2xl font-bold text-white">{ledger.total}.-</div></div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><span className="text-[10px] uppercase text-zinc-500">Clients</span><div className="text-2xl font-bold text-white">{clients.length}</div></div>
                        </div>
                    </div>
                )}

                {/* CRM */}
                {view === 'CRM' && (
                    <div className="space-y-4">
                        {clients.map(c => (
                            <div key={c.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-zinc-500">{c.name[0]}</div>
                                    <div><div className="font-bold text-sm">{c.name}</div><div className="text-[10px] text-zinc-500">Visites: {c.visits} • Dernier: {c.last}</div></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MARKETING */}
                {view === 'MARKETING' && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-lg mb-2">Campagne SMS</h3>
                            <button onClick={()=>actions.sendCampaign({title:'Promo'})} className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs rounded-xl flex items-center justify-center gap-2"><Megaphone size={14}/> Envoyer Offre (-20%)</button>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase">Historique</h4>
                            {campaigns.map((c,i)=><div key={i} className="bg-zinc-900 p-3 rounded-lg text-xs flex justify-between"><span>{c.title}</span><span className="text-green-500">Envoyé</span></div>)}
                        </div>
                    </div>
                )}
            </div>

            {/* POS MODAL (OVERLAY) */}
            {posOrder && (
                <div className="fixed inset-0 z-50 bg-[#0F0F11] flex flex-col animate-slide-in-from-bottom">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900">
                        <h3 className="font-bold text-white">Caisse</h3>
                        <button onClick={()=>setPosOrder(null)}><X size={20}/></button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="bg-zinc-900 p-4 rounded-xl mb-4 border border-zinc-800">
                            {posOrder.booking && <div className="flex justify-between text-sm mb-2 font-bold"><span>{posOrder.booking.serviceName}</span><span>{posOrder.booking.total}.-</span></div>}
                            {posOrder.items.map((it, i) => (
                                <div key={i} className="flex justify-between text-sm text-[#D4AF37]"><span>+ {it.name}</span><span>{it.price}.-</span></div>
                            ))}
                            <div className="border-t border-zinc-800 my-2"/>
                            <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Ajouter Produit (Retail)</div>
                            <div className="grid grid-cols-2 gap-2">
                                {inventory.map(p => (
                                    <button key={p.id} onClick={()=>setPosOrder({...posOrder, items: [...posOrder.items, p], total: posOrder.total + p.price})} className="p-2 border border-zinc-700 rounded text-xs text-left hover:border-[#D4AF37]">{p.name} ({p.price}.-)</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-zinc-900 border-t border-white/5">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-zinc-500 text-sm uppercase font-bold">Total à payer</span>
                            <span className="text-5xl font-bold text-white" style={fontTitle}>{posOrder.total}.-</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={()=>{actions.checkout(posOrder.booking?.id, 'CASH', posOrder.total, posOrder.items); setPosOrder(null);}} className="py-4 bg-zinc-800 rounded-xl font-bold border border-zinc-700 hover:bg-[#D4AF37] hover:text-black">Espèces</button>
                            <button onClick={()=>{actions.checkout(posOrder.booking?.id, 'CARD', posOrder.total, posOrder.items); setPosOrder(null);}} className="py-4 bg-white text-black rounded-xl font-bold hover:scale-105">Carte</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: CLIENT EXPLORER (MAP + BOOKING V3) ---
const ClientExplorer = ({ brain, actions }) => {
    const [viewMode, setViewMode] = useState('LIST');
    const [selectedPro, setSelectedPro] = useState(null);
    const [booking, setBooking] = useState(null); // { step, service, options, staff }
    const [tab, setTab] = useState('EXPLORE');

    // MERGE MOCK + REAL
    const PROS = brain.proProfile ? [brain.proProfile, SEED_PRO] : [SEED_PRO];
    const filtered = PROS.filter(p => brain.searchCtx.category==='ALL' || p.category === brain.searchCtx.category);

    const handleConfirm = () => {
        const total = booking.service.sPrice + (booking.options?.reduce((a,o)=>a+o.price,0)||0);
        actions.addBooking({
            proId: selectedPro.id, clientName: "Moi", 
            total, serviceName: booking.service.name, staffName: booking.staff?.name,
            time: "14:00"
        });
        setSelectedPro(null); setBooking(null); setTab('BOOKINGS');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative">
            {/* Header */}
            <div className="p-6 pt-8 flex justify-between items-center border-b border-white/5 bg-black/90 backdrop-blur sticky top-0 z-30">
                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5"><MapPin size={14} className="text-[#D4AF37]"/><span className="text-sm font-bold">{brain.searchCtx.city}</span></div>
                <div className="flex bg-zinc-900 rounded-full p-1"><button onClick={()=>setViewMode('LIST')} className={`p-2 rounded-full ${viewMode==='LIST'?'bg-white text-black':''}`}><List size={14}/></button><button onClick={()=>setViewMode('MAP')} className={`p-2 rounded-full ${viewMode==='MAP'?'bg-white text-black':''}`}><MapIcon size={14}/></button></div>
                <button onClick={actions.logout} className="p-2 rounded-full bg-zinc-900"><LogOut size={16}/></button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-32">
                {tab === 'EXPLORE' && (
                    viewMode === 'LIST' ? filtered.map(pro => (
                        <div key={pro.id} onClick={()=>{setSelectedPro(pro); setBooking({step:'SERVICE', options:[]})}} className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 cursor-pointer group shadow-2xl">
                            <img src={pro.cover} className="w-full h-full object-cover transition duration-700 group-hover:scale-105"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"/>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div><h3 style={fontTitle} className="text-2xl text-white">{pro.name}</h3><p className="text-zinc-400 text-xs">{pro.category}</p></div>
                                <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg text-[#D4AF37] font-bold text-sm">Dès {pro.services?.[0]?.sPrice}.-</div>
                            </div>
                        </div>
                    )) : (
                        <div className="absolute inset-0 bg-[#111]">
                            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3}}></div>
                            {filtered.map(pro => (
                                <div key={pro.id} onClick={()=>{setSelectedPro(pro); setBooking({step:'SERVICE', options:[]})}} className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition" style={{top: `${pro.lat}%`, left: `${pro.lng}%`}}>
                                    <div className="bg-white text-black px-2 py-1 rounded-lg text-[10px] font-bold shadow-xl mb-1">{pro.services?.[0]?.sPrice}.-</div>
                                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full ring-4 ring-[#D4AF37]/30"/>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {tab === 'BOOKINGS' && (
                    <div className="space-y-4">
                        <h2 style={fontTitle} className="text-3xl mb-6">Mes RDV.</h2>
                        {brain.bookings.map(b => (
                            <div key={b.id} className="bg-zinc-900 border border-white/5 p-5 rounded-2xl flex justify-between items-center">
                                <div><div className="font-bold text-lg">{b.serviceName}</div><div className="text-xs text-zinc-500">{b.staffName} • {b.total}.-</div></div>
                                {b.status === 'COMPLETED' && !b.reviewed ? <button onClick={()=>actions.addReview(b.id, 5)} className="px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded">Noter</button> : <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded">{b.status}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DOCK */}
            <div className="p-4 pb-8 bg-black/90 backdrop-blur border-t border-white/5 flex justify-around items-center z-50">
                <button onClick={()=>setTab('EXPLORE')} className={`flex flex-col items-center gap-1 ${tab==='EXPLORE'?'text-[#D4AF37]':'text-zinc-600'}`}><Search size={20}/><span className="text-[9px] font-bold uppercase">Explorer</span></button>
                <button onClick={()=>setTab('BOOKINGS')} className={`flex flex-col items-center gap-1 ${tab==='BOOKINGS'?'text-[#D4AF37]':'text-zinc-600'}`}><CalIcon size={20}/><span className="text-[9px] font-bold uppercase">Agenda</span></button>
                <button className={`flex flex-col items-center gap-1 text-zinc-600`}><User size={20}/><span className="text-[9px] font-bold uppercase">Moi</span></button>
            </div>

            {/* BOOKING MODAL */}
            {selectedPro && (
                <div className="fixed inset-0 z-[60] bg-[#0F0F11] flex flex-col animate-slide-in-from-bottom">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center"><h3 style={fontTitle} className="text-2xl">{selectedPro.name}</h3><button onClick={()=>setSelectedPro(null)} className="p-2 bg-zinc-900 rounded-full"><X size={16}/></button></div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {booking?.step === 'SERVICE' && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase text-zinc-500">Choisir Prestation</h4>
                                {selectedPro.services.map((s,i) => (
                                    <div key={i} onClick={()=>setBooking({...booking, step:'OPTIONS', service:s})} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center hover:border-[#D4AF37] cursor-pointer">
                                        <div><div className="font-bold">{s.name}</div><div className="text-xs text-zinc-500">{s.time} min</div></div>
                                        <div className="font-bold text-[#D4AF37]">{s.sPrice}.-</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {booking?.step === 'OPTIONS' && (
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold uppercase text-zinc-500">Ajouter Options</h4>
                                {(booking.service.addons || []).map((opt, i) => (
                                    <div key={i} onClick={()=>{const exists=booking.options.includes(opt); setBooking({...booking, options: exists ? booking.options.filter(x=>x!==opt) : [...booking.options, opt]})}} className={`p-4 border rounded-xl flex justify-between cursor-pointer ${booking.options.includes(opt) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-zinc-900 border-zinc-800'}`}><span className="font-bold">{opt.name}</span><span>+{opt.price}.-</span></div>
                                ))}
                                <button onClick={()=>setBooking({...booking, step:'STAFF'})} className="w-full py-4 bg-white text-black font-bold uppercase rounded-xl">Continuer</button>
                            </div>
                        )}
                        {booking?.step === 'STAFF' && (
                            <div className="space-y-6 animate-slide-in-from-right">
                                <h4 className="text-xs font-bold uppercase text-zinc-500">Choisir Expert</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {(selectedPro.staff || []).map((st, i) => (
                                        <div key={i} onClick={()=>setBooking({...booking, step:'CONFIRM', staff: st})} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center cursor-pointer hover:border-[#D4AF37]">
                                            <div className="w-12 h-12 bg-black rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-zinc-600">{st.name[0]}</div>
                                            <div className="font-bold text-sm">{st.name}</div>
                                            <div className="text-[10px] text-zinc-500">{st.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {booking?.step === 'CONFIRM' && (
                            <div className="space-y-6 text-center pt-8">
                                <h2 className="text-4xl font-bold text-white mb-2" style={fontTitle}>{booking.service.sPrice + booking.options.reduce((a,o)=>a+o.price,0)}.-</h2>
                                <p className="text-zinc-500 text-sm">Avec {booking.staff?.name}</p>
                                <button onClick={handleConfirm} className="w-full py-4 bg-[#D4AF37] text-black font-black uppercase rounded-xl shadow-lg">Confirmer</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ROOT ---
export default function App() {
    const { state, actions } = useNexusBrain();
    if(state.view === 'LANDING') return <LandingPage onSearch={(ctx) => { actions.setSearch(ctx); actions.login(ctx.role); }} context={state.searchCtx}/>;
    if(state.view === 'PRO_SETUP') return <ProStudio profile={null} actions={actions}/>; // First time setup
    if(state.view === 'PRO_COCKPIT') return <ProCockpit profile={state.proProfile} bookings={state.bookings} ledger={state.ledger} inventory={state.inventory} campaigns={state.campaigns} clients={state.clients} actions={actions}/>;
    if(state.view === 'PRO_STUDIO') return <ProStudio profile={state.proProfile} actions={actions}/>;
    if(state.view === 'CLIENT_EXPLORER') return <ClientExplorer brain={state} actions={actions}/>;
    return null;
}
