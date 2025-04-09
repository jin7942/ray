/**
 * RAY CI/CD Automation Library Entry
 *
 * This module provides both full pipeline execution
 * and individual step functions for custom usage.
 */

export { runRayPipeline, runAllPipelines } from './main';
export { createContext } from './core/contextBuilder';

// Optional: export individual core functions for advanced control
export { gitCloneRepo, buildProject, dockerBuildImage, dockerDeployContainer } from './core';

export { loadAllProjects, loadProjectConfig } from './config/configLoader';

// Export types for external use
export type { Config, ConfigFile } from '../src/_types/config';
export type { StepContext } from '../src/_types/context';
