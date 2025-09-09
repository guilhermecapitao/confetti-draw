import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Confetti } from "./Confetti";
import { SorteioSettings, Winner } from "./SorteioApp";

interface SorteioLiveProps {
  emails: string[];
  settings: SorteioSettings;
  onComplete: (winners: Winner[]) => void;
  getPrizeLabel: (position: number) => string;
}

export const SorteioLive = ({ emails, settings, onComplete, getPrizeLabel }: SorteioLiveProps) => {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [availableEmails, setAvailableEmails] = useState(emails);
  const [phase, setPhase] = useState<"waiting" | "countdown" | "rolling" | "revealing" | "complete">("waiting");

  const startSorteio = () => {
    if (settings.useCountdown) {
      setPhase("countdown");
      setCountdown(3);
    } else {
      startRolling();
    }
  };

  const startRolling = () => {
    setPhase("rolling");
    setIsRolling(true);
    
    // Animação de rolagem dos emails
    const rollInterval = setInterval(() => {
      const randomEmail = availableEmails[Math.floor(Math.random() * availableEmails.length)];
      setCurrentEmail(randomEmail);
    }, 100);

    // Para após 3 segundos e seleciona ganhador
    setTimeout(() => {
      clearInterval(rollInterval);
      selectWinner();
    }, 3000);
  };

  const selectWinner = () => {
    const winnerIndex = Math.floor(Math.random() * availableEmails.length);
    const winnerEmail = availableEmails[winnerIndex];
    
    const newWinner: Winner = {
      email: winnerEmail,
      position: currentPosition,
      prize: getPrizeLabel(currentPosition),
    };

    setCurrentEmail(winnerEmail);
    setIsRolling(false);
    setPhase("revealing");
    setShowConfetti(true);
    
    // Atualiza listas
    const newWinners = [...winners, newWinner];
    setWinners(newWinners);
    setAvailableEmails(availableEmails.filter(email => email !== winnerEmail));

    // Remove confetti após 4 segundos
    setTimeout(() => {
      setShowConfetti(false);
      
      if (currentPosition < settings.winnersCount) {
        // Próximo sorteio
        setTimeout(() => {
          setCurrentPosition(currentPosition + 1);
          setPhase("waiting");
          setCurrentEmail("");
        }, 2000);
      } else {
        // Sorteio completo
        setTimeout(() => {
          setPhase("complete");
          onComplete(newWinners);
        }, 3000);
      }
    }, 4000);
  };

  // Efeito para contagem regressiva
  useEffect(() => {
    if (phase === "countdown" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "countdown" && countdown === 0) {
      startRolling();
    }
  }, [phase, countdown]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {showConfetti && <Confetti />}
      
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Progresso */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: settings.winnersCount }, (_, i) => i + 1).map((pos) => (
              <div
                key={pos}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-smooth ${
                  pos < currentPosition
                    ? "bg-green-500 text-white"
                    : pos === currentPosition
                    ? "bg-gradient-winner text-white winner-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {pos}
              </div>
            ))}
          </div>
          <p className="text-white/80 text-lg">
            Sorteando: {getPrizeLabel(currentPosition)}
          </p>
        </div>

        {/* Área principal do sorteio */}
        <Card className="border-0 shadow-elegant bg-white/95 backdrop-blur">
          <CardContent className="p-12">
            {phase === "waiting" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Pronto para sortear o {getPrizeLabel(currentPosition)}?
                </h2>
                <p className="text-xl text-muted-foreground">
                  {availableEmails.length} participantes restantes
                </p>
                <Button
                  onClick={startSorteio}
                  size="lg"
                  className="text-xl px-12 py-6 bg-gradient-primary hover:opacity-90 transition-smooth btn-bounce"
                >
                  🎲 Sortear Agora!
                </Button>
              </div>
            )}

            {phase === "countdown" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-muted-foreground">
                  Sorteando em...
                </h2>
                <div className="text-9xl font-bold text-primary animate-bounce">
                  {countdown}
                </div>
              </div>
            )}

            {phase === "rolling" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-muted-foreground">
                  🎲 Sorteando...
                </h2>
                <div className="text-3xl font-mono bg-muted p-6 rounded-lg animate-pulse">
                  {currentEmail || "..."}
                </div>
              </div>
            )}

            {phase === "revealing" && (
              <div className="space-y-6 animate-reveal-winner">
                <h2 className="text-3xl font-bold text-green-600">
                  🎉 GANHADOR!
                </h2>
                <div className="text-4xl font-bold text-primary p-8 bg-gradient-winner text-white rounded-lg winner-glow">
                  {currentEmail}
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {getPrizeLabel(currentPosition)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ganhadores anteriores */}
        {winners.length > 0 && phase !== "revealing" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Ganhadores:</h3>
            <div className="space-y-2">
              {winners.map((winner) => (
                <div
                  key={winner.position}
                  className="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-lg text-white"
                >
                  <span className="font-semibold">{winner.prize}</span>
                  <span className="font-mono">{winner.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};