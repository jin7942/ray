# RAY Function Documentation

This document describes the key exported functions and structures in RAY, for developers who want to use RAY as a library or extend its behavior.

---

## Table of Contents

- [RAY Function Documentation](#ray-function-documentation)
  - [Table of Contents](#table-of-contents)
  - [`loadProjectConfig(projectName: string): Promise<Config>`](#loadprojectconfigprojectname-string-promiseconfig)
  - [`runRayPipeline(context: StepContext): Promise<void>`](#runraypipelinecontext-stepcontext-promisevoid)
  - [`createContext(config: Config): StepContext`](#createcontextconfig-config-stepcontext)
  - [`StepContext` interface](#stepcontext-interface)
  - [Core Functions](#core-functions)
  - [Notes](#notes)

---

## `loadProjectConfig(projectName: string): Promise<Config>`

Loads a specific project config from `ray.config.json`.

-   **Parameters**
    -   `projectName`: The name of the project to load
-   **Returns**
    -   `Config` object
-   **Throws**
    -   If file is missing, invalid, or project not found

---

## `runRayPipeline(context: StepContext): Promise<void>`

Runs the full deployment pipeline using a prepared context.

-   **Parameters**
    -   `context`: Contains all step-level inputs (repo path, image name, etc.)
-   **Behavior**
    -   Clones repo
    -   Builds project
    -   Builds Docker image
    -   Deploys with zero downtime

---

## `createContext(config: Config): StepContext`

Builds a `StepContext` object from a given config. This is used internally to prepare values for the pipeline.

---

## `StepContext` interface

```ts
interface StepContext {
    /** GitHub repository URL */
    repo: string;

    /** Branch to checkout (optional) */
    branch?: string;

    /** Build command to run */
    // buildCommand: string;

    /** Docker configuration */
    docker: Config['docker'];

    /** Environment variables (optional) */
    env?: Record<string, string>;

    /** Temporary working directory for this pipeline */
    workspace: string;

    /** path to .env file to load environment variables (optional) */
    envFilePath?: string;

    // path to log output
    logDir?: string;
}
```

---

## Core Functions

Each stage in the pipeline is modularized:

| Function                      | File                        | Purpose                                     |
| ----------------------------- | --------------------------- | ------------------------------------------- |
| `gitCloneRepo(ctx)`           | `core/gitClone.ts`          | Clones the Git repo into the workdir        |
| `buildProject(ctx)`           | `core/runBuild.ts`          | Runs the build command                      |
| `dockerBuildImage(ctx)`       | `core/dockerBuild.ts`       | Builds the Docker image                     |
| `dockerRunNewContainer(ctx)`  | `core/dockerRunNew.ts`      | Starts a new container for zero downtime    |
| `dockerHealthCheck(ctx)`      | `core/dockerHealthCheck.ts` | Waits for the new container to be healthy   |
| `dockerReplaceContainer(ctx)` | `core/dockerReplace.ts`     | Replaces the old container with the new one |

---

## Notes

-   All steps receive a shared `StepContext` object.
-   You can import and use individual functions if you prefer a customized flow.
-   RAY is designed to be hackable. Use it your way.
