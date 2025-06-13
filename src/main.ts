import { Config } from './_types/config';
import { logger } from './utils/logger';
import { ProgressBar } from './utils/progress';
import { gitCloneRepo, dockerBuildImage, dockerDeployContainer, createContext } from './core/index';

/**
 * Runs the full CI/CD pipeline for a single project.
 * Internally converts Config into StepContext and executes all stages.
 *
 * @param config - The project configuration object
 */
export async function runRayPipeline(config: Config): Promise<void> {
    const ctx = createContext(config);
    const bar = new ProgressBar(4);

    try {
        bar.step('Cloning repository...');
        await gitCloneRepo(ctx);

        // bar.step('Building project...');
        // await buildProject(ctx);

        if (ctx.docker?.type == 'docker') {
            bar.step('Building Docker image...');
            await dockerBuildImage(ctx);
        }

        bar.step('Deploying container...');
        await dockerDeployContainer(ctx);

        bar.step('Deployment completed.');
    } catch (e) {
        // bar.fail('Deployment failed.');
        if (e instanceof Error) {
            logger.error(e);
        } else {
            logger.error(String(e));
        }
    }
}

/**
 * Runs the full pipeline for multiple projects sequentially.
 *
 * @param configs - Array of project configurations
 */
export async function runAllPipelines(configs: Config[]): Promise<void> {
    for (const config of configs) {
        try {
            await runRayPipeline(config);
        } catch (err) {
            console.error(`[FAIL] ${config.name}`);
        }
    }
}
