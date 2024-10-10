#include <math.h>
#include <stdio.h>

#include "array.h"
#include "camera.h"
#include "clipping.h"
#include "display.h"
#include "light.h"
#include "matrix.h"
#include "mesh.h"
#include "texture.h"
#include "triangle.h"
#include "upng.h"
#include "vector.h"

#define MAX_TRIANGLES_PER_MESH 10000
triangle_t triangles_to_render[MAX_TRIANGLES_PER_MESH];
int num_triangles_to_render = 0;

bool is_running = false;
int previous_frame_time = 0;
mat4_t world_matrix;
mat4_t proj_matrix;
mat4_t view_matrix;
float delta_time = 0;

/*----------------------------------------------------------------------------*/

void setup(void) {
    setRenderMethod(RENDER_WIRE);
    setCullMethod(CULL_BACKFACE);

    // initialise scene lighting
    init_light((vec3_t){.x = 0, .y = 0, .z = 1});

    // initialise perspective projection matrix
    float aspect_y = (float)getWindowHeight() / (float)getWindowWidth();
    float aspect_x = (float)getWindowWidth() / (float)getWindowHeight();
    float fov_y = 60 * (3.1415 / 180);
    float fov_x = 2.0 * atan(tan(fov_y / 2) * (aspect_x));
    float z_near = 0.1;
    float z_far = 10.0;
    proj_matrix = mat4_make_perspective(fov_y, aspect_y, z_near, z_far);

    // initialise frustum planes
    initFrustumPlanes(fov_x, fov_y, z_near, z_far);

    // manually load hardcoded texture data from static array
    // mesh_texture = (uint32_t*)REDBRICK_TEXTURE;
    // texture_width = 64;
    // texture_height = 64;

    load_obj_file_data("./assets/f22.obj");
    loadPNGTexture("./assets/f22.png");
}

/*----------------------------------------------------------------------------*/

bool walk_forward = false;
bool walk_backward = false;
bool turn_left = false;
bool turn_right = false;
bool pan_up = false;
bool pan_down = false;
bool look_up = false;
bool look_down = false;

void processInput(void) {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        switch (event.type) {
            case SDL_QUIT:
                is_running = false;
                break;
            case SDL_KEYDOWN:
                if (event.key.keysym.sym == SDLK_ESCAPE) {
                    is_running = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_0) {
                    setRenderMethod(RENDER_VERTEX);
                    printf("\nRENDER_VERTEX");
                    break;
                }
                if (event.key.keysym.sym == SDLK_1) {
                    setRenderMethod(RENDER_WIRE_VERTEX);
                    printf("\nRENDER_WIRE_VERTEX");
                    break;
                }
                if (event.key.keysym.sym == SDLK_2) {
                    setRenderMethod(RENDER_WIRE);
                    printf("\nRENDER_WIRE");
                    break;
                }
                if (event.key.keysym.sym == SDLK_3) {
                    setRenderMethod(RENDER_FILL_TRIANGLE);
                    printf("\nRENDER_FILL_TRIANGLE");
                    break;
                }
                if (event.key.keysym.sym == SDLK_4) {
                    setRenderMethod(RENDER_FILL_TRIANGLE_WIRE);
                    printf("\nRENDER_FILL_TRIANGLE_WIRE");
                    break;
                }
                if (event.key.keysym.sym == SDLK_5) {
                    setRenderMethod(RENDER_TEXTURED);
                    printf("\nRENDER_TEXTURED");
                    break;
                }
                if (event.key.keysym.sym == SDLK_6) {
                    setRenderMethod(RENDER_TEXTURED_WIRE);
                    printf("\nRENDER_TEXTURED_WIRE");
                    break;
                }
                if (event.key.keysym.sym == SDLK_c) {
                    setCullMethod(CULL_BACKFACE);
                    printf("\nCULL_BACKFACE");
                    break;
                }
                if (event.key.keysym.sym == SDLK_x) {
                    setCullMethod(CULL_NONE);
                    printf("\nCULL_NONE");
                    break;
                }
                if (event.key.keysym.sym == SDLK_UP) {
                    pan_up = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_DOWN) {
                    pan_down = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_a) {
                    turn_left = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_d) {
                    turn_right = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_w) {
                    walk_forward = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_s) {
                    walk_backward = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_PAGEUP) {
                    look_up = true;
                    break;
                }
                if (event.key.keysym.sym == SDLK_PAGEDOWN) {
                    look_down = true;
                    break;
                }
                break;

            case SDL_KEYUP:
                if (event.key.keysym.sym == SDLK_w) {
                    walk_forward = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_s) {
                    walk_backward = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_a) {
                    turn_left = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_d) {
                    turn_right = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_UP) {
                    pan_up = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_DOWN) {
                    pan_down = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_PAGEUP) {
                    look_up = false;
                    break;
                }
                if (event.key.keysym.sym == SDLK_PAGEDOWN) {
                    look_down = false;
                    break;
                }
                break;
        }
    }
    if (walk_forward) {
        setCameraForwardVelocity(vec3_mul(getCameraDirection(), 5.0 * delta_time));
        setCameraPosition(vec3_add(getCameraPosition(), getCameraForwardVelocity()));
    }
    if (walk_backward) {
        setCameraForwardVelocity(vec3_mul(getCameraDirection(), 5.0 * delta_time));
        setCameraPosition(vec3_sub(getCameraPosition(), getCameraForwardVelocity()));
    }
    if (turn_left) {
        rotateCameraY(-1.0 * delta_time);
    }
    if (turn_right) {
        rotateCameraY(1.0 * delta_time);
    }
    if (pan_up) {
        setCameraPosition((vec3_t){
            .x = getCameraPosition().x, .y = getCameraPosition().y + (3.0 * delta_time), .z = getCameraPosition().z});
    }
    if (pan_down) {
        setCameraPosition((vec3_t){
            .x = getCameraPosition().x, .y = getCameraPosition().y - (3.0 * delta_time), .z = getCameraPosition().z});
    }
    if (look_up) {
        rotateCameraX(-1.0 * delta_time);
    }
    if (look_down) {
        rotateCameraX(1.0 * delta_time);
    }
}

/*----------------------------------------------------------------------------*/

void update(void) {
    // frameskipper and cap
    int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);
    if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME) {
        SDL_Delay(time_to_wait);
    }
    delta_time = (SDL_GetTicks() - previous_frame_time) / 1000.0;
    previous_frame_time = SDL_GetTicks();

    num_triangles_to_render = 0;

    // our transformation will be a rotation
    // mesh.rotation.x += 0.06 * delta_time;
    // mesh.rotation.y += 0.6 * delta_time;
    // mesh.rotation.y = (3.1415 / 2);
    // mesh.rotation.z += 0.06 * delta_time;
    // mesh.translation.x += 1 * delta_time;
    // mesh.scale.x += 0.002;
    // mesh.scale.y += 0.001;

    mesh.translation.z = 5.0;

    // change camera postion each frame
    // camera.position.x += 0.5 * delta_time;
    // camera.position.y += 0.8 * delta_time;

    // create the camera view matrix looking at a hardcoded point (For now)
    // vec3_t target = {.x = 0, .y = 0, .z = 4.0};

    // find the target
    // vec3_t target = {0, 0, 1};  // start with target being positive z-axis

    // mat4_t camera_yaw_rotation = mat4_make_rotation_y(getCameraYaw());
    // mat4_t camera_pitch_rotation = mat4_make_rotation_x(getCameraPitch());
    // vec3_t yaw_transform = vec3_from_vec4(mat4_mul_vec4(camera_yaw_rotation, vec4_from_vec3(target)));
    // vec3_t pitch_transform = vec3_from_vec4(mat4_mul_vec4(camera_pitch_rotation, vec4_from_vec3(target)));
    // setCameraDirection(vec3_add(yaw_transform, pitch_transform));

    // // offset the camera position in the direction camera is pointing at
    // target = vec3_add(getCameraPosition(), getCameraDirection());

    vec3_t target = getTarget();
    vec3_t up = {0, 1, 0};  // usually it's this.

    view_matrix = mat4_look_at(getCameraPosition(), target, up);

    /* ------ TRANSFORMATIONS ------ */
    mat4_t scale_matrix = mat4_make_scale(mesh.scale.x, mesh.scale.y, mesh.scale.z);

    mat4_t translation_matrix = mat4_make_translation(mesh.translation.x, mesh.translation.y, mesh.translation.z);

    mat4_t rotation_matrix_x = mat4_make_rotation_x(mesh.rotation.x);
    mat4_t rotation_matrix_y = mat4_make_rotation_y(mesh.rotation.y);
    mat4_t rotation_matrix_z = mat4_make_rotation_z(mesh.rotation.z);

    // for each face...
    int num_faces = array_length(mesh.faces);
    for (int i = 0; i < num_faces; i++) {
        face_t mesh_face = mesh.faces[i];

        // ...get the vertices
        vec3_t face_vertices[3];
        face_vertices[0] = mesh.vertices[mesh_face.a - 1];
        face_vertices[1] = mesh.vertices[mesh_face.b - 1];
        face_vertices[2] = mesh.vertices[mesh_face.c - 1];

        vec4_t transformed_vertices[3];

        // apply the transform to each vertex
        for (int j = 0; j < 3; j++) {
            vec4_t transformed_vertex = vec4_from_vec3(face_vertices[j]);

            // create a "world matrix" that combines transforms.
            // translation must follow rotation and scale
            world_matrix = mat4_identity();
            world_matrix = mat4_mul_mat4(world_matrix, scale_matrix);
            world_matrix = mat4_mul_mat4(rotation_matrix_z, world_matrix);
            world_matrix = mat4_mul_mat4(rotation_matrix_y, world_matrix);
            world_matrix = mat4_mul_mat4(rotation_matrix_x, world_matrix);
            world_matrix = mat4_mul_mat4(translation_matrix, world_matrix);

            transformed_vertex = mat4_mul_vec4(world_matrix, transformed_vertex);

            // multiply the vertex by view matrix to transform to camera space
            transformed_vertex = mat4_mul_vec4(view_matrix, transformed_vertex);

            transformed_vertices[j] = transformed_vertex;
        }

        // BACKFACE CULLING CHECK GOES HERE.

        // 1. find vectors B-A and C-A (clockwise because we use LHCS)
        /*    A    */
        /*   / \   */
        /*  C---B  */
        vec3_t vector_a = vec3_from_vec4(transformed_vertices[0]);
        vec3_t vector_b = vec3_from_vec4(transformed_vertices[1]);
        vec3_t vector_c = vec3_from_vec4(transformed_vertices[2]);
        vec3_t vector_ab = vec3_sub(vector_b, vector_a);
        vec3_t vector_ac = vec3_sub(vector_c, vector_a);
        vec3_normalise(&vector_ab);
        vec3_normalise(&vector_ac);

        // 2. take their cross product and find perpendicular normal N
        vec3_t normal = vec3_cross(vector_ab, vector_ac);
        vec3_normalise(&normal);

        // 3. find camera ray vector by subtracting camera position - point
        // A this will point a vector from a towards camera
        // origin is at camera position, so (0,0,0) here is relative
        vec3_t origin = {.x = 0, .y = 0, .z = 0};
        vec3_t camera_ray = vec3_sub(origin, vector_a);

        // 4. take dot product between normal N and camera ray
        // dot product is commutative, so order doesn't matter
        float dot_normal_camera = vec3_dot(normal, camera_ray);

        // experimental flat shading stuff
        // vec3_normalise(&light_global);
        // dot_normal_light = vec3_dot(normal, light_global);

        if (isCullBackface()) {
            // 5. if dot product < 0, dont display that face
            if (dot_normal_camera < 0) continue;
        }

        /* ------ CLIPPING STAGE ------ */
        polygon_t polygon = createPolygonFromTriangle(
            vec3_from_vec4(transformed_vertices[0]), vec3_from_vec4(transformed_vertices[1]),
            vec3_from_vec4(transformed_vertices[2]), mesh_face.a_uv, mesh_face.b_uv, mesh_face.c_uv);

        // clip the polygon and returns a new polygon that may not be a triangle
        clipPolygon(&polygon);
        // printf("n polygon vertices post-clipping: %d\n", polygon.num_vertices);

        // after clipping, break the polygon back into triangles
        triangle_t triangles_after_clipping[MAX_NUM_POLY_TRIANGLES];
        int num_triangles_after_clipping = 0;
        trianglesFromPolygon(&polygon, triangles_after_clipping, &num_triangles_after_clipping);

        // loop thru all the assembled triangles post clipping
        for (int t = 0; t < num_triangles_after_clipping; t++) {
            triangle_t triangle_after_clipping = triangles_after_clipping[t];

            /* ------ PROJECTION STAGE ------ */
            // project (i.e. create 2D coordinates for) the vertices
            vec4_t projected_points[3];

            for (int j = 0; j < 3; j++) {
                // projected_points[j] = mat4_mul_vec4_project(proj_matrix, transformed_vertices[j]);
                projected_points[j] = mat4_mul_vec4_project(proj_matrix, triangle_after_clipping.points[j]);

                // scale into the viewport
                projected_points[j].x *= (getWindowWidth() / 2.0);
                projected_points[j].y *= (getWindowHeight() / 2.0);

                // account for differing y-axis orientation
                projected_points[j].y *= -1;

                // translate the projected point relative to center of window
                projected_points[j].x += (getWindowWidth() / 2.0);
                projected_points[j].y += (getWindowHeight() / 2.0);
            }

            float light_intensity_factor = -vec3_dot(normal, getLightDirection());

            uint32_t triangle_colour = light_apply_intensity(mesh_face.colour, light_intensity_factor);

            triangle_t triangle_to_render = {
                .points = {{.x = projected_points[0].x,
                            .y = projected_points[0].y,
                            .z = projected_points[0].z,
                            .w = projected_points[0].w},
                           {.x = projected_points[1].x,
                            .y = projected_points[1].y,
                            .z = projected_points[1].z,
                            .w = projected_points[1].w},
                           {.x = projected_points[2].x,
                            .y = projected_points[2].y,
                            .z = projected_points[2].z,
                            .w = projected_points[2].w}},

                // .texcoords = {{mesh_face.a_uv.u, mesh_face.a_uv.v},
                //               {mesh_face.b_uv.u, mesh_face.b_uv.v},
                //               {mesh_face.c_uv.u, mesh_face.c_uv.v}},

                .texcoords =
                    {
                        {triangle_after_clipping.texcoords[0].u, triangle_after_clipping.texcoords[0].v},
                        {triangle_after_clipping.texcoords[1].u, triangle_after_clipping.texcoords[1].v},
                        {triangle_after_clipping.texcoords[2].u, triangle_after_clipping.texcoords[2].v},
                    },

                .colour = triangle_colour,
            };

            // save the 2d projected version of the face
            // array_push(projected_triangles, projected_triangle);
            if (num_triangles_to_render < MAX_TRIANGLES_PER_MESH) {
                triangles_to_render[num_triangles_to_render] = triangle_to_render;
                num_triangles_to_render++;
            }
        }
    }
}

/*----------------------------------------------------------------------------*/

void render(void) {
    clearColourBuffer(0x00000000);
    clearZBuffer();
    drawGrid();

    // loop thru all the projected triangles and render them
    // int num_triangles = array_length(projected_triangles);
    for (int i = 0; i < num_triangles_to_render; i++) {
        triangle_t triangle = triangles_to_render[i];

        if (shouldRenderVertices()) {
            drawRectangle(triangle.points[0].x - 3, triangle.points[0].y - 3, 6, 6, 0xffff0000);
            drawRectangle(triangle.points[1].x - 3, triangle.points[1].y - 3, 6, 6, 0xffff0000);
            drawRectangle(triangle.points[2].x - 3, triangle.points[2].y - 3, 6, 6, 0xffff0000);
        }

        if (shouldRenderWireframe()) {
            drawTriangle(triangle.points[0].x, triangle.points[0].y, triangle.points[1].x, triangle.points[1].y,
                         triangle.points[2].x, triangle.points[2].y, WHITE);
        }

        if (shouldRenderFilledTriangles()) {
            drawFilledTriangle(triangle.points[0].x, triangle.points[0].y, triangle.points[0].z, triangle.points[0].w,
                               triangle.points[1].x, triangle.points[1].y, triangle.points[1].z, triangle.points[1].w,
                               triangle.points[2].x, triangle.points[2].y, triangle.points[2].z, triangle.points[2].w,
                               triangle.colour);
        }

        if (shouldRenderTexturedTriangles()) {
            drawTexturedTriangle(triangle.points[0].x, triangle.points[0].y, triangle.points[0].z, triangle.points[0].w,
                                 triangle.texcoords[0].u, triangle.texcoords[0].v, triangle.points[1].x,
                                 triangle.points[1].y, triangle.points[1].z, triangle.points[1].w,
                                 triangle.texcoords[1].u, triangle.texcoords[1].v, triangle.points[2].x,
                                 triangle.points[2].y, triangle.points[2].z, triangle.points[2].w,
                                 triangle.texcoords[2].u, triangle.texcoords[2].v, mesh_texture);
        }
    }

    // clear the triangle array
    // array_free(projected_triangles);

    renderColourBuffer();
}

/*----------------------------------------------------------------------------*/

// frees memory that was dynamically allocated
void freeResources(void) {
    upng_free(png_texture);
    array_free(mesh.faces);
    array_free(mesh.vertices);
}

/*----------------------------------------------------------------------------*/

int main(int argc, char* argv[]) {
    is_running = initialiseWindow();

    setup();

    while (is_running) {
        processInput();
        update();
        render();
    }

    destroyWindow();
    freeResources();

    return 0;
}