import { StepContext } from '../_types/context';
import { Config } from '../_types/config';

/**
 * Transforms a Config object into a StepContext object.
 * Adds internal runtime data such as the workspace path.
 *
 * @param config - The raw configuration loaded from JSON
 * @returns StepContext ready to be passed into pipeline functions
 */
export function createContext(config: Config): StepContext {
    return {
        repo: config.repo,
        branch: config.branch,
        buildCommand: config.buildCommand,
        docker: config.docker,
        env: config.env,
        envFilePath: config.internal?.envFilePath,
        workspace: `/tmp/ray-${config.name.replace(/\s+/g, '-').toLowerCase()}`,
    };
}
