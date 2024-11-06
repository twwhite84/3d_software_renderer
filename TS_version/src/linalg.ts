export type vec2_t = [number, number];
export type vec3_t = [number, number, number];
export type vec4_t = [number, number, number, number];
export type mtx3_t = [vec3_t, vec3_t, vec3_t];
export type mtx4_t = [vec4_t, vec4_t, vec4_t, vec4_t];
export const X = 0, Y = 1, Z = 2, W = 3;

export const eye_m4d: mtx4_t = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];

export function add_v3d(v1: vec3_t, v2: vec3_t): vec3_t {
    let result: vec3_t = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        result[i] += (v1[i] + v2[i]);
    }
    return result;
}

export function sub_v3d(v1: vec3_t, v2: vec3_t): vec3_t {
    let result: vec3_t = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        result[i] += (v1[i] - v2[i]);
    }
    return result;
}

export function div_v3d_s(v: vec3_t, s: number): vec3_t {
    let result: vec3_t = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        result[i] += (v[i] / s);
    }
    return result;
}

export function mult_v3d_s(v: vec3_t, s: number): vec3_t {
    let result: vec3_t = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        result[i] += (v[i] * s);
    }
    return result;
}

export function dot_m4d_v4d(M: mtx4_t, v: vec4_t): vec4_t {
    let result: vec4_t = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i] += (M[i][j] * v[j]);
        }
    }
    return result;
}

export function dot_m4d(M1: mtx4_t, M2: mtx4_t): mtx4_t {
    let result: mtx4_t = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let row: vec4_t = M1[i];
            let col: vec4_t = [M2[0][j], M2[1][j], M2[2][j], M2[3][j]];
            result[i][j] = dot_v4d(row, col);
        }
    }
    return result;
}

export function dot_v3d(v1: vec3_t, v2: vec3_t): number {
    let result: number = 0;
    for (let i = 0; i < 3; i++) {
        result += (v1[i] * v2[i]);
    }
    return result;
}

export function dot_v4d(v1: vec4_t, v2: vec4_t): number {
    let result: number = 0;
    for (let i = 0; i < 4; i++) {
        result += (v1[i] * v2[i]);
    }
    return result;
}

export function norm_v3d(v: vec3_t): number {
    let result: number = 0;
    for (let i = 0; i < 3; i++) {
        result += v[i] ** 2;
    }
    result = Math.sqrt(result);
    return result;
}

export function cross_v3d(v1: vec3_t, v2: vec3_t): vec3_t {
    let result: vec3_t = [0, 0, 0];
    result[X] = v1[Y] * v2[Z] - v1[Z] * v2[Y];
    result[Y] = v1[Z] * v2[X] - v1[X] * v2[Z];
    result[Z] = v1[X] * v2[Y] - v1[Y] * v2[X];
    return result;
}

export function v4d_to_v3d(v: vec4_t): vec3_t {
    let result: vec3_t = [v[X], v[Y], v[Z]];
    return result;
}

export function v3d_to_v4d(v: vec3_t): vec4_t {
    let result: vec4_t = [v[X], v[Y], v[Z], 1.0];
    return result;
}
