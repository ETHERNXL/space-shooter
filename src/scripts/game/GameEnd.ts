import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Game } from "./Game";
import { Config } from "./Config";

export class GameEnd {
    
    public container: PIXI.Container;
    private message: PIXI.Text;
    private restartButton: PIXI.Text;
    private timerText: PIXI.Text;
    private timerDuration: number;
    private timeLeft!: number;
    private startTime!: number;
    private isGameEnded: boolean = false;

    constructor() {
        this.container = new PIXI.Container();

        this.message = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: 36,
            fill: "red",
            align: "center"
        });
        this.message.x = 640;
        this.message.y = 360;
        this.message.anchor.set(0.5);
        this.container.addChild(this.message);
        
        this.timerText = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "red",
            align: "center"
        });
        this.timerText.x = Config.width - 200;
        this.timerText.y = 0;
        this.container.addChild(this.timerText);

        this.restartButton = new PIXI.Text("Restart", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "red",
            align: "center"
        });

        this.restartButton.anchor.set(0.5);
        this.restartButton.x = Config.width / 2;
        this.restartButton.y = (Config.height / 2) + 330;
        this.restartButton.interactive = true;
        this.restartButton.buttonMode = true;
        this.container.addChild(this.restartButton);
        this.restartButton.on("pointerdown", this.restartGame.bind(this));

        this.updateTimer();
        this.timerDuration = Config.gametime || 60;
        this.resetTimer();
    }

    public update(dt: number, game: Game): void {
        const currentTime = Date.now();
        const elapsed = (currentTime - this.startTime) / 1000;
        this.timeLeft = Math.max(0, this.timerDuration - elapsed);

        if (this.timeLeft === 0) {
            this.showMessage("YOU LOSE");
        } else if (this.shouldTransitionToNextLevel(game)) {
            this.resetTimer();
            game.transitionToNextLevel();
        }

        this.updateTimer();
    }

    private resetTimer(): void {
        this.timeLeft = this.timerDuration;
        this.startTime = Date.now();
    }

    private updateTimer(): void {
        this.timerText.text = `Time Left: ${Math.ceil(this.timeLeft)}`;
    }

    public showMessage(text: string): void {
        this.message.text = text;
        this.message.visible = true;
        this.timerText.visible = true;
    }

    private shouldTransitionToNextLevel(game: Game): boolean {
        return game.asteroids.asteroids.length === 0 && game.boss === undefined;
    }
    private restartGame() {
        this.isGameEnded = false;
        App.restart(); 
    }
}
