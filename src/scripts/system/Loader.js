"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
class Loader {
    constructor(loader, config) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }
    preload() {
        for (const asset of this.config.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                this.loader.add(key, asset.data.default);
            }
        }
        return new Promise(resolve => {
            this.loader.load((loader, resources) => {
                this.resources = resources;
                resolve();
            });
        });
    }
}
exports.Loader = Loader;
