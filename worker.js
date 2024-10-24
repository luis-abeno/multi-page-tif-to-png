importScripts("tiff.min.js");

self.onmessage = async function (event) {
  const file = event.data;
  const arrayBuffer = await file.arrayBuffer();
  const tiff = new Tiff({ buffer: arrayBuffer });

  const totalPages = tiff.countDirectory();

  for (let i = 0; i < totalPages; i++) {
    tiff.setDirectory(i);
    const canvas = tiff.toCanvas();

    // Convert the canvas to a blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    // Send the page blob back to the main thread
    self.postMessage({ pageNumber: i + 1, blob });
  }
};
