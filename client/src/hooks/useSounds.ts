import { useEffect, useState, useCallback, useRef } from 'react';

export type SoundType = 'playerMove' | 'computerMove' | 'win' | 'lose' | 'draw';

export function useSounds() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved === 'true';
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const ambientOscillatorsRef = useRef<OscillatorNode[]>([]);
  const ambientGainRef = useRef<GainNode | null>(null);
  const isAmbientPlayingRef = useRef(false);

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

  const startAmbient = useCallback(() => {
    if (isAmbientPlayingRef.current) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create gain node for volume control and fading
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    ambientGainRef.current = gainNode;

    // Start at 0 and fade in to 15% volume over 2 seconds
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 2);

    // Create a futuristic ambient pad using multiple oscillators
    const oscillators: OscillatorNode[] = [];

    // Base drone - low frequency
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, now); // A1
    osc1.connect(gainNode);
    oscillators.push(osc1);

    // Mid harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(82.41, now); // E2
    osc2.connect(gainNode);
    oscillators.push(osc2);

    // High shimmer
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(220, now); // A3
    osc3.connect(gainNode);
    oscillators.push(osc3);

    // Very subtle high frequency for sci-fi feel
    const osc4 = ctx.createOscillator();
    osc4.type = 'sine';
    osc4.frequency.setValueAtTime(440, now); // A4
    const osc4Gain = ctx.createGain();
    osc4Gain.gain.setValueAtTime(0.3, now); // Quieter
    osc4.connect(osc4Gain);
    osc4Gain.connect(gainNode);
    oscillators.push(osc4);

    // Start all oscillators
    oscillators.forEach(osc => osc.start(now));
    
    ambientOscillatorsRef.current = oscillators;
    isAmbientPlayingRef.current = true;
  }, []);

  const stopAmbient = useCallback(() => {
    if (!isAmbientPlayingRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const gainNode = ambientGainRef.current;

    if (gainNode) {
      // Fade out over 2 seconds
      const currentGain = gainNode.gain.value;
      gainNode.gain.setValueAtTime(currentGain, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 2);

      // Stop oscillators after fade out completes
      setTimeout(() => {
        ambientOscillatorsRef.current.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Already stopped
          }
        });
        ambientOscillatorsRef.current = [];
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

      if (gainNode) {
        const currentGain = gainNode.gain.value;
        gainNode.gain.setValueAtTime(currentGain, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 2);

        setTimeout(() => {
          ambientOscillatorsRef.current.forEach(osc => {
            try {
              osc.stop();
            } catch (e) {
              // Already stopped
            }
          });
          ambientOscillatorsRef.current = [];
          isAmbientPlayingRef.current = false;
        }, 2100);
      }
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientOscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      ambientOscillatorsRef.current = [];
      isAmbientPlayingRef.current = false;
    };
  }, []);

  return { playSound, isMuted, toggleMute, startAmbient, stopAmbient };
}
