const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function convertMultiPageTiffToPng(inputFile, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.time("Conversion Time");

    const tiffBuffer = fs.readFileSync(inputFile);
    const image = sharp(tiffBuffer);
    const metadata = await image.metadata();

    for (let i = 0; i < metadata.pages; i++) {
      const pngBuffer = await sharp(tiffBuffer, { page: i }).png().toBuffer();

      const outputFilePath = path.join(outputDir, `${i + 1}.png`);
      fs.writeFileSync(outputFilePath, pngBuffer);
      console.log(`Page ${i + 1} converted successfully`);
    }

    console.timeEnd("Conversion Time");
  } catch (err) {
    console.error(`Error processing the TIFF file: ${err.message}`);
  }
}

const inputFilePath = path.join(__dirname, "IMG_00000073_00073530.tiff");
const outputDir = path.join(__dirname, "converted");

convertMultiPageTiffToPng(inputFilePath, outputDir);
