import { Config } from './config';

/**
 * Internal pipeline execution context
 * - Created from Config
 * - Used across all pipeline steps
 */
export interface StepContext {
    /** GitHub repository URL */
    repo: string;

    /** Branch to checkout (optional) */
    branch?: string;

    /** Build command to run */
    buildCommand: string;

    /** Docker configuration */
    docker: Config['docker'];

    /** Environment variables (optional) */
    env?: Record<string, string>;

    /** Temporary working directory for this pipeline */
    workspace: string;

    /** path to .env file to load environment variables (optional) */
    envFilePath?: string;
}
