
import React, { useEffect, useRef } from 'react';
import { MemeState } from './types';

interface Props {
  state: MemeState;
  onImageProcess?: (base64: string) => void;
}

const MemeCanvas: React.FC<Props> = ({ state, onImageProcess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = state.imageUrl;
    img.onload = () => {
      render(img);
      if (onImageProcess) {
        const temp = document.createElement('canvas');
        temp.width = 512; temp.height = 512;
        const ctx = temp.getContext('2d');
        ctx?.drawImage(img, 0, 0, 512, 512);
        onImageProcess(temp.toDataURL('image/jpeg', 0.8));
      }
    };
  }, [state]);

  const render = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600;
    canvas.width = size; canvas.height = size;

    // Draw Image (Cover)
    const ratio = Math.max(size / img.width, size / img.height);
    const x = (size - img.width * ratio) / 2;
    const y = (size - img.height * ratio) / 2;
    ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);

    // Text Style
    const fontSize = (state.fontSize / 100) * (size / 8);
    ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
    ctx.fillStyle = state.textColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 8;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';

    const drawText = (text: string, yPos: number, isBottom: boolean) => {
      const words = text.toUpperCase().split(' ');
      let lines = [];
      let currentLine = words[0];
      for(let i=1; i<words.length; i++) {
        if(ctx.measureText(currentLine + " " + words[i]).width < size - 40) {
          currentLine += " " + words[i];
        } else {
          lines.push(currentLine); currentLine = words[i];
        }
      }
      lines.push(currentLine);

      if (isBottom) lines.reverse();
      lines.forEach((line, i) => {
        const y = isBottom ? yPos - (i * fontSize * 1.1) : yPos + (i * fontSize * 1.1);
        ctx.strokeText(line, size / 2, y);
        ctx.fillText(line, size / 2, y);
      });
    };

    drawText(state.topText, 20 + fontSize, false);
    drawText(state.bottomText, size - 40, true);
  };

  return <canvas ref={canvasRef} className="w-full max-w-[500px] aspect-square rounded-3xl shadow-2xl border-4 border-white/10" />;
};

export default MemeCanvas;
