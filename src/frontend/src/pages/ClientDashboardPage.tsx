import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import AuthHeader from '../components/AuthHeader';
import SalonListSection from '../components/SalonListSection';
import SalonDetailsPage from './SalonDetailsPage';
import MemberCard from '../components/MemberCard';
import { Search, Calendar, User, Loader2 } from 'lucide-react';
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
          <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Calendar size={30} className="text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Bookings</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
              Your upcoming appointments will appear here. Time to treat yourself!
            </p>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 space-y-6">
            {profileLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              </div>
            ) : userProfile ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black text-white">
                    {userProfile.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                    <p className="text-zinc-400 text-sm">{userProfile.tier.tierName} Member</p>
                  </div>
                </div>

                <MemberCard profile={userProfile} />

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-white font-bold mb-3">Membership Benefits</h3>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      Earn 50 XP per confirmed booking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      Unlock exclusive rewards as you level up
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      Priority access to premium salons
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-400">Profile not found</p>
              </div>
            )}
          </div>
        );
      default:
        return <SalonListSection onSelect={setSelectedSalon} />;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen">
      <div className="w-full max-w-md bg-black relative shadow-2xl min-h-screen flex flex-col border-x border-zinc-900">
        {!selectedSalon && <AuthHeader userType="client" />}

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="h-full animate-in fade-in duration-300">{renderContent()}</div>
        </div>

        {!selectedSalon && (
          <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 h-20 px-6 flex justify-around items-center z-50">
            <NavBtn icon={Search} label="Explore" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavBtn
              icon={Calendar}
              label="Bookings"
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            />
            <NavBtn icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
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
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-violet-400' : 'text-zinc-600'}`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
