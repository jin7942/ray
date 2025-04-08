# RAY Function Documentation

This document describes the key exported functions and structures in RAY, for developers who want to use RAY as a library or extend its behavior.

---

## Table of Contents

- [loadProjectConfig](#loadprojectconfig)
- [runRayPipeline](#runraypipeline)
- [createContext](#createcontext)
- [StepContext](#stepcontext-interface)
- [Core Functions](#core-functions)

---

## `loadProjectConfig(projectName: string): Promise<Config>`

Loads a specific project config from `ray.config.json`.

- **Parameters**
  - `projectName`: The name of the project to load
- **Returns**
  - `Config` object
- **Throws**
  - If file is missing, invalid, or project not found

---

## `runRayPipeline(context: StepContext): Promise<void>`

Runs the full deployment pipeline using a prepared context.

- **Parameters**
  - `context`: Contains all step-level inputs (repo path, image name, etc.)
- **Behavior**
  - Clones repo
  - Builds project
  - Builds Docker image
  - Deploys with zero downtime

---

## `createContext(config: Config): StepContext`

Builds a `StepContext` object from a given config. This is used internally to prepare values for the pipeline.

---

## `StepContext` interface

```ts
interface StepContext {
  workdir: string;
  repopath: string;
  image: string;
  containername: string;
  dockerfilePath: string;
  buildCommand: string;
  repo: string;
  branch: string;
  logdir: string;
  maxLogDirSize: number;
  logLevel: string;
}
```

---

## Core Functions

Each stage in the pipeline is modularized:

| Function | File | Purpose |
|----------|------|---------|
| `gitCloneRepo(ctx)` | `core/gitClone.ts` | Clones the Git repo into the workdir |
| `buildProject(ctx)` | `core/runBuild.ts` | Runs the build command |
| `dockerBuildImage(ctx)` | `core/dockerBuild.ts` | Builds the Docker image |
| `dockerRunNewContainer(ctx)` | `core/dockerRunNew.ts` | Starts a new container for zero downtime |
| `dockerHealthCheck(ctx)` | `core/dockerHealthCheck.ts` | Waits for the new container to be healthy |
| `dockerReplaceContainer(ctx)` | `core/dockerReplace.ts` | Replaces the old container with the new one |

---

## Notes

- All steps receive a shared `StepContext` object.
- You can import and use individual functions if you prefer a customized flow.
- RAY is designed to be hackable. Use it your way.