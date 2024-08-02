import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Config } from "./Config";

export class Bullet extends PIXI.Graphics {
    public isHeroBullet: boolean;
    constructor() {
        super();
        this.isHeroBullet = true;
    }
}

export class Hero {
    public sprite!: PIXI.AnimatedSprite;
    private speed: number;
    private movingLeft: boolean;
    private movingRight: boolean;
    private bullets: PIXI.Graphics[];
    private maxBullets: number;
    public bulletCount: number;
    public defeated: boolean;
    private bulletCountText: PIXI.Text;

    constructor() {
        this.createSprite();
        this.speed = 5;
        this.movingLeft = false;
        this.movingRight = false;
        this.bullets = [];
        this.maxBullets = Config.hero.bullet.amount;
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

        App.app.stage.addChild(this.bulletCountText);
        this.setupKeyboardListeners();
    }

    private createSprite(): void {
        const walk1Texture = App.res("walk1");
        const walk2Texture = App.res("walk2");
        if (walk1Texture && walk2Texture){
            this.sprite = new PIXI.AnimatedSprite([
                walk1Texture,
                walk2Texture
            ]);
        }
        this.sprite.x = Config.hero.position.x;
        this.sprite.y = Config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }

    private setupKeyboardListeners(): void {
        window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e));
    }

    private onKeyDown(e: KeyboardEvent): void {
        switch (e.code) {
            case Config.hero.controls.left:
                this.moveLeft(true);
                break;
            case Config.hero.controls.right:
                this.moveRight(true);
                break;
            case Config.hero.controls.shoot:
                this.shoot();
                break;
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
        switch (e.code) {
            case Config.hero.controls.left:
                this.moveLeft(false);
                break;
            case Config.hero.controls.right:
                this.moveRight(false);
                break;
        }
    }

    private moveLeft(start: boolean): void {
        this.movingLeft = start;
    }

    private moveRight(start: boolean): void {
        this.movingRight = start;
    }

    private shoot(): void {
        if (this.bulletCount <= 0) return;

        const bullet = new Bullet();
        bullet.beginFill(0xff0000);
        bullet.drawRect(0, 0, Config.hero.bullet.width, Config.hero.bullet.height);
        bullet.endFill();
        bullet.x = this.sprite.x + this.sprite.width / 2;
        bullet.y = this.sprite.y;
        bullet.isHeroBullet = true;
        this.bullets.push(bullet);
        App.app.stage.addChild(bullet);

        this.bulletCount--;
        this.updateBulletCountText();
    }

    public resetBulletCount(): void {
        this.bulletCount = this.maxBullets;
        this.updateBulletCountText();
    }

    private updateBulletCountText(): void {
        this.bulletCountText.text = `Bullets: ${this.bulletCount}`;
    }

    public update(dt: number): void {
        if (this.movingLeft) {
            this.sprite.x -= this.speed;
        }
        if (this.movingRight) {
            this.sprite.x += this.speed;
        }

        const minX = 0;
        const maxX = Config.width - this.sprite.width;
        this.sprite.x = Math.max(minX, Math.min(this.sprite.x, maxX));

        this.bullets.forEach(bullet => {
            bullet.y -= Config.hero.bullet.speed;
        });

        this.bullets = this.bullets.filter(bullet => {
            if (bullet.y < 0) {
                App.app.stage.removeChild(bullet);
                return false;
            }
            return true;
        });
    }

    public takeDamage(): void {
        this.defeated = true;
    }
}
