import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Hero } from './Hero';
import { Config } from "./Config";
import {Bullet} from "./Hero";

class BossBullet extends PIXI.Graphics {
    public speed: number;

    constructor(speed: number) {
        super();
        this.speed = speed;
    }
}
export class Boss {
    private static instance: Boss | null = null;
    public defeated: boolean = false;
    private hero!: Hero;
    public container!: PIXI.Container;
    private sprite!: PIXI.AnimatedSprite;
    private healthBarContainer!: PIXI.Container;
    private healthBars: PIXI.Graphics[] = [];
    private bullets: BossBullet[] = [];
    private speed!: number;
    private hp!: number;
    private direction!: number;
    private moveInterval!: number;
    private stopDuration!: number;
    private moving!: boolean;
    private lastSwitchTime!: number;
    private lastShootTime!: number;
    private shootInterval!: number;

    constructor(hero: Hero) {
        if (Boss.instance) {
            return Boss.instance;
        }
        Boss.instance = this;
        
        this.hero = hero;
        this.container = new PIXI.Container();
        this.hp = Config.boss.hp; 
        this.defeated = false;
        this.speed = Config.boss.speed; 
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

    public static getInstance(hero: Hero): Boss {
        if (!Boss.instance) {
            Boss.instance = new Boss(hero);
        }
        return Boss.instance;
    }

    private shoot(): void { 
        console.log("shoot from boss!");
        const bullet = new BossBullet(Config.boss.bullet.speed);
        bullet.beginFill(0xff0000); 
        bullet.drawRect(0, 0, Config.boss.bullet.width, Config.boss.bullet.height); 
        bullet.endFill();
        bullet.x = this.sprite.x + this.sprite.width / 2 - 5;
        bullet.y = this.sprite.y + this.sprite.height;
        bullet.speed = Config.boss.bullet.speed; 
        this.bullets.push(bullet);
        App.app.stage.addChild(bullet);
    }

    private updateBullets(): void {
        this.bullets.forEach(bullet => {
            bullet.y += bullet.speed; 
            if (bullet.y > Config.height) { 
                App.app.stage.removeChild(bullet);
                bullet.visible = false;
            }
        });
        this.bullets = this.bullets.filter(bullet => bullet.visible);
    }

    private createSprite(): void {
        const walk1Texture = App.res("enemy1");
        const walk2Texture = App.res("enemy2");
        if (walk1Texture && walk2Texture) {
            this.sprite = new PIXI.AnimatedSprite([
                walk1Texture,
                walk2Texture
            ]);
        } else {
            console.error("Missing textures for the boss sprite.");
        }
        this.sprite.x = Config.width / 2 - this.sprite.width / 2;
        this.sprite.y = Config.height - 650;
        this.container.addChild(this.sprite);
    }

    private createHealthBar(): void {
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

    private getRandomMoveInterval(): number {
        return 2000 + Math.random() * 3000; 
    }

    private getRandomDirection(): number {
        return Math.random() < 0.5 ? -1 : 1;
    }

    private checkPlayerBulletCollisions(): void {
        const heroBullets = App.app.stage.children.filter(child => child instanceof PIXI.Graphics);
        heroBullets.forEach(bullet => {
            if (this.checkCollision(bullet, this.sprite)) {
                App.app.stage.removeChild(bullet);
                bullet.visible = false;
                this.takeDamage(); 
            }
        });
    }
    
    checkBossAndPlayerBulletCollisions() {
        const heroBullets = App.app.stage.children.filter(child => child instanceof Bullet);
        this.bullets.forEach(bossBullet => {
            heroBullets.forEach(heroBullet => {
                console.log(this.checkCollision(bossBullet, heroBullet));
                if (this.checkCollision(bossBullet, heroBullet)) {
                    App.app.stage.removeChild(bossBullet);
                    bossBullet.visible = false;
                    App.app.stage.removeChild(heroBullet);
                    heroBullet.visible = false;
                }
            });
        });
    }

    private checkCollision(a: PIXI.DisplayObject, b: PIXI.DisplayObject): boolean {
        if (!a.visible || !b.visible) {
            return false;
        }

        const aBounds = a.getBounds();
        const bBounds = b.getBounds();

        return (
            aBounds.x < bBounds.x + bBounds.width &&
            aBounds.x + aBounds.width > bBounds.x &&
            aBounds.y < bBounds.y + bBounds.height &&
            aBounds.y + aBounds.height > bBounds.y
        );
    }

    private takeDamage(): void {
        if (this.hp > 0) {
            this.hp--;
        }
        if (this.hp <= 0) {
            this.die();
        }
    }

    private die(): void {
        this.container.visible = false;
        this.defeated = true;
    }
    public update(dt: number): void {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastSwitchTime;
        const elapsedShootTime = currentTime - this.lastShootTime;

        if (this.moving && elapsedTime >= this.moveInterval) {
            this.moving = false;
            this.lastSwitchTime = currentTime;
        } else if (!this.moving && elapsedTime >= this.stopDuration) {
            this.moving = true;
            this.lastSwitchTime = currentTime;
            this.moveInterval = this.getRandomMoveInterval();
            this.direction = this.getRandomDirection();
        }

        if (this.moving) {
            this.sprite.x += this.speed * this.direction;

            if (this.sprite.x <= 0 || this.sprite.x + this.sprite.width >= Config.width) {
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
                App.app.stage.removeChild(bullet);
                bullet.visible = false;
            }
        });

        this.checkPlayerBulletCollisions();
        this.checkBossAndPlayerBulletCollisions();
    }
}
