# RAY

[![npm version](https://img.shields.io/npm/v/@jin7942/ray?color=blue)](https://www.npmjs.com/package/@jin7942/ray)
[![npm downloads](https://img.shields.io/npm/dm/@jin7942/ray)](https://www.npmjs.com/package/@jin7942/ray)
[![license](https://img.shields.io/npm/l/@jin7942/ray)](./LICENSE)

**ver: 1.0.1**

[한국어 README 보기](./README.ko.md)

**A lightweight, no-nonsense CI/CD automation tool.**

RAY clones your GitHub repo, runs your build command, builds a Docker image, and replaces containers with zero downtime — all from a simple JSON config. No YAML, no cloud vendor lock-in, just code that ships.

---

## Features

-   Clone GitHub repositories
-   Custom build commands
-   Docker image creation
-   Zero-downtime container replacement
-   JSON-based config file
-   CLI and library usage supported

---

## Installation

```bash
npm install -g @jin7942/ray
```

---

## CLI Usage

```bash
ray init               # Create default config file
ray init wizard        # Run interactive setup wizard
ray run                # Run all configured projects
ray run <project>      # Run a specific project
ray help               # Show help
```

---

## Configuration Example (`ray.config.json`)

```json
{
    "projects": [
        {
            "name": "my-app",
            "repo": "https://github.com/user/my-app.git",
            "branch": "main",
            "buildCommand": "npm run build",
            "docker": {
                "image": "my-app-image",
                "containername": "my-app-container",
                "path": "./Dockerfile"
            },
            "internal": {
                "logdir": "./logs",
                "maxLogDirSize": 5242880,
                "logLevel": "info"
            }
        }
    ]
}
```

---

## Library Usage

```ts
import { loadProjectConfig, runRayPipeline } from '@jin7942/ray';

const config = await loadProjectConfig('my-app');
await runRayPipeline(config);
```

### [document](./DOCUMENT.md)

---

## Requirements

-   Node.js 18+
-   Git installed
-   Docker installed and running

---

## Simple Example

Want to see how to use RAY in a real server?

## Check out [RAY Auto Deploy Server](https://github.com/jin7942/ra-auto-deploy-server) — a lightweight webhook server that uses RAY for CI/CD automation.

---

## Philosophy

Deployment shouldn't be complicated.  
RAY automates the essential steps in a simple, controlled, and hackable way — so you can deploy your project without the overhead.

---

## Release History

| Version | Date       | Description                                      |
| ------- | ---------- | ------------------------------------------------ |
| v1.0.0  | 2024-04-09 | Initial release. Core pipeline features complete |
| v1.1.0  | Upcoming   | Environment overrides, healthcheck customization |

---

## License

MIT

---

## Contributing

This project is open source and welcomes contributions, suggestions, and feedback.

-   Open an issue: [GitHub Issues](https://github.com/jin7942/ray/issues)
-   Pull requests are welcome.

## Links

-   GitHub: https://github.com/jin7942/ray
-   Issues: https://github.com/jin7942/ray/issues
