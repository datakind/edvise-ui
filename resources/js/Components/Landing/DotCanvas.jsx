import { useEffect, useRef } from 'react';

export default function DotCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      console.log('resize');

      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;

      const padding = 28;

      // Grid settings
      const spacing = 30; // distance between dots
      const radius = 3; // radius of each dot

      for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'black';
          ctx.fill();
        }
      }
    }

    resize();

    window.addEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full"></canvas>;
}
