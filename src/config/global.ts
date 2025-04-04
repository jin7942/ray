import type { Config } from '../_types/config';

let configRef: Config;

export function setGlobalConfig(c: Config) {
    configRef = c;
}

export function getGlobalConfig(): Config {
    if (!configRef) throw new Error('Global config not set');
    return configRef;
}

/**
 * Returns extracted settings relevant to logging
 */
export function getLogSettings() {
    const config = getGlobalConfig();
    const internal = config.internal ?? {};

    return {
        logDir: internal.logdir ?? 'logs',
        maxSize: internal.maxLogDirSize ?? 5 * 1024 * 1024,
        level: (internal.logLevel as 'info' | 'warn' | 'error') ?? 'info',
    };
}
