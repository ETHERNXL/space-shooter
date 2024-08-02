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
exports.Hero = exports.Bullet = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("../system/App");
const Config_1 = require("./Config");
class Bullet extends PIXI.Graphics {
    constructor() {
        super();
        this.isHeroBullet = true;
    }
}
exports.Bullet = Bullet;
class Hero {
    constructor() {
        this.createSprite();
        this.speed = 5;
        this.movingLeft = false;
        this.movingRight = false;
        this.bullets = [];
        this.maxBullets = Config_1.Config.hero.bullet.amount;
        this.bulletCount = this.maxBullets;
        this.defeated = false;
        this.bulletCountText = new PIXI.Text(`Bullets: ${this.bulletCount}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'red',
            align: 'left'
        });
        this.bulletCountText.x = 10;
        this.bulletCountText.y = 0;
        App_1.App.app.stage.addChild(this.bulletCountText);
        this.setupKeyboardListeners();
    }
    createSprite() {
        const walk1Texture = App_1.App.res("walk1");
        const walk2Texture = App_1.App.res("walk2");
        if (walk1Texture && walk2Texture) {
            this.sprite = new PIXI.AnimatedSprite([
                walk1Texture,
                walk2Texture
            ]);
        }
        this.sprite.x = Config_1.Config.hero.position.x;
        this.sprite.y = Config_1.Config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }
    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    onKeyDown(e) {
        switch (e.code) {
            case Config_1.Config.hero.controls.left:
                this.moveLeft(true);
                break;
            case Config_1.Config.hero.controls.right:
                this.moveRight(true);
                break;
            case Config_1.Config.hero.controls.shoot:
                this.shoot();
                break;
        }
    }
    onKeyUp(e) {
        switch (e.code) {
            case Config_1.Config.hero.controls.left:
                this.moveLeft(false);
                break;
            case Config_1.Config.hero.controls.right:
                this.moveRight(false);
                break;
        }
    }
    moveLeft(start) {
        this.movingLeft = start;
    }
    moveRight(start) {
        this.movingRight = start;
    }
    shoot() {
        if (this.bulletCount <= 0)
            return;
        const bullet = new Bullet();
        bullet.beginFill(0xff0000);
        bullet.drawRect(0, 0, Config_1.Config.hero.bullet.width, Config_1.Config.hero.bullet.height);
        bullet.endFill();
        bullet.x = this.sprite.x + this.sprite.width / 2;
        bullet.y = this.sprite.y;
        bullet.isHeroBullet = true;
        this.bullets.push(bullet);
        App_1.App.app.stage.addChild(bullet);
        this.bulletCount--;
        this.updateBulletCountText();
        console.log(bullet);
    }
    resetBulletCount() {
        this.bulletCount = this.maxBullets;
        this.updateBulletCountText();
    }
    updateBulletCountText() {
        this.bulletCountText.text = `Bullets: ${this.bulletCount}`;
    }
    update(dt) {
        if (this.movingLeft) {
            this.sprite.x -= this.speed;
        }
        if (this.movingRight) {
            this.sprite.x += this.speed;
        }
        const minX = 0;
        const maxX = Config_1.Config.width - this.sprite.width;
        this.sprite.x = Math.max(minX, Math.min(this.sprite.x, maxX));
        this.bullets.forEach(bullet => {
            bullet.y -= Config_1.Config.hero.bullet.speed;
        });
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.y < 0) {
                App_1.App.app.stage.removeChild(bullet);
                return false;
            }
            return true;
        });
    }
    takeDamage() {
        this.defeated = true;
    }
}
exports.Hero = Hero;
