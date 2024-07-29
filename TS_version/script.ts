const canvas: HTMLCanvasElement = document.getElementById("my-canvas") as HTMLCanvasElement;
canvas.style.background = 'white';
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
let colour_buffer: ImageData = ctx.createImageData(800, 600);

class Playfield {
  public static readonly WIDTH: number = 800
  public static readonly HEIGHT: number = 600
}

class Block {
  xpos: number = 100;
  ypos: number = 100;
  size: number = 50;
  color: string = 'blue';
  speed: number = 200; // pixels/sec

  public moveRight(td: number): void {
    this.xpos += this.speed * td;
  }

  public moveLeft(td: number): void {
    this.xpos -= this.speed * td;
  }
}

class Game {
  private keysDown: Record<string, boolean> = {};
  private ts_delta: number = 0;
  private ts_old: number = 0;
  private playfield: Playfield = new Playfield();

  constructor() {
    // some setup
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // set colour buffer to red
    let cb_data = colour_buffer.data;
    for (let i: number = 0; i < cb_data.length; i += 4) {
      // rgba
      cb_data[i] = 255;
      cb_data[i + 1] = 255;
      cb_data[i + 2] = 0;
      cb_data[i + 3] = 255;
    }

    // start loop
    this.gameloop(this.ts_old);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keysDown[event.key] = true;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keysDown[event.key] = false;
  }

  private render(): void {
    // redraw the canvas
    ctx.putImageData(colour_buffer, 0, 0);
    // ctx.clearRect(0, 0, 800, 600);
    // ctx.fillStyle = "#FF0000";
    

    // i need to stretch virtual canvas items to context

    // rc for real canvas
    let hscale: number = (800 / Playfield.WIDTH);
    let vscale: number = (600 / Playfield.HEIGHT);
    let rc_xpos: number = hscale * block.xpos;
    let rc_ypos: number = vscale * block.ypos;
    let rc_vsize: number = block.size * vscale;
    let rc_hsize: number = block.size * hscale;

    ctx.fillRect(block.xpos, block.ypos, block.size, block.size);
    ctx.fillRect(rc_xpos, rc_ypos, rc_hsize, rc_vsize);
  }

  private gameloop(ts: number): void {
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

let block: Block = new Block();
let game: Game = new Game();
