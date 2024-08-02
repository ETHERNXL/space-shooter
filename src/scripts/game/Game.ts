import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from './Hero';
import { Asteroids } from './Asteroids';
import { GameEnd } from './GameEnd';
import { Boss } from "./Boss";

export class Game extends Scene {
    public isGameOver: boolean;
    private bg!: Background;
    private hero!: Hero;
    public asteroids!: Asteroids;
    private gameEnd!: GameEnd;
    public boss!: Boss;
    private bossCreated: boolean;
    
    constructor() {
        super();
        this.bossCreated = false; 
        this.isGameOver = false;
    }
    
    create(): void {
        this.createBackground();
        this.createHero();
        this.createAsteroids();
        this.createGameEnd();
    }

    private createBackground(): void {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    private createHero(): void {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);
    }

    private createAsteroids() {
        this.asteroids = new Asteroids();
        this.container.addChild(this.asteroids.container);
    }

    private createBoss(): void {
        this.boss = new Boss(this.hero);
        this.container.addChild(this.boss.container);
    }
    
    private createGameEnd(): void {
        this.gameEnd = new GameEnd();
        this.container.addChild(this.gameEnd.container);
    }

    public update(dt: number) {
        if (this.isGameOver) return;
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

    private endGame(message: string) {
        this.isGameOver = true; 
        this.gameEnd.showMessage(message); 
    }

    public transitionToNextLevel(): void {
        this.container.removeChild(this.asteroids.container);
        this.createBoss();
        this.bossCreated = true;
        this.hero.resetBulletCount();
    }
}
