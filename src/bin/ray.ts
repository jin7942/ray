#!/usr/bin/env node
import { initConfigWizard } from '../wizard/initWizard';
import { loadAllProjects, loadProjectConfig } from '../config/configLoader';
import { runRayPipeline, runAllPipelines } from '../main';
import fs from 'fs/promises';
import path from 'path';

const args = process.argv.slice(2);
const [command, sub] = args;

async function main() {
    try {
        switch (command) {
            case 'init':
                if (sub === 'wizard') {
                    // run: ray init wizard → interactive config wizard
                    await initConfigWizard();
                } else {
                    // run: ray init → create default ray.config.json
                    await createDefaultConfig();
                }
                break;

            case 'run':
                if (sub) {
                    // run: ray run <project> → specific project
                    const config = await loadProjectConfig(sub);
                    await runRayPipeline(config);
                } else {
                    // run: ray run → all projects
                    const configs = await loadAllProjects();
                    await runAllPipelines(configs);
                }
                break;

            case 'help':
            case undefined:
                printHelp();
                break;

            default:
                console.error(`Unknown command: ${command}`);
                printHelp();
                process.exit(1);
        }
    } catch (err) {
        console.error('Error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}

/**
 * Create a default ray.config.json with example project
 */
async function createDefaultConfig() {
    const defaultJson = {
        projects: [
            {
                name: 'my-project',
                repo: 'https://github.com/your/repo.git',
                branch: 'main',
                // buildCommand: 'npm run build',
                docker: {
                    image: 'your-image',
                    containername: 'your-container',
                    path: './Dockerfile',
                    network: '',
                },
                internal: {
                    logdir: './logs',
                    maxLogDirSize: 5242880,
                    logLevel: 'info',
                    envFilePath: './.env',
                },
                env: {
                    NODE_ENV: 'production',
                },
            },
        ],
    };

    const filePath = path.resolve('ray.config.json');
    await fs.writeFile(filePath, JSON.stringify(defaultJson, null, 2), 'utf-8');
    console.log(`Default config created at: ${filePath}`);
}

/**
 * Print usage instructions for CLI
 */
function printHelp() {
    console.log(`
Usage:
  ray init               # Create default ray.config.json
  ray init wizard        # Launch interactive wizard
  ray run                # Run all projects
  ray run <project>      # Run a specific project
  ray help               # Show this help
`);
}

main();
