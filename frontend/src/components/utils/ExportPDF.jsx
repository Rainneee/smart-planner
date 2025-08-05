import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

const ExportReportToPDF = async () => {
  const exportBtn = document.querySelector('#export-pdf-btn');
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting...';

  try {
    const input = document.getElementById('report');
    const originalBg = input.style.backgroundColor;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      height: input.scrollHeight,
      windowHeight: input.scrollHeight
    });

    input.style.backgroundColor = originalBg;

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const headerHeight = 25;
    const availableHeight = pdfHeight - headerHeight - 10;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const contentWidth = pdfWidth - 20;
    const scaleFactor = contentWidth / (canvasWidth / 2);
    
    const canvasHeightPerPage = availableHeight / scaleFactor * 2;

    let currentY = 0;
    let pageNumber = 1;

    while (currentY < canvasHeight) {
      if (pageNumber > 1) {
        pdf.addPage();
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Smart Planner Report', pdfWidth / 2, 15, { align: 'center' });

      const remainingHeight = canvasHeight - currentY;
      const heightToUse = Math.min(canvasHeightPerPage, remainingHeight);

      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      pageCanvas.width = canvasWidth;
      pageCanvas.height = heightToUse;

      pageCtx.drawImage(
        canvas,
        0, currentY,
        canvasWidth, heightToUse,
        0, 0,
        canvasWidth, heightToUse
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      const pageImgHeight = (heightToUse / 2) * scaleFactor;
      
      pdf.addImage(pageImgData, 'PNG', 10, headerHeight, contentWidth, pageImgHeight);

      currentY += heightToUse;
      pageNumber++;
    }

    pdf.save('campaign_report.pdf');
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Failed to export PDF. Please try again.');
  } finally {
    exportBtn.disabled = false;
    exportBtn.textContent = 'Export to PDF';
  }
};

export default ExportReportToPDF;