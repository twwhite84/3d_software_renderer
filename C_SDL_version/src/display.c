#include "display.h"

SDL_Window* window = NULL;
SDL_Renderer* renderer = NULL;
uint32_t* colour_buffer = NULL;
SDL_Texture* colour_buffer_texture = NULL;
int window_width = 800;
int window_height = 600;

/*----------------------------------------------------------------------------*/

bool initialiseWindow(void) {
  if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
    fprintf(stderr, "Error initializing SDL.\n");
    return false;
  }

  SDL_DisplayMode display_mode;
  SDL_GetCurrentDisplayMode(0, &display_mode);

  // Create a SDL Window
  window =
      SDL_CreateWindow(NULL, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
                       window_width, window_height, SDL_WINDOW_RESIZABLE);
  if (!window) {
    fprintf(stderr, "Error creating SDL window.\n");
    return false;
  }

  // Create a SDL renderer
  renderer = SDL_CreateRenderer(window, -1, 0);
  if (!renderer) {
    fprintf(stderr, "Error creating SDL renderer.\n");
    return false;
  }

  return true;
}

/*----------------------------------------------------------------------------*/

void drawGrid(void) {
  for (int row = 0; row < window_height; row += 10) {
    for (int column = 0; column < window_width; column += 10) {
      if (column % 10 == 0) {
        colour_buffer[row * window_width + column] = 0xff333333;
      }
      if (row % 10 == 0) {
        colour_buffer[row * window_width + column] = 0xff333333;
      }
    }
  }
}

/*----------------------------------------------------------------------------*/

void drawPixel(int x, int y, uint32_t colour) {
  if (x >= 0 && x < window_width && y >= 0 && y < window_height) {
    colour_buffer[(y * window_width) + x] = colour;
  }
}

/*----------------------------------------------------------------------------*/

void drawRectangle(int x, int y, int width, int height, uint32_t colour) {
  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++) {
      int current_x = x + i;
      int current_y = y + j;
      drawPixel(current_x, current_y, colour);
    }
  }
}

// //OLD CODE
// for (int row_idx = y * window_width; row_idx <= (y + height) * window_width;
//      row_idx += window_width) {
//   for (int col_idx = row_idx + x; col_idx <= row_idx + x + width; col_idx++)
//   {
//     colour_buffer[col_idx] = colour;
//   }
// }

/*----------------------------------------------------------------------------*/

void clearColourBuffer(uint32_t colour) {
  for (int row = 0; row < window_height; row++) {
    for (int column = 0; column < window_width; column++) {
      colour_buffer[(window_width * row) + column] = colour;
    }
  }
}

/*----------------------------------------------------------------------------*/

void renderColourBuffer(void) {
  SDL_UpdateTexture(colour_buffer_texture, NULL, colour_buffer,
                    (int)window_width * sizeof(uint32_t));
  SDL_RenderCopy(renderer, colour_buffer_texture, NULL, NULL);
}

/*----------------------------------------------------------------------------*/

void destroyWindow(void) {
  free(colour_buffer);
  SDL_DestroyRenderer(renderer);
  SDL_DestroyWindow(window);
  SDL_Quit();
}