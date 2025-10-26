import { useEffect, useState, useCallback, useRef } from 'react';

export type SoundType = 'playerMove' | 'computerMove' | 'win' | 'lose' | 'draw';

export function useSounds() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved === 'true';
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    
    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  useEffect(() => {
    localStorage.setItem('soundMuted', isMuted.toString());
  }, [isMuted]);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted || isPlayingRef.current) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Prevent overlapping sounds
    isPlayingRef.current = true;

    try {
      switch (type) {
        case 'playerMove': {
          // Clean click - short mid-high frequency
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.setValueAtTime(800, now);
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          
          oscillator.start(now);
          oscillator.stop(now + 0.08);
          
          setTimeout(() => { isPlayingRef.current = false; }, 100);
          break;
        }

        case 'computerMove': {
          // Slightly different click - lower frequency
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.setValueAtTime(600, now);
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          
          oscillator.start(now);
          oscillator.stop(now + 0.08);
          
          setTimeout(() => { isPlayingRef.current = false; }, 100);
          break;
        }

        case 'win': {
          // Positive ascending chime
          const oscillator1 = ctx.createOscillator();
          const oscillator2 = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator1.connect(gainNode);
          oscillator2.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator1.frequency.setValueAtTime(523.25, now); // C5
          oscillator2.frequency.setValueAtTime(659.25, now); // E5
          oscillator1.frequency.setValueAtTime(783.99, now + 0.1); // G5
          
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          
          oscillator1.start(now);
          oscillator2.start(now);
          oscillator1.stop(now + 0.4);
          oscillator2.stop(now + 0.4);
          
          setTimeout(() => { isPlayingRef.current = false; }, 450);
          break;
        }

        case 'lose': {
          // Descending minor tone
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.setValueAtTime(400, now);
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
          
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          
          setTimeout(() => { isPlayingRef.current = false; }, 350);
          break;
        }

        case 'draw': {
          // Neutral two-tone
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.setValueAtTime(440, now);
          oscillator.frequency.setValueAtTime(440, now + 0.15);
          
          gainNode.gain.setValueAtTime(0.12, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          
          oscillator.start(now);
          oscillator.stop(now + 0.25);
          
          setTimeout(() => { isPlayingRef.current = false; }, 300);
          break;
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      isPlayingRef.current = false;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { playSound, isMuted, toggleMute };
}
