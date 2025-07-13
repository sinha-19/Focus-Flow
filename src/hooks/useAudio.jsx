import { useRef, useCallback } from 'react';

const useAudio = () => {
  const audioContextRef = useRef(null);

  const playNotification = useCallback((type = 'completion') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'completion') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, audioContext.currentTime);
      } else if (type === 'break') {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15); // C#5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3); // E5
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(1500, audioContext.currentTime);
      } else if (type === 'warning') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1); 
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
      }
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  }, []);

  const playTickSound = useCallback(() => {
    try {
      if (!audioContextRef.current) return;
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Tick sound failed:', error);
    }
  }, []);

  return { playNotification, playTickSound };
};

export default useAudio;
