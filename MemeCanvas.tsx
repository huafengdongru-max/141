import React, { useEffect, useRef } from 'react';
import { MemeState } from './types';

interface Props {
  state: MemeState;
  onImageProcess?: (base64: string) => void;
}

const MemeCanvas: React.FC<Props> = ({ state, onImageProcess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!state.imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = state.imageUrl;
    img.onload = () => {
      imgRef.current = img;
      draw();
      
      if (onImageProcess) {
        const temp = document.createElement('canvas');
        temp.width = 512;
        temp.height = 512;
        const ctx = temp.getContext('2d');
        if (ctx) {
          const ratio = Math.max(512 / img.width, 512 / img.height);
          const x = (512 - img.width * ratio) / 2;
          const y = (512 - img.height * ratio) / 2;
          ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
          onImageProcess(temp.toDataURL('image/jpeg', 0.8));
        }
      }
    };
  }, [state.imageUrl]);

  useEffect(() => {
    draw();
  }, [state.topText, state.bottomText, state.fontSize, state.textColor]);

  const draw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 800;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const ratio = Math.max(size / img.width, size / img.height);
    const x = (size - img.width * ratio) / 2;
    const y = (size - img.height * ratio) / 2;
    ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);

    const baseFontSize = (state.fontSize / 100) * (size / 8);
    ctx.font = `900 ${baseFontSize}px "Anton", Impact, sans-serif`;
    ctx.fillStyle = state.textColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = baseFontSize / 6;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';

    const renderText = (text: string, yPos: number, isBottom: boolean) => {
      const words = text.toUpperCase().split(' ');
      let lines: string[] = [];
      let currentLine = words[0] || '';
      for(let i=1; i<words.length; i++) {
        if(ctx.measureText(currentLine + " " + words[i]).width < size - 80) {
          currentLine += " " + words[i];
        } else {
          lines.push(currentLine); currentLine = words[i];
        }
      }
      lines.push(currentLine);

      if (isBottom) lines.reverse();
      lines.forEach((line, i) => {
        const y = isBottom ? yPos - (i * baseFontSize * 1.1) : yPos + (i * baseFontSize * 1.1);
        ctx.strokeText(line, size / 2, y);
        ctx.fillText(line, size / 2, y);
      });
    };

    if (state.topText) renderText(state.topText, 40 + baseFontSize, false);
    if (state.bottomText) renderText(state.bottomText, size - 60, true);
  };

  return (
    <div className="w-full flex justify-center p-2 bg-slate-900 rounded-[2.5rem] border-4 border-white/5 overflow-hidden shadow-inner relative group">
      <canvas 
        ref={canvasRef} 
        className="rounded-[1.8rem] shadow-2xl transition-transform duration-500 hover:scale-[1.01]" 
        style={{ width: '100%', aspectRatio: '1/1' }} 
      />
      {!state.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black">
          NO IMAGE SOURCE
        </div>
      )}
    </div>
  );
};

export default MemeCanvas;
