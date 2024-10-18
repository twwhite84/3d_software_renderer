import { vec2_t, vec3_t, vec4_t, VectorIndex } from './vector'
import { mathHelper } from './mathHelper';

export interface triangle_t {
    points: vec4_t[];
    // tex2_t texcoords[3];
    colour: vec4_t;
}

export class Triangle {

    static barycentricWeights(a: vec2_t, b: vec2_t, c: vec2_t, p: vec2_t): vec3_t {

        // MATHJS SUBTRACT FUNCTION IS TOO SLOW HERE
        // let AC: vec2_t = mathHelper.subtract(c, a);
        // let AB: vec2_t = mathHelper.subtract(b, a);
        // let PC: vec2_t = mathHelper.subtract(c, p);
        // let PB: vec2_t = mathHelper.subtract(b, p);
        // let AP: vec2_t = mathHelper.subtract(p, a);

        let AC: vec2_t = [(c[0] - a[0]), (c[1] - a[1])];
        let AB: vec2_t = [(b[0] - a[0]), (b[1] - a[1])];
        let PC: vec2_t = [(c[0] - p[0]), (c[1] - p[1])];
        let PB: vec2_t = [(b[0] - p[0]), (b[1] - p[1])];
        let AP: vec2_t = [(p[0] - a[0]), (p[1] - a[1])];

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