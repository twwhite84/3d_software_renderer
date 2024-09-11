#include "triangle.h"

#include "display.h"

void int_swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/*----------------------------------------------------------------------------*/

void fill_flat_bottom_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
                               uint32_t colour) {
    // (x0,y0) is top vertex; to (x1,y1) is left leg; to (x2,y2) is right leg
    float slope_left = (float)(x1 - x0) / (y1 - y0);
    float slope_right = (float)(x2 - x0) / (y2 - y0);

    float x_left = x0;
    float x_right = x0;

    for (int y = y0; y <= y2; y++) {
        drawLine(x_left, y, x_right, y, colour);
        x_left += slope_left;
        x_right += slope_right;
    }
}

/*----------------------------------------------------------------------------*/

void fill_flat_top_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
                            uint32_t colour) {
    // (x2,y2) is bottom vertex; to (x0,y0) is left leg; to (x1,y1) is right leg

    // note: doesnt appear to matter if you go x2 - x0, or x0 - x2
    float slope_left = (float)(x2 - x0) / (y2 - y0);
    float slope_right = (float)(x2 - x1) / (y2 - y1);

    float x_left = x2;
    float x_right = x2;

    for (int y = y2; y >= y0; y--) {
        drawLine(x_left, y, x_right, y, colour);
        x_left -= slope_left;
        x_right -= slope_right;
    }
}

/*----------------------------------------------------------------------------*/

void drawFilledTriangle(int x0, int y0, int x1, int y1, int x2, int y2,
                        uint32_t colour) {
    // SORTING: sort the vertices by y-coordinates so y_0 < y_1 < y_2
    if (y0 > y1) {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
    }

    if (y1 > y2) {
        int_swap(&y1, &y2);
        int_swap(&x1, &x2);
    }

    if (y0 > y1) {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
    }

    // FILLING
    if (y1 == y2) {
        fill_flat_bottom_triangle(x0, y0, x1, y1, x2, y2, colour);
    } else if (y0 == y1) {
        fill_flat_top_triangle(x0, y0, x1, y1, x2, y2, colour);
    } else {
        int My, Mx;
        My = y1;
        Mx = ((float)((x2 - x0) * (y1 - y0)) / (float)(y2 - y0)) + x0;
        fill_flat_bottom_triangle(x0, y0, x1, y1, Mx, My, colour);
        fill_flat_top_triangle(x1, y1, Mx, My, x2, y2, colour);
    }
}
