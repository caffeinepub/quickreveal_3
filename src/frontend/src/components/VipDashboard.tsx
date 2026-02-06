import { Award, Gift, TrendingUp, Loader2 } from 'lucide-react';
import type { UserProfile } from '../backend';

interface VipDashboardProps {
  profile: UserProfile | null;
  isLoading: boolean;
}

export default function VipDashboard({ profile, isLoading }: VipDashboardProps) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center py-12">
        <p className="text-zinc-400">Profil introuvable</p>
      </div>
    );
  }

  const currentXP = Number(profile.xp);
  const currentTierXP = Number(profile.tier.requiredXP);

  const tiers = [
    { name: 'Bronze', requiredXP: 0 },
    { name: 'Silver', requiredXP: 200 },
    { name: 'Gold', requiredXP: 500 },
    { name: 'Platinum', requiredXP: 1000 }
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === profile.tier.tierName);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

  const progressPercent = nextTier
    ? Math.round(((currentXP - currentTierXP) / (nextTier.requiredXP - currentTierXP)) * 100)
    : 100;

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Platinum':
        return '#e2e8f0';
      case 'Gold':
        return '#fbbf24';
      case 'Silver':
        return '#d4d4d8';
      default:
        return '#ea580c';
    }
  };

  const tierColor = getTierColor(profile.tier.tierName);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard VIP</h2>

      {/* Circular Progress */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke={tierColor}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{ strokeDashoffset }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Award className="h-8 w-8 mb-2" style={{ color: tierColor }} />
            <div className="text-3xl font-black text-white">{progressPercent}%</div>
            <div className="text-sm text-zinc-400 mt-1">Statut {profile.tier.tierName}</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-white font-bold text-lg">{currentXP} XP</div>
          {nextTier && (
            <div className="text-zinc-500 text-sm">
              {nextTier.requiredXP - currentXP} XP pour {nextTier.name}
            </div>
          )}
        </div>
      </div>

      {/* Reward Section */}
      <div className="bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 border border-violet-500/30 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
            <Gift className="h-6 w-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">Récompense prochaine</h3>
            <p className="text-violet-300 text-sm font-medium">-20% dans 2 résas</p>
            <p className="text-zinc-400 text-xs mt-2">
              Continuez à réserver pour débloquer des avantages exclusifs
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-400" />
          Avantages Membre
        </h3>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Gagnez 50 XP par réservation confirmée
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Débloquez des récompenses exclusives
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Accès prioritaire aux établissements premium
          </li>
        </ul>
      </div>
    </div>
  );
}
