import path from 'path'
import { getPlaiceholder } from 'plaiceholder';
import fs from "node:fs/promises"

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.avif', 'gif'];
const imageMetadata = {};

async function getAllImagePaths(dir) {
  async function walkDirectory(currentPath) {
    const files = await fs.readdir(currentPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(currentPath, file.name);
      if (file.isDirectory()) {
        await walkDirectory(fullPath);
      } else if (imageExtensions.includes(path.extname(file.name).toLowerCase())) {
        const key = fullPath.split('.')[0].split('/').at(-1);
        const file = await fs.readFile(fullPath);  // Correct use of fs.promises.readFile
        const { base64 } = await getPlaiceholder(file);
        imageMetadata[key] = base64;
      }
    }
  }

  await walkDirectory(dir);
  return imageMetadata;
}

async function main() {
  const imagesDirectory = path.join(process.cwd(), 'public', 'images');
  console.log('imagesDirectory', imagesDirectory)
  const imagePaths = await getAllImagePaths(imagesDirectory)

  console.log('image paths', imagePaths)
  console.log('image metadata', imageMetadata)
}

main().catch(console.error)
