import * as PIXI from "pixi.js";

interface Asset {
    key: string;
    data: { default: string };
}

interface Config {
    loader: Asset[];
    [key: string]: any; 
}
export class Loader {
    private loader: PIXI.Loader;
    private config: Config;
    public resources: { [key: string]: PIXI.LoaderResource };

    constructor(loader: PIXI.Loader, config: any) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }

    preload() {
        for (const asset of this.config.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                this.loader.add(key, asset.data.default)
            }
        }

        return new Promise<void>(resolve => {
            this.loader.load((loader, resources) => {
                this.resources = resources;
                resolve();
            });
        });
    }
}