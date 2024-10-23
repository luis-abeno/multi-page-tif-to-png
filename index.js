const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function convertMultiPageTiffToPng(inputFile, outputDir) {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Read the multi-page TIFF file and get metadata
    const tiffBuffer = fs.readFileSync(inputFile);
    const image = sharp(tiffBuffer);
    const metadata = await image.metadata();

    // Loop through each page in the TIFF file
    for (let i = 0; i < metadata.pages; i++) {
      // Extract and convert each page to PNG by specifying the page index
      const pngBuffer = await sharp(tiffBuffer, { page: i }).png().toBuffer();

      // Save the PNG file for each page
      const outputFilePath = path.join(outputDir, `${i + 1}.png`);
      fs.writeFileSync(outputFilePath, pngBuffer);
      console.log(`Page ${i + 1} converted successfully`);
    }
  } catch (err) {
    console.error(`Error processing the TIFF file: ${err.message}`);
  }
}

// Define input and output paths
const inputFilePath = path.join(__dirname, "multi-page.tif");
const outputDir = path.join(__dirname, "converted");

// Call the function to convert the TIFF to PNG
convertMultiPageTiffToPng(inputFilePath, outputDir);
