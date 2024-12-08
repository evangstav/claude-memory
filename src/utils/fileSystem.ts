import { promises as fs } from 'fs';

export class FileSystemManager {
  static async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error}`);
    }
  }

  static async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as any).code === "ENOENT") {
        return '';
      }
      throw error;
    }
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content);
    } catch (error) {
      throw new Error(`Failed to write to file ${filePath}: ${error}`);
    }
  }
}
