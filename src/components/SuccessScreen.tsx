import { Button } from "@/components/ui/button";
import { CheckCircle, Download, PlusCircle } from "lucide-react";

interface SuccessScreenProps {
  pdfUrl: string;
  onNewActivity: () => void;
}

export function SuccessScreen({ pdfUrl, onNewActivity }: SuccessScreenProps) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Atividade Registrada!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          A evidência foi salva com sucesso e o relatório PDF foi gerado automaticamente.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button asChild size="lg" className="font-semibold">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-5 w-5" />
            Baixar Relatório PDF
          </a>
        </Button>

        <Button variant="outline" size="lg" onClick={onNewActivity} className="font-semibold">
          <PlusCircle className="mr-2 h-5 w-5" />
          Nova Atividade
        </Button>
      </div>
    </div>
  );
}
