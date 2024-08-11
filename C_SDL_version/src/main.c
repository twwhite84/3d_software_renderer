#include <stdio.h>

#include "display.h"
#include "vector.h"

#define N_POINTS (9 * 9 * 9)
vec3_t cube_points[N_POINTS];
vec2_t projected_points[N_POINTS];

vec3_t camera_position = {.x = 0, .y = 0, .z = -5};
vec3_t cube_rotation = {.x = 0, .y = 0, .z = 0};

float fov_factor = 640;

bool is_running = false;

/*----------------------------------------------------------------------------*/

void setup(void) {
  colour_buffer =
      (uint32_t*)malloc(window_width * window_height * sizeof(uint32_t));

  colour_buffer_texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB8888,
                                            SDL_TEXTUREACCESS_STREAMING,
                                            window_width, window_height);

  // start loading array of vectors (point cloud)
  // from -1 to 1 (in this 9x9x9 cube)
  int point_count = 0;
  for (float x = -1; x <= 1; x += 0.25) {
    for (float y = -1; y <= 1; y += 0.25) {
      for (float z = -1; z <= 1; z += 0.25) {
        vec3_t new_point = {.x = x, .y = y, .z = z};
        cube_points[point_count++] = new_point;
      }
    }
  }
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
  cube_rotation.x += 0.001;
  cube_rotation.y += 0.001;
  cube_rotation.z += 0.001;

  for (int i = 0; i < N_POINTS; i++) {
    // fetch each point from our cube of points
    vec3_t point = cube_points[i];

    // transform that point using cube_rotation
    vec3_t transformed_point = vec3_rotate_x(point, cube_rotation.x);
    transformed_point = vec3_rotate_y(transformed_point, cube_rotation.y);
    transformed_point = vec3_rotate_z(transformed_point, cube_rotation.z);

    // translate the points away from the camera (too zoomed in before...)
    transformed_point.z -= camera_position.z;

    // project(display on flat screen using perspective projection) the current point
    vec2_t projected_point = project(transformed_point);

    // save the projected 2d vector in the array of projected points
    projected_points[i] = projected_point;
  }
}

/*----------------------------------------------------------------------------*/

void render(void) {
  drawGrid();

  // loop thru all projected points and render them
  for (int i = 0; i < N_POINTS; i++) {
    vec2_t projected_point = projected_points[i];
    drawRectangle(projected_point.x + (window_width / 2),
                  projected_point.y + (window_height / 2), 4, 4, 0xffffff00);
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

  vec3_t myvector = {2.0, 3.0, -4.0};

  while (is_running) {
    processInput();
    update();
    render();
  }

  destroyWindow();
  return 0;
}