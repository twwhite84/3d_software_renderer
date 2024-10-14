import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { vec3_t, VectorIndex } from "./vector";
import { mathHelper } from "./mathHelper";

export class Input {
    static keysDown: Record<string, boolean> = {};
    static keyAlreadyDown_1: boolean = false;
    static keyAlreadyDown_2: boolean = false;
    static keyAlreadyDown_3: boolean = false;
    static keyAlreadyDown_c: boolean = false;

    static registerKeyDown(event: KeyboardEvent): void {
        Input.keysDown[event.key] = true;
    }

    static registerKeyUp(event: KeyboardEvent): void {
        Input.keysDown[event.key] = false;
    }

    static handleMouseEvent(event: MouseEvent, ts_delta: number) {
        Camera.yaw += event.movementX * 0.1 * ts_delta;
        Camera.pitch -= -event.movementY * 0.1 * ts_delta;
        if (Camera.pitch > 90) Camera.pitch = 90;
        if (Camera.pitch < -90) Camera.pitch = -90;
    }

    static processInput(ts_delta: number) {

        // toggle backface culling
        if (Input.keysDown['c'] && Input.keyAlreadyDown_c == false) {
            Renderer.cull_mode = !Renderer.cull_mode;
            Input.keyAlreadyDown_c = true;
        }
        if (!Input.keysDown['c']) {
            Input.keyAlreadyDown_c = false;
        }

        // toggle render vertices
        if (Input.keysDown['1'] && Input.keyAlreadyDown_1 == false) {
            Renderer.render_options.vertex = !Renderer.render_options.vertex;
            Input.keyAlreadyDown_1 = true;
        }
        if (!Input.keysDown['1']) {
            Input.keyAlreadyDown_1 = false;
        }

        // toggle render wireframe
        if (Input.keysDown['2'] && Input.keyAlreadyDown_2 == false) {
            Renderer.render_options.wireframe = !Renderer.render_options.wireframe;
            Input.keyAlreadyDown_2 = true;
        }
        if (!Input.keysDown['2']) {
            Input.keyAlreadyDown_2 = false;
        }

        // toggle render filled triangles
        if (Input.keysDown['3'] && Input.keyAlreadyDown_3 == false) {
            Renderer.render_options.filled = !Renderer.render_options.filled;
            Input.keyAlreadyDown_3 = true;
        }
        if (!Input.keysDown['3']) {
            Input.keyAlreadyDown_3 = false;
        }

        // turn camera right
        if (Input.keysDown['l']) {
            Camera.rotateCameraY(1.0 * ts_delta);
        }

        // turn camera left
        if (Input.keysDown['j']) {
            Camera.rotateCameraY(-1.0 * ts_delta);
        }

        // tilt camera up
        if (Input.keysDown['k']) {
            Camera.rotateCameraX(1.0 * ts_delta);
            let max_tilt_up: number = 89 * (Math.PI / 180);
            if (Camera.pitch > max_tilt_up) Camera.pitch = max_tilt_up;
        }

        // tilt camera down
        if (Input.keysDown['i']) {
            Camera.rotateCameraX(-1.0 * ts_delta);
            let max_tilt_down: number = -89 * (Math.PI / 180);
            if (Camera.pitch < max_tilt_down) Camera.pitch = max_tilt_down;
        }

        // walk forward
        if (Input.keysDown['w']) {
            Camera.forward_velocity = mathHelper.multiply(Camera.direction, 1.0 * ts_delta).valueOf() as vec3_t;
            Camera.position = mathHelper.add(Camera.position, Camera.forward_velocity);
        }

        // walk backward
        if (Input.keysDown['s']) {
            Camera.forward_velocity = mathHelper.multiply(Camera.direction, -1.0 * ts_delta).valueOf() as vec3_t;
            Camera.position = mathHelper.add(Camera.position, Camera.forward_velocity);
        }

        // pan up
        if (Input.keysDown['o']) {
            Camera.position = [
                Camera.position[VectorIndex.X],
                Camera.position[VectorIndex.Y] + (3.0 * ts_delta),
                Camera.position[VectorIndex.Z]
            ];
        }

        // pan down
        if (Input.keysDown['u']) {
            Camera.position = [
                Camera.position[VectorIndex.X],
                Camera.position[VectorIndex.Y] - (3.0 * ts_delta),
                Camera.position[VectorIndex.Z]
            ];
        }

        // strafe left
        if (Input.keysDown['a']) {
            Camera.position = mathHelper.add(
                Camera.position, mathHelper.multiply(Camera.right, 3.0 * ts_delta)
            ).valueOf() as vec3_t;
        }

        // strafe right
        if (Input.keysDown['d']) {
            Camera.position = mathHelper.add(
                Camera.position, mathHelper.multiply(Camera.right, -3.0 * ts_delta)
            ).valueOf() as vec3_t;
        }
    }
}