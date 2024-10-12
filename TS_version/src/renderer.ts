import { Colour } from './colours';
import { triangle_t } from './triangle';
import { vec4_t, VectorIndex } from './vector';
import * as math from 'mathjs';

interface RenderOptions {
    vertex: boolean,
    wireframe: boolean
}

export class Renderer {
    static canvas: HTMLCanvasElement;
    static context: CanvasRenderingContext2D;
    static image_data: ImageData;
    static pixel_buffer: Uint8ClampedArray;
    static render_options: RenderOptions;

    static {
        Renderer.canvas = document.getElementById("my-canvas") as HTMLCanvasElement
        Renderer.canvas.style.background = 'lightgrey';
        Renderer.context = Renderer.canvas.getContext('2d');
        Renderer.image_data = Renderer.context.getImageData(0, 0, Renderer.canvas.width, Renderer.canvas.height);
        Renderer.pixel_buffer = Renderer.image_data.data;
        Renderer.render_options = {
            vertex: false,
            wireframe: true
        }
    }

    static clear() {
        Renderer.pixel_buffer.fill(0);
    }

    static refresh() {
        Renderer.context.putImageData(Renderer.image_data, 0, 0);
    }

    static drawPixel(x: number, y: number, colour: vec4_t) {
        const R = 0, G = 1, B = 2, A = 3;
        let offset: number = (y * Renderer.canvas.width + x) * 4;
        Renderer.pixel_buffer[offset + 0] = colour[R];
        Renderer.pixel_buffer[offset + 1] = colour[G];
        Renderer.pixel_buffer[offset + 2] = colour[B];
        Renderer.pixel_buffer[offset + 3] = colour[A];
    }

    static drawVertex(x: number, y: number, s: number, colour: vec4_t) {
        for (let row = x; row < (x + s); row++) {
            for (let column = y; column < (y + s); column++) {
                Renderer.drawPixel(row, column, colour);
            }
        }
    }

    // DDA algorithm, this isn't particularly efficient, hence poor framerates
    static drawLine(x0: number, y0: number, x1: number, y1: number, colour: vec4_t) {
        let delta_x = (x1 - x0);
        let delta_y = (y1 - y0);
        let longest_side_length = (math.abs(delta_x) >= math.abs(delta_y)) ? math.abs(delta_x) : math.abs(delta_y);
        let x_inc = delta_x / longest_side_length;
        let y_inc = delta_y / longest_side_length;
        let current_x = x0;
        let current_y = y0;
        for (let i = 0; i <= longest_side_length; i++) {
            Renderer.drawPixel(math.round(current_x), math.round(current_y), colour);
            current_x += x_inc;
            current_y += y_inc;
        }
    }

    static drawTriangle(triangle: triangle_t) {
        let x0: number = triangle.points[0][VectorIndex.X];
        let y0: number = triangle.points[0][VectorIndex.Y];
        let x1: number = triangle.points[1][VectorIndex.X];
        let y1: number = triangle.points[1][VectorIndex.Y];
        let x2: number = triangle.points[2][VectorIndex.X];
        let y2: number = triangle.points[2][VectorIndex.Y];
        Renderer.drawLine(x0, y0, x1, y1, triangle.colour);
        Renderer.drawLine(x1, y1, x2, y2, triangle.colour);
        Renderer.drawLine(x2, y2, x0, y0, triangle.colour);
    }

    static render(triangle: triangle_t) {

        // paint vertices
        if (Renderer.render_options.vertex == true) {
            let x = math.round(triangle.points[0][VectorIndex.X]);
            let y = math.round(triangle.points[0][VectorIndex.Y]);
            Renderer.drawVertex(x, y, 5, Colour.BLACK);
            x = math.round(triangle.points[1][VectorIndex.X]);
            y = math.round(triangle.points[1][VectorIndex.Y]);
            Renderer.drawVertex(x, y, 5, Colour.BLACK);
            x = math.round(triangle.points[2][VectorIndex.X]);
            y = math.round(triangle.points[2][VectorIndex.Y]);
            Renderer.drawVertex(x, y, 5, Colour.BLACK);
        }

        // paint lines
        if (Renderer.render_options.wireframe == true) {
            Renderer.drawTriangle(
                triangle
            );
        }

    }

}