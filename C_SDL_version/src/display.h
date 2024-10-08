#ifndef DISPLAY_H
#define DISPLAY_H

#include <SDL2/SDL.h>
#include <stdbool.h>
#include <stdint.h>

#define FPS 60
#define FRAME_TARGET_TIME (1000 / FPS)

// colours
#define RED 0xffff0000
#define GREEN 0xff00ff00
#define BLUE 0xff0000ff
#define CYAN 0xff00ffff
#define YELLOW 0xffffff00
#define MAGENTA 0xffff00ff
#define WHITE 0xffffffff

enum cull_method { CULL_NONE, CULL_BACKFACE };
enum render_method {
    RENDER_WIRE,
    RENDER_WIRE_VERTEX,
    RENDER_FILL_TRIANGLE,
    RENDER_FILL_TRIANGLE_WIRE,
    RENDER_TEXTURED,
    RENDER_TEXTURED_WIRE,
    RENDER_VERTEX
};

// extern enum cull_method _cull_method;
// extern enum render_method _render_method;
// extern SDL_Window* window;
// extern SDL_Renderer* renderer;
// extern uint32_t* colour_buffer;
// extern SDL_Texture* colour_buffer_texture;
// extern float* z_buffer;
// extern int window_width;
// extern int window_height;

bool initialiseWindow(void);
int getWindowWidth(void);
int getWindowHeight(void);

void setRenderMethod(int method);
void setCullMethod(int method);
bool isCullBackface();

bool shouldRenderFilledTriangles(void);
bool shouldRenderTexturedTriangles(void);
bool shouldRenderWireframe(void);
bool shouldRenderVertices(void);

void drawGrid(void);
void drawPixel(int x, int y, uint32_t colour);
void drawLine(int x0, int y0, int x1, int y1, uint32_t colour);
void drawRectangle(int x, int y, int width, int height, uint32_t colour);
void drawTriangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t colour);

void renderColourBuffer(void);
void clearColourBuffer(uint32_t colour);
void clearZBuffer(void);

float getZBufferAt(int x, int y);
void setZBufferAt(int x, int y, float value);

void destroyWindow(void);

#endif