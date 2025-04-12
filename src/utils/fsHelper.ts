/**
 * A collection of file system utility functions used by RAY
 * - Directory creation
 * - Log writing with auto-trim
 * - File existence checks
 * - UTF-8 file reading
 */
import fs from 'fs/promises';
import path from 'path';
import { getLogSettings } from '../config/global';

/**
 * Ensure that a directory exists, create it recursively if it doesn't.
 *
 * @param dirPath - Absolute or relative path to the directory.
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        console.warn('[fsHelper] Failed to create directory:', err);
    }
}

/**
 * Append a log message to a file.
 * - Automatically trims old log files if total log size exceeds threshold.
 *
 * @param dir - Directory path to save logs.
 * @param filename - File name (e.g., 2025-04-05.log).
 * @param content - Log message to write.
 */
export async function appendToFile(dir: string, filename: string, content: string): Promise<void> {
    await ensureDirectoryExists(dir);

    const fullPath = path.join(dir, filename);
    try {
        await fs.appendFile(fullPath, content + '\n', 'utf-8');
    } catch (err) {
        console.warn('[fsHelper] Failed to write log:', err);
    }

    const { maxSize } = getLogSettings();
    trimLogsIfTooLarge(dir, maxSize).catch((e) => console.warn('[fsHelper] Failed to trim logs:', e));
}

/**
 * Get total size of all files in a directory (in bytes).
 *
 * @param dir - Directory path.
 * @returns The total size in bytes.
 */
async function getDirectorySize(dir: string): Promise<number> {
    try {
        const files = await fs.readdir(dir);
        let total = 0;

        for (const file of files) {
            const { size } = await fs.stat(path.join(dir, file));
            total += size;
        }

        return total;
    } catch (err) {
        console.warn('[fsHelper] Failed to calculate directory size:', err);
        return 0;
    }
}

/**
 * Check total directory size and delete oldest files if limit exceeded.
 *
 * @param dir - Log directory.
 * @param maxSizeBytes - Size threshold in bytes.
 */
export async function trimLogsIfTooLarge(dir: string, maxSizeBytes: number): Promise<void> {
    try {
        const entries = await fs.readdir(dir);

        const logFiles = await Promise.all(
            entries
                .filter((f) => f.endsWith('.log'))
                .map(async (file) => {
                    const stat = await fs.stat(path.join(dir, file));
                    return { name: file, time: stat.mtime.getTime(), size: stat.size };
                })
        );

        logFiles.sort((a, b) => a.time - b.time); // Sort oldest first

        let totalSize = logFiles.reduce((sum, f) => sum + f.size, 0);
        while (totalSize > maxSizeBytes && logFiles.length > 0) {
            const toDelete = logFiles.shift();
            if (!toDelete) break;

            await fs.unlink(path.join(dir, toDelete.name));
            totalSize -= toDelete.size;
        }
    } catch (err) {
        console.warn('[fsHelper] Failed to trim logs:', err);
    }
}

/**
 * Reads a file as UTF-8 encoded text.
 *
 * @param filePath - The absolute or relative path to the file.
 * @returns A promise that resolves to the file contents as a string.
 */
export async function readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
}

/**
 * Checks whether a file exists at the given path.
 *
 * @param filePath - The path to the file to check.
 * @returns A promise that resolves to true if the file exists, false otherwise.
 */
export async function exists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Remove directory from directory path
 *
 * @param dirPath  - The path to remove target of diretory path
 */
export async function removeDirectory(dirPath: string): Promise<void> {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
    } catch (err) {
        console.warn(`[fsHelper] Failed to remove directory: ${dirPath}`, err);
    }
}
