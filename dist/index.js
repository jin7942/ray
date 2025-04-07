"use strict";
/**
 * RAY CI/CD Automation Library Entry
 *
 * This module provides both full pipeline execution
 * and individual step functions for custom usage.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dockerDeployContainer = exports.dockerBuildImage = exports.buildProject = exports.gitCloneRepo = exports.createContext = exports.runAllPipelines = exports.runRayPipeline = void 0;
var main_1 = require("./main");
Object.defineProperty(exports, "runRayPipeline", { enumerable: true, get: function () { return main_1.runRayPipeline; } });
Object.defineProperty(exports, "runAllPipelines", { enumerable: true, get: function () { return main_1.runAllPipelines; } });
var contextBuilder_1 = require("./core/contextBuilder");
Object.defineProperty(exports, "createContext", { enumerable: true, get: function () { return contextBuilder_1.createContext; } });
// Optional: export individual core functions for advanced control
var core_1 = require("./core");
Object.defineProperty(exports, "gitCloneRepo", { enumerable: true, get: function () { return core_1.gitCloneRepo; } });
Object.defineProperty(exports, "buildProject", { enumerable: true, get: function () { return core_1.buildProject; } });
Object.defineProperty(exports, "dockerBuildImage", { enumerable: true, get: function () { return core_1.dockerBuildImage; } });
Object.defineProperty(exports, "dockerDeployContainer", { enumerable: true, get: function () { return core_1.dockerDeployContainer; } });
