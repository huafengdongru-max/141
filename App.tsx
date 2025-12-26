import React, { useState } from 'react';
import { MemeState, SuggestedCaption } from './types';
import { TRENDING_TEMPLATES } from './constants';
import { generateMagicCaptions } from './geminiService';
// Import from components/ to avoid root casing conflict and ambiguity
import MemeCanvas from './components/MemeCanvas';
import { Wand2, Camera, Baby, User, Download, RefreshCw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [isKidMode, setIsKidMode] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentBase64, setCurrentBase64] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedCaption[]>([]);
  const [state, setState] = useState<MemeState>({
    imageUrl: TRENDING_TEMPLATES[0].url,
    topText: 'WOW!',
    bottomText: 'LOOK AT THIS CAT',
    fontSize: 60,
    textColor: '#ffffff'
  });

  const handleMagic = async () => {
    if (!currentBase64) {
        alert("请先上传或选择一张图片");
        return;
    }
    setIsAnalyzing(true);
    try {
      const results = await generateMagicCaptions(currentBase64, isKidMode);
      setSuggestions(results);
      if (results.length > 0) {
        setState(prev => ({ ...prev, topText: results[0].top, bottomText: results[0].bottom }));
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
    } catch (e) {
      console.error(e);
      alert("AI 脑暴失败。请检查后台 API_KEY 是否设置。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setState(p => ({ ...p, imageUrl: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `MemeMagic-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 glass p-6 md:p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center rotate-3 shadow-2xl">
              <Zap className="text-white fill-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                MEME <span className="text-indigo-400">MAGIC</span>
              </h1>
              <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase mt-1">
                AI Meme Laboratory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl">
            <button 
              onClick={() => setIsKidMode(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isKidMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-white/5 text-slate-500'}`}
            >
              <Baby size={18} />
              宝宝模式
            </button>
            <button 
              onClick={() => setIsKidMode(false)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${!isKidMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'hover:bg-white/5 text-slate-500'}`}
            >
              <User size={18} />
              逗比模式
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <MemeCanvas state={state} onImageProcess={setCurrentBase64} />
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleMagic} 
                disabled={isAnalyzing} 
                className="h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[2rem] flex flex-col items-center justify-center gap-1 text-white font-black text-xl shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={28} /> : <Wand2 size={28} />}
                <span>{isAnalyzing ? '正在分析...' : 'AI 魔法灵感'}</span>
              </button>
              <button 
                onClick={handleSave} 
                className="h-24 bg-white text-slate-950 rounded-[2rem] flex flex-col items-center justify-center gap-1 font-black text-xl shadow-2xl hover:bg-slate-100 active:scale-[0.98] transition-all"
              >
                <Download size={28} />
                <span>保存梗图</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase px-2">AI 建议</h3>
                <div className="grid gap-3">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => setState(p => ({ ...p, topText: s.top, bottomText: s.bottom }))} 
                      className="w-full text-left glass p-5 rounded-2xl hover:bg-white/10 transition-all border-l-4 border-indigo-500 active:scale-[0.97]"
                    >
                      <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">{s.top || '...'}</p>
                      <p className="text-base font-bold text-slate-200 leading-tight">{s.bottom}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">自定义文本</h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="顶部文本" value={state.topText} 
                  onChange={(e) => setState(p => ({ ...p, topText: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
                <input 
                  type="text" placeholder="底部文本" value={state.bottomText} 
                  onChange={(e) => setState(p => ({ ...p, bottomText: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>字体大小</span>
                  <span className="text-indigo-400">{state.fontSize}px</span>
                </div>
                <input 
                  type="range" min="20" max="150" value={state.fontSize} 
                  onChange={(e) => setState(p => ({ ...p, fontSize: Number(e.target.value) }))} 
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>文本颜色</span>
                <input 
                  type="color" value={state.textColor} 
                  onChange={(e) => setState(p => ({ ...p, textColor: e.target.value }))} 
                  className="w-10 h-10 bg-transparent border-none cursor-pointer p-0" 
                />
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">素材库</h3>
                <label className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                  <Camera size={18} className="text-indigo-400" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {TRENDING_TEMPLATES.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setState(p => ({ ...p, imageUrl: t.url }))} 
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${state.imageUrl === t.url ? 'border-indigo-500 scale-95 shadow-lg shadow-indigo-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={t.url} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
