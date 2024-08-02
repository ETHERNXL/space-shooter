import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Background {

    public container: PIXI.Container;
    private sprites: PIXI.Sprite[] = [];

    constructor() {
        this.container = new PIXI.Container();
        this.createSprites();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private createSprites(): void {
        for (let i = 0; i < 2; i++) {
            this.createSprite(i);
        }
    }

    private createSprite(i: number): void {
        const sprite = App.sprite("bg");

        sprite.x = i * sprite.width;

        this.container.addChild(sprite);
        this.sprites.push(sprite);
    }

    private resize(): void {
        const { width, height } = App.app.renderer;

        this.sprites.forEach((sprite, index) => {
            sprite.width = width;
            sprite.height = height;

            sprite.x = index * width;
            sprite.y = 0;
        });

        this.container.width = width;
        this.container.height = height;
    }

    public update(dt: number): void {

    }
}
