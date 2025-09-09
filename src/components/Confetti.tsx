import { useEffect, useState } from "react";

export const Confetti = () => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Gera peças de confete
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    
    setConfettiPieces(pieces);

    // Remove confetes após a animação
    const cleanup = setTimeout(() => {
      setConfettiPieces([]);
    }, 4000);

    return () => clearTimeout(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti absolute rounded-full"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            width: Math.random() * 10 + 5 + "px",
            height: Math.random() * 10 + 5 + "px",
          }}
        />
      ))}
    </div>
  );
};