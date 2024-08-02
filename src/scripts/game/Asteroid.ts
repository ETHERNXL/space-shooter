import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Config } from "./Config";

export class Asteroid {
    tileSize: number;
    width: number;
    height: number;
    container!: PIXI.Container;
    speed: number;

    constructor(x: number) {
        this.tileSize = PIXI.Texture.from("tile").width;
        this.width = this.tileSize * 60; 
        this.height = this.tileSize * 60; 
        this.createContainer(x);
        this.createTiles();
        this.speed = Config.asteroids.speed || 2;
    }

    createContainer(x: number) {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = 0;
        this.container.scale.set(0.3);
    }

    createTiles() {
        for (let row = 0; row < 5; row++) { 
            for (let col = 0; col < 5; col++) { 
                this.createTile(row, col);
            }
        }
    }

    createTile(row: number, col: number) {
        const texture = "tile"; 
        const tile = App.sprite(texture);
        this.container.addChild(tile);
        tile.x = col * tile.width;
        tile.y = row * tile.height;
    }

    update(dt: number) {
        this.container.y += this.speed * dt;
    }
}
