import { useState } from "react";
import { EmailInput } from "./EmailInput";
import { SorteioConfig } from "./SorteioConfig";
import { SorteioLive } from "./SorteioLive";
import { SorteioResults } from "./SorteioResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SorteioState = "setup" | "config" | "live" | "results";

export interface SorteioSettings {
  winnersCount: number;
  useCountdown: boolean;
}

export interface Winner {
  email: string;
  position: number;
  prize: string;
}

export const SorteioApp = () => {
  const [currentState, setCurrentState] = useState<SorteioState>("setup");
  const [emails, setEmails] = useState<string[]>([]);
  const [settings, setSettings] = useState<SorteioSettings>({
    winnersCount: 1,
    useCountdown: true,
  });
  const [winners, setWinners] = useState<Winner[]>([]);

  const handleEmailsSubmit = (emailList: string[]) => {
    setEmails(emailList);
    setCurrentState("config");
  };

  const handleConfigSubmit = (config: SorteioSettings) => {
    setSettings(config);
    setCurrentState("live");
  };

  const handleSorteioComplete = (winnersList: Winner[]) => {
    setWinners(winnersList);
    setCurrentState("results");
  };

  const resetSorteio = () => {
    setCurrentState("setup");
    setEmails([]);
    setWinners([]);
    setSettings({ winnersCount: 1, useCountdown: true });
  };

  const getPrizeLabel = (position: number): string => {
    const labels = ["🥇 Primeiro Lugar", "🥈 Segundo Lugar", "🥉 Terceiro Lugar", "🏅 Quarto Lugar", "🎖️ Quinto Lugar"];
    return labels[position - 1] || `${position}º Lugar`;
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">
            🎊 Sorteio ao Vivo
          </h1>
          <p className="text-xl text-white/90 animate-slide-up [animation-delay:0.2s]">
            Realize sorteios emocionantes com animações e confetes!
          </p>
        </header>

        <div className="animate-slide-up [animation-delay:0.4s]">
          {currentState === "setup" && (
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-center">📧 Adicionar Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <EmailInput onSubmit={handleEmailsSubmit} />
              </CardContent>
            </Card>
          )}

          {currentState === "config" && (
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-center">⚙️ Configurar Sorteio</CardTitle>
              </CardHeader>
              <CardContent>
                <SorteioConfig
                  emailsCount={emails.length}
                  onSubmit={handleConfigSubmit}
                  settings={settings}
                  onBack={() => setCurrentState("setup")}
                />
              </CardContent>
            </Card>
          )}

          {currentState === "live" && (
            <SorteioLive
              emails={emails}
              settings={settings}
              onComplete={handleSorteioComplete}
              getPrizeLabel={getPrizeLabel}
            />
          )}

          {currentState === "results" && (
            <div className="space-y-6">
              <SorteioResults winners={winners} getPrizeLabel={getPrizeLabel} />
              <div className="text-center">
                <Button
                  onClick={resetSorteio}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 btn-bounce text-lg px-8"
                >
                  🎊 Novo Sorteio
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};