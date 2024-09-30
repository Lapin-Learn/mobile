import * as fs from 'fs';
import * as path from 'path';

const localesPath = path.resolve(__dirname, './locales');
const languages = ['en', 'vi'] as const;

languages.forEach((lang) => {
  const langDir = path.join(localesPath, lang);
  const files = fs.readdirSync(langDir).filter((file) => file.endsWith('.json'));

  const imports = files
    .map((file) => {
      const fileNameWithoutExt = path.basename(file, '.json');
      return `import ${fileNameWithoutExt} from './${fileNameWithoutExt}.json';`;
    })
    .join('\n');

  // Prepare the export object for each language
  const exports = `export { ${files
    .map((file) => {
      const fileNameWithoutExt = path.basename(file, '.json');
      return `${fileNameWithoutExt}`;
    })
    .join(', ')} };`;

  // Combine imports and exports into one file
  const output = `${imports}\n\n${exports}\n`;

  fs.writeFileSync(path.join(langDir, `index.ts`), output);
});
