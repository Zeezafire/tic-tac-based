import { useEffect, useState, useCallback, useRef } from 'react';

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
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    // Create master gain node for volume control and fading
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    ambientGainRef.current = masterGain;

    // Start at 0 and fade in to 15% volume over 2 seconds
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.15, now + 2);

    // Digital chime/pulse pattern - clean and airy
    const playChime = (frequency: number, startTime: number, duration: number = 0.15, volume: number = 0.3) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, startTime);
      
      // Soft attack and decay for smooth chime
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(masterGain);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Create a 15-second looping pattern with digital chimes
    const loopDuration = 15; // 15 seconds

    const playPattern = () => {
      const baseTime = ctx.currentTime;
      
      // Pattern: soft digital chimes in a calming sequence
      // Measure 1 (0-3s): Gentle intro
      playChime(523.25, baseTime + 0, 0.2, 0.25);      // C5
      playChime(659.25, baseTime + 1.5, 0.15, 0.2);    // E5
      playChime(783.99, baseTime + 2.5, 0.18, 0.22);   // G5
      
      // Measure 2 (3-6s): Response
      playChime(880, baseTime + 4, 0.15, 0.18);        // A5
      playChime(659.25, baseTime + 5.5, 0.2, 0.2);     // E5
      
      // Measure 3 (6-9s): Digital pulse accent
      playChime(1046.5, baseTime + 7, 0.12, 0.15);     // C6 (higher, softer)
      playChime(783.99, baseTime + 8, 0.18, 0.2);      // G5
      
      // Measure 4 (9-12s): Ambient fill
      playChime(523.25, baseTime + 10, 0.2, 0.2);      // C5
      playChime(698.46, baseTime + 11.5, 0.15, 0.18);  // F5
      
      // Measure 5 (12-15s): Gentle close
      playChime(587.33, baseTime + 13, 0.2, 0.22);     // D5
      playChime(523.25, baseTime + 14.2, 0.25, 0.2);   // C5 (ending)
    };

    // Play the pattern immediately
    playPattern();

    // Set up interval to loop the pattern every 15 seconds
    const interval = setInterval(() => {
      if (isAmbientPlayingRef.current) {
        playPattern();
      }
    }, loopDuration * 1000);

    ambientIntervalRef.current = interval;
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

      // Stop the looping interval
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }

      // Mark as stopped after fade out completes
      setTimeout(() => {
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

        // Stop the looping interval
        if (ambientIntervalRef.current) {
          clearInterval(ambientIntervalRef.current);
          ambientIntervalRef.current = null;
        }

        setTimeout(() => {
          isAmbientPlayingRef.current = false;
        }, 2100);
      }
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
      isAmbientPlayingRef.current = false;
    };
  }, []);

  return { playSound, isMuted, toggleMute, startAmbient, stopAmbient };
}
