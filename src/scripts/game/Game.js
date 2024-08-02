"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Background_1 = require("./Background");
const Scene_1 = require("../system/Scene");
const Hero_1 = require("./Hero");
const Asteroids_1 = require("./Asteroids");
const GameEnd_1 = require("./GameEnd");
const Boss_1 = require("./Boss");
class Game extends Scene_1.Scene {
    constructor() {
        super();
        this.bossCreated = false;
        this.isGameOver = false;
    }
    create() {
        this.createBackground();
        this.createHero();
        this.createAsteroids();
        this.createGameEnd();
    }
    createBackground() {
        this.bg = new Background_1.Background();
        this.container.addChild(this.bg.container);
    }
    createHero() {
        this.hero = new Hero_1.Hero();
        this.container.addChild(this.hero.sprite);
    }
    createAsteroids() {
        this.asteroids = new Asteroids_1.Asteroids();
        this.container.addChild(this.asteroids.container);
    }
    createBoss() {
        this.boss = new Boss_1.Boss(this.hero);
        this.container.addChild(this.boss.container);
    }
    createGameEnd() {
        this.gameEnd = new GameEnd_1.GameEnd();
        this.container.addChild(this.gameEnd.container);
    }
    update(dt) {
        if (this.isGameOver)
            return;
        this.bg.update(dt);
        this.asteroids.update(dt);
        this.hero.update(dt);
        this.gameEnd.update(dt, this);
        if (this.hero.bulletCount === 0 && this.asteroids.asteroids.length > 1) {
            this.endGame("YOU LOSE");
        }
        if (this.bossCreated) {
            this.boss.update(dt);
            if (this.boss.defeated) {
                this.endGame("YOU WIN");
            }
            if (this.hero.bulletCount === 0 && !this.boss.defeated) {
                this.endGame("YOU LOSE");
            }
            if (this.hero.defeated) {
                this.endGame("YOU LOSE");
            }
        }
    }
    endGame(message) {
        this.isGameOver = true;
        this.gameEnd.showMessage(message);
    }
    transitionToNextLevel() {
        this.container.removeChild(this.asteroids.container);
        this.createBoss();
        this.bossCreated = true;
        this.hero.resetBulletCount();
    }
}
exports.Game = Game;
