import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPieceProps {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  size: number;
  delay: number;
}

const ConfettiPiece = ({ x, y, angle, color, shape, size, delay }: ConfettiPieceProps) => {
  const shapeStyles = {
    circle: { borderRadius: '50%' },
    square: { borderRadius: '2px' },
    triangle: {
      width: 0,
      height: 0,
      borderLeft: `${size/2}px solid transparent`,
      borderRight: `${size/2}px solid transparent`,
      borderBottom: `${size}px solid ${color}`,
      backgroundColor: 'transparent',
    },
    star: {
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: shape === 'triangle' ? size : `${size}px`,
        height: shape === 'triangle' ? size : `${size}px`,
        backgroundColor: shape === 'triangle' ? 'transparent' : color,
        rotate: angle,
        ...shapeStyles[shape],
      }}
      initial={{ 
        y: y - 50,
        opacity: 1,
        scale: 1,
        rotate: angle 
      }}
      animate={{
        y: y + window.innerHeight + 100,
        opacity: 0,
        scale: 0.3,
        rotate: angle + (Math.random() > 0.5 ? 720 : -720),
        x: x + (Math.random() - 0.5) * 200,
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: 'easeOut',
      }}
    />
  );
};

const SparkleEffect = ({ x, y, delay }: { x: number; y: number; delay: number }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '6px',
        height: '6px',
        backgroundColor: '#FFD700',
        borderRadius: '50%',
        boxShadow: '0 0 10px #FFD700',
      }}
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        repeat: 2,
        ease: 'easeInOut',
      }}
    />
  );
};

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPieceProps[]>([]);
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    // Generate confetti pieces
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF7675', '#74B9FF'];
    const shapes: ('circle' | 'square' | 'triangle' | 'star')[] = ['circle', 'square', 'triangle', 'star'];
    
    const newPieces = Array.from({ length: 150 }).map((_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: Math.random() * -200 - 50,
      angle: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: 8 + Math.random() * 8,
      delay: Math.random() * 2,
    }));
    setPieces(newPieces);

    // Generate sparkles
    const newSparkles = Array.from({ length: 50 }).map((_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 3,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none', 
      zIndex: 100,
      overflow: 'hidden' 
    }}>
      {/* Confetti pieces */}
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
      
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <SparkleEffect key={sparkle.id} {...sparkle} />
      ))}
      
      {/* Gradient overlay for extra sparkle */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(173, 216, 230, 0.1) 0%, transparent 50%)
          `,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ 
          duration: 4,
          ease: 'easeInOut',
          repeat: 1 
        }}
      />
    </div>
  );
};

export default Confetti;
