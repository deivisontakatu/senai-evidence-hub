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
      <header className="flex flex-col lg:flex-row p-5 bg-brand-primary gap-10">
        <div className="flex flex-col gap-3">
          <img
            src="/logo_unisenai.png"
            alt="Logo UNISENAI"
            className="w-40 lg:h-fit lg:w-fit"
          />
          <div className="text-brand-accent">
            <p className="text-sm font-bold">Campus Sorocaba - Santa Rosália</p>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start lg:pl-48 w-full">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Registro de Atividades Acadêmicas
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center mx-auto px-4 py-8 bg-brand-secondary">
        <Card className="w-full max-w-3xl shadow-lg border-0 bg-brand-primary">
          <CardContent className="p-6 sm:p-8">
            {pdfUrl ? (
              <SuccessScreen
                pdfUrl={pdfUrl}
                onNewActivity={() => setPdfUrl(null)}
              />
            ) : (
              <>
                <div className="flex flex-col items-center mb-6 gap-2">
                  <span className="flex gap-5">
                    <ClipboardList className="h-8 w-8 text-brand-secondary" />
                    <h2 className=" text-xl lg:text-2xl font-bold text-foreground text-center">
                      Nova Atividade
                    </h2>
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo para registrar a evidência
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
