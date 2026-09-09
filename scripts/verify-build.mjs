import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distIndex = resolve('dist/index.html');
if (!existsSync(distIndex)) throw new Error('dist/index.html was not generated.');

const html = readFileSync(distIndex, 'utf8');
const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map((match) => match[1]);
const missingAssets = assetPaths.filter((assetPath) => !existsSync(resolve('dist', `.${assetPath}`)));

if (missingAssets.length > 0) {
  throw new Error(`Build references missing assets:\n${missingAssets.join('\n')}`);
}

console.log(`Build verified: ${assetPaths.length} referenced assets exist.`);