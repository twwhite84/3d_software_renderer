import { Camera } from './camera';
import { Cube } from './cube';
import { Matrix } from './matrix';
import { Renderer } from './renderer';
import { Vector, vec3_t, vec4_t } from './vector';
import { Colour } from './colours';

// /*--------------------------------------------------------------------------------------------------------------------*/

let keysDown: Record<string, boolean> = {};

function handleKeyDown(event: KeyboardEvent): void {
    keysDown[event.key] = true;
}

function handleKeyUp(event: KeyboardEvent): void {
    keysDown[event.key] = false;
}

function processInput(): void {
    // check keystates
    if (keysDown['ArrowRight']) {
        console.log(ts);
    }
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

function update() {

    // update the values on the mesh you want to transform here
    Cube.rotation[Y] += 0.01;
    // Cube.translation[Y] += 0.1;
    Cube.rotation[X] += 0.01;
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
    Cube.faces.forEach(face => {

        // get the vectors into 4d
        let v0: vec4_t = Vector.vec3_to_vec4(Cube.vertices[face[0]]);
        let v1: vec4_t = Vector.vec3_to_vec4(Cube.vertices[face[1]]);
        let v2: vec4_t = Vector.vec3_to_vec4(Cube.vertices[face[2]]);

        // apply transforms
        let transformed_vertices: vec4_t[] = [v0, v1, v2];
        transformed_vertices.forEach((vertex, index) => {

            let transformed_vertex: vec4_t = math.multiply(world_matrix, vertex).valueOf() as vec4_t;
            transformed_vertex = math.multiply(view_matrix, transformed_vertex).valueOf() as vec4_t;
            transformed_vertices[index] = transformed_vertex;
        });

        // culling

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
            colour: Colour.BLACK
        };
        triangles.push(triangle_to_render);
    });

}

/*--------------------------------------------------------------------------------------------------------------------*/

function render() {
    Renderer.clear();
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

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
requestAnimationFrame(mainloop);
console.log("PROGRAM IS RUNNING");