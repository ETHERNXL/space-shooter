import { Game } from "./Game";
import { Tools } from "../system/Tools";

declare const require: any;

export const Config = {
    width: 1280,
    height: 720,
    gametime: 60,
    hero: {
        position: {
            x: 350,
            y: 600
        },
        controls:{
            left: "ArrowLeft",
            right: "ArrowRight",
            shoot: "Space"
        },
        bullet: {
            speed: 10,
            width: 10,
            height: 15,
            amount: 10
        }
    },
    boss:{
        hp: 4,
        speed: 1,
        bullet: {
            speed: 2,
            width: 10,
            height: 15,
        }
    },
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    scenes: {
        "Game": Game
    },
    asteroids: {
        ranges: {
            rows: {
                min: 3,
                max: 3
            },
            cols: {
                min: 3,
                max: 3
            },
            offset: {
                min: 60,
                max: 200
            }
        },
        maxAsteroids: 10,
        speed: 0.5
    },

};