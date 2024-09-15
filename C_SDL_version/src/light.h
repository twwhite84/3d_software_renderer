#ifndef LIGHT_H
#define LIGHT_h

#include <stdint.h>

#include "vector.h"

uint32_t light_apply_intensity(uint32_t colour, float factor);

typedef struct {
    vec3_t direction;
} light_t;

extern light_t light;

#endif