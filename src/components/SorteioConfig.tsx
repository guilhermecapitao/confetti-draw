import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trophy, Timer } from "lucide-react";
import { SorteioSettings } from "./SorteioApp";

interface SorteioConfigProps {
  emailsCount: number;
  settings: SorteioSettings;
  onSubmit: (settings: SorteioSettings) => void;
  onBack: () => void;
}

export const SorteioConfig = ({ emailsCount, settings, onSubmit, onBack }: SorteioConfigProps) => {
  const [winnersCount, setWinnersCount] = useState(settings.winnersCount);
  const [useCountdown, setUseCountdown] = useState(settings.useCountdown);

  const handleSubmit = () => {
    onSubmit({ winnersCount, useCountdown });
  };

  const maxWinners = Math.min(5, emailsCount);

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-muted rounded-lg">
        <p className="text-lg">
          <strong>{emailsCount}</strong> participantes carregados ✅
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Quantidade de Ganhadores
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((count) => (
              <Button
                key={count}
                variant={winnersCount === count ? "default" : "outline"}
                onClick={() => setWinnersCount(count)}
                disabled={count > maxWinners}
                className={`h-16 text-lg font-bold transition-smooth ${
                  winnersCount === count
                    ? "bg-gradient-primary hover:opacity-90"
                    : "hover:border-primary"
                }`}
              >
                {count}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Máximo de {maxWinners} ganhadores com {emailsCount} participantes
          </p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="countdown" className="text-base font-semibold flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Contagem Regressiva
                </Label>
                <p className="text-sm text-muted-foreground">
                  Adiciona suspense antes de revelar cada ganhador
                </p>
              </div>
              <Switch
                id="countdown"
                checked={useCountdown}
                onCheckedChange={setUseCountdown}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Prêmios que serão sorteados:</h3>
          <div className="space-y-2">
            {Array.from({ length: winnersCount }, (_, i) => i + 1).map((position) => {
              const labels = ["🥇 Primeiro Lugar", "🥈 Segundo Lugar", "🥉 Terceiro Lugar", "🏅 Quarto Lugar", "🎖️ Quinto Lugar"];
              return (
                <div key={position} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <span className="text-2xl">{position}</span>
                  <span className="font-medium">{labels[position - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 bg-gradient-primary hover:opacity-90 transition-smooth btn-bounce text-lg"
        >
          🎊 Iniciar Sorteio
        </Button>
      </div>
    </div>
  );
};