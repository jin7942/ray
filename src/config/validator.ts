import { Config } from '../_types/config';

/**
 * Validates a Config object. Throws an Error if any required field is invalid.
 *
 * @param config - The project configuration to validate.
 */
export function validateConfig(config: Config): void {
    if (!config.name?.trim()) {
        throw new Error('"name" is required.');
    }

    if (!config.repo?.startsWith('https://')) {
        throw new Error('"repo" must start with "https://".');
    }

    // if (!config.buildCommand?.trim()) {
    //     throw new Error('"buildCommand" is required.');
    // }

    const docker = config.docker;
    if (!docker || !docker.image || !docker.containername || !docker.path) {
        throw new Error('"docker" section must include "image", "containername", and "path".');
    }

    const internal = config.internal;
    if (internal) {
        if (internal.maxLogDirSize !== undefined) {
            if (typeof internal.maxLogDirSize !== 'number' || internal.maxLogDirSize < 1024 * 1024) {
                throw new Error('"internal.maxLogDirSize" must be a number greater than 1MB.');
            }
        }
    }
}
