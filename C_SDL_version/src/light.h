#ifndef LIGHT_H
#define LIGHT_h

#include <stdint.h>

#include "vector.h"

typedef struct {
    vec3_t direction;
} light_t;

vec3_t getLightDirection(void);
void init_light(vec3_t direction);
uint32_t light_apply_intensity(uint32_t colour, float factor);

// extern light_t light;

#endif