import { vec3_t, vec4_t } from './vector'

export interface face_t {
    a: number;
    b: number;
    c: number;
    // tex2_t a_uv;
    // tex2_t b_uv;
    // tex2_t c_uv;
    colour: number;
}

export interface triangle_t {
    // points: vec4_t[] = [vec4_t, vec4_t, vec4_t]
    points: vec4_t[];
    // tex2_t texcoords[3];
    colour: number;
}

// void int_swap(int* a, int* b);

// void fill_flat_bottom_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
//                                uint32_t colour);

// void fill_flat_top_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
//                             uint32_t colour);

// void drawFilledTriangle(
//     int x0, int y0, float z0, float w0,
//     int x1, int y1, float z1, float w1,
//     int x2, int y2, float z2, float w2,
//     uint32_t colour
// );

// void drawTexturedTriangle(
//     int x0, int y0, float z0, float w0, float u0, float v0, 
//     int x1, int y1, float z1, float w1, float u1, float v1, 
//     int x2, int y2, float z2, float w2, float u2, float v2, 
//     uint32_t* texture
// );

// vec3_t barycentricWeights(vec2_t a, vec2_t b, vec2_t c, vec2_t p);

// void drawTexel(int x, int y, uint32_t* texture, vec4_t point_a, vec4_t point_b,
//                vec4_t point_c, tex2_t a_uv, tex2_t b_uv, tex2_t c_uv);