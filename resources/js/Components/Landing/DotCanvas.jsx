import { useEffect, useRef } from 'react';

export default function DotCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match element size
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;

    // Grid settings
    const spacing = 68 * 2; // distance between dots
    const radius = 3; // radius of each dot

    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < 1328 * 2; x += spacing) {
        const offsetX = 28 * 2 + 6;
        const offsetY = 5;

        const finalX = x + offsetX;
        const finalY = y + offsetY;

        ctx.beginPath();
        ctx.arc(finalX, finalY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
    }
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full"></canvas>;
}
