import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Favorites } from './components/Favorites';
import { History } from './components/History';
import { Trash } from './components/Trash';
import { Summary } from './types';
import { Brain, Search, Home as HomeIcon, Star, History as HistoryIcon, Trash2, X, MessageCircle, Mail, MessageSquare, StickyNote, MoreHorizontal, Camera, Link as LinkIcon, Menu } from 'lucide-react';

type Tab = 'home' | 'favorites' | 'history' | 'trash';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>(() => {
    try {
      const saved = localStorage.getItem('ai-not-ozetleyici-data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSummary, setActiveSummary] = useState<Summary | null>(null);
  
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [sharePromptVisible, setSharePromptVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai-not-ozetleyici-data', JSON.stringify(summaries));
  }, [summaries]);

  const handleSummarize = async (text: string) => {
    setIsLoading(true);
    setActiveSummary(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      
      if (!res.ok) throw new Error("Failed to summarize");
      
      const data = await res.json();
      
      const newSummary: Summary = {
        id: Date.now().toString(),
        title: data.title,
        intro: data.intro,
        keyPoints: data.keyPoints,
        tags: data.tags,
        readingTime: data.readingTime,
        date: new Date().toISOString(),
        isFavorite: false,
        originalText: text
      };
      
      setSummaries(prev => [newSummary, ...prev]);
      setActiveSummary(newSummary);
      
    } catch (err) {
      console.error(err);
      alert("Özetleme sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setSummaries(prev => prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
    if (activeSummary && activeSummary.id === id) {
      setActiveSummary({ ...activeSummary, isFavorite: !activeSummary.isFavorite });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteModalId(id);
  };

  const confirmDelete = () => {
    if (deleteModalId) {
      setSummaries(prev => prev.map(s => s.id === deleteModalId ? { ...s, isDeleted: true } : s));
      if (activeSummary && activeSummary.id === deleteModalId) {
        setActiveSummary(null);
      }
      setDeleteModalId(null);
    }
  };

  const handleRestore = (id: string) => {
    setSummaries(prev => prev.map(s => s.id === id ? { ...s, isDeleted: false } : s));
  };

  const handleHardDelete = (id: string) => {
    setSummaries(prev => prev.filter(s => s.id !== id));
  };

  const handleHardDeleteAll = () => {
    if (confirm("Çöp kutusunu tamamen boşaltmak istediğinize emin misiniz?")) {
      setSummaries(prev => prev.filter(s => !s.isDeleted));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Panoya kopyalandı!");
  };

  const shareText = activeSummary 
    ? `${activeSummary.title}\n\n${activeSummary.intro}\n\nÖnemli Noktalar:\n${activeSummary.keyPoints.map(p => '- ' + p).join('\n')}`
    : '';

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    setSharePromptVisible(false);
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(activeSummary?.title || 'Özet')}&body=${encodeURIComponent(shareText)}`;
    setSharePromptVisible(false);
  };

  const handleShareSMS = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const href = isIOS ? `sms:&body=${encodeURIComponent(shareText)}` : `sms:?body=${encodeURIComponent(shareText)}`;
    window.location.href = href;
    setSharePromptVisible(false);
  };

  const handleSaveToNotes = () => {
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSummary?.title ? activeSummary.title.replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s]/gi, '_').toLowerCase() : 'ozet'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSharePromptVisible(false);
  };

  const handleAddToFavorites = () => {
    if (activeSummary) {
      handleToggleFavorite(activeSummary.id);
    }
    setSharePromptVisible(false);
  };

  const handleShareMore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeSummary?.title || 'AI Not Özetleyici',
          text: shareText,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      alert("Cihazınız paylaşım özelliğini desteklemiyor. Metin panoya kopyalandı.");
      navigator.clipboard.writeText(shareText);
    }
    setSharePromptVisible(false);
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(shareText);
    alert("Özet kopyalandı! Instagram uygulamasını açıp yapıştırabilirsiniz.");
    setSharePromptVisible(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Bağlantı kopyalandı!");
    setSharePromptVisible(false);
  };

  const handleView = (summary: Summary) => {
    setActiveSummary(summary);
    setActiveTab('home');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
      <header className="w-full top-0 sticky bg-surface z-40">
        <div className="flex items-center justify-between px-container-margin py-stack-md w-full max-w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1 -ml-1 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveTab('home'); setActiveSummary(null);}}>
              <Brain className="text-primary w-7 h-7" />
              <h1 className="text-[20px] font-bold text-primary tracking-tight">AI Not Özetleyici</h1>
            </div>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <Home 
          onSummarize={handleSummarize} 
          isLoading={isLoading} 
          activeSummary={activeSummary}
          onClearActive={() => setActiveSummary(null)}
          onCopy={handleCopy}
          onShare={() => setSharePromptVisible(true)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {activeTab === 'favorites' && (
        <Favorites 
          summaries={summaries} 
          onToggleFavorite={handleToggleFavorite} 
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {activeTab === 'history' && (
        <History 
          summaries={summaries} 
          onToggleFavorite={handleToggleFavorite} 
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {activeTab === 'trash' && (
        <Trash 
          summaries={summaries} 
          onRestore={handleRestore}
          onHardDelete={handleHardDelete}
          onHardDeleteAll={handleHardDeleteAll}
        />
      )}

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[70] transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-surface-container-lowest shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-[80] transform transition-transform duration-300 flex flex-col">
            <div className="p-container-margin flex items-center justify-between border-b border-surface-variant">
              <div className="flex items-center gap-2">
                <Brain className="text-primary w-6 h-6" />
                <span className="font-bold text-[16px] text-primary">AI Not Özetleyici</span>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 -mr-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
              <DrawerItem icon={<HomeIcon />} label="Ana Sayfa" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setIsDrawerOpen(false); }} />
              <DrawerItem icon={<Star />} label="Favorilerim" active={activeTab === 'favorites'} onClick={() => { setActiveTab('favorites'); setIsDrawerOpen(false); }} />
              <DrawerItem icon={<HistoryIcon />} label="Geçmiş" active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setIsDrawerOpen(false); }} />
              <DrawerItem icon={<Trash2 />} label="Çöp Kutusu" active={activeTab === 'trash'} onClick={() => { setActiveTab('trash'); setIsDrawerOpen(false); }} />
            </nav>
          </div>
        </>
      )}

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-container-margin pb-8 pt-stack-sm bg-surface-container-lowest z-50 rounded-t-xl shadow-[0px_-4px_20px_rgba(26,28,30,0.06)] md:hidden">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center transition-colors group px-4 py-1 rounded-full ${activeTab === 'home' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
        >
          <HomeIcon className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'fill-current' : ''}`} />
          <span className="text-[12px] font-medium">Ana Sayfa</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center justify-center transition-colors group px-4 py-1 rounded-full ${activeTab === 'favorites' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
        >
          <Star className={`w-6 h-6 mb-1 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
          <span className="text-[12px] font-medium">Favorilerim</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center transition-colors group px-4 py-1 rounded-full ${activeTab === 'history' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
        >
          <HistoryIcon className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-medium">Geçmiş</span>
        </button>
      </nav>

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-[60] flex items-center justify-center p-container-margin">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[16px] shadow-[0px_8px_32px_rgba(26,28,30,0.12)] p-card-padding flex flex-col items-center text-center transform transition-all scale-100 opacity-100">
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mb-stack-md">
              <Trash2 className="text-error w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold text-on-surface mb-stack-sm">Notu Sil</h3>
            <p className="text-[14px] text-on-surface-variant mb-stack-lg">
              Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="w-full flex flex-col gap-stack-sm">
              <button 
                onClick={confirmDelete}
                className="w-full bg-error hover:bg-error/90 active:scale-[0.98] transition-all text-on-error font-semibold text-[14px] py-3 px-6 rounded-lg shadow-sm"
              >
                Sil
              </button>
              <button 
                onClick={() => setDeleteModalId(null)}
                className="w-full bg-transparent border border-outline-variant hover:bg-surface-container-highest active:scale-[0.98] transition-all text-on-surface font-semibold text-[14px] py-3 px-6 rounded-lg"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Sheet */}
      {sharePromptVisible && (
        <>
          <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setSharePromptVisible(false)}></div>
          <div className="fixed bottom-0 left-0 w-full bg-surface rounded-t-[1.5rem] shadow-[0px_8px_32px_rgba(26,28,30,0.12)] z-[61] transform transition-transform duration-300 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-outline-variant rounded-full"></div>
            </div>
            <div className="px-container-margin pt-stack-sm pb-stack-lg">
              <div className="flex justify-between items-center mb-stack-lg">
                <h2 className="text-[20px] font-semibold text-on-surface">Paylaş</h2>
                <button 
                  onClick={() => setSharePromptVisible(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-y-stack-lg gap-x-gutter-md">
                <ShareOption icon={<MessageCircle className="text-primary w-7 h-7" />} label="WhatsApp" onClick={handleShareWhatsApp} />
                <ShareOption icon={<Mail className="text-primary w-7 h-7" />} label="E-posta" onClick={handleShareEmail} />
                <ShareOption icon={<MessageSquare className="text-primary w-7 h-7" />} label="Mesajlar" onClick={handleShareSMS} />
                <ShareOption icon={<StickyNote className="text-primary w-7 h-7" />} label={"Notlara\nKaydet"} onClick={handleSaveToNotes} />
                <ShareOption icon={<Star className={`w-7 h-7 ${activeSummary?.isFavorite ? 'fill-current text-primary' : 'text-primary'}`} />} label={activeSummary?.isFavorite ? "Favorilerden\nÇıkar" : "Favorilere\nEkle"} onClick={handleAddToFavorites} />
                <ShareOption icon={<MoreHorizontal className="text-on-surface w-7 h-7" />} label="Daha Fazla" isDark onClick={handleShareMore} />
                <ShareOption icon={<Camera className="text-primary w-7 h-7" />} label="Instagram" onClick={handleShareInstagram} />
              </div>
              
              <div 
                className="mt-stack-lg p-card-padding rounded-xl bg-surface-container-lowest border border-surface-variant flex items-center justify-between cursor-pointer hover:bg-surface-container active:bg-surface-container-high transition-colors"
                onClick={handleCopyLink}
              >
                <div className="flex items-center gap-gutter-md overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <LinkIcon className="text-on-secondary-container w-5 h-5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-[14px] text-on-surface truncate">Bağlantıyı Kopyala</span>
                    <span className="text-[14px] text-on-surface-variant truncate">
                      {typeof window !== 'undefined' ? window.location.href : 'ainot.app/...'}
                    </span>
                  </div>
                </div>
                <button className="font-semibold text-[14px] text-primary pl-4 pointer-events-none">Kopyala</button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

function ShareOption({ icon, label, isDark = false, onClick }: { icon: React.ReactNode, label: string, isDark?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center group active:scale-95 transition-transform duration-150">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-stack-sm transition-colors ${isDark ? 'bg-surface-container-high group-hover:bg-surface-variant' : 'bg-surface-container group-hover:bg-primary-container'}`}>
        {icon}
      </div>
      <span className="text-[12px] font-medium text-on-surface-variant text-center leading-tight whitespace-pre-line">
        {label}
      </span>
    </button>
  );
}

function DrawerItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-[14px] ${active ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
    >
      <div className={`w-5 h-5 ${active ? 'fill-current' : ''}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}
