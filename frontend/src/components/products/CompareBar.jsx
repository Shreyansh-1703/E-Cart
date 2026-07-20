import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { X, ArrowRight, Layers } from 'lucide-react';

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white rounded-3xl shadow-2xl p-4 flex flex-col md:flex-row items-center gap-4 max-w-[95vw] border border-slate-800 animate-slide-up">
      <div className="flex items-center gap-2 px-2 shrink-0">
        <Layers className="w-5 h-5 text-pink-500 animate-pulse" />
        <span className="text-sm font-black uppercase tracking-wider">Compare Products</span>
        <span className="bg-pink-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
          {compareList.length}/4
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {compareList.map((p) => (
          <div key={p.id} className="flex items-center gap-2 bg-slate-800 rounded-2xl py-1 px-3 border border-slate-700">
            <span className="text-xs font-black truncate max-w-[120px]">{p.name}</span>
            <button
              onClick={() => removeFromCompare(p.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-white font-bold transition-colors uppercase tracking-widest px-3 py-2"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="bg-pink-600 hover:bg-pink-700 text-white font-black text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all active:scale-95 uppercase tracking-widest"
        >
          Compare Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default CompareBar;
