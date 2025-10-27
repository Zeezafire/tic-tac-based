import { useEffect, useState, useCallback, useRef } from 'react';
import drillBeatUrl from '@assets/Drill X0_mix_1761502671826.mp3';

export type SoundType = 'playerMove' | 'computerMove' | 'win' | 'lose' | 'draw';

export function useSounds() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved === 'true';
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const ambientGainRef = useRef<GainNode | null>(null);
  const isAmbientPlayingRef = useRef(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

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
          
          const timeout1 = setTimeout(() => { 
            isPlayingRef.current = false;
            timeoutsRef.current.delete(timeout1);
          }, 100);
          timeoutsRef.current.add(timeout1);
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
          
          const timeout2 = setTimeout(() => { 
            isPlayingRef.current = false;
            timeoutsRef.current.delete(timeout2);
          }, 100);
          timeoutsRef.current.add(timeout2);
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
          
          const timeout3 = setTimeout(() => { 
            isPlayingRef.current = false;
            timeoutsRef.current.delete(timeout3);
          }, 450);
          timeoutsRef.current.add(timeout3);
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
          
          const timeout4 = setTimeout(() => { 
            isPlayingRef.current = false;
            timeoutsRef.current.delete(timeout4);
          }, 350);
          timeoutsRef.current.add(timeout4);
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
          
          const timeout5 = setTimeout(() => { 
            isPlayingRef.current = false;
            timeoutsRef.current.delete(timeout5);
          }, 300);
          timeoutsRef.current.add(timeout5);
          break;
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      isPlayingRef.current = false;
    }
  }, [isMuted]);

  const startAmbient = useCallback(() => {
    if (isAmbientPlayingRef.current) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create or reuse audio element
    if (!ambientAudioRef.current) {
      const audio = new Audio(drillBeatUrl);
      audio.loop = true;
      audio.volume = 1; // Let Web Audio API gain control the volume
      ambientAudioRef.current = audio;
    }

    const audio = ambientAudioRef.current;

    // Create media source if it doesn't exist
    if (!ambientSourceRef.current) {
      const source = ctx.createMediaElementSource(audio);
      ambientSourceRef.current = source;
      
      // Create gain node for volume control and fading
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      ambientGainRef.current = gainNode;
      
      // Connect: source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
    }

    const gainNode = ambientGainRef.current!;

    // Fade in to 15% volume over 2 seconds
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 2);

    // Start playing
    audio.play().catch(err => console.error('Error playing ambient audio:', err));
    isAmbientPlayingRef.current = true;
  }, []);

  const stopAmbient = useCallback(() => {
    if (!isAmbientPlayingRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const gainNode = ambientGainRef.current;
    const audio = ambientAudioRef.current;

    if (gainNode) {
      // Fade out over 2 seconds
      const currentGain = gainNode.gain.value;
      gainNode.gain.setValueAtTime(currentGain, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 2);

      // Pause audio after fade out completes
      setTimeout(() => {
        if (audio) {
          audio.pause();
        }
        isAmbientPlayingRef.current = false;
      }, 2100);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Handle mute state changes
  useEffect(() => {
    if (isMuted && isAmbientPlayingRef.current) {
      // Stop ambient when muted
      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      const gainNode = ambientGainRef.current;
      const audio = ambientAudioRef.current;

      if (gainNode) {
        const currentGain = gainNode.gain.value;
        gainNode.gain.setValueAtTime(currentGain, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 2);

        setTimeout(() => {
          if (audio) {
            audio.pause();
          }
          isAmbientPlayingRef.current = false;
        }, 2100);
      }
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all pending timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
      
      // Clean up ambient audio
      const audio = ambientAudioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      isAmbientPlayingRef.current = false;
    };
  }, []);

  return { playSound, isMuted, toggleMute, startAmbient, stopAmbient };
}
