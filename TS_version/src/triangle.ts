import { vec2_t, vec3_t, vec4_t, VectorIndex } from './vector'
import * as math from 'mathjs';

export interface triangle_t {
    points: vec4_t[];
    // tex2_t texcoords[3];
    colour: vec4_t;
}

export class Triangle {

    static barycentricWeights(a: vec2_t, b: vec2_t, c: vec2_t, p: vec2_t): vec3_t {
        let AC: vec2_t = math.subtract(c, a);
        let AB: vec2_t = math.subtract(b, a);
        let PC: vec2_t = math.subtract(c, p);
        let PB: vec2_t = math.subtract(b, p);
        let AP: vec2_t = math.subtract(p, a);

        // ||ACxAB||
        let area_parallelogram_abc: number = (
            AC[VectorIndex.X] * AB[VectorIndex.Y] - AC[VectorIndex.Y] * AB[VectorIndex.X]
        );
        let alpha: number = (
            PC[VectorIndex.X] * PB[VectorIndex.Y] - PC[VectorIndex.Y] * PB[VectorIndex.X]
        ) / area_parallelogram_abc;
        let beta: number = (
            AC[VectorIndex.X] * AP[VectorIndex.Y] - AC[VectorIndex.Y] * AP[VectorIndex.X]
        ) / area_parallelogram_abc;
        let gamma: number = 1.0 - alpha - beta;

        let weights: vec3_t = [alpha, beta, gamma];
        return weights;
    }
}






// void int_swap(int* a, int* b);

// void fill_flat_bottom_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
//                                uint32_t colour);

// void fill_flat_top_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
//                             uint32_t colour);

// void drawFilledTriangle(
//     int x0, int y0, float z0, float w0,
//     int x1, int y1, float z1, float w1,
//     int x2, int y2, float z2, float w2,
//     uint32_t colour
// );

// void drawTexturedTriangle(
//     int x0, int y0, float z0, float w0, float u0, float v0,
//     int x1, int y1, float z1, float w1, float u1, float v1,
//     int x2, int y2, float z2, float w2, float u2, float v2,
//     uint32_t* texture
// );

// vec3_t barycentricWeights(vec2_t a, vec2_t b, vec2_t c, vec2_t p);

// void drawTexel(int x, int y, uint32_t* texture, vec4_t point_a, vec4_t point_b,
//                vec4_t point_c, tex2_t a_uv, tex2_t b_uv, tex2_t c_uv);