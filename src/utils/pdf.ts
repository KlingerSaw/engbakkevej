import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.vfs;

interface PDFOptions {
  title: string;
  content: string;
  filename: string;
}

export async function generatePDF({ title, content, filename }: PDFOptions) {
  // Convert HTML to pdfmake compatible format
  const pdfContent = htmlToPdfmake(content, {
    tableAutoSize: true,
    defaultStyles: {
      b: { bold: true },
      strong: { bold: true },
      i: { italics: true },
      em: { italics: true },
      h1: { fontSize: 24, bold: true, marginBottom: 10 },
      h2: { fontSize: 20, bold: true, marginBottom: 8 },
      h3: { fontSize: 16, bold: true, marginBottom: 6 },
      p: { marginBottom: 5 },
      ul: { marginLeft: 10 },
      ol: { marginLeft: 10 },
    },
  });

  const documentDefinition = {
    content: [
      { text: title, style: 'header' },
      { text: '\n' },
      pdfContent
    ],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5,
    },
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: '#424874',
        marginBottom: 20,
      },
    },
  };

  // Generate and download the PDF
  pdfMake.createPdf(documentDefinition).download(filename);
}