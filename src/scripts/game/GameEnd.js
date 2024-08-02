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
exports.GameEnd = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("../system/App");
const Config_1 = require("./Config");
class GameEnd {
    constructor() {
        this.isGameEnded = false;
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
        this.timerText.x = Config_1.Config.width - 200;
        this.timerText.y = 0;
        this.container.addChild(this.timerText);
        this.restartButton = new PIXI.Text("Restart", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "red",
            align: "center"
        });
        this.restartButton.anchor.set(0.5);
        this.restartButton.x = Config_1.Config.width / 2;
        this.restartButton.y = (Config_1.Config.height / 2) + 330;
        this.restartButton.interactive = true;
        this.restartButton.buttonMode = true;
        this.container.addChild(this.restartButton);
        this.restartButton.on("pointerdown", this.restartGame.bind(this));
        this.updateTimer();
        this.timerDuration = Config_1.Config.gametime || 60;
        this.resetTimer();
    }
    update(dt, game) {
        const currentTime = Date.now();
        const elapsed = (currentTime - this.startTime) / 1000;
        this.timeLeft = Math.max(0, this.timerDuration - elapsed);
        if (this.timeLeft === 0) {
            this.showMessage("YOU LOSE");
        }
        else if (this.shouldTransitionToNextLevel(game)) {
            this.resetTimer();
            game.transitionToNextLevel();
        }
        this.updateTimer();
    }
    resetTimer() {
        this.timeLeft = this.timerDuration;
        this.startTime = Date.now();
    }
    updateTimer() {
        this.timerText.text = `Time Left: ${Math.ceil(this.timeLeft)}`;
    }
    showMessage(text) {
        this.message.text = text;
        this.message.visible = true;
        this.timerText.visible = true;
    }
    shouldTransitionToNextLevel(game) {
        return game.asteroids.asteroids.length === 0 && game.boss === undefined;
    }
    restartGame() {
        console.log("Restart button clicked");
        this.isGameEnded = false;
        App_1.App.restart();
    }
}
exports.GameEnd = GameEnd;
