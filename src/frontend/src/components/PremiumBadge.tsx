import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export default function PremiumBadge() {
  return (
    <Badge className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-[10px] px-2 py-0.5 uppercase border-0">
      <Crown className="h-3 w-3 mr-1" />
      Premium
    </Badge>
  );
}
