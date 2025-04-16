import fs from 'fs/promises';
import path from 'path';
import { Config, ConfigFile } from '../_types/config';
import { logger } from '../utils/logger';

/**
 * Loads the full config file and returns the project matching the given name.
 *
 * @param projectName - Name of the project to find.
 * @param configPath - Path to the JSON config file. Default: './ray.config.json'.
 * @returns A Promise resolving to the matching project's Config object.
 * @throws If the file is missing, invalid, or the project is not found.
 */
export async function loadProjectConfig(projectName: string, configPath = './ray.config.json'): Promise<Config> {
    const absolutePath = path.resolve(configPath);

    try {
        const raw = await fs.readFile(absolutePath, 'utf-8');
        const configFile: ConfigFile = JSON.parse(raw);

        const project = configFile.projects.find((p) => p.name.trim() === projectName.trim());

        if (!project) {
            logger.error(`Project "${projectName}" not found in config file.`);
            throw new Error(`Project "${projectName}" does not exist in ${absolutePath}`);
        }

        logger.info(`Loaded config for project: ${projectName}`);
        return project;
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            logger.error(`Config file not found at: ${absolutePath}`);
            throw new Error(`Config file not found at ${absolutePath}`);
        }

        logger.error(`Failed to load config: ${err.message}`);
        throw new Error(`Invalid config file: ${err.message}`);
    }
}

/**
 * Loads all projects from the config file.
 *
 * @param configPath - Path to the JSON config file. Default: './ray.config.json'.
 * @returns A Promise resolving to an array of all project configurations.
 * @throws If the file is missing or contains invalid JSON.
 */
export async function loadAllProjects(configPath = './ray.config.json'): Promise<Config[]> {
    const absolutePath = path.resolve(configPath);

    try {
        const raw = await fs.readFile(absolutePath, 'utf-8');
        const configFile: ConfigFile = JSON.parse(raw);

        logger.info(`Loaded all project configs (${configFile.projects.length})`);
        return configFile.projects;
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            logger.error(`Config file not found at: ${absolutePath}`);
            throw new Error(`Config file not found at ${absolutePath}`);
        }

        logger.error(`Failed to load config file: ${err.message}`);
        throw new Error(`Invalid config file: ${err.message}`);
    }
}
