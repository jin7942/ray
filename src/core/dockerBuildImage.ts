import { exec } from 'child_process';
import { promisify } from 'util';
import { StepContext } from '../_types/context';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

/**
 * Builds a Docker image using the given Dockerfile and context.
 *
 * @param ctx - Pipeline execution context
 */
export async function dockerBuildImage(ctx: StepContext): Promise<void> {
    const { workspace, docker } = ctx;
    const dockerfilePath = docker.path;
    const imageName = docker.image;

    logger.info(`Building Docker image: ${imageName}`);

    const cmd = `docker build -t ${imageName} -f ${dockerfilePath} ${workspace}`;

    try {
        await execAsync(cmd);
        logger.info('Docker image built successfully.');
    } catch (e) {
        throw new Error(`Docker build failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}
