import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Users } from "lucide-react";

interface EmailInputProps {
  onSubmit: (emails: string[]) => void;
}

export const EmailInput = ({ onSubmit }: EmailInputProps) => {
  const [emailText, setEmailText] = useState("");
  const [emailCount, setEmailCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processEmails = (text: string): string[] => {
    const emails = text
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0 && email.includes("@"));
    
    return [...new Set(emails)]; // Remove duplicatas
  };

  const handleTextChange = (value: string) => {
    setEmailText(value);
    const emails = processEmails(value);
    setEmailCount(emails.length);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setEmailText(text);
      handleTextChange(text);
      toast({
        title: "Arquivo carregado!",
        description: `${processEmails(text).length} emails encontrados.`,
      });
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    const emails = processEmails(emailText);
    
    if (emails.length === 0) {
      toast({
        title: "Nenhum email válido encontrado",
        description: "Adicione pelo menos um email válido para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (emails.length < 2) {
      toast({
        title: "Participantes insuficientes",
        description: "É necessário pelo menos 2 participantes para realizar o sorteio.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(emails);
    toast({
      title: "Participantes carregados!",
      description: `${emails.length} participantes prontos para o sorteio.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email-upload" className="text-sm font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload CSV
          </Label>
          <input
            id="email-upload"
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-20 border-2 border-dashed hover:border-primary transition-smooth"
          >
            <div className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <span>Clique para carregar arquivo</span>
            </div>
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <span className="text-2xl font-bold">OU</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-text" className="text-sm font-medium">
          Cole os emails aqui (um por linha):
        </Label>
        <Textarea
          id="email-text"
          placeholder="exemplo1@email.com&#10;exemplo2@email.com&#10;exemplo3@email.com"
          value={emailText}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={8}
          className="resize-none"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {emailCount} participante{emailCount !== 1 ? "s" : ""} encontrado{emailCount !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={emailCount < 2}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-smooth btn-bounce"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};