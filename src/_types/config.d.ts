/**
 * Configuration schema for RAY CI/CD automation
 */
export interface Config {
    /**
     * Name of the project
     * @example "sexy node app"
     */
    name: string;
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
    // buildCommand: string;

    /**
     * Set the docker information
     */
    docker: {
        /**
         * Type of the docker or docker-compose
         * @example "docker" or "compose"
         */
        type: 'docker' | 'compose';

        /**
         * Name of the Docker image
         * @example "ray-image"
         */
        image: string;

        /**
         * Name of the container to replace
         * @example "ray-container"
         */
        containername: string;

        /**
         * Path to the Dockerfile or docker-compose.yml (relative to project root)
         * @example "./Dockerfile"
         */
        path: {
            dockerfile: string;

            /**
             * If you're using docker-compose, enter the docker-compose.yml path
             */
            compose?: string;
        };

        /**
         * Docker network to connect the container to
         * @example "["net1", "net2", "net3"]"
         */
        network?: string[];

        /**
         *  An array of volume mounts. Each volume specifies a path to mount from the host system
         * @example "["/host/path:/app/path", "/tmp/test:/app/test"]"
         */
        volumes?: string[];
    };

    /**
     * Optional internal constants used by RAY
     */
    internal?: {
        /**
         * Path to log directory (default: "./logs")
         * @example "./logs"
         */
        logdir?: string;

        /**
         * Maximum total log size in bytes (default: 5 * 1024 * 1024)
         * @example 5242880
         */
        maxLogDirSize?: number;

        /**
         * Level of the log
         * @example "info" or "warn" or "error"
         */
        logLevel?: string;

        /**
         * Optional path to .env file to load environment variables
         * @example "./.env"
         */
        envFilePath?: string;
    };

    /**
     * Optional environment variables to inject during build/deploy
     * @example { "NODE_ENV": "production" }
     */
    env?: Record<string, string>;
}
/**
 * Top-level configuration file structure for RAY
 */
export interface ConfigFile {
    projects: Config[];
}
