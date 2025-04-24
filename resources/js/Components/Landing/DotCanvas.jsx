import { useEffect, useRef } from 'react';

import Dots from '@/Components/Landing/dots/Dots';

export default function DotCanvas({ animation }) {
  const canvasRef = useRef(null);

  const dots = useRef();

  useEffect(() => {
    if (!dots.current) return;

    dots.current.playAnimation(animation);
  }, [animation]);

  useEffect(() => {
    const canvas = canvasRef.current;

    dots.current = new Dots(canvas);

    return () => {
      dots.kill();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
