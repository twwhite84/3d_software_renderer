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