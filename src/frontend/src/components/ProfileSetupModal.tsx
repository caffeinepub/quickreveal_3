import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MotionButton from './MotionButton';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveProfile({
      name: name.trim(),
      role,
      xp: BigInt(0),
      tier: {
        tierName: 'Bronze',
        requiredXP: BigInt(0)
      }
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Bienvenue sur QuickReveal</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Veuillez compléter votre profil pour continuer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Type de compte</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'client' | 'pro')}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="pro">Professionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <MotionButton type="submit" disabled={isPending || !name.trim()} className="w-full">
            {isPending ? 'Enregistrement...' : 'Continuer'}
          </MotionButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
