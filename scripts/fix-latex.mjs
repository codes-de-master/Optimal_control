import { readFile, writeFile } from 'node:fs/promises';

const pageUrl = new URL('../src/pages/index.astro', import.meta.url);
let source = await readFile(pageUrl, 'utf8');

// Astro interprets literal { ... } in template text as JavaScript expressions.
// MathJax/LaTeX uses braces heavily (\frac{a}{b}, \text{...}, matrices, etc.),
// so escape braces only inside MathJax delimiters before Astro parses the page.
// HTML entities are decoded by the browser back to { and }, so MathJax still
// receives valid LaTeX at runtime.
const escapeMathBraces = (math) =>
  math.replaceAll('{', '&#123;').replaceAll('}', '&#125;');

source = source
  .replace(/\\\[[\s\S]*?\\\]/g, escapeMathBraces)
  .replace(/\\\([\s\S]*?\\\)/g, escapeMathBraces);

await writeFile(pageUrl, source, 'utf8');
console.log('Escaped LaTeX braces for Astro compilation.');
