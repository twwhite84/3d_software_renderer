#include "clipping.h"

#include "math.h"
#include "triangle.h"

#define NUM_PLANES 6
plane_t frustum_planes[NUM_PLANES];

float floatLerp(float a, float b, float t) {
    float result = a + t * (b - a);
    return result;
}

void initFrustumPlanes(float fovx, float fovy, float z_near, float z_far) {
    float cos_half_fovx = cos(fovx / 2);
    float sin_half_fovx = sin(fovx / 2);
    float cos_half_fovy = cos(fovy / 2);
    float sin_half_fovy = sin(fovy / 2);
    vec3_t origin = {0, 0, 0};

    frustum_planes[LEFT_FRUSTUM_PLANE].point = origin;
    frustum_planes[LEFT_FRUSTUM_PLANE].normal = (vec3_t){cos_half_fovx, 0, sin_half_fovx};
    frustum_planes[RIGHT_FRUSTUM_PLANE].point = origin;
    frustum_planes[RIGHT_FRUSTUM_PLANE].normal = (vec3_t){-cos_half_fovx, 0, sin_half_fovx};
    frustum_planes[TOP_FRUSTUM_PLANE].point = origin;
    frustum_planes[TOP_FRUSTUM_PLANE].normal = (vec3_t){0, -cos_half_fovy, sin_half_fovy};
    frustum_planes[BOTTOM_FRUSTUM_PLANE].point = origin;
    frustum_planes[BOTTOM_FRUSTUM_PLANE].normal = (vec3_t){0, cos_half_fovy, sin_half_fovy};
    frustum_planes[NEAR_FRUSTUM_PLANE].point = (vec3_t){0, 0, z_near};
    frustum_planes[NEAR_FRUSTUM_PLANE].normal = (vec3_t){0, 0, 1};
    frustum_planes[FAR_FRUSTUM_PLANE].point = (vec3_t){0, 0, z_far};
    frustum_planes[FAR_FRUSTUM_PLANE].normal = (vec3_t){0, 0, -1};
}

polygon_t createPolygonFromTriangle(vec3_t v0, vec3_t v1, vec3_t v2, tex2_t t0, tex2_t t1, tex2_t t2) {
    polygon_t polygon = {.vertices = {v0, v1, v2}, .texcoords = {t0, t1, t2}, .num_vertices = 3};
    return polygon;
}

void clipPolygon(polygon_t* polygon) {
    clipPolygonAgainstPlane(polygon, LEFT_FRUSTUM_PLANE);
    clipPolygonAgainstPlane(polygon, RIGHT_FRUSTUM_PLANE);
    clipPolygonAgainstPlane(polygon, TOP_FRUSTUM_PLANE);
    clipPolygonAgainstPlane(polygon, BOTTOM_FRUSTUM_PLANE);
    clipPolygonAgainstPlane(polygon, NEAR_FRUSTUM_PLANE);
    clipPolygonAgainstPlane(polygon, FAR_FRUSTUM_PLANE);
}

// float floatLerp(float a, float b, float t) { return a + t * (b - a); }

void clipPolygonAgainstPlane(polygon_t* polygon, int plane) {
    // get the relevant plane
    vec3_t point = frustum_planes[plane].point;
    vec3_t normal = frustum_planes[plane].normal;

    // storage for tracking vertices within this frustum plane
    vec3_t inside_vertices[MAX_NUM_POLY_VERTICES];
    tex2_t inside_texcoords[MAX_NUM_POLY_VERTICES];
    int num_inside_vertices = 0;

    // initialise current vertex and texcoords, and previous vertex and texcoords
    vec3_t* current_vertex = &polygon->vertices[0];
    tex2_t* current_texcoord = &polygon->texcoords[0];
    vec3_t* previous_vertex = &polygon->vertices[polygon->num_vertices - 1];
    tex2_t* previous_texcoord = &polygon->texcoords[polygon->num_vertices - 1];

    // for the pair get the inside or outside frustum plane status of each
    float current_dot = 0;
    float previous_dot = vec3_dot(vec3_sub(*previous_vertex, point), normal);

    // while current and last are different:
    while (current_vertex != &polygon->vertices[polygon->num_vertices]) {
        current_dot = vec3_dot(vec3_sub(*current_vertex, point), normal);

        // if pair inside-outside or vice-versa, find intersection
        if ((current_dot * previous_dot) < 0) {
            // find the interpolation factor t: dotQ1 / (dotQ1 - dotQ2)
            float t = previous_dot / (previous_dot - current_dot);

            // calculate intersection point I = Q1 + t(Q2-Q1)
            vec3_t intersection_point = {.x = floatLerp(previous_vertex->x, current_vertex->x, t),
                                         .y = floatLerp(previous_vertex->y, current_vertex->y, t),
                                         .z = floatLerp(previous_vertex->z, current_vertex->z, t)};

            // vec3_t intersection_point = vec3_clone(current_vertex);               // I = Qc
            // intersection_point = vec3_sub(intersection_point, *previous_vertex);  // I = (Qc - Qp)
            // intersection_point = vec3_mul(intersection_point, t);                 // I = t(Qc-Qp)
            // intersection_point = vec3_add(intersection_point, *previous_vertex);  // I = Qp + t(Qc-Qp)

            // use the lerp (linear interpolation formula) to get interpolated U and V
            tex2_t interpolated_texcoord = {.u = floatLerp(previous_texcoord->u, current_texcoord->u, t),
                                            .v = floatLerp(previous_texcoord->v, current_texcoord->v, t)};

            // insert intersection point into list of "inside vertices"
            inside_vertices[num_inside_vertices] = vec3_clone(&intersection_point);
            inside_texcoords[num_inside_vertices] = tex2_clone(&interpolated_texcoord);
            num_inside_vertices++;
        }

        // current vertex is inside plane
        if (current_dot > 0) {
            // push to the inside vertices list
            inside_vertices[num_inside_vertices] = vec3_clone(current_vertex);
            inside_texcoords[num_inside_vertices] = tex2_clone(current_texcoord);
            num_inside_vertices++;
        }

        // move to the next vertex
        previous_dot = current_dot;
        previous_vertex = current_vertex;
        previous_texcoord = current_texcoord;
        current_vertex++;  // pointer arithmetic to go to next vertex
        current_texcoord++;
    }

    // copy the list of inside vertices to the destination polygon (out param)
    for (int i = 0; i < num_inside_vertices; i++) {
        polygon->vertices[i] = vec3_clone(&inside_vertices[i]);
        polygon->texcoords[i] = tex2_clone(&inside_texcoords[i]);
    }
    polygon->num_vertices = num_inside_vertices;
}

// static arrays are send by reference in C, so you dont need to use pointers for it
void trianglesFromPolygon(polygon_t* polygon, triangle_t triangles[], int* num_triangles) {
    for (int i = 0; i < polygon->num_vertices - 2; i++) {
        int index0 = 0;
        int index1 = i + 1;
        int index2 = i + 2;

        triangles[i].points[0] = vec4_from_vec3(polygon->vertices[index0]);
        triangles[i].points[1] = vec4_from_vec3(polygon->vertices[index1]);
        triangles[i].points[2] = vec4_from_vec3(polygon->vertices[index2]);
        triangles[i].texcoords[0] = polygon->texcoords[index0];
        triangles[i].texcoords[1] = polygon->texcoords[index1];
        triangles[i].texcoords[2] = polygon->texcoords[index2];
    }
    *num_triangles = polygon->num_vertices - 2;
}
