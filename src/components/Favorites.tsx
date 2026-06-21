import React, { useState } from 'react';
import { Summary } from '../types';
import { Search, Star, SortAsc, Bookmark, Calendar, Clock, Trash2, X } from 'lucide-react';

interface FavoritesProps {
  summaries: Summary[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (summary: Summary) => void;
}

export function Favorites({ summaries, onToggleFavorite, onDelete, onView }: FavoritesProps) {
  const [search, setSearch] = useState("");
  
  const favoriteSummaries = summaries.filter(s => s.isFavorite && !s.isDeleted && (s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))));

  return (
    <main className="flex-1 px-container-margin pt-stack-md flex flex-col gap-stack-lg max-w-2xl mx-auto w-full pb-32">
      <div className="flex items-center justify-between mb-4 mt-stack-sm">
        <h1 className="text-[20px] leading-[28px] font-bold text-on-surface">Favorilerim</h1>
        <span className="text-[12px] font-medium text-outline bg-surface-container py-1 px-3 rounded-full">{favoriteSummaries.length} Not</span>
      </div>

      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px] text-on-surface placeholder-on-surface-variant shadow-[0px_4px_20px_rgba(26,28,30,0.06)] pr-10" 
            placeholder="Favorilerde ara..." 
            type="text" 
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:bg-surface-variant/20 p-1 rounded-full transition-colors focus:outline-none active:scale-95">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {favoriteSummaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
            <Star className="w-10 h-10 text-outline" />
          </div>
          <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2">Henüz favori eklenmemiş</h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mb-6 max-w-xs">
            Özetlerinizi okurken yıldız ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {favoriteSummaries.map((summary, index) => {
            const isBlue = index % 2 === 0;
            return (
              <div 
                key={summary.id} 
                className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(26,28,30,0.06)] border border-outline-variant/20 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer"
                onClick={() => onView(summary)}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${isBlue ? 'from-primary-fixed-dim/30' : 'from-secondary-container/50'} to-transparent rounded-bl-full pointer-events-none`}></div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    {summary.tags.map(tag => (
                      <span key={tag} className={`text-[12px] font-medium px-2 py-1 rounded-md ${isBlue ? 'text-primary bg-primary-fixed/50' : 'text-secondary bg-secondary-fixed/50'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(summary.id); }}
                    className="text-primary hover:bg-surface-container transition-colors p-1 rounded-full z-10"
                  >
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>
                </div>
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2 leading-tight line-clamp-1 pr-6">{summary.title}</h3>
                <p className="text-[14px] leading-[20px] text-on-surface-variant line-clamp-2 mb-4">
                  {summary.intro}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-outline text-[12px] font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(summary.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(summary.id); }}
                    className="text-on-surface-variant hover:text-error hover:bg-error-container/20 p-1.5 rounded-full transition-all focus:outline-none active:scale-95 z-10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
