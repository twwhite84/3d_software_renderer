"use strict";
const canvas = document.getElementById("my-canvas");
canvas.style.background = 'white';
const ctx = canvas.getContext('2d');
let colour_buffer = ctx.createImageData(800, 600);
class Playfield {
}
Playfield.WIDTH = 800;
Playfield.HEIGHT = 600;
class Block {
    constructor() {
        this.xpos = 100;
        this.ypos = 100;
        this.size = 50;
        this.color = 'blue';
        this.speed = 200; // pixels/sec
    }
    moveRight(td) {
        this.xpos += this.speed * td;
    }
    moveLeft(td) {
        this.xpos -= this.speed * td;
    }
}
class Game {
    constructor() {
        this.keysDown = {};
        this.ts_delta = 0;
        this.ts_old = 0;
        this.playfield = new Playfield();
        // some setup
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        // set colour buffer to red
        let cb_data = colour_buffer.data;
        for (let i = 0; i < cb_data.length; i += 4) {
            // rgba
            cb_data[i] = 255;
            cb_data[i + 1] = 255;
            cb_data[i + 2] = 0;
            cb_data[i + 3] = 255;
        }
        // start loop
        this.gameloop(this.ts_old);
    }
    handleKeyDown(event) {
        this.keysDown[event.key] = true;
    }
    handleKeyUp(event) {
        this.keysDown[event.key] = false;
    }
    render() {
        // redraw the canvas
        ctx.putImageData(colour_buffer, 0, 0);
        // ctx.clearRect(0, 0, 800, 600);
        // ctx.fillStyle = "#FF0000";
        // i need to stretch virtual canvas items to context
        // rc for real canvas
        let hscale = (800 / Playfield.WIDTH);
        let vscale = (600 / Playfield.HEIGHT);
        let rc_xpos = hscale * block.xpos;
        let rc_ypos = vscale * block.ypos;
        let rc_vsize = block.size * vscale;
        let rc_hsize = block.size * hscale;
        ctx.fillRect(block.xpos, block.ypos, block.size, block.size);
        ctx.fillRect(rc_xpos, rc_ypos, rc_hsize, rc_vsize);
    }
    gameloop(ts) {
        // get the time delta
        this.ts_delta = (ts - this.ts_old) / 1000;
        this.ts_old = ts;
        // handle keyboard input
        if (this.keysDown['ArrowRight']) {
            block.moveRight(this.ts_delta);
        }
        if (this.keysDown['ArrowLeft']) {
            block.moveLeft(this.ts_delta);
        }
        if (this.keysDown['f']) {
            canvas.requestFullscreen();
        }
        this.render();
        requestAnimationFrame(this.gameloop.bind(this));
    }
}
let block = new Block();
let game = new Game();
//# sourceMappingURL=script.js.map