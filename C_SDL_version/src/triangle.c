#include "triangle.h"

#include "display.h"
#include "swap.h"

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

// draw textured pixel at (x, y) via interpolation
void drawTexel(int x, int y, uint32_t* texture, vec4_t point_a, vec4_t point_b,
               vec4_t point_c, tex2_t a_uv, tex2_t b_uv, tex2_t c_uv) {
    vec2_t p = {x, y};
    vec2_t a = vec2_from_vec4(point_a);
    vec2_t b = vec2_from_vec4(point_b);
    vec2_t c = vec2_from_vec4(point_c);

    vec3_t weights = barycentricWeights(a, b, c, p);
    float alpha = weights.x;
    float beta = weights.y;
    float gamma = weights.z;

    float interp_u, interp_v;
    float interp_recp_w;

    // perform interpolation of all U/w, V/w values using barycentrism with
    // factor of 1/w
    interp_u = (a_uv.u / point_a.w) * alpha + (b_uv.u / point_b.w) * beta +
               (c_uv.u / point_c.w) * gamma;
    interp_v = (a_uv.v / point_a.w) * alpha + (b_uv.v / point_b.w) * beta +
               (c_uv.v / point_c.w) * gamma;

    // interpolate 1/w for the current pixel
    interp_recp_w = (1 / point_a.w) * alpha + (1 / point_b.w) * beta +
                    (1 / point_c.w) * gamma;

    // divide all attributes by reciprocal to undo the perspective transform
    interp_u /= interp_recp_w;
    interp_v /= interp_recp_w;

    // map the UV coordinate to full texture width and height. 
    // use of modulus to prevent out of range errors
    int tex_x = abs((int)(interp_u * texture_width)) % texture_width;
    int tex_y = abs((int)(interp_v * texture_height)) % texture_height;

    if (tex_x < texture_width && tex_y < texture_height) {
        drawPixel(x, y, texture[(texture_width * tex_y) + tex_x]);
    }
}

void drawTexturedTriangle(int x0, int y0, float z0, float w0, float u0,
                          float v0, int x1, int y1, float z1, float w1,
                          float u1, float v1, int x2, int y2, float z2,
                          float w2, float u2, float v2, uint32_t* texture) {
    // first sort the vertices by y coordinates ascending (y0 < y1 < y2)
    if (y0 > y1) {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
        float_swap(&z0, &z1);
        float_swap(&w0, &w1);
        float_swap(&u0, &u1);
        float_swap(&v0, &v1);
    }

    if (y1 > y2) {
        int_swap(&y1, &y2);
        int_swap(&x1, &x2);
        float_swap(&z1, &z2);
        float_swap(&w1, &w2);
        float_swap(&u1, &u2);
        float_swap(&v1, &v2);
    }

    if (y0 > y1) {
        int_swap(&y0, &y1);
        int_swap(&x0, &x1);
        float_swap(&z0, &z1);
        float_swap(&w0, &w1);
        float_swap(&u0, &u1);
        float_swap(&v0, &v1);
    }

    // texture coordinates are mirrored, so get inverse
    v0 = 1.0 - v0;
    v1 = 1.0 - v1;
    v2 = 1.0 - v2;

    // create vector points
    vec4_t point_a = {x0, y0, z0, w0};
    vec4_t point_b = {x1, y1, z1, w1};
    vec4_t point_c = {x2, y2, z2, w2};
    tex2_t a_uv = {u0, v0};
    tex2_t b_uv = {u1, v1};
    tex2_t c_uv = {u2, v2};

    // render flat bottom (upper split of triangle)
    // using m = delta_x/delta_y because we want f(y)=x basically
    float inv_slope_1 = 0, inv_slope_2 = 0;

    if ((y1 - y0) != 0) inv_slope_1 = (float)(x1 - x0) / abs(y1 - y0);
    if ((y2 - y0) != 0) inv_slope_2 = (float)(x2 - x0) / abs(y2 - y0);

    if (y1 - y0 != 0) {
        for (int y = y0; y <= y1; y++) {
            int x_start = 0, x_end = 0;
            x_start = x1 + (y - y1) * inv_slope_1;
            x_end = x0 + (y - y0) * inv_slope_2;

            if (x_end < x_start) {
                int_swap(&x_start,
                         &x_end);  // make sure x_end is always on the right
            }

            for (int x = x_start; x < x_end; x++) {
                // drawPixel(x, y, RED);
                // drawPixel(x, y, (x % 2 == 0 && y % 2 == 0 ? RED :
                // 0x00000000));

                drawTexel(x, y, texture, point_a, point_b, point_c, a_uv, b_uv,
                          c_uv);
            }
        }
    }

    // render flat top (lower split of triangle)
    inv_slope_1 = 0;
    inv_slope_2 = 0;

    if ((y2 - y1) != 0) inv_slope_1 = (float)(x2 - x1) / abs(y2 - y1);
    if ((y2 - y0) != 0) inv_slope_2 = (float)(x2 - x0) / abs(y2 - y0);

    if (y2 - y1 != 0) {
        for (int y = y1; y <= y2; y++) {
            int x_start = 0, x_end = 0;
            x_start = x1 + (y - y1) * inv_slope_1;
            x_end = x0 + (y - y0) * inv_slope_2;

            if (x_end < x_start) {
                int_swap(&x_start,
                         &x_end);  // make sure x_end is always on the right
            }

            for (int x = x_start; x < x_end; x++) {
                // drawPixel(x, y, (x % 2 == 0 && y % 2 == 0 ? RED :
                // 0x00000000));

                drawTexel(x, y, texture, point_a, point_b, point_c, a_uv, b_uv,
                          c_uv);
            }
        }
    }
}

// get barry's weights for a point P somewhere inside a triangle ABC
vec3_t barycentricWeights(vec2_t a, vec2_t b, vec2_t c, vec2_t p) {
    vec2_t AC = vec2_sub(c, a);
    vec2_t AB = vec2_sub(b, a);
    vec2_t PC = vec2_sub(c, p);
    vec2_t PB = vec2_sub(b, p);
    vec2_t AP = vec2_sub(p, a);

    float area_parallelogram_abc = (AC.x * AB.y - AC.y * AB.x);  // ||ACxAB||
    float alpha = (PC.x * PB.y - PC.y * PB.x) / area_parallelogram_abc;
    float beta = (AC.x * AP.y - AC.y * AP.x) / area_parallelogram_abc;
    float gamma = 1.0 - alpha - beta;

    vec3_t weights = {alpha, beta, gamma};
    return weights;
}
