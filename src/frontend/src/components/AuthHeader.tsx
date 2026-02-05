import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bell, LogOut } from 'lucide-react';

export default function AuthHeader({ userType }: { userType: 'client' | 'pro' }) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="px-6 pt-14 pb-4 bg-black/80 backdrop-blur sticky top-0 z-40 flex justify-between items-center border-b border-white/5">
      <div className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
        QR.
      </div>
      <div className="flex gap-4 items-center">
        <div className="bg-zinc-900 px-3 py-1 rounded-full text-xs font-bold text-zinc-400 border border-zinc-800">
          {userType === 'pro' ? 'COMPTE PRO' : 'PARIS 11e'}
        </div>
        <Bell className="text-white" size={20} />
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:text-red-400">
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
}
