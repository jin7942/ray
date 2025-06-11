import { exec } from 'child_process';
import { promisify } from 'util';
import { StepContext } from '../_types/context';
import { logger } from '../utils/logger';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Builds a Docker image using the given Dockerfile and context.
 *
 * @param ctx - Pipeline execution context
 */
export async function dockerBuildImage(ctx: StepContext): Promise<void> {
    const { workspace, docker } = ctx;

    // workspace 기준으로 Dockerfile 경로 구성
    const dockerfilePath = path.resolve(workspace, docker.path);
    const imageName = docker.image;

    logger.info(`Building Docker image: ${imageName}`);
    logger.info(`Using Dockerfile at: ${dockerfilePath}`);

    const cmd = `docker build -t ${imageName} -f ${dockerfilePath} ${workspace}`;

    try {
        await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 });
        logger.info('Docker image built successfully.');
    } catch (e) {
        throw new Error(`Docker build failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}
