import { fileURLToPath } from 'url';
import path from 'path';

export class ConfigManager {
  static getMemoryFilePath(args: string[]): string {
    const pathIndex = args.findIndex(arg => arg === '--path' || arg === '-p');

    if (pathIndex !== -1 && args[pathIndex + 1]) {
      return args[pathIndex + 1];
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    return path.join(__dirname, 'memory.json');
  }
}
