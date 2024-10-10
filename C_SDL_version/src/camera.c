#include "camera.h"

#include "matrix.h"

static camera_t camera = {.position = {.x = 0, .y = 0, .z = 0},
                          .direction = {.x = 0, .y = 0, .z = 1},
                          .forward_velocity = {.x = 0, .y = 0, .z = 0},
                          .yaw = 0.0,
                          .pitch = 0.0};

void initCamera(vec3_t position, vec3_t direction) {
    camera.position = position;
    camera.direction = direction;
    camera.forward_velocity = (vec3_t){.x = 0, .y = 0, .z = 0};
    camera.yaw = 0.0;
    camera.pitch = 0.0;
}

vec3_t getCameraPosition(void) { return camera.position; }
vec3_t getCameraDirection(void) { return camera.direction; }
vec3_t getCameraForwardVelocity(void) { return camera.forward_velocity; }
float getCameraYaw(void) { return camera.yaw; }
float getCameraPitch(void) { return camera.pitch; }

vec3_t getTarget(void) {
    vec3_t target = {.x = 0, .y = 0, .z = 1};
    mat4_t yaw_rotation = mat4_make_rotation_y(camera.yaw);
    mat4_t pitch_rotation = mat4_make_rotation_x(camera.pitch);
    mat4_t camera_rotation = mat4_identity();
    camera_rotation = mat4_mul_mat4(pitch_rotation, camera_rotation);
    camera_rotation = mat4_mul_mat4(yaw_rotation, camera_rotation);
    vec4_t camera_direction = mat4_mul_vec4(camera_rotation, vec4_from_vec3(target));
    camera.direction = vec3_from_vec4(camera_direction);
    target = vec3_add(camera.position, camera.direction);
    return target;
}

void setCameraPosition(vec3_t position) { camera.position = position; }
void setCameraDirection(vec3_t direction) { camera.direction = direction; }
void setCameraForwardVelocity(vec3_t forward_velocity) { camera.forward_velocity = forward_velocity; }
void rotateCameraX(float pitch_radians) { camera.pitch += pitch_radians; }
void rotateCameraY(float yaw_radians) { camera.yaw += yaw_radians; }