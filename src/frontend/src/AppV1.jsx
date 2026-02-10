import React, { useState, useRef } from 'react';
import { 
  Calendar, MapPin, Star, LogOut, 
  ArrowRight, Heart, X, 
  Home, Moon, ChevronLeft, Clock, Grid, 
  Check, Plus
} from 'lucide-react';

// --- DATA SOURCE ---
const DATA = [
  {
    id: 1, name: "MIDNIGHT BARBER", category: "Barber", rating: "5.0", reviews: 124,
    cover: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    location: "Lausanne", type: "Domicile", distance: "Service Mobile",
    nextSlot: "Ce soir 20:00",
    tags: ["Nocturne", "Dimanche"],
    bio: "L'art du rasage traditionnel, revisité pour l'homme moderne. Je me déplace avec mon fauteuil et mes produits d'exception.",
    services: [{ id: 101, name: "Coupe Prestige", price: 80, time: "1h" }, { id: 102, name: "Barbe & Soin", price: 45, time: "30min" }]
  },
  {
    id: 2, name: "L'ATELIER NUIT", category: "Onglerie", rating: "4.9", reviews: 89,
    cover: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    location: "Genève", type: "Salon", distance: "1.2km",
    nextSlot: "Demain 10:00",
    tags: ["Lundi", "Privé"],
    bio: "Un cocon de verre et de lumière. Spécialiste des ongles naturels et du Nail Art minimaliste.",
    services: [{ id: 201, name: "Manucure Russe", price: 100, time: "1h30" }]
  },
  {
    id: 3, name: "SUZY GLOW", category: "Esthétique", rating: "5.0", reviews: 52,
    cover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    location: "Montreux", type: "Salon", distance: "0.5km",
    nextSlot: "Dimanche 14h",
    tags: ["Dimanche"],
    bio: "Technologies de pointe (Hydrafacial, RF) pour une peau de verre. Vue sur le lac.",
    services: [{ id: 301, name: "HydraFacial Gold", price: 180, time: "1h" }]
  }
];

// --- COMPOSANTS SOPHISTIQUÉS ---

const GlassBadge = ({ icon: Icon, text, active }) => (
    <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ${active ? 'bg-white text-black border-white' : 'bg-black/30 text-white border-white/10'}`}>
        {Icon && <Icon size={10} />}
        {text}
    </div>
);

// --- CARTE "ETHEREAL" ---
const EtherealCard = ({ salon, onSelect }) => {
    return (
        <div 
            onClick={() => onSelect(salon)}
            className="group relative w-full aspect-[3/4] rounded-[32px] overflow-hidden mb-6 cursor-pointer shadow-2xl animate-fade-in"
        >
            <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"/>
            
            {/* TOP HUD */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <GlassBadge icon={salon.type === 'Domicile' ? Home : MapPin} text={salon.location} />
                {salon.tags.includes('Nocturne') && <GlassBadge icon={Moon} text="Night" active />}
            </div>

            {/* BOTTOM INFO */}
            <div className="absolute bottom-6 left-6 right-6">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-3xl font-black text-white leading-none tracking-tight">{salon.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold"><Star size={10} fill="currentColor"/> {salon.rating}</div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Prochain Slot</span>
                        <span className="text-sm text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> {salon.nextSlot}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                        <ArrowRight size={18}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DÉTAIL IMMERSIF (MODAL) ---
const EtherealDetail = ({ salon, onClose }) => {
    const [booking, setBooking] = useState(null);

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col overflow-hidden animate-scale-in">
            {/* IMAGE HEADER (PARALLAX EFFECT) */}
            <div className="relative h-[45vh] w-full flex-shrink-0">
                <img src={salon.cover} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"/>
                <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-50 hover:bg-white hover:text-black transition"><ChevronLeft size={20}/></button>
            </div>

            {/* CONTENU FLUIDE */}
            <div className="flex-1 overflow-y-auto px-6 -mt-10 relative z-10 animate-slide-up">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-4xl font-black text-white tracking-tight leading-none">{salon.name}</h2>
                    <GlassBadge text={salon.category} active />
                </div>

                <div className="space-y-8 pb-32">
                    {/* BIO SECTION */}
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
                        <p className="text-sm text-zinc-300 leading-relaxed font-medium">"{salon.bio}"</p>
                    </div>

                    {/* SERVICES SECTION */}
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Carte des Soins</h3>
                        <div className="space-y-3">
                            {salon.services.map(s => (
                                <button 
                                    key={s.id} 
                                    onClick={() => setBooking(s)}
                                    className={`w-full p-4 rounded-2xl border flex justify-between items-center transition-all duration-300 ${booking?.id === s.id ? 'bg-indigo-600/20 border-indigo-500' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'}`}
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-white text-base">{s.name}</div>
                                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1"><Clock size={10}/> {s.time}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-black text-white">{s.price}.-</span>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${booking?.id === s.id ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                                            {booking?.id === s.id && <Check size={12} className="text-white"/>}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION BAR (FLOATING) */}
            <div className="fixed bottom-8 left-6 right-6 z-50">
                <button 
                    disabled={!booking}
                    onClick={() => { alert("Réservation confirmée !"); onClose(); }}
                    className="w-full h-16 bg-white text-black rounded-full font-black uppercase tracking-widest shadow-xl shadow-white/10 disabled:opacity-50 disabled:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                    {booking ? `Réserver • ${booking.price}.-` : "Choisir un service"}
                </button>
            </div>
        </div>
    );
};

// --- STUDIO PRO (SPLIT SCREEN MIRROR) ---
const EtherealStudio = ({ onFinish }) => {
    const [preview, setPreview] = useState({ 
        name: 'Mon Salon', category: 'Barber', rating: '5.0', 
        cover: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
        location: 'Lausanne', type: 'Salon', distance: '1.2km',
        nextSlot: '20:00', tags: [], bio: '', services: [] 
    });
    const fileRef = useRef(null);

    const update = (k, v) => setPreview(p => ({...p, [k]: v}));
    const handleImg = (e) => { if(e.target.files[0]) update('cover', URL.createObjectURL(e.target.files[0])) };
    const addSrv = () => update('services', [...preview.services, {id: Date.now(), name: "Nouveau Soin", price: 50, time: "45min"}]);

    return (
        <div className="h-full bg-black text-white font-sans flex flex-col md:flex-row animate-fade-in">
            {/* EDITOR (GAUCHE) */}
            <div className="flex-1 flex flex-col border-r border-zinc-800">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-black tracking-widest text-zinc-500 uppercase">STUDIO PRO</span>
                    <button onClick={() => onFinish(null)}><X className="text-zinc-500 hover:text-white"/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <section className="space-y-4">
                        <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Identité</div>
                        <input value={preview.name} onChange={e=>update('name', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-xl font-bold focus:border-white outline-none transition" placeholder="Nom du Salon"/>
                        <div className="flex gap-2">
                            {['Barber', 'Coiffure', 'Nails'].map(c => (
                                <button key={c} onClick={()=>update('category', c)} className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase transition ${preview.category === c ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-500'}`}>{c}</button>
                            ))}
                        </div>
                        <div onClick={() => fileRef.current.click()} className="h-32 w-full border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 hover:text-white hover:border-zinc-500 transition cursor-pointer">
                            {preview.cover ? <img src={preview.cover} className="h-full w-full object-cover rounded-xl"/> : "Photo de Couverture"}
                            <input type="file" ref={fileRef} onChange={handleImg} className="hidden"/>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Offre</div>
                        <div className="flex gap-3">
                            <button onClick={()=>update('type', 'Salon')} className={`flex-1 py-3 border rounded-lg text-xs font-bold uppercase ${preview.type==='Salon'?'bg-zinc-800 border-white':'border-zinc-800'}`}>Salon</button>
                            <button onClick={()=>update('type', 'Domicile')} className={`flex-1 py-3 border rounded-lg text-xs font-bold uppercase ${preview.type==='Domicile'?'bg-emerald-900/30 border-emerald-500 text-emerald-500':'border-zinc-800'}`}>Domicile</button>
                        </div>
                        <textarea value={preview.bio} onChange={e=>update('bio', e.target.value)} className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm focus:border-white outline-none resize-none" placeholder="Votre histoire..."/>
                        
                        <div className="pt-2">
                            {preview.services.map((s, i) => (
                                <div key={i} className="flex justify-between items-center text-sm text-zinc-400 py-2 border-b border-zinc-800"><span>{s.name}</span><span>{s.price}.-</span></div>
                            ))}
                            <button onClick={addSrv} className="w-full mt-4 py-3 bg-zinc-800 rounded-lg text-xs font-bold uppercase hover:bg-zinc-700 transition">Ajouter un service</button>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-zinc-800">
                    <button onClick={() => onFinish(preview)} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition">Déployer</button>
                </div>
            </div>

            {/* PREVIEW (DROITE - CACHÉ SUR MOBILE) */}
            <div className="hidden md:flex w-[400px] bg-[#050505] border-l border-zinc-800 items-center justify-center p-8 relative">
                <div className="absolute top-6 left-0 right-0 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Aperçu Client</div>
                <div className="w-full pointer-events-none transform scale-100">
                    <EtherealCard salon={preview} onSelect={()=>{}} />
                </div>
            </div>
        </div>
    );
};

// --- APP ROOT ---
export default function App() {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [salons, setSalons] = useState(DATA);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [catFilter, setCatFilter] = useState('Tout');

  const handleDeploy = (data) => {
      if(data) {
          const s = { ...data, id: Date.now(), rating: "5.0", reviews: 0 };
          setSalons(prev => [s, ...prev]);
          setView('client');
      } else {
          setView('client');
      }
  };

  const filtered = salons.filter(s => catFilter === 'Tout' || s.category === catFilter);

  if (view === 'landing') return (
      <div className="h-screen bg-black flex flex-col justify-center items-center font-sans relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20 animate-pulse-slow"/>
          <div className="z-10 text-center space-y-12 animate-fade-in">
              <div>
                  <h1 className="text-8xl font-black text-white tracking-tighter mix-blend-difference mb-2">ETHEREAL<span className="text-indigo-500">.</span></h1>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">Beauty Operating System</p>
              </div>
              <div className="flex flex-col gap-4 w-72">
                  <button onClick={() => setView('client')} className="py-5 bg-white text-black font-black rounded-full uppercase tracking-widest shadow-2xl hover:scale-105 transition">Entrer</button>
                  <button onClick={() => setView('pro')} className="py-5 border border-zinc-700 text-zinc-400 font-black rounded-full uppercase tracking-widest hover:text-white hover:border-white transition">Créer</button>
              </div>
          </div>
      </div>
  );

  if (view === 'pro') return <EtherealStudio onFinish={handleDeploy} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md mx-auto bg-black relative min-h-screen border-x border-zinc-900 shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="px-6 py-6 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
            <span className="font-black text-xl tracking-tighter">ETHEREAL.</span>
            <button onClick={() => setView('landing')}><LogOut size={20} className="text-zinc-600 hover:text-white"/></button>
        </div>

        {/* NAVIGATION CAPSULES */}
        <div className="sticky top-[73px] z-40 bg-black/90 backdrop-blur-md pb-4 pt-2">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6">
                {['Tout', 'Barber', 'Coiffure', 'Onglerie', 'Esthétique'].map(c => (
                    <button 
                        key={c} 
                        onClick={() => setCatFilter(c)} 
                        className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${catFilter === c ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>

        {/* FEED */}
        <div className="flex-1 px-4 pt-2 pb-32">
            {filtered.map(s => <EtherealCard key={s.id} salon={s} onSelect={setSelectedSalon} />)}
            {filtered.length === 0 && <div className="text-center text-zinc-700 font-bold py-20 uppercase tracking-widest">Vide.</div>}
        </div>

        {/* FLOATING ISLAND NAV */}
        <div className="fixed bottom-8 w-full max-w-md px-10 z-40 flex justify-center pointer-events-none">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-14 shadow-2xl pointer-events-auto">
                <button onClick={() => setActiveTab('home')} className={`transition transform ${activeTab==='home' ? 'text-white scale-125' : 'text-zinc-600 hover:text-white'}`}><Grid size={22}/></button>
                <button onClick={() => setActiveTab('agenda')} className={`transition transform ${activeTab==='agenda' ? 'text-white scale-125' : 'text-zinc-600 hover:text-white'}`}><Calendar size={22}/></button>
                <button onClick={() => setActiveTab('likes')} className={`transition transform ${activeTab==='likes' ? 'text-white scale-125' : 'text-zinc-600 hover:text-white'}`}><Heart size={22}/></button>
            </div>
        </div>

        {/* DETAIL VIEW */}
        {selectedSalon && <EtherealDetail salon={selectedSalon} onClose={() => setSelectedSalon(null)} />}

      </div>
    </div>
  );
}
