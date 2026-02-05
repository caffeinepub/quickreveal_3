import { useGetSalons } from '../hooks/useQueries';
import { Star, Loader2 } from 'lucide-react';
import PremiumBadge from './PremiumBadge';
import type { Salon } from '../backend';

const CATEGORIES = ['All', 'Hair', 'Barber', 'Spa', 'Nails'];

export default function SalonListSection({ onSelect }: { onSelect: (salon: Salon) => void }) {
  const { data: salons, isLoading, error } = useGetSalons();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-red-400">Error loading salons</p>
      </div>
    );
  }

  if (!salons || salons.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-zinc-400 mb-4">No salons available at the moment.</p>
        <p className="text-zinc-500 text-sm">Check back soon to discover our partners.</p>
      </div>
    );
  }

  const featuredSalon = salons.find(s => s.isPremium) || salons[0];

  return (
    <div className="p-6 space-y-8">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {CATEGORIES.map((cat, i) => (
          <button
            key={i}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              i === 0 ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {featuredSalon && (
        <div
          className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer"
          onClick={() => onSelect(featuredSalon)}
        >
          <img
            src={featuredSalon.photoUrls[0] || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
            alt={featuredSalon.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              {featuredSalon.isPremium && <PremiumBadge />}
              <span className="bg-violet-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Night
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{featuredSalon.name}</h2>
            <div className="flex items-center text-zinc-300 text-xs">
              <Star size={12} className="text-amber-400 fill-amber-400 mr-1" /> 4.9 (128 reviews) • {featuredSalon.neighborhood}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Recommended for you</h3>
        <div className="space-y-4">
          {salons.map((salon) => (
            <div
              key={salon.name}
              onClick={() => onSelect(salon)}
              className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition cursor-pointer"
            >
              <img
                src={salon.photoUrls[0] || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                className="w-20 h-20 rounded-xl object-cover"
                alt={salon.name}
              />
              <div className="flex-1 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white">{salon.name}</h4>
                  {salon.isPremium && <PremiumBadge />}
                </div>
                <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{salon.description}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-300">{salon.neighborhood}</span>
                  {salon.services.length > 0 && (
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-300">
                      {salon.services.length} services
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
