export declare class FileSystemManager {
    static ensureDirectoryExists(dirPath: string): Promise<void>;
    static readFile(filePath: string): Promise<string>;
    static writeFile(filePath: string, content: string): Promise<void>;
}
