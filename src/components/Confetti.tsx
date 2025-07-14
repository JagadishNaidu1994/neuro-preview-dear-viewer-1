import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ConfettiPiece = ({ x, y, angle, color }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '10px',
        height: '10px',
        backgroundColor: color,
        rotate: angle,
      }}
      animate={{
        y: y + 200,
        opacity: 0,
        scale: 0.5,
        rotate: angle + 360,
      }}
      transition={{
        duration: 2,
        ease: 'easeOut',
      }}
    />
  );
};

const Confetti = () => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 100 }).map((_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      angle: Math.random() * 360,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
      {pieces.map(({ id, x, y, angle, color }) => (
        <ConfettiPiece key={id} x={x} y={y} angle={angle} color={color} />
      ))}
    </div>
  );
};

export default Confetti;
