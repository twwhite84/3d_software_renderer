#include "mesh.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "array.h"

mesh_t mesh = {.vertices = NULL, .faces = NULL, .rotation = {0, 0, 0}};

vec3_t cube_vertices[N_CUBE_VERTICES] = {
    {.x = -1, .y = -1, .z = -1},  // 1, index position for points
    {.x = -1, .y = 1, .z = -1},   // 2
    {.x = 1, .y = 1, .z = -1},    // 3
    {.x = 1, .y = -1, .z = -1},   // 4
    {.x = 1, .y = 1, .z = 1},     // 5
    {.x = 1, .y = -1, .z = 1},    // 6
    {.x = -1, .y = 1, .z = 1},    // 7
    {.x = -1, .y = -1, .z = 1},   // 8
};

face_t cube_faces[N_CUBE_FACES] = {
    // front
    {.a = 1, .b = 2, .c = 3, .colour = RED},
    {.a = 1, .b = 3, .c = 4, .colour = RED},
    // right
    {.a = 4, .b = 3, .c = 5, .colour = GREEN},
    {.a = 4, .b = 5, .c = 6, .colour = GREEN},
    // back
    {.a = 6, .b = 5, .c = 7, .colour = BLUE},
    {.a = 6, .b = 7, .c = 8, .colour = BLUE},
    // left
    {.a = 8, .b = 7, .c = 2, .colour = YELLOW},
    {.a = 8, .b = 2, .c = 1, .colour = YELLOW},
    // top
    {.a = 2, .b = 7, .c = 5, .colour = MAGENTA},
    {.a = 2, .b = 5, .c = 3, .colour = MAGENTA},
    // bottom
    {.a = 6, .b = 8, .c = 1, .colour = CYAN},
    {.a = 6, .b = 1, .c = 4, .colour = CYAN},
};

void load_cube_mesh_data(void) {
  for (int i = 0; i < N_CUBE_VERTICES; i++) {
    vec3_t cube_vertex = cube_vertices[i];
    array_push(mesh.vertices, cube_vertex);
  }

  for (int i = 0; i < N_CUBE_FACES; i++) {
    face_t cube_face = cube_faces[i];
    array_push(mesh.faces, cube_face);
  }
}

void load_obj_file_data(char* filename) {
  // read contents of .obj
  // load up the mesh.vertices and mesh.faces

  FILE* file = fopen(filename, "r");
  char line[256];
  char* token;

  if (file != NULL) {
    while (fgets(line, sizeof(line), file)) {
      token = strtok(line, " ");
      if (token != NULL && strcmp(token, "v") == 0) {
        token = strtok(NULL, " ");
        float x = strtof(token, NULL);
        token = strtok(NULL, " ");
        float y = strtof(token, NULL);
        token = strtok(NULL, " ");
        float z = strtof(token, NULL);
        token = strtok(NULL, " ");

        // these would be written to data structure here...
        printf(" x: %f", x);
        printf(" y: %f", y);
        printf(" z: %f\n", z);

        vec3_t obj_vertex = {.x = x, .y = y, .z = z};
        array_push(mesh.vertices, obj_vertex);
      }

      else if (token != NULL && strcmp(token, "f") == 0) {
        token = strtok(NULL, " /");
        int a = atoi(token);
        token = strtok(NULL, " /");
        token = strtok(NULL, " /");
        token = strtok(NULL, " /");
        int b = atoi(token);
        token = strtok(NULL, " /");
        token = strtok(NULL, " /");
        token = strtok(NULL, " /");
        int c = atoi(token);
        token = strtok(NULL, " /");
        token = strtok(NULL, " /");

        // these would be written to data structure here...
        printf("a: %d ", a);
        printf("b: %d ", b);
        printf("c: %d\n", c);
        face_t cube_face = {.a = a, .b = b, .c = c};
        array_push(mesh.faces, cube_face);
      }
    }

    fclose(file);
  } else {
    fprintf(stderr, "Unable to open file!\n");
  }
}