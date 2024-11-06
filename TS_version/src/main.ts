import { Camera } from './camera';
import { Clipping, polygon_t } from './clipping';
import { Input } from './input';
import { mtx4_t, vec3_t, vec4_t, X, Y, Z, eye_m4d } from './linalg';
import { cross_v3d, div_v3d_s, dot_m4d, dot_m4d_v4d, dot_v3d, norm_v3d, sub_v3d, v3d_to_v4d, v4d_to_v3d } from './linalg';
import { Matrices } from './matrices';
import { Cube, face_t, Ground, Mesh, Prism, Pyramid } from './mesh';
import { Renderer } from './renderer';
import { triangle_t } from './triangle';

export class Main {
    private static meshes: Mesh[] = [];
    private static aspect_x: number = 0;
    private static aspect_y: number = 0;
    private static fov_x: number = 0;
    private static fov_y: number = 0;
    private static z_near: number = 0;
    private static z_far: number = 0;
    private static projection_matrix: mtx4_t = eye_m4d;
    private static triangles: triangle_t[] = [];
    private static ts: number = 0;
    private static ts_delta: number = 0;
    private static ts_old: number = 0;
    private static camera: Camera = new Camera();

    private static init() {
        Main.meshes.push(new Cube([-3, 0, -5]));
        Main.meshes.push(new Pyramid([0, 0, 0]));
        Main.meshes.push(new Prism([-7, 4, -3]));
        Main.meshes.push(new Ground([0, -1, 0]));

        Main.aspect_y = Renderer.canvas.height / Renderer.canvas.width;
        Main.aspect_x = Renderer.canvas.width / Renderer.canvas.height;
        Main.fov_y = 90 * (Math.PI / 180);
        Main.fov_x = 2.0 * Math.atan(Math.tan(Main.fov_y / 2) * (Main.aspect_x));
        Main.z_near = 0.1;
        Main.z_far = 20.0;
        Main.projection_matrix = Matrices.make_perspective(Main.fov_y, Main.aspect_y, Main.z_near, Main.z_far);
        Main.triangles = [];
        Clipping.initFrustumPlanes(Main.fov_x, Main.fov_y, Main.z_near, Main.z_far);
        Main.camera.setPosition([0, 0, -8]);
    }

    private static project(vertices: vec4_t[]): vec4_t[] {
        let projected_vertices: vec4_t[] = [];
        vertices.forEach(vertex => {
            let projected_vertex: vec4_t = Matrices.perspective_divide(Main.projection_matrix, vertex);
            // scale to viewport
            projected_vertex[X] *= (Renderer.canvas.width / 2.0);
            projected_vertex[Y] *= (Renderer.canvas.height / 2.0);
            // account for 2D pixel coordinates having inverse y-axis
            projected_vertex[Y] *= -1;
            // center
            projected_vertex[X] += (Renderer.canvas.width / 2.0);
            projected_vertex[Y] += (Renderer.canvas.height / 2.0);

            projected_vertices.push(projected_vertex);
        });
        return projected_vertices;
    }

    private static shouldCull(vertices: vec4_t[]): boolean {
        // clockwise ordering, renderer is LHCS
        let a: vec3_t = v4d_to_v3d(vertices[0]);
        let b: vec3_t = v4d_to_v3d(vertices[1]);
        let c: vec3_t = v4d_to_v3d(vertices[2]);

        // get normal to triangle
        let ab: vec3_t = sub_v3d(b, a);
        let ac: vec3_t = sub_v3d(c, a);
        ab = div_v3d_s(ab, norm_v3d(ab));
        ac = div_v3d_s(ac, norm_v3d(ac));
        let normal: vec3_t = cross_v3d(ab, ac);
        normal = div_v3d_s(normal, norm_v3d(normal));

        // check alignment between camera-to-vertex and normal
        let camera_ray: vec3_t = sub_v3d([0, 0, 0], a);
        let dot_normal_camera: number = dot_v3d(normal, camera_ray);
        if (dot_normal_camera < 0) { return true; }
        return false;
    }

    private static update() {
        // update camera
        let camera_target: vec3_t = Main.camera.findTarget();
        let view_matrix: mtx4_t = Matrices.make_view(Main.camera.getPosition(), camera_target, Main.camera.getUp());

        Main.meshes.forEach(mesh => {
            // prepare transform matrix from any updated mesh properties
            let scale_matrix: mtx4_t = Matrices.make_scaler(mesh.scale[X], mesh.scale[Y], mesh.scale[Z]);
            let translation_matrix: mtx4_t = Matrices.make_translator(
                mesh.translation[X], mesh.translation[Y], mesh.translation[Z]
            );
            let rotation_matrix_x: mtx4_t = Matrices.make_rotator_x(mesh.rotation[X]);
            let rotation_matrix_y: mtx4_t = Matrices.make_rotator_y(mesh.rotation[Y]);
            let rotation_matrix_z: mtx4_t = Matrices.make_rotator_z(mesh.rotation[Z]);
            let world_matrix: mtx4_t = eye_m4d;
            world_matrix = dot_m4d(world_matrix, scale_matrix);
            world_matrix = dot_m4d(rotation_matrix_z, world_matrix);
            world_matrix = dot_m4d(rotation_matrix_y, world_matrix);
            world_matrix = dot_m4d(rotation_matrix_x, world_matrix);
            world_matrix = dot_m4d(translation_matrix, world_matrix);

            for (let i = 0; i < mesh.faces.length; i++) {
                let face: face_t = mesh.faces[i];
                let v0: vec4_t = v3d_to_v4d(mesh.vertices[face.vertexIndices[0]]);
                let v1: vec4_t = v3d_to_v4d(mesh.vertices[face.vertexIndices[1]]);
                let v2: vec4_t = v3d_to_v4d(mesh.vertices[face.vertexIndices[2]]);

                // apply transforms
                let transformed_vertices: vec4_t[] = [v0, v1, v2];
                transformed_vertices.forEach((vertex, index) => {
                    let transformed_vertex: vec4_t = dot_m4d_v4d(world_matrix, vertex);
                    transformed_vertex = dot_m4d_v4d(view_matrix, transformed_vertex);
                    transformed_vertices[index] = transformed_vertex;
                });

                // culling
                if (Renderer.cull_mode == true && Main.shouldCull(transformed_vertices)) { continue; }

                // clipping
                let polygon: polygon_t = Clipping.createPolygonFromTriangle(
                    v4d_to_v3d(transformed_vertices[0]),
                    v4d_to_v3d(transformed_vertices[1]),
                    v4d_to_v3d(transformed_vertices[2]),
                    face.colour,
                );

                polygon = Clipping.clipPolygon(polygon);
                let clipped_triangles: triangle_t[] = Clipping.trianglesFromPolygon(polygon);

                // projection
                clipped_triangles.forEach(triangle => {
                    let projected_vertices = Main.project(triangle.points);
                    let triangle_to_render: triangle_t = {
                        points: projected_vertices,
                        colour: face.colour,
                    };
                    Main.triangles.push(triangle_to_render);
                });
            }
        });
    }

    private static render() {
        Renderer.clear();
        Renderer.clearZBuffer();
        Main.triangles.forEach(triangle => {
            Renderer.render(triangle);
        });
        Renderer.refresh();
        Main.triangles = [];
    }

    private static mainloop(timestamp: number): void {
        Main.ts = timestamp;
        Main.ts_delta = (Main.ts - Main.ts_old) / 1000;
        Main.ts_old = Main.ts;

        Input.processInput(Main.ts_delta);
        Main.update();
        Main.render();

        requestAnimationFrame(Main.mainloop);
    }

    public static getDelta(): number {
        return Main.ts_delta;
    }

    public static getCamera(): Camera {
        return Main.camera;
    }

    public static run() {
        document.addEventListener('keydown', Input.registerKeyDown);
        document.addEventListener('keyup', Input.registerKeyUp);
        Renderer.canvas.addEventListener('click', () => {
            Renderer.canvas.requestPointerLock();
        });
        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === Renderer.canvas) {
                Input.handleMouseEvent(event, Main.getDelta());
            }
        });

        Main.init();
        requestAnimationFrame(Main.mainloop);
    }
}

Main.run();