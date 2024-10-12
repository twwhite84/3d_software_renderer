export type vec3_t = [number, number, number];
export type vec4_t = [number, number, number, number];
// export interface vec3_t { x: number, y: number, z: number }
// export interface vec4_t { x: number, y: number, z: number, w: number }

export function vec3_to_vec4(vec3: vec3_t): vec4_t {
    return [vec3[0], vec3[1], vec3[2], 1.0];
    // return { 'x': vec3.x, 'y': vec3.y, 'z': vec3.z, 'w': 1.0 };
}

export function vec4_to_vec3(vec4: vec4_t): vec3_t {
    return [vec4[0], vec4[1], vec4[2]];
    // return { 'x': vec4.x, 'y': vec4.y, 'z': vec4.z };
}