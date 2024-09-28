#include "mesh.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "array.h"

mesh_t mesh = {.vertices = NULL,
               .faces = NULL,
               .rotation = {0, 0, 0},
               .scale = {1.0, 1.0, 1.0},
               .translation = {0, 0, 0}};

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
    {.a = 1,
     .b = 2,
     .c = 3,
     .a_uv = {0, 1},
     .b_uv = {0, 0},
     .c_uv = {1, 0},
     .colour = WHITE},
    {.a = 1,
     .b = 3,
     .c = 4,
     .a_uv = {0, 1},
     .b_uv = {1, 0},
     .c_uv = {1, 1},
     .colour = WHITE},
    // right
    {.a = 4,
     .b = 3,
     .c = 5,
     .a_uv = {0, 1},
     .b_uv = {0, 0},
     .c_uv = {1, 0},
     .colour = WHITE},
    {.a = 4,
     .b = 5,
     .c = 6,
     .a_uv = {0, 1},
     .b_uv = {1, 0},
     .c_uv = {1, 1},
     .colour = WHITE},
    // back
    {.a = 6,
     .b = 5,
     .c = 7,
     .a_uv = {0, 1},
     .b_uv = {0, 0},
     .c_uv = {1, 0},
     .colour = WHITE},
    {.a = 6,
     .b = 7,
     .c = 8,
     .a_uv = {0, 1},
     .b_uv = {1, 0},
     .c_uv = {1, 1},
     .colour = WHITE},
    // left
    {.a = 8,
     .b = 7,
     .c = 2,
     .a_uv = {0, 1},
     .b_uv = {0, 0},
     .c_uv = {1, 0},
     .colour = WHITE},
    {.a = 8,
     .b = 2,
     .c = 1,
     .a_uv = {0, 1},
     .b_uv = {1, 0},
     .c_uv = {1, 1},
     .colour = WHITE},
    // top
    {.a = 2,
     .b = 7,
     .c = 5,
     .a_uv = {0, 1},
     .b_uv = {0, 0},
     .c_uv = {1, 0},
     .colour = WHITE},
    {.a = 2,
     .b = 5,
     .c = 3,
     .a_uv = {0, 1},
     .b_uv = {1, 0},
     .c_uv = {1, 1},
     .colour = WHITE},
    // bottom
    {.a = 6,
     .b = 8,
     .c = 1,
     .a_uv = {0, 1},
     .b_uv = {0, 0},
     .c_uv = {1, 0},
     .colour = WHITE},
    {.a = 6,
     .b = 1,
     .c = 4,
     .a_uv = {0, 1},
     .b_uv = {1, 0},
     .c_uv = {1, 1},
     .colour = WHITE},
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

void load_obj_file_data(char *filename) {
    FILE *file = fopen(filename, "r");
    char line[256];
    char *token;
    tex2_t *texcoords = NULL;

    if (file != NULL) {
        while (fgets(line, sizeof(line), file)) {
            token = strtok(line, " ");

            // vertices
            if (token != NULL && strcmp(token, "v") == 0) {
                token = strtok(NULL, " ");
                float x = strtof(token, NULL);
                token = strtok(NULL, " ");
                float y = strtof(token, NULL);
                token = strtok(NULL, " ");
                float z = strtof(token, NULL);
                token = strtok(NULL, " ");
                printf(" x: %f", x);
                printf(" y: %f", y);
                printf(" z: %f\n", z);
                vec3_t obj_vertex = {.x = x, .y = y, .z = z};
                array_push(mesh.vertices, obj_vertex);
            }

            // texture coords
            else if (token != NULL && strcmp(token, "vt") == 0) {
                token = strtok(NULL, " ");
                float u = strtof(token, NULL);
                token = strtok(NULL, " ");
                float v = strtof(token, NULL);
                tex2_t texcoord = {.u = u, .v = v};
                array_push(texcoords, texcoord);
            }

            // faces
            else if (token != NULL && strcmp(token, "f") == 0) {
                token = strtok(NULL, " /");

                int a = atoi(token);
                token = strtok(NULL, " /");
                int a_texidx = atoi(token);
                token = strtok(NULL, " /");
                int a_normidx = atoi(token);
                token = strtok(NULL, " /");

                int b = atoi(token);
                token = strtok(NULL, " /");
                int b_texidx = atoi(token);
                token = strtok(NULL, " /");
                int b_normidx = atoi(token);
                token = strtok(NULL, " /");

                int c = atoi(token);
                token = strtok(NULL, " /");
                int c_texidx = atoi(token);
                token = strtok(NULL, " /");
                int c_normidx = atoi(token);

                printf("a: %d ", a);
                printf("b: %d ", b);
                printf("c: %d ", c);
                printf("a_uv: %f,%f ", texcoords[a_texidx].u,
                       texcoords[a_texidx].v);
                printf("b_uv: %f,%f ", texcoords[b_texidx].u,
                       texcoords[b_texidx].v);
                printf("c_uv: %f,%f\n", texcoords[c_texidx].u,
                       texcoords[c_texidx].v);
                face_t cube_face = {.a = a,
                                    .b = b,
                                    .c = c,
                                    .a_uv = texcoords[a_texidx - 1],
                                    .b_uv = texcoords[b_texidx - 1],
                                    .c_uv = texcoords[c_texidx - 1],
                                    .colour = WHITE};
                array_push(mesh.faces, cube_face);
            }
        }
        fclose(file);
    } else {
        fprintf(stderr, "Unable to open file!\n");
    }
    array_free(texcoords);
}