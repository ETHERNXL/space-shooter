import * as PIXI from "pixi.js";
import { App } from "./App";
import { Config } from "../game/Config";

interface Scene {
    container: PIXI.Container;
    remove(): void;
}

export class ScenesManager {
    public container: PIXI.Container;
    private scene: Scene | null;

    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.scene = null;
    }

    start(sceneKey: keyof typeof Config.scenes): void  {
        if (this.scene) {
            this.scene.remove();
        }

        this.scene = new Config.scenes[sceneKey]();
        if (this.scene) {
            this.container.addChild(this.scene.container);
        }
    }
}