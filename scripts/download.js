
document.getElementById('download-pdf-btn').addEventListener('click', downloadPDF);

    async function downloadPDF() {

  // Заменяем progress-бары ДО вызова html2canvas
      document.querySelectorAll('progress').forEach(progress => {
        const value = progress.value;
        const max = progress.max;
        const percent = (value / max) * 100;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.width = `${progress.offsetWidth}px`;
        progressContainer.style.height = `${progress.offsetHeight}px`;
        progressContainer.style.border = 'none';
        progressContainer.style.borderRadius = '3px';
        progressContainer.style.overflow = 'hidden';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${percent}%`;
        progressFill.style.height = '100%';
        progressFill.style.backgroundColor = '#28D979';
        
        progressContainer.appendChild(progressFill);
        progress.replaceWith(progressContainer);
      });

      const { jsPDF } = window.jspdf;
      const element = document.getElementById('resume-container');

      try {
        // 1. Конвертируем HTML в изображение
        const canvas = await html2canvas(element, {
          scale: 2, // Повышаем качество
          logging: false,
          useCORS: true,
          allowTaint: true
        });

        // 2. Создаем PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm'
        });

        // 3. Получаем текущие размеры окна браузера (в пикселях)
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 4. Рассчитываем соотношение сторон элемента
        const elementRatio = canvas.width / canvas.height;

        // 5. Устанавливаем максимальную ширину (A4: 210 мм)
        const maxPdfWidth = 210; // Ширина A4 в мм
        let imgWidth = maxPdfWidth;
        let imgHeight = maxPdfWidth / elementRatio;

        // 6. Если высота превышает A4 (297 мм), уменьшаем пропорционально
        const maxPdfHeight = 297; // Высота A4 в мм
        if (imgHeight > maxPdfHeight) {
          imgHeight = maxPdfHeight;
          imgWidth = maxPdfHeight * elementRatio;
        }

        // 7. Добавляем изображение в PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        pdf.save('resume.pdf');

      } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        alert('Не удалось создать PDF');
      }
    }