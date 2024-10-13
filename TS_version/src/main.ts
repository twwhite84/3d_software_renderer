import { Camera } from './camera';
import { Cube, face_t } from './cube';
import { Matrix } from './matrix';
import { Renderer } from './renderer';
import { Vector, VectorIndex, vec3_t, vec4_t } from './vector';
import { Colour } from './colours';

// /*--------------------------------------------------------------------------------------------------------------------*/

let keysDown: Record<string, boolean> = {};

function handleKeyDown(event: KeyboardEvent): void {
    keysDown[event.key] = true;
}

function handleKeyUp(event: KeyboardEvent): void {
    keysDown[event.key] = false;
}

let keyAlreadyDown_1: boolean = false;
let keyAlreadyDown_2: boolean = false;
let keyAlreadyDown_3: boolean = false;
let keyAlreadyDown_c: boolean = false;

function processInput(): void {

    // toggle backface culling
    if (keysDown['c'] && keyAlreadyDown_c == false) {
        cull_mode = !cull_mode;
        keyAlreadyDown_c = true;
    }
    if (!keysDown['c']) {
        keyAlreadyDown_c = false;
    }

    // toggle render vertices
    if (keysDown['1'] && keyAlreadyDown_1 == false) {
        Renderer.render_options.vertex = !Renderer.render_options.vertex;
        keyAlreadyDown_1 = true;
    }
    if (!keysDown['1']) {
        keyAlreadyDown_1 = false;
    }

    // toggle render wireframe
    if (keysDown['2'] && keyAlreadyDown_2 == false) {
        Renderer.render_options.wireframe = !Renderer.render_options.wireframe;
        keyAlreadyDown_2 = true;
    }
    if (!keysDown['2']) {
        keyAlreadyDown_2 = false;
    }

    // toggle render filled triangles
    if (keysDown['3'] && keyAlreadyDown_3 == false) {
        Renderer.render_options.filled = !Renderer.render_options.filled;
        keyAlreadyDown_3 = true;
    }
    if (!keysDown['3']) {
        keyAlreadyDown_3 = false;
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Determines whether triangle front face is angled out of camera view.
 */
function shouldCull(vertices: vec4_t[]): boolean {
    // 1. normalise vectors B-A and C-A (clockwise because we use LHCS)
    //     A
    //    / \
    //   C---B
    let a: vec3_t = Vector.vec4_to_vec3(vertices[0]);
    let b: vec3_t = Vector.vec4_to_vec3(vertices[1]);
    let c: vec3_t = Vector.vec4_to_vec3(vertices[2]);
    let ab: vec3_t = math.subtract(b, a);
    let ac: vec3_t = math.subtract(c, a);
    ab = math.divide(ab, math.norm(ab)).valueOf() as vec3_t;
    ac = math.divide(ac, math.norm(ac)).valueOf() as vec3_t;

    // 2. find the outward normal to the triangle
    let normal: vec3_t = math.cross(ab, ac).valueOf() as vec3_t;
    normal = math.divide(normal, math.norm(normal)).valueOf() as vec3_t;

    // 3. find camera ray vector. origin is relative to camera position.
    let origin: vec3_t = [0, 0, 0];
    let camera_ray: vec3_t = math.subtract(origin, a);

    // 4. take dot product between normal N and camera ray
    let dot_normal_camera: number = math.dot(normal, camera_ray);

    // 5. skip rendering triangle (i.e. cull) if angled too far away
    if (dot_normal_camera < 0) { return true }
    return false;
}

/*--------------------------------------------------------------------------------------------------------------------*/

import { triangle_t } from './triangle';
import * as math from 'mathjs';
const X = 0, Y = 1, Z = 2, W = 3; // for indexing

let aspect_y = Renderer.canvas.height / Renderer.canvas.width;
let aspect_x = Renderer.canvas.width / Renderer.canvas.height;
let fov_y = math.unit(90, 'deg').toNumber('rad');
let fov_x = 2.0 * math.atan(math.tan(fov_y / 2) * (aspect_x));
let z_near = 0.1;
let z_far = 10.0;
let projection_matrix = Matrix.make_perspective(fov_y, aspect_y, z_near, z_far);
let triangles: triangle_t[] = []
let cull_mode: boolean = true;
let z_buffer: number[] = []

function update() {

    // update the values on the mesh you want to transform here
    if (auto_rotate) {
        Cube.rotation[X] += 0.01;
        Cube.rotation[Y] += 0.01;
    }
    Cube.translation[Z] = 3;

    // update view matrix
    let camera_target: vec3_t = Camera.getTarget();
    let camera_up: vec3_t = [0, 1, 0];
    let view_matrix: math.Matrix = Matrix.make_view(Camera.position, camera_target, camera_up);

    // update transform matrix
    let scale_matrix: math.Matrix = Matrix.make_scaler(Cube.scale[X], Cube.scale[Y], Cube.scale[Z]);
    let translation_matrix: math.Matrix = Matrix.make_translator(Cube.translation[X], Cube.translation[Y], Cube.translation[Z]);
    let rotation_matrix_x: math.Matrix = Matrix.make_rotator_x(Cube.rotation[X]);
    let rotation_matrix_y: math.Matrix = Matrix.make_rotator_y(Cube.rotation[Y]);
    let rotation_matrix_z: math.Matrix = Matrix.make_rotator_z(Cube.rotation[Z]);
    let world_matrix: math.Matrix = math.identity(4) as math.Matrix;
    world_matrix = math.multiply(world_matrix, scale_matrix);
    world_matrix = math.multiply(rotation_matrix_z, world_matrix);
    world_matrix = math.multiply(rotation_matrix_y, world_matrix);
    world_matrix = math.multiply(rotation_matrix_x, world_matrix);
    world_matrix = math.multiply(translation_matrix, world_matrix);


    // process every triangle in the mesh
    for (let i = 0; i < Cube.faces.length; i++) {

        // get the vectors into 4d
        // note: a "face" in this context refers to an unprocessed triangle from the mesh
        // whereas a "triangle" is one that has been transformed
        let face: face_t = Cube.faces[i];
        let v0: vec4_t = Vector.vec3_to_vec4(Cube.vertices[face.vertexIndices[0]]);
        let v1: vec4_t = Vector.vec3_to_vec4(Cube.vertices[face.vertexIndices[1]]);
        let v2: vec4_t = Vector.vec3_to_vec4(Cube.vertices[face.vertexIndices[2]]);

        // apply transforms
        let transformed_vertices: vec4_t[] = [v0, v1, v2];
        transformed_vertices.forEach((vertex, index) => {
            let transformed_vertex: vec4_t = math.multiply(world_matrix, vertex).valueOf() as vec4_t;
            transformed_vertex = math.multiply(view_matrix, transformed_vertex).valueOf() as vec4_t;
            transformed_vertices[index] = transformed_vertex;
        });

        // culling
        if (cull_mode == true && shouldCull(transformed_vertices)) { continue; }

        // clipping

        // projection
        let projected_vertices: vec4_t[] = []
        transformed_vertices.forEach(vertex => {
            let projected_vertex: vec4_t = Matrix.mat4_mul_vec4_project(projection_matrix, vertex);
            // scale to viewport
            projected_vertex[X] *= (Renderer.canvas.width / 2.0);
            projected_vertex[Y] *= (Renderer.canvas.height / 2.0);
            // account for y-positive being down not up
            projected_vertex[Y] *= -1;
            // center
            projected_vertex[X] += (Renderer.canvas.width / 2.0);
            projected_vertex[Y] += (Renderer.canvas.height / 2.0);

            projected_vertices.push(projected_vertex);
        });

        // triangles
        let triangle_to_render: triangle_t = {
            points: projected_vertices,
            colour: face.colour,
        };
        triangles.push(triangle_to_render);
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/

function render() {
    Renderer.clear();
    Renderer.clearZBuffer();
    triangles.forEach(triangle => {
        Renderer.render(triangle);
    });
    Renderer.refresh();
    triangles = [];
}

/*--------------------------------------------------------------------------------------------------------------------*/

let ts = 0, ts_delta = 0, ts_old = 0;

function mainloop(timestamp: number): void {
    // get the time delta
    ts = timestamp;
    ts_delta = (ts - ts_old) / 1000;
    ts_old = ts;

    // handle input
    processInput();

    // update
    update();

    // render
    render();

    requestAnimationFrame(mainloop);
}

/*--------------------------------------------------------------------------------------------------------------------*/

let auto_rotate: boolean = false;
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.getElementById('btn-auto-on').addEventListener('click', () => { auto_rotate = true; });
document.getElementById('btn-auto-off').addEventListener('click', () => { auto_rotate = false; });
requestAnimationFrame(mainloop);