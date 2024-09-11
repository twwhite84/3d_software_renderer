// header file for mesh definitions
#ifndef MESH_H
#define MESH_H

#include "display.h"
#include "triangle.h"
#include "vector.h"

/*----------------------------------------------------------------------------*/

#define N_CUBE_VERTICES 8
extern vec3_t cube_vertices[N_CUBE_VERTICES];

#define N_CUBE_FACES (6 * 2)  // 6 cube faces * 2 triangles per face = 12 faces
extern face_t cube_faces[N_CUBE_FACES];

/*----------------------------------------------------------------------------*/

// A mesh is a collection of vertices, edges, and faces that defines the shape
// of a 3D object in computer graphics and computational geometry.

typedef struct {
    vec3_t* vertices;    // dynamic array of vertices
    face_t* faces;       // dynamic array of faces
    vec3_t rotation;     // current rotation with x,y,z values
    vec3_t scale;        // scale with x,y,z
    vec3_t translation;  // translation with x,y,z
} mesh_t;

/*----------------------------------------------------------------------------*/

// global mesh that we'll use for everything for now (multiple objects later!)

extern mesh_t mesh;

/*----------------------------------------------------------------------------*/

void load_cube_mesh_data(void);
void load_obj_file_data(char* filename);

#endif