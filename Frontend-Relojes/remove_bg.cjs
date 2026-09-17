const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const inputPath = path.resolve(__dirname, 'public', 'watches', 'edifice_pure_black.jpg');
    const outputPath = path.resolve(__dirname, 'public', 'watches', 'edifice_transparent.png');
    
    console.log('Removing background from:', inputPath);
    const blob = await removeBackground(inputPath);
    console.log('Background removed. Writing to:', outputPath);
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log('Done! Background removed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}
main();
