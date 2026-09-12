import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const exportPortfolioAsPDF = async (elementId, filename = 'portfolio') => {
  const input = document.getElementById(elementId);
  if (!input) {
    toast.error('Element to export not found.');
    return;
  }

  toast.info('Generating PDF, please wait...');

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // If images are from external sources
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}-Portfolio.pdf`);
    toast.success('PDF exported successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to export PDF.');
  }
};

export default exportPortfolioAsPDF;