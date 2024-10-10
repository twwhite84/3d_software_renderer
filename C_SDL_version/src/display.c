#include "display.h"

static SDL_Window* window = NULL;
static SDL_Renderer* renderer = NULL;
static uint32_t* colour_buffer = NULL;
static float* z_buffer = NULL;
static SDL_Texture* texture_buffer = NULL;
static int window_width;
static int window_height;
// static enum cull_method _cull_method = CULL_NONE;
// static enum render_method _render_method = RENDER_WIRE;
static int render_method = 0;
static int cull_method = 0;

int getWindowWidth(void) { return window_width; }

int getWindowHeight(void) { return window_height; }

void setRenderMethod(int method) { render_method = method; }

void setCullMethod(int method) { cull_method = method; }

bool isCullBackface() { return cull_method == CULL_BACKFACE; }

bool initialiseWindow(void) {
    if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
        fprintf(stderr, "Error initializing SDL.\n");
        return false;
    }

    SDL_DisplayMode display_mode;
    SDL_GetCurrentDisplayMode(0, &display_mode);
    int fullscreen_width = display_mode.w;  // actual resolution
    int fullscreen_height = display_mode.h;
    window_width = fullscreen_width / 2;    // virtual resolution
    window_height = fullscreen_height / 2;

    window = SDL_CreateWindow(NULL, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, fullscreen_width, fullscreen_height,
                              SDL_WINDOW_FULLSCREEN_DESKTOP);
    if (!window) {
        fprintf(stderr, "Error creating SDL window.\n");
        return false;
    }

    renderer = SDL_CreateRenderer(window, -1, 0);
    if (!renderer) {
        fprintf(stderr, "Error creating SDL renderer.\n");
        return false;
    }

    colour_buffer = (uint32_t*)malloc(window_width * window_height * sizeof(uint32_t));
    z_buffer = (float*)malloc(window_width * window_height * sizeof(float));
    texture_buffer =
        SDL_CreateTexture(renderer, SDL_PIXELFORMAT_RGBA32, SDL_TEXTUREACCESS_STREAMING, window_width, window_height);

    return true;
}

bool shouldRenderFilledTriangles(void) {
    return (render_method == RENDER_FILL_TRIANGLE || render_method == RENDER_FILL_TRIANGLE_WIRE);
}

bool shouldRenderTexturedTriangles(void) {
    return (render_method == RENDER_TEXTURED || render_method == RENDER_TEXTURED_WIRE);
}

bool shouldRenderWireframe(void) {
    return (render_method == RENDER_WIRE_VERTEX || render_method == RENDER_WIRE ||
            render_method == RENDER_FILL_TRIANGLE_WIRE || render_method == RENDER_TEXTURED_WIRE);
}

bool shouldRenderVertices(void) { return (render_method == RENDER_VERTEX || render_method == RENDER_WIRE_VERTEX); }

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

void drawPixel(int x, int y, uint32_t colour) {
    if (x < 0 || x >= window_width || y < 0 || y >= window_height) {
        return;
    }
    colour_buffer[(y * window_width) + x] = colour;
}

void drawLine(int x0, int y0, int x1, int y1, uint32_t colour) {
    int delta_x = (x1 - x0);
    int delta_y = (y1 - y0);

    int longest_side_length = (abs(delta_x) >= abs(delta_y)) ? abs(delta_x) : abs(delta_y);

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

void drawRectangle(int x, int y, int width, int height, uint32_t colour) {
    for (int i = 0; i < width; i++) {
        for (int j = 0; j < height; j++) {
            int current_x = x + i;
            int current_y = y + j;
            drawPixel(current_x, current_y, colour);
        }
    }
}

void drawTriangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t colour) {
    drawLine(x0, y0, x1, y1, colour);
    drawLine(x1, y1, x2, y2, colour);
    drawLine(x2, y2, x0, y0, colour);
}

void clearColourBuffer(uint32_t colour) {
    for (int i = 0; i < window_width * window_height; i++) {
        colour_buffer[i] = colour;
    }
}

void renderColourBuffer(void) {
    SDL_UpdateTexture(texture_buffer, NULL, colour_buffer, (int)window_width * sizeof(uint32_t));
    SDL_RenderCopy(renderer, texture_buffer, NULL, NULL);
    SDL_RenderPresent(renderer);
}

void destroyWindow(void) {
    free(colour_buffer);
    free(z_buffer);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
}

void clearZBuffer(void) {
    for (int i = 0; i < window_width * window_height; i++) {
        z_buffer[i] = 1.0;
    }
}

float getZBufferAt(int x, int y) {
    if (x < 0 || x >= window_width || y < 0 || y >= window_height) {
        return 1.0;
    }
    return z_buffer[(window_width * y) + x];
}

void setZBufferAt(int x, int y, float value) {
    if (x < 0 || x >= window_width || y < 0 || y >= window_height) {
        return;
    }
    z_buffer[(window_width * y) + x] = value;
}
