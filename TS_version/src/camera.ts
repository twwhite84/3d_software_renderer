import { vec3_t, vec4_t, Vector } from './vector'
import { Matrices } from './matrices';
import { mathHelper } from './mathHelper';

export class Camera {
    static position: vec3_t = [0, 0, 0];
    static direction: vec3_t = [0, 0, 1];
    static up: vec3_t = [0, 1, 0];
    static right: vec3_t = [1, 0, 0];
    static forward_velocity: vec3_t = [0, 0, 0];
    static yaw: number = 0.0;
    static pitch: number = 0.0;

    static getTarget(): vec3_t {
        let target: vec3_t = [0, 0, 1];
        let yaw_rotation: math.Matrix = Matrices.make_rotator_y(Camera.yaw);
        let pitch_rotation: math.Matrix = Matrices.make_rotator_x(Camera.pitch);
        let camera_rotation: math.Matrix = mathHelper.identity(4) as math.Matrix;
        camera_rotation = mathHelper.multiply(pitch_rotation, camera_rotation);
        camera_rotation = mathHelper.multiply(yaw_rotation, camera_rotation);
        let camera_direction: math.Matrix = mathHelper.multiply(camera_rotation, Vector.vec3_to_vec4(target));
        Camera.direction = Vector.vec4_to_vec3(camera_direction.toArray() as vec4_t);
        Camera.right = mathHelper.cross(Camera.direction, Camera.up).valueOf() as vec3_t;
        target = mathHelper.add(Camera.position, Camera.direction);
        return target;
    }

    static rotateCameraX(pitch_radians: number) { Camera.pitch += pitch_radians; }
    static rotateCameraY(yaw_radians: number) { Camera.yaw += yaw_radians; }
}