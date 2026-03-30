import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityForm } from "@/components/ActivityForm";
import { SuccessScreen } from "@/components/SuccessScreen";
import { ClipboardList } from "lucide-react";

const Index = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-red-700">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary-foreground" />
          <div>
            <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
              Registro de Evidências
            </h1>
            <p className="text-sm text-primary-foreground/70">
              SENAI — Sistema de Atividades
            </p>
          </div>
        </div>
        {/* Red accent bar */}
        <div className="h-1" style={{ backgroundColor: "rgb(0, 0, 0)" }} />
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 sm:p-8">
            {pdfUrl ? (
              <SuccessScreen
                pdfUrl={pdfUrl}
                onNewActivity={() => setPdfUrl(null)}
              />
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    Nova Atividade
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo para registrar a evidência.
                  </p>
                </div>
                <ActivityForm onSuccess={(url) => setPdfUrl(url)} />
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
