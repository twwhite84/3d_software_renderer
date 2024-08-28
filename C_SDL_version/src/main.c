#include <stdio.h>

#include "array.h"
#include "display.h"
#include "mesh.h"
#include "vector.h"

// this holds the projected vertices for a triangle, ie 3 2D points.

// triangle_t triangles_to_render[N_MESH_FACES]; // old
triangle_t* triangles_to_render = NULL;

vec3_t camera_position = {0, 0, 0};

float fov_factor = 640;

bool is_running = false;
int previous_frame_time = 0;

/*----------------------------------------------------------------------------*/

void setup(void) {
  colour_buffer =
      (uint32_t*)malloc(window_width * window_height * sizeof(uint32_t));

  colour_buffer_texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB8888,
                                            SDL_TEXTUREACCESS_STREAMING,
                                            window_width, window_height);

  // loads up our single mesh (that we have for now) with cube data
  // load_cube_mesh_data();
  // load_obj_file_data("./assets/f22.obj");
  load_obj_file_data("./assets/cube.obj");
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
      break;
  }
}

/*----------------------------------------------------------------------------*/

vec2_t project(vec3_t point) {
  vec2_t projected_point = {.x = (fov_factor * point.x) / point.z,
                            .y = (fov_factor * point.y) / point.z};
  return projected_point;
}

/*----------------------------------------------------------------------------*/

void update(void) {
  // projected 2d faces
  triangles_to_render = NULL;

  // cap the framerate
  int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);
  if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME) {
    SDL_Delay(time_to_wait);
  }
  previous_frame_time = SDL_GetTicks();

  // our transformation will be a rotation
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.01;

  // for each face...
  int num_faces = array_length(mesh.faces);
  for (int i = 0; i < num_faces; i++) {
    face_t mesh_face = mesh.faces[i];

    // ...get the vertices
    vec3_t face_vertices[3];
    face_vertices[0] = mesh.vertices[mesh_face.a - 1];
    face_vertices[1] = mesh.vertices[mesh_face.b - 1];
    face_vertices[2] = mesh.vertices[mesh_face.c - 1];

    vec3_t transformed_vertices[3];

    // apply the transform to each vertex
    for (int j = 0; j < 3; j++) {
      vec3_t transformed_vertex = face_vertices[j];
      transformed_vertex = vec3_rotate_x(transformed_vertex, mesh.rotation.x);
      transformed_vertex = vec3_rotate_y(transformed_vertex, mesh.rotation.y);
      transformed_vertex = vec3_rotate_z(transformed_vertex, mesh.rotation.z);
      transformed_vertex.z += 5;  // default 0 is too zoomed
      transformed_vertices[j] = transformed_vertex;
    }

    // BACKFACE CULLING CHECK GOES HERE.
    // 1. find vectors B-A and C-A (clockwise because we use LHCS)
    // normalise vectors where you dont need magnitude. helps boost performance.
    vec3_t vector_a = transformed_vertices[0]; /*   A   */
    vec3_t vector_b = transformed_vertices[1]; /*  / \  */
    vec3_t vector_c = transformed_vertices[2]; /* C---B */
    vec3_t vector_ab = vec3_sub(vector_b, vector_a);
    vec3_t vector_ac = vec3_sub(vector_c, vector_a);
    vec3_normalise(&vector_ab);
    vec3_normalise(&vector_ac);

    // 2. take their cross product and find perpendicular normal N
    // non-commutative, so order matters
    vec3_t normal = vec3_cross(vector_ab, vector_ac);
    vec3_normalise(&normal);

    // 3. find camera ray vector by subtracting camera position - point A
    // this will point a vector from a towards camera
    vec3_t camera_ray = vec3_sub(camera_position, vector_a);

    // 4. take dot product between normal N and camera ray
    // dot product is commutative, so order doesn't matter
    float dot_normal_camera = vec3_dot(normal, camera_ray);

    // 5. if dot product < 0, dont display that face
    if (dot_normal_camera < 0) continue;

    // project (i.e. create 2D coordinates for) the vertices
    triangle_t projected_triangle;
    for (int j = 0; j < 3; j++) {
      vec2_t projected_point = project(transformed_vertices[j]);

      // scale and translate the projected point relative to center of window
      projected_point.x += (window_width / 2);
      projected_point.y += (window_height / 2);
      projected_triangle.points[j] = projected_point;
    }

    // save the 2d projected version of the face
    array_push(triangles_to_render, projected_triangle);
  }
}

/*----------------------------------------------------------------------------*/

void render(void) {
  drawGrid();

  // loop thru all the projected triangles and render them
  int num_triangles = array_length(triangles_to_render);
  for (int i = 0; i < num_triangles; i++) {
    triangle_t triangle = triangles_to_render[i];

    // for each triangle draw each vertex
    drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3, 0xffffff00);
    drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3, 0xffffff00);
    drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3, 0xffffff00);

    // draw unfilled triangle faces
    drawTriangle(triangle.points[0].x, triangle.points[0].y,
                 triangle.points[1].x, triangle.points[1].y,
                 triangle.points[2].x, triangle.points[2].y, 0xff00ff00);
  }

  // clear the triangle array
  array_free(triangles_to_render);

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