import { eye_m4d, mtx4_t, vec3_t, vec4_t } from './linalg';
import { add_v3d, cross_v3d, dot_m4d, dot_m4d_v4d, v3d_to_v4d, v4d_to_v3d } from './linalg';
import { Matrices } from './matrices';

export class Camera {
    private direction: vec3_t = [0, 0, 1];
    private forward_velocity: vec3_t = [0, 0, 0];
    private pitch: number = 0.0;
    private position: vec3_t = [0, 0, 0];
    private right: vec3_t = [1, 0, 0];
    private up: vec3_t = [0, 1, 0];
    private yaw: number = 0.0;

    public getDirection(): vec3_t { return this.direction; }
    public setDirection(direction: vec3_t) { this.direction = direction; }
    public getForwardVelocity() { return this.forward_velocity; }
    public setForwardVelocity(fv: vec3_t) { this.forward_velocity = fv; }
    public getPitch(): number { return this.pitch; }
    public setPitch(pitch: number) { this.pitch = pitch; }
    public getPosition(): vec3_t { return this.position; }
    public setPosition(position: vec3_t) { this.position = position; }
    public getRight() { return this.right; }
    public setRight(right: vec3_t) { this.right = right; }
    public getUp(): vec3_t { return this.up; }
    public setUp(up: vec3_t) { this.up = up; }
    public getYaw(): number { return this.yaw; }
    public setYaw(yaw: number) { this.yaw = yaw; }

    public findTarget(): vec3_t {
        let target: vec3_t = [0, 0, 1];
        let yaw_rotation: mtx4_t = Matrices.make_rotator_y(this.yaw);
        let pitch_rotation: mtx4_t = Matrices.make_rotator_x(this.pitch);
        let camera_rotation: mtx4_t = eye_m4d;
        camera_rotation = dot_m4d(pitch_rotation, camera_rotation);
        camera_rotation = dot_m4d(yaw_rotation, camera_rotation);
        let camera_direction: vec4_t = dot_m4d_v4d(camera_rotation, v3d_to_v4d(target));
        this.direction = v4d_to_v3d(camera_direction);
        this.right = cross_v3d(this.direction, this.up);
        target = add_v3d(this.position, this.direction);
        return target;
    }
}
