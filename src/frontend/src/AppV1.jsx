import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, LayoutDashboard, User, MapPin, Star, Upload, LogOut, Instagram, Globe, Scissors } from 'lucide-react';

// --- DATA REACT (MIRROIR BACKEND POUR UX RAPIDE) ---
const INITIAL_SWISS_DATA = [
  {
    id: 1, name: "BlackBlade Hairstylist", category: "Barbier", rating: 4.8, reviews: 142,
    image: "https://images.unsplash.com/photo-1593702295094-aea8c5c93111?auto=format&fit=crop&w=800&q=80",
    badges: ["Homme", "Payerne"], location: "Payerne • Rue de Lausanne 29",
    description: "Le spécialiste de la coupe homme et de la barbe à Payerne. Ambiance moderne.",
    socials: { instagram: "blackblade_payerne", facebook: "BlackBlade Hairstylist" },
    services: [{ name: "Coupe Homme", price: 42, duration: 45 }, { name: "Taille Barbe", price: 27, duration: 30 }]
  },
  {
    id: 2, name: "Le Studio - L'Oréal", category: "Coiffure", rating: 4.9, reviews: 89,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    badges: ["Luxe", "Lausanne"], location: "Lausanne • Rue de la Louve 8",
    description: "Expertise couleur et balayage L'Oréal Professionnel au cœur de Lausanne.",
    socials: { instagram: "lestudio_lausanne", website: "manor.ch" },
    services: [{ name: "Shampoing Coupe", price: 82, duration: 60 }, { name: "Soin Signature", price: 180, duration: 90 }]
  },
  {
    id: 3, name: "Suzy Coiffure & Head Spa", category: "Spa", rating: 5.0, reviews: 56,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    badges: ["Détente", "Neuchâtel"], location: "Neuchâtel • Rue des Chavannes 13",
    description: "Expérience Head Spa unique et beauté holistique.",
    socials: { instagram: "suzy_cocooning" },
    services: [{ name: "Head Spa", price: 22, duration: 30 }, { name: "Beauté Pieds", price: 69, duration: 60 }]
  },
  {
    id: 4, name: "EMER Coiffure", category: "Coiffure", rating: 4.7, reviews: 34,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    badges: ["Tendance", "Fribourg"], location: "Fribourg • Avenue de la Gare 10",
    description: "Expert visagiste près de la gare.",
    socials: { instagram: "emer_coiffure_fribourg" },
    services: [{ name: "Coupe & Go", price: 52, duration: 45 }, { name: "Balayage", price: 179, duration: 120 }]
  }
];

// --- COMPOSANT PRO STUDIO CREATOR (GAMIFIÉ) ---
const ProStudioCreator = ({ addSalon, onFinish }) => {
  const [completion, setCompletion] = useState(0);
  const [salonData, setSalonData] = useState({
    name: '', pitch: '', city: 'Lausanne', category: 'Coiffure', image: null,
    socials: { instagram: '', website: '' }, services: []
  });
  const [tempService, setTempService] = useState({ name: '', price: '', duration: '30' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    let score = 0;
    if (salonData.name) score += 10;
    if (salonData.image) score += 20;
    if (salonData.pitch) score += 10;
    if (salonData.socials.instagram) score += 10;
    if (salonData.services.length > 0) score += 20;
    if (salonData.services.length > 2) score += 10;
    setCompletion(score);
  }, [salonData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSalonData({ ...salonData, image: URL.createObjectURL(file) });
  };

  const addService = () => {
    if (tempService.name && tempService.price) {
      setSalonData({ ...salonData, services: [...salonData.services, { ...tempService, id: Date.now() }] });
      setTempService({ ...tempService, name: '', price: '' });
    }
  };

  const handlePublish = () => {
    addSalon({
      id: Date.now(), ...salonData, rating: 5.0, reviews: 0,
      badges: ["Nouveau", "Suisse"], location: `${salonData.city} • Centre`,
      description: salonData.pitch || "L'excellence suisse."
    });
    onFinish();
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <div className="px-6 pt-6 pb-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Studio Créateur</h2>
          <div className="text-xs font-mono font-bold text-zinc-400">Qualité : <span className={completion === 100 ? "text-green-500" : "text-amber-500"}>{completion}%</span></div>
        </div>
        <div className="h-2 bg-black rounded-full overflow-hidden border border-zinc-800">
          <div style={{ width: `${completion}%` }} className={`h-full transition-all duration-300 ${completion === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-red-600 to-amber-500'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
        {/* Identité */}
        <section className="space-y-4">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">1</div><h3 className="font-bold">Identité Visuelle</h3></div>
          <div onClick={() => fileInputRef.current.click()} className="aspect-video rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
            {salonData.image ? <img src={salonData.image} className="w-full h-full object-cover" alt="Salon" /> : <div className="text-center"><Upload size={20} className="mx-auto mb-2 text-zinc-500"/><span className="text-xs text-zinc-500">Importer photo</span></div>}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
          <input value={salonData.name} onChange={e => setSalonData({...salonData, name: e.target.value})} placeholder="Nom de l'établissement" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold text-white outline-none" />
          <div className="flex gap-2">
             {["Coiffure", "Barbier", "Spa", "Onglerie"].map(c => (
                <button key={c} onClick={() => setSalonData({...salonData, category: c})} className={`text-[10px] px-3 py-2 rounded-lg border ${salonData.category === c ? 'bg-white text-black' : 'bg-zinc-900 border-zinc-800'}`}>{c}</button>
             ))}
          </div>
          <textarea value={salonData.pitch} onChange={e => setSalonData({...salonData, pitch: e.target.value})} placeholder="Votre Pitch..." className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm text-zinc-300 outline-none" />
        </section>

        {/* Services */}
        <section className="space-y-4">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">2</div><h3 className="font-bold">Carte des Services</h3></div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
               <input placeholder="Nom" value={tempService.name} onChange={e => setTempService({...tempService, name: e.target.value})} className="col-span-2 bg-black border border-zinc-800 p-3 rounded-lg text-sm" />
               <input placeholder="CHF" type="number" value={tempService.price} onChange={e => setTempService({...tempService, price: e.target.value})} className="bg-black border border-zinc-800 p-3 rounded-lg text-sm" />
            </div>
            <button onClick={addService} className="w-full bg-white text-black py-2 rounded-lg text-xs font-bold">Ajouter</button>
          </div>
          <div className="space-y-2">
            {salonData.services.map((s) => (<div key={s.id} className="flex justify-between p-3 bg-zinc-900 rounded-xl border-l-2 border-red-500"><span className="text-sm">{s.name}</span><span className="font-bold">{s.price} CHF</span></div>))}
          </div>
        </section>
      </div>
      <div className="p-6 bg-black border-t border-zinc-900">
        <button onClick={handlePublish} disabled={completion < 40} className={`w-full py-4 rounded-xl font-bold ${completion < 40 ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-600 text-white'}`}>
           {completion < 40 ? `Complétez le profil (${completion}%)` : "Lancer mon Établissement"}
        </button>
      </div>
    </div>
  );
};

// --- APP SHELL & ROUTING ---
export default function AppV1() {
  const [view, setView] = useState('landing');
  const [userType, setUserType] = useState(null);
  const [salons, setSalons] = useState([]);

  useEffect(() => { setSalons(INITIAL_SWISS_DATA); }, []);

  const handleAddSalon = (newSalon) => {
    setSalons(prev => [newSalon, ...prev]);
    setView('app');
  };

  if (view === 'landing') return <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center"><h1 className="text-4xl font-black text-white mb-4">QuickReveal<span className="text-red-600">.</span></h1><button onClick={() => setView('auth')} className="bg-white text-black px-8 py-3 rounded-full font-bold">Commencer</button></div>;
  if (view === 'auth') return <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 space-y-4"><button onClick={() => {setUserType('client'); setView('app')}} className="w-full max-w-xs bg-zinc-900 p-6 rounded-2xl text-white font-bold">Espace Client</button><button onClick={() => {setUserType('pro'); setView('app')}} className="w-full max-w-xs bg-red-600 p-6 rounded-2xl text-white font-bold">Espace Pro</button></div>;

  return <AppShell userType={userType} salons={salons} addSalon={handleAddSalon} onLogout={() => setView('landing')} />;
}

const AppShell = ({ userType, salons, addSalon, onLogout }) => {
  const [activeTab, setActiveTab] = useState(userType === 'pro' ? 'dashboard' : 'home');
  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen font-sans text-white">
      <div className="w-full max-w-md bg-black relative shadow-2xl min-h-screen flex flex-col border-x border-zinc-900 overflow-hidden">
        <header className="px-6 pt-14 pb-4 bg-black/80 backdrop-blur sticky top-0 z-40 flex justify-between items-center border-b border-white/5">
           <div className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">QR.</div>
           <div className="bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-400 border border-zinc-800 flex items-center gap-1"><MapPin size={10} /> SUISSE ROMANDE</div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'create' ? <ProStudioCreator addSalon={addSalon} onFinish={() => setActiveTab('dashboard')} /> : 
           activeTab === 'home' ? <ClientHome salons={salons} /> : <div className="p-10 text-center text-zinc-500">Dashboard Pro</div>}
        </div>
        <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 h-20 px-6 flex justify-around items-center z-50 pb-2">
          {userType === 'client' ? (
             <><button onClick={() => setActiveTab('home')} className="text-white"><Search/></button><button className="text-zinc-600"><Calendar/></button></>
          ) : (
             <><button onClick={() => setActiveTab('dashboard')} className="text-white"><LayoutDashboard/></button><div className="relative -top-6"><button onClick={() => setActiveTab('create')} className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white border-4 border-black"><Scissors size={24} /></button></div><button onClick={onLogout} className="text-zinc-600"><LogOut/></button></>
          )}
        </nav>
      </div>
    </div>
  );
};

const ClientHome = ({ salons }) => {
  const [filter, setFilter] = useState("Tout");
  const filtered = filter === "Tout" ? salons : salons.filter(s => s.category === filter);
  return (
    <div className="p-6 pb-24 overflow-y-auto h-full">
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {["Tout", "Coiffure", "Barbier", "Spa", "Onglerie"].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${filter === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>{cat}</button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map(salon => (
          <div key={salon.id} className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <img src={salon.image} className="w-24 h-24 rounded-xl object-cover bg-zinc-800" alt={salon.name} />
            <div className="flex-1 py-1 flex flex-col justify-between">
              <div><h4 className="font-bold text-white text-base">{salon.name}</h4><p className="text-xs text-zinc-500 mb-1">{salon.location}</p></div>
              <div className="flex items-center gap-1 text-xs text-amber-500"><Star size={10} fill="currentColor"/> {salon.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
