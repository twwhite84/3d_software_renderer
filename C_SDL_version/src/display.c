#include "display.h"

SDL_Window* window = NULL;
SDL_Renderer* renderer = NULL;
uint32_t* colour_buffer = NULL;
SDL_Texture* colour_buffer_texture = NULL;
int window_width = 800;
int window_height = 600;
enum cull_method _cull_method = CULL_NONE;
enum render_method _render_method = RENDER_WIRE;

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

// sucky dda algorithm
void drawLine(int x0, int y0, int x1, int y1, uint32_t colour) {
    int delta_x = (x1 - x0);
    int delta_y = (y1 - y0);

    int longest_side_length =
        (abs(delta_x) >= abs(delta_y)) ? abs(delta_x) : abs(delta_y);

    float x_inc = delta_x / (float)longest_side_length;
    float y_inc = delta_y / (float)longest_side_length;

    float current_x = x0;
    float current_y = y0;
    for (int i = 0; i <= longest_side_length; i++) {
        drawPixel(round(current_x), round(current_y), colour);
        current_x += x_inc;
        current_y += y_inc;
    }
}

/*----------------------------------------------------------------------------*/

// draws a solid filled rectangle
void drawRectangle(int x, int y, int width, int height, uint32_t colour) {
    for (int i = 0; i < width; i++) {
        for (int j = 0; j < height; j++) {
            int current_x = x + i;
            int current_y = y + j;
            drawPixel(current_x, current_y, colour);
        }
    }
}

/*----------------------------------------------------------------------------*/

void drawTriangle(int x0, int y0, int x1, int y1, int x2, int y2,
                  uint32_t colour) {
    drawLine(x0, y0, x1, y1, colour);
    drawLine(x1, y1, x2, y2, colour);
    drawLine(x2, y2, x0, y0, colour);
}

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
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
}