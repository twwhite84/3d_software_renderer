import { Colour } from './colours';
import { vec2_t, vec3_t, vec4_t, W, X, Y, Z } from './linalg';
import { triangle_t, Triangle } from './triangle';

interface RenderOptions {
    vertex: boolean,
    wireframe: boolean,
    filled: boolean,
}

export class Renderer {
    static canvas: HTMLCanvasElement;
    static context: CanvasRenderingContext2D;
    static image_data: ImageData;
    static pixel_buffer: Uint8ClampedArray;
    static render_options: RenderOptions;
    static z_buffer: number[];
    static cull_mode: boolean;

    static {
        Renderer.canvas = document.getElementById("my-canvas") as HTMLCanvasElement
        Renderer.canvas.style.background = 'black';
        Renderer.canvas.width = 320;
        Renderer.canvas.height = 200;
        Renderer.context = Renderer.canvas.getContext('2d')!;
        Renderer.image_data = Renderer.context.getImageData(0, 0, Renderer.canvas.width, Renderer.canvas.height);
        Renderer.pixel_buffer = Renderer.image_data.data;
        Renderer.render_options = {
            vertex: false,
            wireframe: false,
            filled: true,
        }
        Renderer.z_buffer = Array(Renderer.canvas.width * Renderer.canvas.height).fill(1);
        Renderer.cull_mode = true;
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

    // DDA algorithm, this isn't efficient
    static drawLine(x0: number, y0: number, x1: number, y1: number, colour: vec4_t) {
        let dx = (x1 - x0);
        let dy = (y1 - y0);
        let longest_side_length = (Math.abs(dx) >= Math.abs(dy)) ? Math.abs(dx) : Math.abs(dy);
        let x_inc = dx / longest_side_length;
        let y_inc = dy / longest_side_length;
        let current_x = x0;
        let current_y = y0;
        for (let i = 0; i <= Math.round(longest_side_length); i++) {
            Renderer.drawPixel(Math.round(current_x), Math.round(current_y), colour);
            current_x += x_inc;
            current_y += y_inc;
        }
    }

    static drawTriangle(triangle: triangle_t) {
        let x0: number = triangle.points[0][X];
        let y0: number = triangle.points[0][Y];
        let x1: number = triangle.points[1][X];
        let y1: number = triangle.points[1][Y];
        let x2: number = triangle.points[2][X];
        let y2: number = triangle.points[2][Y];
        Renderer.drawLine(x0, y0, x1, y1, Colour.BLACK);
        Renderer.drawLine(x1, y1, x2, y2, Colour.BLACK);
        Renderer.drawLine(x2, y2, x0, y0, Colour.BLACK);
    }

    static fillTriangle(triangle: triangle_t) {
        let x0: number = Math.round(triangle.points[0][X]);
        let y0: number = Math.round(triangle.points[0][Y]);
        let z0: number = triangle.points[0][Z];
        let w0: number = triangle.points[0][W];
        let x1: number = Math.round(triangle.points[1][X]);
        let y1: number = Math.round(triangle.points[1][Y]);
        let z1: number = triangle.points[1][Z];
        let w1: number = triangle.points[1][W];
        let x2: number = Math.round(triangle.points[2][X]);
        let y2: number = Math.round(triangle.points[2][Y]);
        let z2: number = triangle.points[2][Z];
        let w2: number = triangle.points[2][W];

        // sort vertices by y-axis
        if (y0 > y1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
            [z0, z1] = [z1, z0];
            [w0, w1] = [w1, w0];
        }

        if (y1 > y2) {
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
            [z1, z2] = [z2, z1];
            [w1, w2] = [w2, w1];
        }

        if (y0 > y1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
            [z0, z1] = [z1, z0];
            [w0, w1] = [w1, w0];
        }

        // create vector points
        let a: vec4_t = [x0, y0, z0, w0];
        let b: vec4_t = [x1, y1, z1, w1];
        let c: vec4_t = [x2, y2, z2, w2];

        // fill flat bottom half
        let inv_slope_1 = 0, inv_slope_2 = 0;
        if ((y1 - y0) != 0) inv_slope_1 = (x1 - x0) / Math.abs(y1 - y0);
        if ((y2 - y0) != 0) inv_slope_2 = (x2 - x0) / Math.abs(y2 - y0);
        if (y1 - y0 != 0) {
            for (let y = y0; y <= y1; y++) {
                let x_start = Math.round(x1 + (y - y1) * inv_slope_1);
                let x_end = Math.round(x0 + (y - y0) * inv_slope_2);

                // ensure x_end is on right
                if (x_end < x_start) {
                    [x_end, x_start] = [x_start, x_end];
                }

                for (let x = x_start; x < x_end; x++) {

                    // get depth info for pixel
                    let p: vec2_t = [x, y];
                    let weights: vec3_t = Triangle.findWeights(
                        [a[X], a[Y]],
                        [b[X], b[Y]],
                        [c[X], c[Y]],
                        p
                    );
                    let alpha: number = weights[X];
                    let beta: number = weights[Y];
                    let gamma: number = weights[Z];
                    let interp_recp_w: number = 1 - (
                        (alpha / a[W]) + (beta / b[W]) + (gamma / c[W])
                    );

                    // redraw pixel if this one is closer to camera
                    if (interp_recp_w < Renderer.getZBufferAt(x, y)) {
                        Renderer.drawPixel(x, y, triangle.colour);
                        Renderer.setZBufferAt(x, y, interp_recp_w);
                    }
                }
            }
        }

        // render flat top (lower split of triangle)
        inv_slope_1 = 0;
        inv_slope_2 = 0;
        if ((y2 - y1) != 0) inv_slope_1 = (x2 - x1) / Math.abs(y2 - y1);
        if ((y2 - y0) != 0) inv_slope_2 = (x2 - x0) / Math.abs(y2 - y0);
        if (y2 - y1 != 0) {
            for (let y = y1; y <= y2; y++) {
                let x_start = Math.round(x1 + (y - y1) * inv_slope_1);
                let x_end = Math.round(x0 + (y - y0) * inv_slope_2);
                if (x_end < x_start) {
                    [x_start, x_end] = [x_end, x_start];
                }

                for (let x = x_start; x < x_end; x++) {

                    // get depth info for pixel
                    let p: vec2_t = [x, y];
                    let weights: vec3_t = Triangle.findWeights(
                        [a[X], a[Y]],
                        [b[X], b[Y]],
                        [c[X], c[Y]],
                        p
                    );
                    let alpha: number = weights[X];
                    let beta: number = weights[Y];
                    let gamma: number = weights[Z];

                    let interp_recp_w: number = 1 - (
                        (alpha / a[W]) + (beta / b[W]) + (gamma / c[W])
                    );

                    // redraw pixel if this one is closer to camera
                    if (interp_recp_w < Renderer.getZBufferAt(x, y)) {
                        Renderer.drawPixel(x, y, triangle.colour);
                        Renderer.setZBufferAt(x, y, interp_recp_w);
                    }
                }
            }
        }
    }

    static render(triangle: triangle_t) {

        // paint filled triangles
        if (Renderer.render_options.filled == true) {
            Renderer.fillTriangle(triangle);
        }

        // paint vertices
        if (Renderer.render_options.vertex == true) {
            let x = Math.round(triangle.points[0][X] - 2);
            let y = Math.round(triangle.points[0][Y] - 2);
            Renderer.drawVertex(x, y, 4, Colour.BLACK);
            x = Math.round(triangle.points[1][X] - 2);
            y = Math.round(triangle.points[1][Y] - 2);
            Renderer.drawVertex(x, y, 4, Colour.BLACK);
            x = Math.round(triangle.points[2][X] - 2);
            y = Math.round(triangle.points[2][Y] - 2);
            Renderer.drawVertex(x, y, 4, Colour.BLACK);
        }

        // paint lines
        if (Renderer.render_options.wireframe == true) {
            Renderer.drawTriangle(triangle);
        }

    }

    static clearZBuffer() {
        Renderer.z_buffer.fill(1);
    }

    static getZBufferAt(x: number, y: number): number {
        if (x < 0 || x >= Renderer.canvas.width || y < 0 || y >= Renderer.canvas.height) {
            return 1.0;
        }
        return Renderer.z_buffer[(Renderer.canvas.width * y) + x];
    }

    static setZBufferAt(x: number, y: number, value: number) {
        if (x < 0 || x >= Renderer.canvas.width || y < 0 || y >= Renderer.canvas.height) {
            return;
        }
        Renderer.z_buffer[(Renderer.canvas.width * y) + x] = value;
    }

}
