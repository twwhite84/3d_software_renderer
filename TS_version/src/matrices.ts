import { mtx4_t, vec3_t, sub_v3d, div_v3d_s, norm_v3d, cross_v3d, dot_v3d, vec4_t, dot_m4d_v4d } from './linalg';

export class Matrices {
    static make_scaler(sx: number, sy: number, sz: number): mtx4_t {
        // [ sx  0  0  0 ]
        // [  0  sy 0  0 ]
        // [  0  0  sz 0 ]
        // [  0  0  0  1 ]
        return [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];
    }

    static make_translator(tx: number, ty: number, tz: number): mtx4_t {
        // [ 1  0  0  tx ]
        // [ 0  1  0  ty ]
        // [ 0  0  1  tz ]
        // [ 0  0  0   1 ]
        return [
            [1, 0, 0, tx],
            [0, 1, 0, ty],
            [0, 0, 1, tz],
            [0, 0, 0, 1]
        ];
    }

    static make_rotator_x(angle: number): mtx4_t {
        // [ 1  0  0  0 ]
        // [ 0  c -s  0 ]
        // [ 0  s  c  0 ]
        // [ 0  0  0  1 ]
        let c: number = Math.cos(angle);
        let s: number = Math.sin(angle);
        return [
            [1, 0, 0, 0],
            [0, c, -s, 0],
            [0, s, c, 0],
            [0, 0, 0, 1]
        ];
    }

    static make_rotator_y(angle: number): mtx4_t {
        // [ c  0  s  0 ]
        // [ 0  1  0  0 ]
        // [-s  0  c  0 ]
        // [ 0  0  0  1 ]
        let c: number = Math.cos(angle);
        let s: number = Math.sin(angle);
        return [
            [c, 0, s, 0],
            [0, 1, 0, 0],
            [-s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    }

    static make_rotator_z(angle: number): mtx4_t {
        // [ c -s  0  0 ]
        // [ s  c  0  0 ]
        // [ 0  0  1  0 ]
        // [ 0  0  0  1 ]
        let c: number = Math.cos(angle);
        let s: number = Math.sin(angle);
        return [
            [c, -s, 0, 0],
            [s, c, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    static make_perspective(fov: number, aspect: number, znear: number, zfar: number): mtx4_t {
        // [(h/w)(1/tan(foc/2)) 0               0          0               ]
        // [0                   (1/tan(fov/2))  0          0               ]
        // [0                   0               zf/(zf-zn) -(zf*zn)/(zf-zn)]
        // [0                   0               1          0               ]
        let r0c0 = aspect * (1 / Math.tan(fov / 2));
        let r1c1 = 1 / Math.tan(fov / 2);
        let r2c2 = zfar * (zfar - znear);
        let r2c3 = (-zfar * znear) / (zfar - znear);
        return [
            [r0c0, 0, 0, 0],
            [0, r1c1, 0, 0],
            [0, 0, r2c2, r2c3],
            [0, 0, 1.0, 0]
        ];
    }

    static make_view(eye: vec3_t, target: vec3_t, up: vec3_t): mtx4_t {
        // get x,y,z axes relative to camera position and direction
        let z = sub_v3d(target, eye);
        let z_unit = div_v3d_s(z, norm_v3d(z));
        let x = cross_v3d(up, z);
        let x_unit = div_v3d_s(x, norm_v3d(x));
        let y = cross_v3d(z_unit, x_unit);
        return [
            [x_unit[0], x_unit[1], x_unit[2], -dot_v3d(x_unit, eye)],
            [y[0], y[1], y[2], -dot_v3d(y, eye)],
            [z_unit[0], z_unit[1], z_unit[2], -dot_v3d(z_unit, eye)],
            [0, 0, 0, 1]
        ];
    }

    static perspective_divide(projection_matrix: mtx4_t, v: vec4_t): vec4_t {
        let result: vec4_t = dot_m4d_v4d(projection_matrix, v);
        let x = 0, y = 1, z = 2, w = 3;

        // perform perspective divide with original z-value now stored in w
        if (result[w] != 0.0) {
            result[x] /= result[w];
            result[y] /= result[w];
            result[z] /= result[w];
        }

        return result;
    }
}
