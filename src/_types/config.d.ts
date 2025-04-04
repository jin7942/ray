// _types/config.d.ts

/**
 * Configuration schema for RAY CI/CD automation
 */
export interface Config {
    /**
     * GitHub repository URL
     * @example "https://github.com/user/repo.git"
     */
    repo: string;

    /**
     * Branch to deploy (optional, default: main)
     * @example "main"
     */
    branch?: string;

    /**
     * Build command to run before deploying
     * @example "npm run build"
     */
    buildCommand: string;

    docker: {
        /**
         * Name of the Docker image
         * @example "im docker image"
         */
        image: String;
        /**
         * Name of the container to replace
         * @example "myapp-container"
         */
        containername: String;
        /**
         * Path to the Dockerfile (relative to project root)
         * @example "./Dockerfile"
         */
        path: String;
    };

    /**
     * Optional environment variables to inject during build/deploy
     * @example { "NODE_ENV": "production" }
     */
    env?: Record<string, string>;
}
