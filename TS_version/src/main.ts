import { Camera } from './camera';
import { Cube, face_t } from './cube';
import { Matrices } from './matrices';
import { Renderer } from './renderer';
import { Vector, VectorIndex, vec3_t, vec4_t } from './vector';
import { Clipping, polygon_t } from './clipping';
import { Input } from './input';
import { triangle_t } from './triangle';
import { mathHelper } from './mathHelper';

const X = VectorIndex.X, Y = VectorIndex.Y, Z = VectorIndex.Z, W = VectorIndex.W;

function project(vertices: vec4_t[]): vec4_t[] {
    let projected_vertices: vec4_t[] = []
    vertices.forEach(vertex => {
        let projected_vertex: vec4_t = Matrices.mat4_mul_vec4_project(projection_matrix, vertex);
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
    return projected_vertices;
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
    let ab: vec3_t = mathHelper.subtract(b, a);
    let ac: vec3_t = mathHelper.subtract(c, a);
    ab = mathHelper.divide(ab, mathHelper.norm(ab)).valueOf() as vec3_t;
    ac = mathHelper.divide(ac, mathHelper.norm(ac)).valueOf() as vec3_t;

    // 2. find the outward normal to the triangle
    let normal: vec3_t = mathHelper.cross(ab, ac).valueOf() as vec3_t;
    normal = mathHelper.divide(normal, mathHelper.norm(normal)).valueOf() as vec3_t;

    // 3. find camera ray vector. origin is relative to camera position.
    let origin: vec3_t = [0, 0, 0];
    let camera_ray: vec3_t = mathHelper.subtract(origin, a);

    // 4. take dot product between normal N and camera ray
    let dot_normal_camera: number = mathHelper.dot(normal, camera_ray);

    // 5. skip rendering triangle (i.e. cull) if angled too far away
    if (dot_normal_camera < 0) { return true }
    return false;
}

/*--------------------------------------------------------------------------------------------------------------------*/

let aspect_y = Renderer.canvas.height / Renderer.canvas.width;
let aspect_x = Renderer.canvas.width / Renderer.canvas.height;
let fov_y = 90 * (Math.PI / 180);
let fov_x = 2.0 * Math.atan(Math.tan(fov_y / 2) * (aspect_x));
let z_near = 0.1;
let z_far = 10.0;
let projection_matrix = Matrices.make_perspective(fov_y, aspect_y, z_near, z_far);
let triangles: triangle_t[] = []
let z_buffer: number[] = []
Clipping.initFrustumPlanes(fov_x, fov_y, z_near, z_far);

function update() {

    // update the values on the mesh you want to transform here
    if (auto_rotate) {
        Cube.rotation[X] += 0.5 * ts_delta;
        Cube.rotation[Y] += 0.5 * ts_delta;
    }
    Cube.translation[Z] = 3;

    // update view matrix
    let camera_target: vec3_t = Camera.getTarget();
    let view_matrix: math.Matrix = Matrices.make_view(Camera.position, camera_target, Camera.up);

    // update transform matrix
    let scale_matrix: math.Matrix = Matrices.make_scaler(Cube.scale[X], Cube.scale[Y], Cube.scale[Z]);
    let translation_matrix: math.Matrix = Matrices.make_translator(Cube.translation[X], Cube.translation[Y], Cube.translation[Z]);
    let rotation_matrix_x: math.Matrix = Matrices.make_rotator_x(Cube.rotation[X]);
    let rotation_matrix_y: math.Matrix = Matrices.make_rotator_y(Cube.rotation[Y]);
    let rotation_matrix_z: math.Matrix = Matrices.make_rotator_z(Cube.rotation[Z]);
    let world_matrix: math.Matrix = mathHelper.identity(4) as math.Matrix;
    world_matrix = mathHelper.multiply(world_matrix, scale_matrix);
    world_matrix = mathHelper.multiply(rotation_matrix_z, world_matrix);
    world_matrix = mathHelper.multiply(rotation_matrix_y, world_matrix);
    world_matrix = mathHelper.multiply(rotation_matrix_x, world_matrix);
    world_matrix = mathHelper.multiply(translation_matrix, world_matrix);


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
            let transformed_vertex: vec4_t = mathHelper.multiply(world_matrix, vertex).valueOf() as vec4_t;
            transformed_vertex = mathHelper.multiply(view_matrix, transformed_vertex).valueOf() as vec4_t;
            transformed_vertices[index] = transformed_vertex;
        });

        // culling
        if (Renderer.cull_mode == true && shouldCull(transformed_vertices)) { continue; }

        // clipping
        let polygon: polygon_t = Clipping.createPolygonFromTriangle(
            Vector.vec4_to_vec3(transformed_vertices[0]),
            Vector.vec4_to_vec3(transformed_vertices[1]),
            Vector.vec4_to_vec3(transformed_vertices[2]),
            face.colour
        );
        polygon = Clipping.clipPolygon(polygon);
        let clipped_triangles: triangle_t[] = Clipping.trianglesFromPolygon(polygon);

        // projection
        clipped_triangles.forEach(triangle => {
            let projected_vertices = project(triangle.points);
            let triangle_to_render: triangle_t = {
                points: projected_vertices,
                colour: face.colour,
            };
            triangles.push(triangle_to_render);
        })

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
    Input.processInput(ts_delta);

    // update
    update();

    // render
    render();

    requestAnimationFrame(mainloop);
}

/*--------------------------------------------------------------------------------------------------------------------*/

let auto_rotate: boolean = false;
document.addEventListener('keydown', Input.registerKeyDown);
document.addEventListener('keyup', Input.registerKeyUp);
// document.addEventListener('mousemove', (event: MouseEvent) => Input.handleMouseEvent(event, ts_delta));
document.getElementById('btn-auto-on').addEventListener('click', () => { auto_rotate = true; });
document.getElementById('btn-auto-off').addEventListener('click', () => { auto_rotate = false; });
requestAnimationFrame(mainloop);