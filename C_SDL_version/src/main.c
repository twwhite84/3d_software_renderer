#include <stdio.h>

#include "display.h"
#include "mesh.h"
#include "vector.h"

// this holds the projected vertices for a triangle, ie 3 2D points.
triangle_t triangles_to_render[N_MESH_FACES];

vec3_t camera_position = {.x = 0, .y = 0, .z = -5};
vec3_t cube_rotation = {.x = 0, .y = 0, .z = 0};

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
  int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);
  if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME) {
    SDL_Delay(time_to_wait);
  }

  previous_frame_time = SDL_GetTicks();

  cube_rotation.x += 0.01;
  cube_rotation.y += 0.01;
  cube_rotation.z += 0.01;

  // loop all triangle faces of the cube mesh
  for (int i = 0; i < N_MESH_FACES; i++) {
    face_t mesh_face = mesh_faces[i];

    vec3_t face_vertices[3];
    // mesh_face stores its vertices one-index, so -1 to fix off by one
    face_vertices[0] = mesh_vertices[mesh_face.a - 1];
    face_vertices[1] = mesh_vertices[mesh_face.b - 1];
    face_vertices[2] = mesh_vertices[mesh_face.c - 1];

    // loop all three vertices of the face and apply the transform
    triangle_t projected_triangle;
    for (int j = 0; j < 3; j++) {
      vec3_t transformed_vertex = face_vertices[j];
      transformed_vertex = vec3_rotate_x(transformed_vertex, cube_rotation.x);
      transformed_vertex = vec3_rotate_y(transformed_vertex, cube_rotation.y);
      transformed_vertex = vec3_rotate_z(transformed_vertex, cube_rotation.z);

      // translate the transformed vertex away from the camera (too zoomed in by
      // default)
      transformed_vertex.z -= camera_position.z;

      // project the current vertex onto projection plane (i.e. our screen)
      vec2_t projected_point = project(transformed_vertex);

      // scale and translate the projected point to the middle of the screen
      projected_point.x += (window_width / 2);
      projected_point.y += (window_height / 2);
      projected_triangle.points[j] = projected_point;
    }

    // save the projected triangle in the array of triangles to render
    triangles_to_render[i] = projected_triangle;
  }

  /* for (int i = 0; i < N_POINTS; i++) {
    // fetch each point from our cube of points
    vec3_t point = cube_points[i];

    // transform that point using cube_rotation
    vec3_t transformed_point = vec3_rotate_x(point, cube_rotation.x);
    transformed_point = vec3_rotate_y(transformed_point, cube_rotation.y);
    transformed_point = vec3_rotate_z(transformed_point, cube_rotation.z);

    // translate the points away from the camera (too zoomed in before...)
    transformed_point.z -= camera_position.z;

    // project(display on flat screen using perspective projection) the current
    // point
    vec2_t projected_point = project(transformed_point);

    // save the projected 2d vector in the array of projected points
    projected_points[i] = projected_point;
  } */
}

/*----------------------------------------------------------------------------*/

void render(void) {
  drawGrid();

  // loop thru all the projected triangles and render them
  for (int i = 0; i < N_MESH_FACES; i++) {
    triangle_t triangle = triangles_to_render[i];

    // for each triangle draw each vertex
    drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3, 0xffffff00);
    drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3, 0xffffff00);
    drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3, 0xffffff00);

    // drawRectangle(projected_point.x + (window_width / 2),
    // projected_point.y + (window_height / 2), 4, 4, 0xffffff00);
  }

  renderColourBuffer();
  clearColourBuffer(0x00000000);
  SDL_RenderPresent(renderer);
}

// //OLD CODE FROM RENDER
// SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
// SDL_RenderClear(renderer);
// drawPixel(20, 20, 0xffffff00);
// drawRectangle(50, 50, 100, 200, 0xffff0000);

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
  return 0;
}