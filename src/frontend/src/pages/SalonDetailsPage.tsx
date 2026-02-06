import { useState } from 'react';
import { ChevronRight, Star, Loader2 } from 'lucide-react';
import PremiumBadge from '../components/PremiumBadge';
import Pressable from '../components/Pressable';
import MotionButton from '../components/MotionButton';
import { useBookSalon } from '../hooks/useQueries';
import { useSalonImage } from '../hooks/useSalonImage';
import { formatCHF } from '../utils/currency';
import type { Salon, Availability, Service } from '../backend';

const DATE_OPTIONS = ['Dim 12', 'Lun 13', 'Mar 14', 'Mer 15', 'Jeu 16'];
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

function SalonHeroImage({ salon }: { salon: Salon }) {
  const imageId = salon.imageIds.length > 0 ? salon.imageIds[0] : null;
  const { imageUrl, isLoading } = useSalonImage(imageId);

  const finalImageUrl = imageUrl || salon.photoUrls[0] || DEFAULT_IMAGE;

  if (isLoading) {
    return (
      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  return <img src={finalImageUrl} className="w-full h-full object-cover" alt={salon.name} />;
}

export default function SalonDetailsPage({ salon, onBack }: { salon: Salon; onBack: () => void }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);

  const { mutate: bookSalon, isPending } = useBookSalon();

  const availableSlots = salon.availabilities.filter((slot) => slot.isAvailable);

  const handleConfirm = () => {
    if (!selectedService || !selectedSlot) return;

    bookSalon(
      {
        salonName: salon.name,
        time: Number(selectedSlot.time),
        date: selectedSlot.date,
        serviceName: selectedService.name
      },
      {
        onSuccess: () => {
          onBack();
        }
      }
    );
  };

  const calculateSurge = (slot: Availability) => {
    if (!selectedService) return 0;
    if (salon.isPremium && (slot.isNight || slot.isSunday)) {
      return Math.round(Number(selectedService.price) * 0.2);
    }
    return 0;
  };

  const totalPrice = selectedService && selectedSlot ? Number(selectedService.price) + calculateSurge(selectedSlot) : 0;

  return (
    <div className="bg-black min-h-screen pb-24 animate-in slide-in-from-bottom duration-500">
      <div className="relative h-80">
        <SalonHeroImage salon={salon} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        {salon.isPremium && (
          <div className="absolute top-6 right-6 z-10">
            <PremiumBadge />
          </div>
        )}
        <Pressable
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/10 z-50"
        >
          <ChevronRight className="rotate-180" />
        </Pressable>
      </div>

      <div className="px-6 -mt-20 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-2">{salon.name}</h1>
        <div className="flex gap-4 text-sm text-zinc-400 mb-6 border-b border-zinc-800 pb-6">
          <span className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" /> 4.9
          </span>
          <span>•</span>
          <span>{salon.neighborhood}</span>
        </div>

        <div className="mb-6">
          <p className="text-zinc-300 text-sm leading-relaxed">{salon.description}</p>
        </div>

        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Date</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
          {DATE_OPTIONS.map((d, i) => (
            <Pressable
              key={i}
              onClick={() => setSelectedDate(i)}
              className={`min-w-[70px] py-3 rounded-2xl flex flex-col items-center justify-center border transition ${
                selectedDate === i ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              <span className="text-xs font-bold">{d.split(' ')[0]}</span>
              <span className="text-lg font-black">{d.split(' ')[1]}</span>
            </Pressable>
          ))}
        </div>

        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Services</h3>
        <div className="space-y-3 mb-8">
          {salon.services.map((s, i) => (
            <Pressable
              key={i}
              onClick={() => setSelectedService(s)}
              asDiv
              className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                selectedService === s ? 'bg-violet-900/30 border-violet-500' : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div>
                <div className="font-bold text-white">{s.name}</div>
                <div className="text-xs text-zinc-500">{Number(s.durationMinutes)} min</div>
              </div>
              <div className="font-bold text-white">{formatCHF(s.price)}</div>
            </Pressable>
          ))}
        </div>

        {selectedService && (
          <div className="overflow-hidden animate-in slide-in-from-top duration-300">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Créneaux disponibles</h3>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {availableSlots.map((slot, i) => {
                const surge = calculateSurge(slot);
                return (
                  <Pressable
                    key={i}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-lg border text-sm font-medium relative transition ${
                      selectedSlot === slot
                        ? 'bg-amber-500 text-black border-amber-500 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {Number(slot.time)}:00
                    {surge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-[8px] px-1.5 rounded-full">
                        +{surge}
                      </span>
                    )}
                  </Pressable>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedService && selectedSlot && (
        <div className="fixed bottom-0 w-full max-w-md bg-zinc-900 border-t border-zinc-800 p-6 z-50 flex justify-between items-center pb-8 animate-in slide-in-from-bottom duration-300">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase">Total</div>
            <div className="text-2xl font-black text-white">{formatCHF(totalPrice)}</div>
          </div>
          <MotionButton
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-100"
          >
            {isPending ? 'Confirmation...' : 'Confirmer'}
          </MotionButton>
        </div>
      )}
    </div>
  );
}
