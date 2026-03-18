import jsPDF from "jspdf";

interface AtividadeData {
  nome: string;
  descricao: string;
  data: string;
  local: string;
  fotosUrls: string[];
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function gerarPdfAtividade(atividade: AtividadeData): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Header bar
  doc.setFillColor(0, 90, 156); // SENAI blue
  doc.rect(0, 0, pageWidth, 40, "F");

  // Red accent line
  doc.setFillColor(200, 30, 30); // SENAI red
  doc.rect(0, 40, pageWidth, 3, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("EVIDÊNCIA DE ATIVIDADE", pageWidth / 2, 20, { align: "center" });
  doc.setFontSize(16);
  doc.text("SENAI", pageWidth / 2, 32, { align: "center" });

  y = 55;
  doc.setTextColor(30, 30, 30);

  // Helper function for labeled fields
  const addField = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 90, 156);
    doc.text(label, margin, y);
    y += 5;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(value, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 6;
  };

  // Separator line
  const addSeparator = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  addField("NOME DO RESPONSÁVEL", atividade.nome);
  addSeparator();

  addField("DESCRIÇÃO DA ATIVIDADE", atividade.descricao);
  addSeparator();

  const dataFormatada = new Date(atividade.data + "T00:00:00").toLocaleDateString("pt-BR");
  addField("DATA", dataFormatada);
  addSeparator();

  addField("LOCAL", atividade.local);
  addSeparator();

  // Photos section
  if (atividade.fotosUrls.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 90, 156);
    doc.text("FOTOS / EVIDÊNCIAS", margin, y);
    y += 8;

    for (const url of atividade.fotosUrls) {
      try {
        const img = await loadImage(url);
        const imgWidth = contentWidth * 0.7;
        const ratio = img.height / img.width;
        const imgHeight = imgWidth * ratio;

        // Check if image fits on page
        if (y + imgHeight > 270) {
          doc.addPage();
          y = 20;
        }

        const imgX = margin + (contentWidth - imgWidth) / 2;
        doc.addImage(img, "JPEG", imgX, y, imgWidth, imgHeight);
        y += imgHeight + 10;
      } catch {
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("[Imagem não disponível]", margin, y);
        y += 8;
      }
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `SENAI - Registro de Evidências | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return doc.output("blob");
}
