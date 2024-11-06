import { vec2_t, vec3_t, vec4_t, X, Y } from "./linalg";

export interface triangle_t {
    points: vec4_t[];
    colour: vec4_t;
}

export class Triangle {

    static findWeights(a: vec2_t, b: vec2_t, c: vec2_t, p: vec2_t): vec3_t {

        let AC: vec2_t = [(c[0] - a[0]), (c[1] - a[1])];
        let AB: vec2_t = [(b[0] - a[0]), (b[1] - a[1])];
        let PC: vec2_t = [(c[0] - p[0]), (c[1] - p[1])];
        let PB: vec2_t = [(b[0] - p[0]), (b[1] - p[1])];
        let AP: vec2_t = [(p[0] - a[0]), (p[1] - a[1])];

        // ||ACxAB||
        let area_parallelogram_abc: number = (
            AC[X] * AB[Y] - AC[Y] * AB[X]
        );
        let alpha: number = (
            PC[X] * PB[Y] - PC[Y] * PB[X]
        ) / area_parallelogram_abc;
        let beta: number = (
            AC[X] * AP[Y] - AC[Y] * AP[X]
        ) / area_parallelogram_abc;
        let gamma: number = 1.0 - alpha - beta;

        let weights: vec3_t = [alpha, beta, gamma];
        return weights;
    }
}
