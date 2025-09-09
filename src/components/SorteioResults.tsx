import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Winner } from "./SorteioApp";
import { Trophy, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SorteioResultsProps {
  winners: Winner[];
  getPrizeLabel: (position: number) => string;
}

export const SorteioResults = ({ winners, getPrizeLabel }: SorteioResultsProps) => {
  const { toast } = useToast();

  const shareResults = async () => {
    const resultText = winners
      .map((winner) => `${winner.prize}: ${winner.email}`)
      .join("\n");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Resultado do Sorteio",
          text: `🎊 Resultado do Sorteio:\n\n${resultText}`,
        });
      } catch (error) {
        copyToClipboard(resultText);
      }
    } else {
      copyToClipboard(resultText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`🎊 Resultado do Sorteio:\n\n${text}`);
    toast({
      title: "Copiado!",
      description: "Resultado copiado para a área de transferência.",
    });
  };

  const downloadResults = () => {
    const resultText = winners
      .map((winner) => `${winner.prize};${winner.email}`)
      .join("\n");
    
    const blob = new Blob([`Posição;Email\n${resultText}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sorteio-resultado-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado!",
      description: "Arquivo CSV com os resultados foi baixado.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-elegant bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Resultado do Sorteio
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Parabéns aos ganhadores! 🎉
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {winners.map((winner, index) => (
            <div
              key={winner.position}
              className={`p-6 rounded-xl border-2 transition-smooth animate-slide-up ${
                winner.position === 1
                  ? "bg-gradient-winner text-white border-yellow-400 winner-glow"
                  : winner.position === 2
                  ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white border-gray-400"
                  : winner.position === 3
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{winner.prize}</h3>
                  <p className="text-lg font-mono opacity-90">{winner.email}</p>
                </div>
                <div className="text-4xl font-bold">
                  {winner.position === 1 ? "🥇" : 
                   winner.position === 2 ? "🥈" : 
                   winner.position === 3 ? "🥉" : 
                   winner.position === 4 ? "🏅" : "🎖️"}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={shareResults}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 btn-bounce"
        >
          <Share2 className="w-5 h-5" />
          Compartilhar
        </Button>
        <Button
          onClick={downloadResults}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 btn-bounce"
        >
          <Download className="w-5 h-5" />
          Baixar CSV
        </Button>
      </div>
    </div>
  );
};