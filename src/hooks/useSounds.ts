import { useState, useEffect, useRef } from 'react';

const useSounds = () => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const soundFiles = {
    start: 'https://assets.codepen.io/21542/howler-push.mp3', // placeholder URL
    chomp: 'https://assets.codepen.io/21542/howler-sfx-levelup.mp3', // placeholder URL
    powerPellet: 'https://assets.codepen.io/21542/howler-coin.mp3', // placeholder URL
    eatGhost: 'https://assets.codepen.io/21542/howler-notify.mp3', // placeholder URL
    death: 'https://assets.codepen.io/21542/howler-mistake.mp3', // placeholder URL
    gameOver: 'https://assets.codepen.io/21542/howler-negative.mp3' // placeholder URL
  };

  useEffect(() => {
    // Preload audio files
    Object.entries(soundFiles).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup audio objects
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
    };
  }, []);

  const playSound = (soundName: keyof typeof soundFiles) => {
    if (!isSoundOn) return;
    
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Error playing sound:', e));
    }
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
    
    // If turning off, pause all currently playing sounds
    if (isSoundOn) {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
      });
    }
  };

  return { playSound, toggleSound, isSoundOn };
};

export default useSounds;