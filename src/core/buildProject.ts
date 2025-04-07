import { exec } from 'child_process';
import { promisify } from 'util';
import { StepContext } from '../_types/context';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

/**
 * Runs the project's build command inside the cloned workspace.
 *
 * @param ctx - Pipeline execution context
 */
export async function buildProject(ctx: StepContext): Promise<void> {
    const { buildCommand, workspace } = ctx;

    logger.info(`Running build command: ${buildCommand}`);

    try {
        await execAsync(buildCommand, { cwd: workspace });
        logger.info('Build completed successfully.');
    } catch (e) {
        throw new Error(`Build failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}
