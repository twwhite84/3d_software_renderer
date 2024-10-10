#ifndef CAMERA_H
#define CAMERA_H

#include "vector.h"

typedef struct {
    vec3_t position;
    vec3_t direction;
    vec3_t forward_velocity;
    float yaw;
    float pitch;
} camera_t;

vec3_t getCameraPosition(void);
vec3_t getCameraDirection(void);
vec3_t getCameraForwardVelocity(void);
float getCameraYaw(void);
float getCameraPitch(void);
vec3_t getTarget(void);

void initCamera(vec3_t position, vec3_t direction);
void setCameraPosition(vec3_t position);
void setCameraDirection(vec3_t direction);
void setCameraForwardVelocity(vec3_t forward_velocity);
void rotateCameraX(float pitch_radians);
void rotateCameraY(float yaw_radians);

#endif