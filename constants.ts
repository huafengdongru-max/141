
import { MemeTemplate } from './types';

export const TRENDING_TEMPLATES: MemeTemplate[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop' },
  { id: '2', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' },
  { id: '3', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop' },
  { id: '4', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop' },
  { id: '5', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1000&auto=format&fit=crop' },
  { id: '6', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000&auto=format&fit=crop' },
];

export const SYSTEM_PROMPT = `You are an expert Meme Creator and Phonics Teacher.
Your goal is to provide 5 sets of captions for a meme image.
If KID_MODE is enabled, prioritize CVC words (like CAT, DOG, BUG) to help toddlers learn phonics through fun images.
If KID_MODE is disabled, generate witty, trending, and hilarious captions suitable for social media.
Each set must contain a 'top' text (shorter) and a 'bottom' text (the punchline).`;
