#include "light.h"

static light_t light;

vec3_t getLightDirection(void) { return light.direction; }

void init_light(vec3_t direction) { light.direction = direction; }

uint32_t light_apply_intensity(uint32_t colour, float factor) {
    factor < 0 ? factor = 0 : factor;
    factor > 1 ? factor = 1 : factor;

    uint32_t a = (colour & 0xff000000);
    uint32_t r = (colour & 0x00ff0000) * factor;
    uint32_t g = (colour & 0x0000ff00) * factor;
    uint32_t b = (colour & 0x000000ff) * factor;
    uint32_t new_colour = a | (r & 0x00ff0000) | (g & 0x0000ff00) | (b & 0x000000ff);

    return new_colour;
}

// uint32_t light_apply_intensity(uint32_t colour, float factor) {
//     uint32_t a = ((colour & 0xff000000) >> 24) * factor;
//     uint32_t r = ((colour & 0x00ff0000) >> 16) * factor;
//     uint32_t g = ((colour & 0x0000ff00) >> 8) * factor;
//     uint32_t b = (colour & 0x000000ff) * factor;
//     uint32_t new_colour = (a << 24) + (r << 16) + (g << 8) + (b);
//     return new_colour;
// }