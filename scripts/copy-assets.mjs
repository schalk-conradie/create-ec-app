import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const srcReadmes = path.join(projectRoot, 'src', 'readmes');
const distReadmes = path.join(projectRoot, 'dist', 'readmes');

async function main() {
  try {
    if (await fs.pathExists(srcReadmes)) {
      await fs.remove(distReadmes).catch(() => {});
      await fs.copy(srcReadmes, distReadmes);
      console.log('Copied README templates to dist/readmes');
    }
  } catch (err) {
    console.warn('Warning: failed to copy README templates:', err?.message || err);
  }
}

await main();

