import { Colour } from './colours';
import { vec4_t } from './vector';
import * as math from 'mathjs';

export class Renderer {
    static canvas: HTMLCanvasElement;
    static context: CanvasRenderingContext2D;
    static image_data: ImageData;
    static pixel_buffer: Uint8ClampedArray;

    static {
        Renderer.canvas = document.getElementById("my-canvas") as HTMLCanvasElement
        Renderer.canvas.style.background = 'lightgrey';
        Renderer.context = Renderer.canvas.getContext('2d');
        Renderer.image_data = Renderer.context.getImageData(0, 0, Renderer.canvas.width, Renderer.canvas.height);
        Renderer.pixel_buffer = Renderer.image_data.data;
    }

    static clear() {
        // need to use clearRect if painting pixels with fillRect
        // Renderer.context.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);
        Renderer.pixel_buffer.fill(0);
    }

    static drawPixel(x: number, y: number, colour: vec4_t) {
        const R = 0, G = 1, B = 2, A = 3;
        let offset: number = (y * Renderer.canvas.width + x) * 4;
        Renderer.pixel_buffer[offset + 0] = colour[R];
        Renderer.pixel_buffer[offset + 1] = colour[G];
        Renderer.pixel_buffer[offset + 2] = colour[B];
        Renderer.pixel_buffer[offset + 3] = colour[A];

        // NOTE: Calls to putImageDate() here are very slow.
        // Renderer.context.putImageData(Renderer.image_data, 0, 0);
    }

    static drawVertex(x: number, y: number, s: number, colour: vec4_t) {
        for (let row = x; row < (x + s); row++) {
            for (let column = y; column < (y + s); column++) {
                Renderer.drawPixel(row, column, colour);
            }
        }
    }

}