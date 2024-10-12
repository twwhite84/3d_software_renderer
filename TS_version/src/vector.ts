export type vec2_t = [number, number];
export type vec3_t = [number, number, number];
export type vec4_t = [number, number, number, number];

export enum VectorIndex {
    X = 0,
    Y = 1,
    Z = 2,
    W = 3
}

export class Vector {
    static vec3_to_vec4(vec3: vec3_t): vec4_t {
        return [vec3[VectorIndex.X], vec3[VectorIndex.Y], vec3[VectorIndex.Z], 1.0];
    }

    static vec4_to_vec3(vec4: vec4_t): vec3_t {
        return [vec4[VectorIndex.X], vec4[VectorIndex.Y], vec4[VectorIndex.Z]];
    }
}