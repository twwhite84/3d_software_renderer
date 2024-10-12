export type vec3_t = [number, number, number];
export type vec4_t = [number, number, number, number];

export class Vector {
    static readonly X: number = 0;
    static readonly Y: number = 1;
    static readonly Z: number = 2;
    static readonly W: number = 3;

    static vec3_to_vec4(vec3: vec3_t): vec4_t {
        return [vec3[Vector.X], vec3[Vector.Y], vec3[Vector.Z], 1.0];
    }

    static vec4_to_vec3(vec4: vec4_t): vec3_t {
        return [vec4[Vector.X], vec4[Vector.Y], vec4[Vector.Z]];
    }
}