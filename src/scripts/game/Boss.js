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
exports.Boss = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("../system/App");
const Config_1 = require("./Config");
const Hero_1 = require("./Hero");
class BossBullet extends PIXI.Graphics {
    constructor(speed) {
        super();
        this.speed = speed;
    }
}
class Boss {
    constructor(hero) {
        this.defeated = false;
        this.healthBars = [];
        this.bullets = [];
        if (Boss.instance) {
            return Boss.instance;
        }
        Boss.instance = this;
        this.hero = hero;
        this.container = new PIXI.Container();
        this.hp = Config_1.Config.boss.hp;
        this.defeated = false;
        this.speed = Config_1.Config.boss.speed;
        this.direction = 1;
        this.moveInterval = this.getRandomMoveInterval();
        this.stopDuration = 2000;
        this.moving = true;
        this.lastSwitchTime = Date.now();
        this.lastShootTime = Date.now();
        this.shootInterval = 2000;
        this.createSprite();
        this.createHealthBar();
    }
    static getInstance(hero) {
        if (!Boss.instance) {
            Boss.instance = new Boss(hero);
        }
        return Boss.instance;
    }
    shoot() {
        console.log("shoot from boss!");
        const bullet = new BossBullet(Config_1.Config.boss.bullet.speed);
        bullet.beginFill(0xff0000);
        bullet.drawRect(0, 0, Config_1.Config.boss.bullet.width, Config_1.Config.boss.bullet.height);
        bullet.endFill();
        bullet.x = this.sprite.x + this.sprite.width / 2 - 5;
        bullet.y = this.sprite.y + this.sprite.height;
        bullet.speed = Config_1.Config.boss.bullet.speed;
        this.bullets.push(bullet);
        App_1.App.app.stage.addChild(bullet);
    }
    updateBullets() {
        this.bullets.forEach(bullet => {
            bullet.y += bullet.speed;
            if (bullet.y > Config_1.Config.height) {
                App_1.App.app.stage.removeChild(bullet);
                bullet.visible = false;
            }
        });
        this.bullets = this.bullets.filter(bullet => bullet.visible);
    }
    createSprite() {
        const walk1Texture = App_1.App.res("enemy1");
        const walk2Texture = App_1.App.res("enemy2");
        if (walk1Texture && walk2Texture) {
            this.sprite = new PIXI.AnimatedSprite([
                walk1Texture,
                walk2Texture
            ]);
        }
        else {
            console.error("Missing textures for the boss sprite.");
        }
        this.sprite.x = Config_1.Config.width / 2 - this.sprite.width / 2;
        this.sprite.y = Config_1.Config.height - 650;
        this.container.addChild(this.sprite);
    }
    createHealthBar() {
        this.healthBarContainer = new PIXI.Container();
        this.healthBarContainer.x = this.sprite.x + this.sprite.width / 6;
        this.healthBarContainer.y = this.sprite.y - 20;
        this.healthBars = [];
        for (let i = 0; i < this.hp; i++) {
            const healthBar = new PIXI.Graphics();
            healthBar.beginFill(0xff0000);
            healthBar.drawRect(i * 15, 0, 10, 10);
            healthBar.endFill();
            this.healthBars.push(healthBar);
            this.healthBarContainer.addChild(healthBar);
        }
        this.container.addChild(this.healthBarContainer);
    }
    getRandomMoveInterval() {
        return 2000 + Math.random() * 3000;
    }
    getRandomDirection() {
        return Math.random() < 0.5 ? -1 : 1;
    }
    checkPlayerBulletCollisions() {
        const heroBullets = App_1.App.app.stage.children.filter(child => child instanceof PIXI.Graphics);
        heroBullets.forEach(bullet => {
            if (this.checkCollision(bullet, this.sprite)) {
                App_1.App.app.stage.removeChild(bullet);
                bullet.visible = false;
                this.takeDamage();
            }
        });
    }
    checkBossAndPlayerBulletCollisions() {
        const heroBullets = App_1.App.app.stage.children.filter(child => child instanceof Hero_1.Bullet);
        this.bullets.forEach(bossBullet => {
            heroBullets.forEach(heroBullet => {
                console.log(this.checkCollision(bossBullet, heroBullet));
                if (this.checkCollision(bossBullet, heroBullet)) {
                    App_1.App.app.stage.removeChild(bossBullet);
                    bossBullet.visible = false;
                    App_1.App.app.stage.removeChild(heroBullet);
                    heroBullet.visible = false;
                }
            });
        });
    }
    checkCollision(a, b) {
        if (!a.visible || !b.visible) {
            return false;
        }
        const aBounds = a.getBounds();
        const bBounds = b.getBounds();
        return (aBounds.x < bBounds.x + bBounds.width &&
            aBounds.x + aBounds.width > bBounds.x &&
            aBounds.y < bBounds.y + bBounds.height &&
            aBounds.y + aBounds.height > bBounds.y);
    }
    takeDamage() {
        if (this.hp > 0) {
            this.hp--;
        }
        if (this.hp <= 0) {
            this.die();
        }
    }
    die() {
        this.container.visible = false;
        this.defeated = true;
    }
    update(dt) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastSwitchTime;
        const elapsedShootTime = currentTime - this.lastShootTime;
        if (this.moving && elapsedTime >= this.moveInterval) {
            this.moving = false;
            this.lastSwitchTime = currentTime;
        }
        else if (!this.moving && elapsedTime >= this.stopDuration) {
            this.moving = true;
            this.lastSwitchTime = currentTime;
            this.moveInterval = this.getRandomMoveInterval();
            this.direction = this.getRandomDirection();
        }
        if (this.moving) {
            this.sprite.x += this.speed * this.direction;
            if (this.sprite.x <= 0 || this.sprite.x + this.sprite.width >= Config_1.Config.width) {
                this.direction *= -1;
            }
        }
        this.healthBarContainer.x = this.sprite.x + this.sprite.width / 6;
        this.healthBarContainer.y = this.sprite.y - 20;
        for (let i = 0; i < this.healthBars.length; i++) {
            this.healthBars[i].visible = i < this.hp;
        }
        if (elapsedShootTime >= this.shootInterval) {
            this.shoot();
            this.lastShootTime = currentTime;
        }
        this.updateBullets();
        this.bullets.forEach(bullet => {
            if (this.checkCollision(bullet, this.hero.sprite)) {
                this.hero.takeDamage();
                App_1.App.app.stage.removeChild(bullet);
                bullet.visible = false;
            }
        });
        this.checkPlayerBulletCollisions();
        this.checkBossAndPlayerBulletCollisions();
    }
}
exports.Boss = Boss;
Boss.instance = null;
