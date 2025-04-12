import { exec } from 'child_process';
import { promisify } from 'util';
import { StepContext } from '../_types/context';
import { logger } from '../utils/logger';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Deploys a Docker container using zero-downtime strategy.
 * - Starts new container with temp name
 * - Removes old container if exists
 * - Renames new to original
 *
 * @param ctx - Pipeline execution context
 */
export async function dockerDeployContainer(ctx: StepContext): Promise<void> {
    const { docker, envFilePath, logDir } = ctx;
    const original = docker.containername;
    const temp = `${original}-temp`;
    const image = docker.image;

    const envFileOption = envFilePath ? `--env-file ${envFilePath}` : '';
    const logDirOption = path.resolve(logDir || './logs');
    const networkOption = docker.network ? `--network ${docker.network} ` : '';

    // Run new container
    logger.info(`Starting temporary container: ${temp}`);
    try {
        await execAsync(`docker run -d --name ${temp} -v ${logDirOption}:/app/logs ${envFileOption} ${networkOption} ${image}`);
    } catch (e) {
        throw new Error(`Failed to start new container: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Stop & remove old container
    logger.info(`Stopping and removing previous container: ${original}`);
    await execAsync(`docker stop ${original}`).catch(() => {}); // ignore if not exists
    await execAsync(`docker rm ${original}`).catch(() => {});

    // Rename temp to original
    logger.info(`Renaming ${temp} → ${original}`);
    try {
        await execAsync(`docker rename ${temp} ${original}`);
        logger.info('Container deployed successfully.');
    } catch (e) {
        throw new Error(`Failed to rename container: ${e instanceof Error ? e.message : String(e)}`);
    }
}
