import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Asteroid } from './Asteroid';
import { Config } from "./Config";

export class Asteroids {
    public asteroids: Asteroid[] = [];
    public container: PIXI.Container;
    private maxAsteroids: number;
    private asteroidCreationDelay: number;
    private currentAsteroidCount: number;

    constructor() {
        this.container = new PIXI.Container();
        this.maxAsteroids = Config.asteroids.maxAsteroids;
        this.asteroidCreationDelay = 500; 
        this.currentAsteroidCount = 0;
        this.createAsteroids();
    }

    private get randomX(): number {
        const maxOffset = Config.width - 300;
        return Math.min(
            Math.round(Math.random() * (Config.width - 2 * PIXI.Texture.from("tile").width)),
            maxOffset
        );
    }

    private createAsteroid(): void {
        if (this.currentAsteroidCount >= this.maxAsteroids) return;

        const x = this.randomX;
        const asteroid = new Asteroid(x);
        this.container.addChild(asteroid.container);
        this.asteroids.push(asteroid);

        this.currentAsteroidCount++;
        
        setTimeout(() => this.createAsteroid(), this.asteroidCreationDelay);
    }

    private createAsteroids(): void {
        this.createAsteroid();
    }

    public update(dt: number): void {
        this.asteroids.forEach(asteroid => asteroid.update(dt));
        this.checkCollisions();
    }

    private checkCollisions(): void {
        const heroBullets = App.app.stage.children.filter(child => child instanceof PIXI.Graphics) as PIXI.Graphics[];
        heroBullets.forEach(bullet => {
            this.asteroids.forEach(asteroid => {
                if (this.isColliding(bullet, asteroid.container)) {
                    App.app.stage.removeChild(bullet);
                    this.asteroids = this.asteroids.filter(a => a !== asteroid);
                    App.app.stage.removeChild(asteroid.container);
                    asteroid.container.destroy();
                }
            });
        });
    }

    private isColliding(bullet: PIXI.Graphics, asteroidContainer: PIXI.Container): boolean {
        const bulletBounds = bullet.getBounds();
        const asteroidBounds = asteroidContainer.getBounds();
        return bulletBounds.x < asteroidBounds.x + asteroidBounds.width &&
               bulletBounds.x + bulletBounds.width > asteroidBounds.x &&
               bulletBounds.y < asteroidBounds.y + asteroidBounds.height &&
               bulletBounds.y + bulletBounds.height > asteroidBounds.y;
    }
}
