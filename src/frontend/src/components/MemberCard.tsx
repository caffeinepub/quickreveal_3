import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp } from 'lucide-react';
import type { UserProfile } from '../backend';

interface MemberCardProps {
  profile: UserProfile;
}

export default function MemberCard({ profile }: MemberCardProps) {
  const currentXP = Number(profile.xp);
  const currentTierXP = Number(profile.tier.requiredXP);

  // Calculate next tier
  const tiers = [
    { name: 'Bronze', requiredXP: 0 },
    { name: 'Silver', requiredXP: 200 },
    { name: 'Gold', requiredXP: 500 },
    { name: 'Platinum', requiredXP: 1000 }
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === profile.tier.tierName);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

  const progressToNextTier = nextTier
    ? ((currentXP - currentTierXP) / (nextTier.requiredXP - currentTierXP)) * 100
    : 100;

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Platinum':
        return 'from-slate-300 to-slate-500';
      case 'Gold':
        return 'from-amber-400 to-yellow-600';
      case 'Silver':
        return 'from-zinc-300 to-zinc-500';
      default:
        return 'from-orange-600 to-orange-800';
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getTierColor(profile.tier.tierName)} border-0 overflow-hidden`}>
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg">Membre {profile.tier.tierName}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-bold">{currentXP} XP</span>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/90 text-xs font-medium">
                {nextTier ? `Progression vers ${nextTier.name}` : 'Niveau Maximum Atteint'}
              </span>
              {nextTier && (
                <span className="text-white/90 text-xs font-medium">{nextTier.requiredXP - currentXP} XP restants</span>
              )}
            </div>
            <Progress value={progressToNextTier} className="h-2 bg-white/20" />
          </div>

          <div className="flex items-center gap-1 text-white/80 text-xs mt-3">
            <TrendingUp className="h-3 w-3" />
            <span>Gagnez 50 XP par réservation confirmée</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
