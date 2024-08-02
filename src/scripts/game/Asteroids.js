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
exports.Asteroids = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("../system/App");
const Asteroid_1 = require("./Asteroid");
const Config_1 = require("./Config");
class Asteroids {
    constructor() {
        this.asteroids = [];
        this.container = new PIXI.Container();
        this.maxAsteroids = Config_1.Config.asteroids.maxAsteroids;
        this.asteroidCreationDelay = 500;
        this.currentAsteroidCount = 0;
        this.createAsteroids();
    }
    get randomX() {
        const maxOffset = Config_1.Config.width - 300;
        return Math.min(Math.round(Math.random() * (Config_1.Config.width - 2 * PIXI.Texture.from("tile").width)), maxOffset);
    }
    createAsteroid() {
        if (this.currentAsteroidCount >= this.maxAsteroids)
            return;
        const x = this.randomX;
        const asteroid = new Asteroid_1.Asteroid(x);
        this.container.addChild(asteroid.container);
        this.asteroids.push(asteroid);
        this.currentAsteroidCount++;
        setTimeout(() => this.createAsteroid(), this.asteroidCreationDelay);
    }
    createAsteroids() {
        this.createAsteroid();
    }
    update(dt) {
        this.asteroids.forEach(asteroid => asteroid.update(dt));
        this.checkCollisions();
    }
    checkCollisions() {
        const heroBullets = App_1.App.app.stage.children.filter(child => child instanceof PIXI.Graphics);
        heroBullets.forEach(bullet => {
            this.asteroids.forEach(asteroid => {
                if (this.isColliding(bullet, asteroid.container)) {
                    App_1.App.app.stage.removeChild(bullet);
                    this.asteroids = this.asteroids.filter(a => a !== asteroid);
                    App_1.App.app.stage.removeChild(asteroid.container);
                    asteroid.container.destroy();
                }
            });
        });
    }
    isColliding(bullet, asteroidContainer) {
        const bulletBounds = bullet.getBounds();
        const asteroidBounds = asteroidContainer.getBounds();
        return bulletBounds.x < asteroidBounds.x + asteroidBounds.width &&
            bulletBounds.x + bulletBounds.width > asteroidBounds.x &&
            bulletBounds.y < asteroidBounds.y + asteroidBounds.height &&
            bulletBounds.y + bulletBounds.height > asteroidBounds.y;
    }
}
exports.Asteroids = Asteroids;
