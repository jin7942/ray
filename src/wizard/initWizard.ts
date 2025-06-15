/**
 * Setting wizard
 */
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { logger } from '../utils/logger';
import { Config } from '../_types/config';
import { askValidated } from '../utils/inputHelper';

/**
 * Prompt the user with a question and return their input.
 *
 * @param query - The question to ask.
 * @returns A Promise that resolves to the user's input.
 */
function ask(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

/**
 * Launches a minimal interactive wizard to generate a RAY config JSON file.
 *
 * @param outputPath - File path to write the generated config (default: './ray.config.json')
 */
export async function initConfigWizard(outputPath = './ray.config.json'): Promise<void> {
    logger.info('RAY config wizard started (minimal mode)');

    const name = await askValidated('Your project name:', (input) => {
        return input.length > 0 ? null : 'You must enter project name';
    });
    const repo = await askValidated('GitHub repository URL: ', (input) => {
        return input.startsWith('https://')
            ? null
            : 'The GitHub repository URL is must start with https://';
    });
    const branch = await askValidated(
        'Branch to deploy (default: main): ',
        (input) => {
            return input.length > 0 ? null : '';
        },
        'main', // default value
    );
    // const buildCommand = await askValidated(
    //     'Build command (default: npm run build): ',
    //     (input) => {
    //         return input.length > 0 ? null : '';
    //     },
    //     'npm run build' // default value
    // );

    const image = await askValidated('Docker image name: ', (input) => {
        return input.length > 0 ? null : 'You must enter Docker image name';
    });
    const containername = await askValidated('Docker container name: ', (input) => {
        return input.length > 0 ? null : 'You must enter Docker container name';
    });
    const dockerfilePath = await askValidated(
        'Dockerfile path (default: ./Dockerfile): ',
        (input) => {
            return input.length > 0 ? null : '';
        },
        './Dockerfile', // default value
    );

    const logdir = await askValidated(
        'Log directory (default: ./logs): ',
        (input) => {
            return input.length > 0 ? null : '';
        },
        './logs', // default value
    );
    const maxLogDirSizeInput = await askValidated(
        'Max log dir size in bytes (default: 5242880): ',
        (input) => {
            const num = Number(input);
            return isNaN(num) || num <= 0 ? 'Must be a positive number' : null;
        },
        '5242880', // default value
    );
    const maxLogDirSize = Number(maxLogDirSizeInput);
    const logLevel = await askValidated(
        'LogLevel: info, warn, error (default : info) ',
        (input) => {
            return input.length > 0 ? null : '';
        },
        'info',
    );

    const config: Config = {
        name,
        repo,
        branch,
        // buildCommand,
        docker: {
            type: 'docker',
            image,
            containername,
            path: {
                dockerfile: dockerfilePath,
            },
        },
        internal: {
            logdir,
            maxLogDirSize,
            logLevel,
        },
    };

    const fullPath = path.resolve(outputPath);
    await fs.writeFile(fullPath, JSON.stringify(config, null, 2), 'utf-8');
    logger.info(`Config file created at: ${fullPath}`);
}
