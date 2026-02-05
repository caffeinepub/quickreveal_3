import { useState } from 'react';
import AuthHeader from '../components/AuthHeader';
import MonopolyModeSwitch from '../components/MonopolyModeSwitch';
import RevenueChart from '../components/RevenueChart';
import ProSalonWizard from '../components/ProSalonWizard';
import { LayoutDashboard, Calendar, Settings } from 'lucide-react';

type Tab = 'dashboard' | 'bookings' | 'profile';

const TEAM_MEMBERS = [
  { id: 1, name: 'Sarah', role: 'Expert Colorist', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 2, name: 'Marc', role: 'Night Barber', img: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' }
];

export default function ProDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>

            <MonopolyModeSwitch />
            <RevenueChart />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Weekly Revenue</div>
                <div className="text-2xl font-bold text-white">€2,100</div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Bookings</div>
                <div className="text-2xl font-bold text-white">42</div>
              </div>
            </div>

            <h3 className="font-bold text-white mt-8">My Team</h3>
            <div className="space-y-3">
              {TEAM_MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <img src={m.img} className="w-10 h-10 rounded-full" alt={m.name} />
                    <div>
                      <div className="font-bold text-white text-sm">{m.name}</div>
                      <div className="text-xs text-zinc-500">{m.role}</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-white mb-4">Create a Salon</h3>
              <ProSalonWizard />
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Calendar size={30} className="text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Bookings</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
              Your upcoming appointments will appear here. Time to get busy!
            </p>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black text-white">
                SA
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Sarah A.</h2>
                <p className="text-zinc-400 text-sm">Salon Manager</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen">
      <div className="w-full max-w-md bg-black relative shadow-2xl min-h-screen flex flex-col border-x border-zinc-900">
        <AuthHeader userType="pro" />

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="h-full animate-in fade-in duration-300">{renderContent()}</div>
        </div>

        <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 h-20 px-6 flex justify-around items-center z-50">
          <NavBtn
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavBtn
            icon={Calendar}
            label="Schedule"
            active={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
          />
          <NavBtn
            icon={Settings}
            label="Settings"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </nav>
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
