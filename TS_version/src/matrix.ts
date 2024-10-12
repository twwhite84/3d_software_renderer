import * as math from 'mathjs';
import { vec3_t, vec4_t } from './vector';

export class Matrix {
    static make_scaler(sx: number, sy: number, sz: number): math.Matrix {
        // [ sx  0  0  0 ]
        // [  0  sy 0  0 ]
        // [  0  0  sz 0 ]
        // [  0  0  0  1 ]
        return math.matrix([
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ]);
    }

    static make_translator(tx: number, ty: number, tz: number): math.Matrix {
        // [ 1  0  0  tx ]
        // [ 0  1  0  ty ]
        // [ 0  0  1  tz ]
        // [ 0  0  0   1 ]
        return math.matrix([
            [1, 0, 0, tx],
            [0, 1, 0, ty],
            [0, 0, 1, tz],
            [0, 0, 0, 1]
        ]);
    }

    static make_rotator_x(angle: number): math.Matrix {
        // [ 1  0  0  0 ]
        // [ 0  c -s  0 ]
        // [ 0  s  c  0 ]
        // [ 0  0  0  1 ]
        let c: number = math.cos(angle);
        let s: number = math.sin(angle);
        return math.matrix([
            [1, 0, 0, 0],
            [0, c, -s, 0],
            [0, s, c, 0],
            [0, 0, 0, 1]
        ]);
    }

    static make_rotator_y(angle: number): math.Matrix {
        // [ c  0  s  0 ]
        // [ 0  1  0  0 ]
        // [-s  0  c  0 ]
        // [ 0  0  0  1 ]
        let c: number = math.cos(angle);
        let s: number = math.sin(angle);
        return math.matrix([
            [c, 0, s, 0],
            [0, 1, 0, 0],
            [-s, 0, c, 0],
            [0, 0, 0, 1]
        ]);
    }

    static make_rotator_z(angle: number): math.Matrix {
        // [ c -s  0  0 ]
        // [ s  c  0  0 ]
        // [ 0  0  1  0 ]
        // [ 0  0  0  1 ]
        let c: number = math.cos(angle);
        let s: number = math.sin(angle);
        return math.matrix([
            [c, -s, 0, 0],
            [s, c, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }

    static make_perspective(fov: number, aspect: number, znear: number, zfar: number): math.Matrix {
        // [(h/w)(1/tan(foc/2)) 0               0          0               ]
        // [0                   (1/tan(fov/2))  0          0               ]
        // [0                   0               zf/(zf-zn) -(zf*zn)/(zf-zn)]
        // [0                   0               1          0               ]
        let r0c0 = aspect * (1 / math.tan(fov / 2));
        let r1c1 = 1 / math.tan(fov / 2);
        let r2c2 = zfar * (zfar - znear);
        let r2c3 = (-zfar * znear) / (zfar - znear);
        return math.matrix([
            [r0c0, 0, 0, 0],
            [0, r1c1, 0, 0],
            [0, 0, r2c2, r2c3],
            [0, 0, 1.0, 0]
        ]);
    }

    static make_view(eye: vec3_t, target: vec3_t, up: vec3_t): math.Matrix {
        // get x,y,z axes relative to camera position and direction
        let z = math.subtract(target, eye);
        let z_unit = math.divide(z, math.norm(z)).valueOf() as number[];
        let x = math.cross(up, z);
        let x_unit = math.divide(x, math.norm(x)).valueOf() as number[];
        let y = math.cross(z_unit, x_unit).valueOf() as number[];
        // let y_unit = math.divide(z, math.norm(z)).valueOf() as number[];
        return math.matrix([
            [x_unit[0], x_unit[1], x_unit[2], -math.dot(x_unit, eye)],
            [y[0], y[1], y[2], -math.dot(y, eye)],
            [z_unit[0], z_unit[1], z_unit[2], -math.dot(z_unit, eye)],
            [0, 0, 0, 1]
        ]);
    }

    static mat4_mul_vec4_project(projection_matrix: math.Matrix, v: vec4_t): vec4_t {
        let result: vec4_t = math.multiply(projection_matrix, v).valueOf() as vec4_t;
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



