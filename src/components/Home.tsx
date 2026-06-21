import React, { useState } from 'react';
import { Summary } from '../types';
import { Sparkles, FileText, Trash2, ClipboardPaste } from 'lucide-react';

interface HomeProps {
  onSummarize: (text: string) => void;
  isLoading: boolean;
  activeSummary: Summary | null;
  onClearActive: () => void;
  onCopy: (text: string) => void;
  onShare: () => void;
  onToggleFavorite: (id: string) => void;
}

export function Home({ onSummarize, isLoading, activeSummary, onClearActive, onCopy, onShare, onToggleFavorite }: HomeProps) {
  const [inputText, setInputText] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    setInputText("");
    onClearActive();
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSummarize(inputText);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center px-container-margin pb-32">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-0"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000"></div>
            <div className="relative z-10 w-20 h-20 bg-surface-container-lowest rounded-full shadow-[0px_8px_32px_rgba(26,28,30,0.12)] flex items-center justify-center">
              <Sparkles className="text-primary text-4xl animate-pulse" style={{ fontSize: '2.25rem' }} />
            </div>
          </div>
          <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2">Özetleniyor</h2>
          <div className="flex gap-1.5 mt-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-[14px] leading-[20px] text-on-surface-variant mt-4 text-center max-w-xs opacity-75">
            Yapay zeka notlarınızı analiz ediyor ve en önemli noktaları çıkarıyor.
          </p>
        </div>
      </main>
    );
  }

  if (activeSummary) {
    return (
      <main className="flex-grow px-container-margin py-4 pb-32">
        <h2 className="text-[20px] leading-[28px] font-semibold mb-4 text-on-surface">Özet</h2>
        <article className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(26,28,30,0.06)] p-card-padding border border-surface-variant mb-6">
          <p className="text-[16px] leading-[24px] text-on-surface mb-6">
            {activeSummary.intro}
          </p>
          <h3 className="text-[14px] leading-[16px] font-semibold text-primary mb-3 tracking-wider">ÖNEMLİ NOKTALAR</h3>
          <ul className="space-y-3">
            {activeSummary.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
                <span className="text-[14px] leading-[20px] text-on-surface-variant">{point}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => onCopy(activeSummary.intro + '\\n\\n' + activeSummary.keyPoints.join('\\n'))}
              className="flex-1 bg-surface-variant/30 text-primary border border-primary/20 rounded-lg py-3 text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant/50 transition-colors active:scale-95 duration-150"
            >
              <ClipboardPaste className="w-5 h-5" />
              Kopyala
            </button>
            <button
              onClick={onShare}
              className="flex-1 bg-surface-variant/30 text-primary border border-primary/20 rounded-lg py-3 text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant/50 transition-colors active:scale-95 duration-150"
            >
              Share
            </button>
          </div>
        </article>
        
        <div className="flex justify-center mt-4">
           <button 
             onClick={handleClear}
             className="text-primary hover:underline text-[14px] font-medium"
           >
             Yeni Not Özetle
           </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow px-container-margin py-stack-lg flex flex-col gap-stack-lg pb-32">
      <div>
        <h2 className="text-[32px] leading-[40px] font-bold tracking-tight text-on-surface mb-2">Notunu Özetle</h2>
        <p className="text-[16px] leading-[24px] text-on-surface-variant">Karmaşık metinleri anında sadeleştirin.</p>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <div className="relative bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant hover:border-primary transition-colors duration-200 p-card-padding flex flex-col items-center justify-center gap-2 cursor-pointer group">
          <FileText className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-200" />
          <div className="text-center">
            <p className="font-semibold text-[14px] text-on-surface">PDF veya Belge Yükle</p>
            <p className="text-[14px] text-on-surface-variant">Dosyayı seçin veya sürükleyip bırakın</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <div className="relative bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(26,28,30,0.06)] border border-outline-variant focus-within:border-primary focus-within:border-2 transition-all duration-200">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 p-card-padding bg-transparent border-none resize-none focus:ring-0 text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 outline-none" 
            placeholder="Uzun metni buraya yapıştır..."
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={handleClear} aria-label="Temizle" className="p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={handlePaste} aria-label="Yapıştır" className="p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <ClipboardPaste className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!inputText.trim()}
        className="w-full py-4 bg-primary text-on-primary rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0px_8px_32px_rgba(26,28,30,0.12)] hover:bg-surface-tint active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5 fill-current" />
        Özetle
      </button>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(26,28,30,0.06)] border border-outline-variant p-card-padding flex flex-col items-center justify-center min-h-[200px] text-center gap-stack-sm opacity-70">
        <FileText className="w-10 h-10 text-outline-variant mb-2" />
        <p className="text-[16px] leading-[24px] text-on-surface-variant">Özetinizi görmek için yukarıya metin girin ve "Özetle" butonuna tıklayın.</p>
      </div>
    </main>
  );
}
