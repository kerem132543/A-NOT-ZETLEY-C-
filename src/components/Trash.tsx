import React, { useState } from 'react';
import { Summary } from '../types';
import { Search, Undo2, Trash2, X, FileMinus } from 'lucide-react';

interface TrashProps {
  summaries: Summary[];
  onRestore: (id: string) => void;
  onHardDelete: (id: string) => void;
  onHardDeleteAll: () => void;
}

export function Trash({ summaries, onRestore, onHardDelete, onHardDeleteAll }: TrashProps) {
  const [search, setSearch] = useState("");
  
  const deletedSummaries = summaries.filter(s => s.isDeleted && (s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))));

  return (
    <main className="flex-1 px-container-margin pt-stack-md flex flex-col gap-stack-lg max-w-2xl mx-auto w-full pb-32">
      <div className="flex items-center justify-between mt-stack-sm">
        <h1 className="text-[24px] leading-[32px] font-bold text-on-surface">Çöp Kutusu</h1>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-outline bg-surface-container py-1 px-3 rounded-full">{deletedSummaries.length} Not</span>
          {deletedSummaries.length > 0 && (
            <button 
              onClick={onHardDeleteAll}
              className="text-[12px] font-medium text-error hover:bg-error-container/20 py-1 px-3 rounded-full transition-colors"
            >
              Tümünü Boşalt
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-error focus:ring-1 focus:ring-error outline-none transition-all text-[14px] text-on-surface placeholder-on-surface-variant shadow-[0px_4px_20px_rgba(26,28,30,0.06)] pr-10" 
            placeholder="Çöp kutusunda ara..." 
            type="text" 
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:bg-surface-variant/20 p-1 rounded-full transition-colors focus:outline-none active:scale-95">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {deletedSummaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
            <FileMinus className="w-10 h-10 text-outline" />
          </div>
          <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2">Çöp kutusu boş</h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mb-6 max-w-xs">
            Burada silinen notlarınız görüntülenir.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-stack-md">
          {deletedSummaries.map((summary) => (
            <article 
              key={summary.id} 
              className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(26,28,30,0.06)] border border-outline-variant transition-colors relative overflow-hidden opacity-80"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface line-clamp-1 pr-16">{summary.title}</h2>
              </div>
              
              <div className="flex items-center gap-2 mb-3 text-on-surface-variant text-[12px] font-medium">
                <span>{new Date(summary.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              
              <p className="text-[14px] leading-[20px] text-on-surface-variant line-clamp-2 leading-relaxed">
                {summary.intro}
              </p>
              
              <div className="mt-4 flex gap-2 justify-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); onRestore(summary.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-[13px] font-medium text-on-surface-variant transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  Geri Yükle
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onHardDelete(summary.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 hover:bg-error/20 rounded-lg text-[13px] font-medium text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Kalıcı Olarak Sil
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
