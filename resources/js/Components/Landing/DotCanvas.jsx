import { useEffect, useRef } from 'react';

export default function DotCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);

    let animationFrameId;
    const spacing = 30;
    const baseRadius = 3;
    let dots = [];

    function resize() {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr); // Scale drawing for high-DPI screens

      const padding = 40;

      const availableWidth = canvas.clientWidth - padding * 2;
      const availableHeight = canvas.clientHeight - padding * 2;

      const cols = Math.floor(availableWidth / spacing);
      const rows = Math.floor(availableHeight / spacing);

      dots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          dots.push({
            x: x * spacing + padding + spacing / 2,
            y: y * spacing + padding + spacing / 2,
          });
        }
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
        const wave = Math.sin(dot.x / 60 - time / 300); // adjust for wave speed and spacing
        const radius = baseRadius + wave * 1.5; // scale factor

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0, radius), 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    animate(0);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
