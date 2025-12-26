import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

export async function loadPrompt(templatePath: URL) {
  try {
    return await readFile(templatePath, 'utf-8');
  } catch (error) {
    console.error('Error reading prompt file:', error);
    return 'Prompt not available.';
  }
}
