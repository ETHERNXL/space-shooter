"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const PIXI = __importStar(require("pixi.js"));
const gsap_1 = require("gsap");
const PixiPlugin_1 = require("gsap/PixiPlugin");
const Loader_1 = require("./Loader");
const ScenesManager_1 = require("./ScenesManager");
class Application {
    run(config) {
        gsap_1.gsap.registerPlugin(PixiPlugin_1.PixiPlugin);
        PixiPlugin_1.PixiPlugin.registerPIXI(PIXI);
        this.config = config;
        this.app = new PIXI.Application({ width: this.config.width, height: this.config.height });
        globalThis.__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view);
        this.scenes = new ScenesManager_1.ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);
        this.loader = new Loader_1.Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());
    }
    res(key) {
        return this.loader.resources[key].texture;
    }
    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }
    start() {
        this.scenes.start("Game");
    }
    restart() {
        this.app.stage.removeChildren();
        location.reload();
    }
}
exports.App = new Application();
