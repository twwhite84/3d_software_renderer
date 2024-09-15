#include <math.h>
#include <stdio.h>

#include "array.h"
#include "display.h"
#include "matrix.h"
#include "mesh.h"
#include "vector.h"

triangle_t* projected_triangles = NULL;
vec3_t camera_position = {0, 0, 0};
mat4_t proj_matrix;
bool is_running = false;
int previous_frame_time = 0;

vec3_t light_global = {0, 0, -1};
float dot_normal_light = 1.0;
uint32_t light_apply_intensity(uint32_t original_colour, float percentage);

/*----------------------------------------------------------------------------*/

void setup(void) {
    colour_buffer =
        (uint32_t*)malloc(window_width * window_height * sizeof(uint32_t));

    colour_buffer_texture = SDL_CreateTexture(
        renderer, SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STREAMING,
        window_width, window_height);

    // initialise perspective projection matrix
    float fov = 3.1415 / 3.0;  // 60 deg
    float aspect = (float)window_height / (float)window_width;
    float znear = 0.1;   // arbitrary
    float zfar = 100.0;  // arbitrary
    proj_matrix = mat4_make_perspective(fov, aspect, znear, zfar);

    // loads up our single mesh (that we have for now) with cube data
    load_cube_mesh_data();
    // load_obj_file_data("./assets/tank.obj");
    // load_obj_file_data("./assets/f22.obj");
    // load_obj_file_data("./assets/cube.obj");
}

/*----------------------------------------------------------------------------*/

void processInput(void) {
    SDL_Event event;
    SDL_PollEvent(&event);

    switch (event.type) {
        case SDL_QUIT:
            is_running = false;
            break;
        case SDL_KEYDOWN:
            if (event.key.keysym.sym == SDLK_ESCAPE) is_running = false;
            if (event.key.keysym.sym == SDLK_1) {
                _render_method = RENDER_WIRE_VERTEX;
                printf("\nRENDER_WIRE_VERTEX");
            }
            if (event.key.keysym.sym == SDLK_2) {
                _render_method = RENDER_WIRE;
                printf("\nRENDER_WIRE");
            }
            if (event.key.keysym.sym == SDLK_3) {
                _render_method = RENDER_FILL_TRIANGLE;
                printf("\nRENDER_FILL_TRIANGLE");
            }
            if (event.key.keysym.sym == SDLK_4) {
                _render_method = RENDER_FILL_TRIANGLE_WIRE;
                printf("\nRENDER_FILL_TRIANGLE_WIRE");
            }
            if (event.key.keysym.sym == SDLK_c) {
                _cull_method = CULL_BACKFACE;
                printf("\nCULL_BACKFACE");
            }
            if (event.key.keysym.sym == SDLK_d) {
                _cull_method = CULL_NONE;
                printf("\nCULL_NONE");
            }
            break;
    }
}

/*----------------------------------------------------------------------------*/

void update(void) {
    // projected 2d faces
    projected_triangles = NULL;

    // cap the framerate
    int time_to_wait =
        FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);
    if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME) {
        SDL_Delay(time_to_wait);
    }
    previous_frame_time = SDL_GetTicks();

    // our transformation will be a rotation
    // mesh.rotation.x += 0.01;
    mesh.rotation.x = 225 * (3.1415 / 180);
    mesh.rotation.y += 0.02;
    // mesh.rotation.x = 3.1415;
    // mesh.rotation.z += 0.01;
    // mesh.scale.x += 0.002;
    // mesh.scale.y += 0.001;
    // mesh.translation.x += 0.01;
    mesh.translation.z = 5.0;

    // create a scale matrix that will be used to multiply the mesh vertices
    mat4_t scale_matrix =
        mat4_make_scale(mesh.scale.x, mesh.scale.y, mesh.scale.z);

    mat4_t translation_matrix = mat4_make_translation(
        mesh.translation.x, mesh.translation.y, mesh.translation.z);

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

            // create a world matrix
            mat4_t world_matrix = mat4_identity();
            world_matrix = mat4_mul_mat4(world_matrix, scale_matrix);
            world_matrix = mat4_mul_mat4(rotation_matrix_z, world_matrix);
            world_matrix = mat4_mul_mat4(rotation_matrix_y, world_matrix);
            world_matrix = mat4_mul_mat4(rotation_matrix_x, world_matrix);
            world_matrix = mat4_mul_mat4(translation_matrix, world_matrix);

            transformed_vertex =
                mat4_mul_vec4(world_matrix, transformed_vertex);

            transformed_vertices[j] = transformed_vertex;
        }

        // BACKFACE CULLING CHECK GOES HERE.
        if (_cull_method == CULL_BACKFACE) {
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
            vec3_t camera_ray = vec3_sub(camera_position, vector_a);

            // 4. take dot product between normal N and camera ray
            // dot product is commutative, so order doesn't matter
            float dot_normal_camera = vec3_dot(normal, camera_ray);

            // experimental flat shading stuff
            vec3_normalise(&light_global);
            dot_normal_light = vec3_dot(normal, light_global);

            // 5. if dot product < 0, dont display that face
            if (dot_normal_camera < 0) continue;
        }

        // project (i.e. create 2D coordinates for) the vertices
        vec4_t projected_points[3];

        for (int j = 0; j < 3; j++) {
            projected_points[j] =
                mat4_mul_vec4_project(proj_matrix, transformed_vertices[j]);

            // scale into the viewport
            projected_points[j].x *= (window_width / 2.0);
            projected_points[j].y *= (window_height / 2.0);

            // translate the projected point relative to center of window
            projected_points[j].x += (window_width / 2.0);
            projected_points[j].y += (window_height / 2.0);
        }

        // calculate mean face depth for each face based on post-transform z
        // values
        float avg_depth =
            (transformed_vertices[0].z + transformed_vertices[1].z +
             transformed_vertices[2].z) /
            3.0;

        triangle_t projected_triangle = {
            .points =
                {
                    {.x = projected_points[0].x, .y = projected_points[0].y},
                    {.x = projected_points[1].x, .y = projected_points[1].y},
                    {.x = projected_points[2].x, .y = projected_points[2].y},
                },
            // .colour = mesh_face.colour,
            .colour = light_apply_intensity(mesh_face.colour, dot_normal_light),
            .avg_depth = avg_depth,
        };

        // save the 2d projected version of the face
        array_push(projected_triangles, projected_triangle);
    }

    // Sort the triangles to render in order of avg_depth
    bool sorted = false;
    while (!sorted) {
        sorted = true;
        for (int i = 0; i < (array_length(projected_triangles) - 1); i++) {
            if (projected_triangles[i].avg_depth <
                projected_triangles[i + 1].avg_depth) {
                sorted = false;
                triangle_t temp = projected_triangles[i];
                projected_triangles[i] = projected_triangles[i + 1];
                projected_triangles[i + 1] = temp;
            }
        }
    }
}

/*----------------------------------------------------------------------------*/

uint32_t light_apply_intensity(uint32_t original_colour, float percentage) {
    uint32_t a = ((original_colour & 0xff000000) >> 24) * percentage;
    uint32_t r = ((original_colour & 0x00ff0000) >> 16) * percentage;
    uint32_t g = ((original_colour & 0x0000ff00) >> 8) * percentage;
    uint32_t b = (original_colour & 0x000000ff) * percentage;
    uint32_t new_colour = (a << 24) + (r << 16) + (g << 8) + (b);
    return new_colour;
}

/*----------------------------------------------------------------------------*/

void render(void) {
    drawGrid();

    // loop thru all the projected triangles and render them
    int num_triangles = array_length(projected_triangles);
    for (int i = 0; i < num_triangles; i++) {
        triangle_t triangle = projected_triangles[i];

        // for each triangle draw each vertex
        if (_render_method == RENDER_WIRE_VERTEX) {
            drawRectangle(triangle.points[0].x - 3, triangle.points[0].y - 3, 6,
                          6, 0xffff0000);
            drawRectangle(triangle.points[1].x - 3, triangle.points[1].y - 3, 6,
                          6, 0xffff0000);
            drawRectangle(triangle.points[2].x - 3, triangle.points[2].y - 3, 6,
                          6, 0xffff0000);
        }

        // draw filled triangle faces
        if (_render_method == RENDER_FILL_TRIANGLE ||
            _render_method == RENDER_FILL_TRIANGLE_WIRE) {
            drawFilledTriangle(triangle.points[0].x, triangle.points[0].y,
                               triangle.points[1].x, triangle.points[1].y,
                               triangle.points[2].x, triangle.points[2].y,
                               triangle.colour);
        }

        // draw unfilled triangle faces over top (ie a wireframe overlay)
        if (_render_method == RENDER_WIRE_VERTEX ||
            _render_method == RENDER_WIRE ||
            _render_method == RENDER_FILL_TRIANGLE_WIRE) {
            drawTriangle(triangle.points[0].x, triangle.points[0].y,
                         triangle.points[1].x, triangle.points[1].y,
                         triangle.points[2].x, triangle.points[2].y,
                         0xffffffff);
        }
    }

    // clear the triangle array
    array_free(projected_triangles);

    renderColourBuffer();
    clearColourBuffer(0x00000000);
    SDL_RenderPresent(renderer);
}

/*----------------------------------------------------------------------------*/

// frees memory that was dynamically allocated
void freeResources(void) {
    free(colour_buffer);
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