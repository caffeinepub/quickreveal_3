import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, X, Scissors, Sparkles, Feather, Zap, 
  CheckCircle2, Calendar as CalIcon, Clock, User, Users, 
  Briefcase, Plus, Trash2, LayoutGrid, Wallet, Home, 
  ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, 
  Settings, Edit3, Image as ImageIcon, LogOut, Bell, Star, 
  CreditCard, QrCode, Smartphone, Map as MapIcon, List,
  Lock, ShieldCheck, Globe, Check, Printer, ShoppingBag, 
  Megaphone, Menu, Store, PenTool, Filter, Navigation as NavIcon, 
  Heart, UserCheck, Package, FileText, Download, AlertTriangle, Crown,
  Route, CheckSquare, Smile
} from 'lucide-react';

// --- CONFIGURATION DU DESIGN ---
const fontTitle = { fontFamily: 'serif', letterSpacing: '-0.02em' }; 
const CITIES = ["Lausanne", "Genève", "Montreux", "Zurich", "Sion", "Monaco"];
const CATEGORIES = [
    { id: 'ALL', label: 'Tout', icon: LayoutGrid },
    { id: 'Barber', label: 'Barber', icon: Scissors },
    { id: 'Coiffure', label: 'Coiffure', icon: Sparkles },
    { id: 'Onglerie', label: 'Onglerie', icon: Feather },
    { id: 'Esthétique', label: 'Esthétique', icon: Zap }
];
const PLANS = [
    { id: 'STARTER', name: 'Mobile', price: 19, features: ['Agenda Intelligent', 'Zone Géo', 'Paiement Lien'] },
    { id: 'EMPIRE', name: 'Pro', price: 49, features: ['Tout Mobile', 'Multi-Staff', 'Marketing SMS', 'Export Compta'] }
];

// --- MOTEUR CENTRAL (STATE MANAGEMENT) ---
const useNexusBrain = () => {
    const [state, setState] = useState(() => {
        // Tentative de récupération locale ou initialisation par défaut
        try {
            const saved = localStorage.getItem('nexus_v12_clean');
            return saved ? JSON.parse(saved) : { 
                view: 'LANDING', 
                userRole: null, 
                proProfile: null, 
                bookings: [], clients: [], campaigns: [], 
                inventory: [{id: 'p1', name: 'Shampoing', price: 25, stock: 10}],
                ledger: { total: 0, cash: 0, card: 0, history: [] },
                searchCtx: { city: 'Genève', category: 'ALL' }
            };
        } catch (e) {
            return { view: 'LANDING', ledger: { total: 0, cash: 0, card: 0, history: [] }, bookings: [], clients: [], inventory: [], campaigns: [], searchCtx: { city: 'Genève', category: 'ALL' } };
        }
    });

    useEffect(() => { localStorage.setItem('nexus_v12_clean', JSON.stringify(state)); }, [state]);

    const actions = {
        go: (view) => setState(s => ({...s, view})),
        setSearch: (ctx) => setState(s => ({...s, searchCtx: {...s.searchCtx, ...ctx}})),
        convertPro: (plan) => setState(s => ({...s, userRole: 'PRO', view: 'PRO_ONBOARDING', proProfile: {plan, name:'', services:[{id:1, name:'Service Base', price:50, time:30}]}})),
        convertClient: () => setState(s => ({...s, userRole: 'CLIENT', view: 'CLIENT_EXPLORER'})),
        
        saveProfile: (p) => setState(s => ({...s, proProfile: {...s.proProfile, ...p}})),
        addInventory: (prod) => setState(s => ({...s, inventory: [...s.inventory, {...prod, id: Date.now()}]})),
        sendCampaign: (c) => setState(s => ({...s, campaigns: [...s.campaigns, c]})),

        addBooking: (b) => setState(s => {
            let newClients = [...s.clients];
            if(!newClients.find(c=>c.name===b.clientName)) newClients.push({id:Date.now(), name:b.clientName, visits:1, total:0});
            return {...s, bookings: [...s.bookings, {...b, id: Date.now(), status: 'CONFIRMED'}], clients: newClients};
        }),
        
        checkout: (bookingId, method, amount, items) => setState(s => {
            const newLedger = {
                total: s.ledger.total + amount,
                cash: method === 'CASH' ? s.ledger.cash + amount : s.ledger.cash,
                card: method !== 'CASH' ? s.ledger.card + amount : s.ledger.card,
                history: [{id: Date.now(), amount, method, label: bookingId ? 'Service' : 'Vente Directe', items}, ...s.ledger.history]
            };
            const newBookings = bookingId ? s.bookings.map(x => x.id === bookingId ? {...x, status: 'COMPLETED', paid: true} : x) : s.bookings;
            return {...s, ledger: newLedger, bookings: newBookings};
        }),
        
        logout: () => setState(s => ({...s, view: 'LANDING', userRole: null}))
    };
    return { state, actions };
};

/* --- 1. LANDING PAGE (MARKETING) --- */
const LandingPage = ({ actions, ctx }) => {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold tracking-tighter" style={fontTitle}>Sovereign<span className="text-yellow-600">.</span></div>
                <div className="flex gap-4">
                    <button onClick={actions.convertClient} className="text-sm font-bold uppercase hover:text-yellow-600">Espace Client</button>
                    <button onClick={()=>actions.convertPro('STARTER')} className="px-5 py-2 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase">Espace Pro</button>
                </div>
            </nav>
            
            <header className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <h1 className="text-6xl md:text-8xl leading-none text-zinc-900" style={fontTitle}>Votre bureau,<br/>c'est la route.</h1>
                    <p className="text-lg text-zinc-500">L'agenda intelligent pour les pros nomades. Gérez vos tournées, encaissez sur mobile.</p>
                    
                    <div className="bg-white p-2 rounded-full shadow-2xl border border-zinc-100 flex flex-col md:flex-row gap-2">
                        <div className="flex-1 bg-zinc-50 rounded-full px-4 py-3 flex items-center gap-2">
                            <MapPin size={16} className="text-yellow-600"/>
                            <select className="bg-transparent w-full text-sm font-bold outline-none" onChange={e=>actions.setSearch({city:e.target.value})}><option>Genève</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select>
                        </div>
                        <button onClick={actions.convertClient} className="px-6 py-3 bg-yellow-600 text-white rounded-full font-bold uppercase text-xs">Explorer</button>
                    </div>
                </div>
                <div className="relative p-8 bg-zinc-100 rounded-3xl">
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl animate-bounce border border-zinc-100">
                        <div className="flex items-center gap-3"><CheckCircle2 className="text-green-500"/><span className="font-bold">Paiement Reçu 120.-</span></div>
                    </div>
                    <div className="aspect-square bg-zinc-200 rounded-2xl flex items-center justify-center text-zinc-400">Image App Mobile</div>
                </div>
            </header>

            <section className="py-20 bg-zinc-900 text-white px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl mb-12 text-center" style={fontTitle}>Tarifs Transparents</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {PLANS.map(p => (
                            <div key={p.id} className={`p-8 rounded-3xl border ${p.id==='EMPIRE'?'bg-white text-black border-transparent':'border-zinc-700'}`}>
                                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                                <div className="text-4xl font-bold mb-6" style={fontTitle}>{p.price}.-</div>
                                <ul className="space-y-3 mb-8 text-sm opacity-80">{p.features.map(f=><li key={f} className="flex gap-2"><Check size={14}/> {f}</li>)}</ul>
                                <button onClick={()=>actions.convertPro(p.id)} className={`w-full py-4 rounded-xl font-bold uppercase text-xs ${p.id==='EMPIRE'?'bg-black text-white':'bg-white text-black'}`}>Choisir</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

/* --- 2. PRO APP (WIZARD & COCKPIT) --- */
const ProOnboarding = ({ actions }) => (
    <div className="min-h-screen bg-zinc-900 text-white p-8 flex flex-col justify-center max-w-md mx-auto">
        <h2 className="text-3xl mb-6 text-yellow-500" style={fontTitle}>Initialisation</h2>
        <input placeholder="Nom du Salon" className="bg-black p-4 rounded-xl mb-4 text-white border border-zinc-800" onChange={e=>actions.saveProfile({name:e.target.value})}/>
        <button onClick={()=>actions.go('PRO_COCKPIT')} className="w-full py-4 bg-white text-black font-bold uppercase rounded-xl">Lancer le Cockpit</button>
    </div>
);

const ProCockpit = ({ brain, actions }) => {
    const [view, setView] = useState('AGENDA');
    const [pos, setPos] = useState(null);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center font-bold text-black">{brain.proProfile?.name?.[0] || 'M'}</div>
                    <div><h2 className="font-bold text-sm">Cockpit Pro</h2><span className="text-[9px] text-green-500 uppercase">En ligne</span></div>
                </div>
                <button onClick={actions.logout} className="p-2 bg-black rounded-full"><LogOut size={16}/></button>
            </div>

            <div className="flex bg-black border-b border-white/10 p-2 gap-2 overflow-x-auto">
                {['AGENDA', 'POS', 'CLIENTS', 'MARKETING'].map(v => (
                    <button key={v} onClick={()=>setView(v)} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold ${view===v?'bg-zinc-800 text-yellow-500':'text-zinc-600'}`}>{v}</button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
                {view === 'AGENDA' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold">Aujourd'hui</h3><button onClick={()=>setPos({total:0, items:[]})} className="text-xs bg-white text-black px-3 py-1 rounded">+ Vente</button></div>
                        <div className="space-y-2 border-l border-zinc-800 ml-2 pl-4">
                            {Array.from({length:10},(_,i)=>9+i).map(h => {
                                const b = brain.bookings.find(x => new Date(x.id).getHours() === h); 
                                return (
                                    <div key={h} className="min-h-[60px] relative">
                                        <span className="absolute -left-8 text-[10px] text-zinc-600">{h}:00</span>
                                        {b ? <div onClick={()=>setPos({booking:b, total:b.total, items:[]})} className="bg-zinc-800 p-3 rounded border-l-2 border-yellow-600 cursor-pointer"><div className="font-bold text-sm">{b.clientName}</div><div className="text-xs text-zinc-500">{b.serviceName} • {b.total}.-</div></div> : <div className="border-b border-zinc-900 h-full"/>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {view === 'POS' && (
                    <div className="text-center py-20">
                        <Printer size={48} className="mx-auto mb-4 opacity-50"/>
                        <p className="text-zinc-500 text-xs">Ouvrez un RDV ou scannez un produit</p>
                        <div className="mt-8 bg-zinc-900 p-4 rounded-xl"><span className="text-xs uppercase text-zinc-500">CA Jour</span><div className="text-3xl font-bold">{brain.ledger.total}.-</div></div>
                    </div>
                )}
                
                {view === 'MARKETING' && (
                    <div className="p-4 bg-zinc-900 rounded-xl">
                        <h3 className="font-bold mb-4">Campagne SMS</h3>
                        <button onClick={()=>actions.sendCampaign({title:'Promo'})} className="w-full py-3 bg-yellow-600 text-black font-bold rounded-lg text-xs">Envoyer Promo (-20%)</button>
                        <div className="mt-4 text-xs text-zinc-500">Campagnes envoyées: {brain.campaigns.length}</div>
                    </div>
                )}
            </div>

            {pos && (
                <div className="fixed inset-0 z-50 bg-[#0F0F11] flex flex-col animate-slide-in-from-bottom">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900"><h3 className="font-bold">Caisse</h3><button onClick={()=>setPos(null)}><X/></button></div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {pos.booking && <div className="bg-zinc-900 p-4 rounded mb-4 flex justify-between"><span>{pos.booking.serviceName}</span><span>{pos.booking.total}.-</span></div>}
                        <div className="text-xs text-zinc-500 uppercase mb-2">Ajouter Produit</div>
                        <div className="grid grid-cols-2 gap-2">{brain.inventory.map(p => <button key={p.id} onClick={()=>setPos(s=>({...s, items: [...(s.items||[]), p], total:(s.total||0)+p.price}))} className="p-3 border border-zinc-800 rounded text-left text-xs hover:border-yellow-600">{p.name} <br/><b>{p.price}.-</b></button>)}</div>
                        <div className="mt-4">
                            {pos.items?.map((it, i) => <div key={i} className="flex justify-between text-sm text-yellow-600"><span>+ {it.name}</span><span>{it.price}.-</span></div>)}
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 bg-zinc-900">
                        <div className="flex justify-between mb-4"><span className="text-zinc-500">Total</span><span className="text-4xl font-bold" style={fontTitle}>{pos.total || 0}.-</span></div>
                        <button onClick={()=>{actions.checkout(pos.booking?.id, 'CARD', pos.total, pos.items); setPos(null)}} className="w-full py-4 bg-white text-black font-bold uppercase rounded text-xs">Encaisser</button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- 3. CLIENT APP --- */
const ClientExplorer = ({ brain, actions }) => {
    const [view, setView] = useState('LIST');
    const [selected, setSelected] = useState(null);

    const PROS = [{id:'p1', name:'Maison Or', city:'Genève', price:50, cover:'https://images.unsplash.com/photo-1503951914875-452162b7f304?auto=format&fit=crop&w=800&q=80'}];
    const filtered = PROS.filter(p => brain.searchCtx.city === p.city || brain.searchCtx.city === 'Genève');

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative">
            <div className="p-6 pt-8 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur z-20">
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full"><MapPin size={14} className="text-yellow-600"/><span className="text-xs font-bold">{brain.searchCtx.city}</span></div>
                <button onClick={()=>setView(v => v==='LIST'?'MAP':'LIST')} className="p-2 bg-zinc-900 rounded-full"><MapIcon size={16}/></button>
                <button onClick={actions.logout} className="p-2 bg-zinc-900 rounded-full"><LogOut size={16}/></button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {view === 'LIST' ? filtered.map(p => (
                    <div key={p.id} onClick={()=>setSelected(p)} className="mb-6 relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer group">
                        <img src={p.cover} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition"/>
                        <div className="absolute bottom-4 left-4">
                            <h3 className="text-xl font-bold" style={fontTitle}>{p.name}</h3>
                            <div className="flex items-center gap-2 mt-1"><span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded">Dès {p.price}.-</span></div>
                        </div>
                    </div>
                )) : <div className="h-full flex items-center justify-center text-zinc-600 text-xs bg-[#111]">Carte Interactive (Module GPS)</div>}
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 bg-[#0F0F11] flex flex-col animate-slide-in-from-bottom">
                    <div className="p-6 flex justify-between"><h3 className="text-xl font-bold">{selected.name}</h3><button onClick={()=>setSelected(null)}><X/></button></div>
                    <div className="flex-1 p-6 space-y-4">
                        <div onClick={()=>{actions.addBooking({clientName:'Moi', serviceName:'Coupe', total:50}); setSelected(null)}} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between cursor-pointer hover:border-yellow-600">
                            <div><div className="font-bold">Coupe Signature</div><div className="text-xs text-zinc-500">45 min</div></div>
                            <div className="font-bold text-yellow-600">50.-</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- RACINE DE L'APPLICATION --- */
export default function App() {
    const { state, actions } = useNexusBrain();
    if(state.view === 'LANDING') return <LandingPage actions={actions} ctx={state.searchCtx} />;
    if(state.view === 'PRO_ONBOARDING') return <ProOnboarding actions={actions} />;
    if(state.view === 'PRO_COCKPIT') return <ProCockpit brain={state} profile={state.proProfile} actions={actions} />;
    if(state.view === 'CLIENT_EXPLORER') return <ClientExplorer brain={state} actions={actions} />;
    return null;
}
