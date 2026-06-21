import React, { useState } from 'react';
import { Summary } from '../types';
import { Search, SortAsc, Bookmark, Calendar, Clock, Trash2, X, FileText } from 'lucide-react';

interface HistoryProps {
  summaries: Summary[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (summary: Summary) => void;
}

export function History({ summaries, onToggleFavorite, onDelete, onView }: HistoryProps) {
  const [search, setSearch] = useState("");
  
  const filteredSummaries = summaries.filter(s => !s.isDeleted && (s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))));

  return (
    <main className="flex-1 px-container-margin pt-stack-md flex flex-col gap-stack-lg max-w-2xl mx-auto w-full pb-32">
      <div className="flex items-center justify-between mt-stack-sm">
        <h1 className="text-[24px] leading-[32px] font-bold text-on-surface">Geçmiş</h1>
        <span className="text-[12px] font-medium text-outline bg-surface-container py-1 px-3 rounded-full">{summaries.length} Not</span>
      </div>

      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px] text-on-surface placeholder-on-surface-variant shadow-[0px_4px_20px_rgba(26,28,30,0.06)] pr-10" 
            placeholder="Geçmişte ara..." 
            type="text" 
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:bg-surface-variant/20 p-1 rounded-full transition-colors focus:outline-none active:scale-95">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {filteredSummaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
            <FileText className="w-10 h-10 text-outline" />
          </div>
          <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2">Geçmiş boş</h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mb-6 max-w-xs">
            Şu ana kadar oluşturulmuş bir özet bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-stack-md">
          {filteredSummaries.map((summary) => (
            <article 
              key={summary.id} 
              className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(26,28,30,0.06)] border border-outline-variant hover:border-primary transition-colors cursor-pointer group relative overflow-hidden"
              onClick={() => onView(summary)}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface line-clamp-1 pr-8">{summary.title}</h2>
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(summary.id); }}
                  className="absolute top-card-padding right-card-padding text-primary hover:scale-110 transition-transform focus:outline-none z-10"
                >
                  <Bookmark className={`w-6 h-6 ${summary.isFavorite ? 'fill-current' : 'opacity-50'}`} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-3 text-on-surface-variant text-[12px] font-medium">
                <Calendar className="w-4 h-4" />
                <span>{new Date(summary.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full mx-1"></span>
                <Clock className="w-4 h-4" />
                <span>{summary.readingTime}</span>
              </div>
              
              <p className="text-[14px] leading-[20px] text-on-surface-variant line-clamp-2 leading-relaxed">
                {summary.intro}
              </p>
              
              <div className="mt-4 flex gap-2">
                {summary.tags.map(tag => (
                  <span key={tag} className="bg-surface-container px-3 py-1 rounded-full text-[12px] font-medium text-on-surface-variant">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(summary.id); }}
                className="absolute bottom-card-padding right-card-padding text-on-surface-variant hover:text-error hover:bg-error-container/20 p-1.5 rounded-full transition-all focus:outline-none active:scale-95 z-10"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
