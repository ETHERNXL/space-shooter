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
exports.Asteroid = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("../system/App");
const Config_1 = require("./Config");
class Asteroid {
    constructor(x) {
        this.tileSize = PIXI.Texture.from("tile").width;
        this.width = this.tileSize * 60;
        this.height = this.tileSize * 60;
        this.createContainer(x);
        this.createTiles();
        this.speed = Config_1.Config.asteroids.speed || 2;
    }
    createContainer(x) {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = 0;
        this.container.scale.set(0.3);
    }
    createTiles() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                this.createTile(row, col);
            }
        }
    }
    createTile(row, col) {
        const texture = "tile";
        const tile = App_1.App.sprite(texture);
        this.container.addChild(tile);
        tile.x = col * tile.width;
        tile.y = row * tile.height;
    }
    update(dt) {
        this.container.y += this.speed * dt;
    }
}
exports.Asteroid = Asteroid;
