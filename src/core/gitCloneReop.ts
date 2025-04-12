import { exec } from 'child_process';
import { promisify } from 'util';
import { StepContext } from '../_types/context';
import { logger } from '../utils/logger';
import { ensureDirectoryExists, removeDirectory, exists } from '../utils/fsHelper'; // exists도 필요함

const execAsync = promisify(exec);

/**
 * Clones the Git repository into the workspace directory.
 * If a branch is specified, it will check out that branch.
 *
 * @param ctx - Pipeline execution context
 */
export async function gitCloneRepo(ctx: StepContext): Promise<void> {
    const { repo, branch, workspace } = ctx;

    logger.info(`Cloning ${repo} into ${workspace}`);

    // 기존 workspace가 존재하면 삭제
    if (await exists(workspace)) {
        logger.info(`Removing existing workspace: ${workspace}`);
        await removeDirectory(workspace);
    }

    await ensureDirectoryExists(workspace);

    // Clone with or without branch
    const branchArg = branch ? `-b ${branch}` : '';
    const cmd = `git clone ${branchArg} ${repo} ${workspace}`;

    try {
        await execAsync(cmd);
        logger.info('Repository cloned successfully.');
    } catch (e) {
        throw new Error(`Git clone failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}
