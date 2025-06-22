import { exec } from 'child_process';
import { promisify } from 'util';
import { StepContext } from '../_types/context';
import { logger } from '../utils/logger';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Deploys a Docker container (zero-downtime) or uses docker-compose.
 *
 * - If docker.type === 'docker':
 *    1. Starts new container with temporary name
 *    2. Connects to networks if needed
 *    3. Stops and removes old container if exists
 *    4. Renames new container to original name
 *
 * - If docker.type === 'compose':
 *    1. Uses docker-compose up -d to recreate services
 *
 * @param ctx - Pipeline execution context
 */
export async function dockerDeployContainer(ctx: StepContext): Promise<void> {
    const { docker, envFilePath, logDir, workspace } = ctx;

    if (docker?.type === 'compose') {
        // Compose 배포 처리
        const composeFile = docker.path.compose;
        if (!composeFile) {
            throw new Error('docker compose.yml path is required for deploy type "compose".');
        }

        const composePath = path.resolve(workspace, composeFile);
        logger.info(`Deploying with docker-compose: ${composePath}`);

        try {
            logger.info(`Executing: docker-compose -f ${composePath} up -d`);
            await execAsync(`docker compose -f ${composePath} up -d`);
            logger.info('docker compose deployed successfully.');
        } catch (e) {
            throw new Error(
                `docker-compose deploy failed: ${e instanceof Error ? e.message : String(e)}`,
            );
        }

        return;
    }

    const original = docker.containername;
    const temp = `${original}-temp`;
    const image = docker.image;

    const envFileOption = envFilePath ? `--env-file ${envFilePath}` : '';
    const logDirOption = path.resolve(logDir || './logs');
    const networkOption = (): string[] => {
        return Array.isArray(docker.network)
            ? docker.network
            : docker.network
            ? [docker.network]
            : [];
    };
    const volumesOption = (() => {
        if (docker.volumes !== undefined && docker.volumes.length > 0) {
            return docker.volumes.map((volume: string) => `-v ${volume}`).join(' ');
        } else return '';
    })();

    // Run new container
    logger.info(`Starting temporary container: ${temp}`);
    try {
        await execAsync(
            `docker run -d --name ${temp} -v ${logDirOption}:/app/logs ${envFileOption} ${volumesOption} ${image}`,
        );
        for (const net of networkOption()) {
            const checkCmd = `docker network inspect ${net}`;
            try {
                await execAsync(checkCmd);
            } catch {
                await execAsync(`docker network create ${net}`);
                logger.info(`Created docker network: ${net}`);
            }

            await execAsync(`docker network connect ${net} ${temp}`);
            logger.info(`Connected docker network: ${net} ${temp}`);
        }
    } catch (e) {
        throw new Error(
            `Failed to start new container: ${e instanceof Error ? e.message : String(e)}`,
        );
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
        throw new Error(
            `Failed to rename container: ${e instanceof Error ? e.message : String(e)}`,
        );
    }
}
