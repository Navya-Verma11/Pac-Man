import { useState, useEffect, RefObject } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | null;

const useTouchControls = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [direction, setDirection] = useState<Direction>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX: number = 0;
    let touchStartY: number = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Check if the touch movement is significant enough
      if (Math.abs(diffX) < 20 && Math.abs(diffY) < 20) return;

      // Determine swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        setDirection(diffX > 0 ? 'left' : 'right');
      } else {
        setDirection(diffY > 0 ? 'up' : 'down');
      }

      // Reset starting position
      touchStartX = touchEndX;
      touchStartY = touchEndY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef]);

  return { direction };
};

export default useTouchControls;