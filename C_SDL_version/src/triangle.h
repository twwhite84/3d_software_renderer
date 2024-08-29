#ifndef TRIANGLE_H
#define TRIANGLE_H

#include <stdint.h>

#include "vector.h"

typedef struct {
  int a;
  int b;
  int c;
  uint32_t colour;
} face_t;

typedef struct {
  vec2_t points[3];
  uint32_t colour;
} triangle_t;

void int_swap(int* a, int* b);

void fill_flat_bottom_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
                               uint32_t colour);

void fill_flat_top_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
                            uint32_t colour);

void drawFilledTriangle(int x0, int y0, int x1, int y1, int x2, int y2,
                        uint32_t colour);

#endif