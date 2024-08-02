import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";
import { ScenesManager } from "./ScenesManager";

interface Config {
    width: number;
    height: number;
    loader: { key: string, data: { default: string } }[];
    scenes: { [key: string]: any };
    [key: string]: any;
}

class Application {
    private config!: Config;
    public app!: PIXI.Application;
    private scenes!: ScenesManager;
    private loader!: Loader;

    run(config: Config): void {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.app = new PIXI.Application({ width: this.config.width, height: this.config.height });
        (globalThis as any).__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view);

        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());
    }

    res(key: string) {
        return this.loader.resources[key].texture;
    }

    sprite(key: string): PIXI.Sprite {
        return new PIXI.Sprite(this.res(key));
    }

    start(): void {
        this.scenes.start("Game");
    }

    restart() {
        this.app.stage.removeChildren(); 
        location.reload()
    }
}

export const App = new Application();
