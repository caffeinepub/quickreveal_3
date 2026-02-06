import { useState } from 'react';
import { useGetSalons } from '../hooks/useQueries';
import { useSalonImage } from '../hooks/useSalonImage';
import { Star, Loader2, Sparkles } from 'lucide-react';
import PremiumBadge from './PremiumBadge';
import Pressable from './Pressable';
import type { Salon } from '../backend';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

function SalonImage({ salon, className }: { salon: Salon; className?: string }) {
  const imageId = salon.imageIds.length > 0 ? salon.imageIds[0] : null;
  const { imageUrl, isLoading } = useSalonImage(imageId);

  const finalImageUrl = imageUrl || salon.photoUrls[0] || DEFAULT_IMAGE;

  if (isLoading) {
    return (
      <div className={`${className} bg-zinc-800 flex items-center justify-center`}>
        <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
      </div>
    );
  }

  return <img src={finalImageUrl} className={className} alt={salon.name} />;
}

export default function SalonListSection({ onSelect }: { onSelect: (salon: Salon) => void }) {
  const { data: salons, isLoading, error } = useGetSalons();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');

  // Fixed French categories
  const categories = ['Tout', 'Coiffure', 'Barbier', 'Spa', 'Onglerie'];

  // Filter salons based on selected category
  const filteredSalons = selectedCategory === 'Tout'
    ? salons || []
    : (salons || []).filter((salon) =>
        salon.services.some((service) => service.category === selectedCategory)
      );

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
        <p className="text-red-400">Erreur de chargement des salons</p>
      </div>
    );
  }

  if (!salons || salons.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 rounded-full flex items-center justify-center mb-6 border border-violet-500/30">
          <Sparkles size={36} className="text-violet-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Bientôt disponible</h3>
        <p className="text-zinc-400 text-sm max-w-xs">Ouverture prochaine près de chez vous...</p>
      </div>
    );
  }

  const featuredSalon = filteredSalons.find((s) => s.isPremium) || filteredSalons[0];

  return (
    <div className="p-6 space-y-8">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((cat, i) => (
          <Pressable
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            {cat}
          </Pressable>
        ))}
      </div>

      {featuredSalon && (
        <Pressable
          asDiv
          onClick={() => onSelect(featuredSalon)}
          className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer"
        >
          <SalonImage
            salon={featuredSalon}
            className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              {featuredSalon.isPremium && <PremiumBadge />}
              <span className="bg-violet-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Nuit
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{featuredSalon.name}</h2>
            <div className="flex items-center text-zinc-300 text-xs">
              <Star size={12} className="text-amber-400 fill-amber-400 mr-1" /> 4.9 (128 avis) •{' '}
              {featuredSalon.neighborhood}
            </div>
          </div>
        </Pressable>
      )}

      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          {filteredSalons.length === 0 ? 'Aucun salon trouvé' : 'Les meilleures adresses'}
        </h3>
        {filteredSalons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-zinc-500 mb-4">Aucun salon dans cette catégorie.</p>
            <Pressable
              onClick={() => setSelectedCategory('Tout')}
              className="text-sm text-violet-400 font-bold"
            >
              Voir tout
            </Pressable>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSalons.map((salon) => (
              <Pressable
                key={salon.name}
                asDiv
                onClick={() => onSelect(salon)}
                className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition cursor-pointer"
              >
                <SalonImage salon={salon} className="w-20 h-20 rounded-xl object-cover" />
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
                        {salon.services.length} {salon.services.length === 1 ? 'service' : 'services'}
                      </span>
                    )}
                  </div>
                </div>
              </Pressable>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
