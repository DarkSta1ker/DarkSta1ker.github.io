document.addEventListener('DOMContentLoaded', function() {
  const editableElements = document.querySelectorAll('[contenteditable="true"]');
  editableElements.forEach((el, index) => {
    const savedText = localStorage.getItem(`editable-text-${index}`);
    if (savedText) {
      el.textContent = savedText;
    }
  });
  editableElements.forEach((el, index) => {
    el.addEventListener('input', () => {
      localStorage.setItem(`editable-text-${index}`, el.textContent);
    });
  });
});

