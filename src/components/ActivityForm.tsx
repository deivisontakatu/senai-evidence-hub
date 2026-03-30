import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectInput } from "./SelectInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { gerarPdfAtividade } from "@/utils/pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface ActivityFormProps {
  onSuccess: (pdfUrl: string) => void;
}

export function ActivityForm({ onSuccess }: ActivityFormProps) {
  const [titulo, setTitulo] = useState("");
  const [membros, setMembros] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !membros || !descricao || !data || !local) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload images
      const fotosUrls: string[] = [];
      for (const file of files) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("evidencias")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("evidencias")
          .getPublicUrl(fileName);

        fotosUrls.push(urlData.publicUrl);
      }

      // Insert record
      const { data: record, error: insertError } = await supabase
        .from("atividades")
        .insert({ titulo, membros, categoria, data, empresa, local, descricao, fotos: fotosUrls })
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate PDF
      const pdfBlob = await gerarPdfAtividade({
        titulo,
        membros,
        categoria,
        data,
        empresa,
        local,
        descricao,
        fotosUrls,
      });
      const pdfFileName = `relatorio-${record.id}.pdf`;

      const { error: pdfUploadError } = await supabase.storage
        .from("relatorios")
        .upload(pdfFileName, pdfBlob, { contentType: "application/pdf" });

      if (pdfUploadError) throw pdfUploadError;

      const { data: pdfUrlData } = supabase.storage
        .from("relatorios")
        .getPublicUrl(pdfFileName);

      // Update record with PDF URL
      await supabase
        .from("atividades")
        .update({ pdf_url: pdfUrlData.publicUrl })
        .eq("id", record.id);

      onSuccess(pdfUrlData.publicUrl);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao registrar atividade",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="titulo"
          className="text-sm font-semibold text-foreground"
        >
          Título da Atividade *
        </Label>
        <Input
          id="atividade"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite um título para a atividade"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="categoria"
            className="text-sm font-semibold text-foreground"
          >
            Categoria da Atividade *
          </Label>
          <SelectInput value={categoria} onChange={setCategoria} />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="data"
            className="text-sm font-semibold text-foreground"
          >
            Data da Atividade *
          </Label>
          <Input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="local"
            className="text-sm font-semibold text-foreground"
          >
            Local da Atividade *
          </Label>
          <Input
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Ex: Laboratório 3, Oficina A"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="empresa"
            className="text-sm font-semibold text-foreground"
          >
            Empresa Parceira
          </Label>
          <Input
            id="empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Ex: Empresa X, Empresa Y"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="membros" className="text-sm font-semibold text-foreground">
          Participantes (professores, alunos ou turma)*
        </Label>
        <Input
          id="membros"
          value={membros}
          onChange={(e) => setMembros(e.target.value)}
          placeholder="Digite o membros completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="descricao"
          className="text-sm font-semibold text-foreground"
        >
          Descrição da Atividade *
        </Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva a atividade realizada..."
          rows={4}
          required
        />
      </div>

      {/* File upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">
          Fotos / Evidências
        </Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Clique para selecionar imagens
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG ou JPEG (múltiplas imagens)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="hidden"
        />

        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative group rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-base font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" />
            Registrar Atividade
          </>
        )}
      </Button>
    </form>
  );
}
