#ifndef DISPLAY_H
#define DISPLAY_H

#include <SDL2/SDL.h>
#include <stdbool.h>
#include <stdint.h>

#define FPS 30
#define FRAME_TARGET_TIME (1000 / FPS)

extern SDL_Window* window;
extern SDL_Renderer* renderer;
extern uint32_t* colour_buffer;
extern SDL_Texture* colour_buffer_texture;
extern int window_width;
extern int window_height;

bool initialiseWindow(void);
void drawGrid(void);
void drawPixel(int x, int y, uint32_t colour);
void drawLine(int x0, int y0, int x1, int y1, uint32_t colour);
void drawTriangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t colour);
void drawRectangle(int x, int y, int width, int height, uint32_t colour);
void renderColourBuffer(void);
void clearColourBuffer(uint32_t colour);
void destroyWindow(void);

#endif