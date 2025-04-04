/**
 * Custom logger for lightweight CLI tools
 * - Console color output
 * - Log file writing
 * - Controlled by config.internal.logdir & logLevel
 */
import { appendToFile } from './fsHelper';
import { getLogSettings } from '../config/global';

/**
 * Supported log levels for filtering output
 */
type LogLevel = 'info' | 'warn' | 'error';

const LEVELS: LogLevel[] = ['info', 'warn', 'error'];

/**
 * Determines whether the current log level allows this message
 *
 * @param level - Level of the message to log
 */
function shouldLog(level: LogLevel): boolean {
    const { level: currentLevel } = getLogSettings();
    return LEVELS.indexOf(level) >= LEVELS.indexOf(currentLevel as LogLevel);
}

/**
 * Generate a console-formatted log message (with ANSI color)
 *
 * @param level - Log level
 * @param message - Message string
 */
function formatConsole(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const color = {
        info: '\x1b[32m', // Green
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
    }[level];

    return `${color}[RAY][${level.toUpperCase()}][${timestamp}] ${message}\x1b[0m`;
}

/**
 * Generate a plain string for log file output
 *
 * @param level - Log level
 * @param message - Message string
 */
function formatFile(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${level.toUpperCase()}][${timestamp}] ${message}`;
}

/**
 * Get today's log file name (e.g., "2025-04-05.log")
 */
function getLogFileName(): string {
    return `${new Date().toISOString().slice(0, 10)}.log`;
}

/**
 * Global logger utility
 * - Writes to both console and local file (under /logs directory)
 */
export const logger = {
    /**
     * Info-level log (green)
     *
     * @param msg - The message to log
     */
    info: (msg: string): void => {
        if (shouldLog('info')) {
            const output = formatConsole('info', msg);
            console.log(output);

            const { logDir } = getLogSettings();
            appendToFile(logDir, getLogFileName(), formatFile('info', msg));
        }
    },

    /**
     * Warning-level log (yellow)
     *
     * @param msg - The message to log
     */
    warn: (msg: string): void => {
        if (shouldLog('warn')) {
            const output = formatConsole('warn', msg);
            console.warn(output);

            const { logDir } = getLogSettings();
            appendToFile(logDir, getLogFileName(), formatFile('warn', msg));
        }
    },

    /**
     * Error-level log (red)
     * Also includes stack trace if an Error object is passed
     *
     * @param msg - Message string or Error object
     */
    error: (msg: string | Error): void => {
        const fullMessage = msg instanceof Error ? `${msg.message}\n${msg.stack}` : msg;

        if (shouldLog('error')) {
            const output = formatConsole('error', fullMessage);
            console.error(output);

            const { logDir } = getLogSettings();
            appendToFile(logDir, getLogFileName(), formatFile('error', fullMessage));
        }
    },
};
