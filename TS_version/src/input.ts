import { Main } from './main';
import { Renderer } from "./renderer";
import { add_v3d, mult_v3d_s, normalise_v3d, vec3_t, X, Y, Z } from "./linalg";

export class Input {

    private static keysDown: Record<string, boolean> = {};
    private static keyAlreadyDown_1: boolean = false;
    private static keyAlreadyDown_2: boolean = false;
    private static keyAlreadyDown_3: boolean = false;
    private static keyAlreadyDown_c: boolean = false;
    private static keyAlreadyDown_i: boolean = false;
    private static yflip: number = -1;

    public static registerKeyDown(event: KeyboardEvent): void {
        Input.keysDown[event.key] = true;
    }

    public static registerKeyUp(event: KeyboardEvent): void {
        Input.keysDown[event.key] = false;
    }

    public static handleMouseEvent(event: MouseEvent, ts_delta: number) {
        const camera = Main.getCamera();
        camera.setYaw(camera.getYaw() + event.movementX * 0.1 * ts_delta);
        camera.setPitch(camera.getPitch() + event.movementY * 0.1 * ts_delta * Input.yflip);
        let y_clamp: number = (89 * Math.PI) / 180;
        if (camera.getPitch() > y_clamp) camera.setPitch(y_clamp);
        if (camera.getPitch() < -y_clamp) camera.setPitch(-y_clamp);
    }

    public static processInput(ts_delta: number) {
        const camera = Main.getCamera();

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

        // toggle y-axis flip
        if (Input.keysDown['i'] && Input.keyAlreadyDown_i == false) {
            Input.yflip = -1 * Input.yflip;
            Input.keyAlreadyDown_i = true;
        }
        if (!Input.keysDown['i']) {
            Input.keyAlreadyDown_i = false;
        }

        // walk forward
        if (Input.keysDown['w']) {
            camera.setForwardVelocity(mult_v3d_s(camera.getDirection(), 1.0 * ts_delta));
            camera.setPosition(add_v3d(camera.getPosition(), camera.getForwardVelocity()));
        }

        // walk backward
        if (Input.keysDown['s']) {
            camera.setForwardVelocity(mult_v3d_s(camera.getDirection(), -1.0 * ts_delta));
            camera.setPosition(add_v3d(camera.getPosition(), camera.getForwardVelocity()));
        }

        // pan up
        if (Input.keysDown['e']) {
            camera.setPosition([
                camera.getPosition()[X],
                camera.getPosition()[Y] + (3.0 * ts_delta),
                camera.getPosition()[Z]
            ]);
        }

        // pan down
        if (Input.keysDown['q']) {
            camera.setPosition([
                camera.getPosition()[X],
                camera.getPosition()[Y] - (3.0 * ts_delta),
                camera.getPosition()[Z]
            ]);
        }

        // strafe left
        if (Input.keysDown['a']) {
            camera.setPosition(
                add_v3d(camera.getPosition(), mult_v3d_s(normalise_v3d(camera.getRight()), 3.0 * ts_delta))
            );
        }

        // strafe right
        if (Input.keysDown['d']) {
            camera.setPosition(
                add_v3d(camera.getPosition(), mult_v3d_s(normalise_v3d(camera.getRight()), -3.0 * ts_delta))
            );
        }
    }
}
