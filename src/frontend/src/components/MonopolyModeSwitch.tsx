import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function MonopolyModeSwitch() {
  const [monopolyMode, setMonopolyMode] = useState(false);

  return (
    <div
      className={`p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
        monopolyMode
          ? 'bg-gradient-to-br from-amber-900/40 to-black border-amber-500/50'
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${monopolyMode ? 'text-amber-400' : 'text-white'}`}>
            <Sparkles size={18} /> Mode Monopole
          </h3>
          <p className="text-xs text-zinc-400 mt-1">Débloquer les créneaux Premium</p>
        </div>
        <div
          onClick={() => setMonopolyMode(!monopolyMode)}
          className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 active:scale-95 ${
            monopolyMode ? 'bg-amber-500' : 'bg-zinc-700'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
              monopolyMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
