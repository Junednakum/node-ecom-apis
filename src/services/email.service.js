import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTemplate = (templateName, data) => {
  const filePath = path.join(
    __dirname,
    '../templates',
    `${templateName}.html`
  );

  let html = fs.readFileSync(filePath, 'utf8');

  Object.keys(data).forEach((key) => {
    html = html.replace(
      new RegExp(`{{${key}}}`, 'g'),
      data[key]
    );
  });

  return html;
};

export default getTemplate;