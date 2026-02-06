import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import AuthHeader from '../components/AuthHeader';
import SalonListSection from '../components/SalonListSection';
import SalonDetailsPage from './SalonDetailsPage';
import VipDashboard from '../components/VipDashboard';
import Pressable from '../components/Pressable';
import MotionButton from '../components/MotionButton';
import { Search, Calendar, User, Sparkles } from 'lucide-react';
import type { Salon } from '../backend';

type Tab = 'home' | 'bookings' | 'profile';

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const renderContent = () => {
    if (selectedSalon) {
      return <SalonDetailsPage salon={selectedSalon} onBack={() => setSelectedSalon(null)} />;
    }

    switch (activeTab) {
      case 'home':
        return <SalonListSection onSelect={setSelectedSalon} />;
      case 'bookings':
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 rounded-full flex items-center justify-center mb-6 border border-violet-500/30">
              <Calendar size={36} className="text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Agenda vide</h3>
            <p className="text-zinc-400 text-sm max-w-xs mb-6">
              Vos prochains rendez-vous apparaîtront ici. Il est temps de vous faire plaisir !
            </p>
            <MotionButton
              onClick={() => setActiveTab('home')}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold px-6 py-3 rounded-xl"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Trouver une dispo ce soir
            </MotionButton>
          </div>
        );
      case 'profile':
        return <VipDashboard profile={userProfile || null} isLoading={profileLoading} />;
      default:
        return <SalonListSection onSelect={setSelectedSalon} />;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen">
      <div className="w-full max-w-md bg-black relative shadow-2xl min-h-screen flex flex-col border-x border-zinc-900">
        {!selectedSalon && <AuthHeader userType="client" />}

        <div className="flex-1 overflow-y-auto pb-24">
          <div key={selectedSalon ? 'salon-details' : activeTab} className="h-full animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </div>

        {!selectedSalon && (
          <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 h-20 px-6 flex justify-around items-center z-50">
            <NavBtn
              icon={Search}
              label="Découvrir"
              active={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
            />
            <NavBtn
              icon={Calendar}
              label="Mon Agenda"
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            />
            <NavBtn icon={User} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </nav>
        )}
      </div>
    </div>
  );
}

function NavBtn({
  icon: Icon,
  label,
  active,
  onClick
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-violet-400' : 'text-zinc-600'}`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </Pressable>
  );
}
