document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const uploadZone = document.getElementById("uploadZone");
  const fileInput = document.getElementById("fileInput");
  const imageContainer = document.getElementById("imageContainer");
  const originalImage = document.getElementById("originalImage");
  const resultImage = document.getElementById("resultImage");
  const promptInput = document.getElementById("promptInput");
  const generateBtn = document.getElementById("generateBtn");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const chips = document.querySelectorAll(".chip");

  // State
  let currentFile = null;

  // Event Listeners
  uploadZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", handleFileSelect);

  // Drag and Drop
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("drag-over");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("drag-over");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  });

  // Generate Button
  generateBtn.addEventListener("click", processImage);

  // Quick Action Chips
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      promptInput.value = chip.dataset.prompt;
      if (currentFile) {
        processImage();
      }
    });
  });

  // Functions
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
  }

  function handleFile(file) {
    currentFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
      originalImage.src = e.target.result;
      resultImage.src = e.target.result; // Initially show same image

      // Switch views
      uploadZone.style.display = "none";
      imageContainer.classList.remove("hidden");
      generateBtn.disabled = false;
    };

    reader.readAsDataURL(file);
  }

  function processImage() {
    if (!currentFile || !promptInput.value) return;

    // Show loading state
    loadingOverlay.classList.remove("hidden");
    generateBtn.disabled = true;

    // Simulate AI Processing
    setTimeout(() => {
      // For the mock, we'll just apply a CSS filter to show "something happened"
      // In a real app, this is where we'd send the image to the API
      const prompt = promptInput.value.toLowerCase();

      if (prompt.includes("remove background")) {
        // Mock background removal (just for demo visuals)
        resultImage.style.filter = "drop-shadow(0 0 10px white)";
        // Note: Real BG removal requires an API or WebAssembly library
      } else if (
        prompt.includes("black and white") ||
        prompt.includes("grayscale")
      ) {
        resultImage.style.filter = "grayscale(100%)";
      } else {
        resultImage.style.filter = "contrast(1.2) saturate(1.2)";
      }

      loadingOverlay.classList.add("hidden");
      generateBtn.disabled = false;
    }, 2000);
  }
});
