import { vec3_t, vec4_t, VectorIndex, Vector } from "./vector";
import { triangle_t } from "./triangle";
import { mathHelper } from "./mathHelper";

export enum FrustumPlanes {
    LEFT_FRUSTUM_PLANE,
    RIGHT_FRUSTUM_PLANE,
    TOP_FRUSTUM_PLANE,
    BOTTOM_FRUSTUM_PLANE,
    NEAR_FRUSTUM_PLANE,
    FAR_FRUSTUM_PLANE
}

export interface plane_t {
    point: vec3_t;
    normal: vec3_t;
}

export interface polygon_t {
    vertices: vec3_t[];
    // texcoords: tex2_t[] = Array(MAX_NUM_POLY_VERTICES);
    num_vertices: number;
    colour: vec4_t;
};

export class Clipping {
    static readonly MAX_NUM_POLY_VERTICES = 10
    static readonly MAX_NUM_POLY_TRIANGLES = 10
    static readonly NUM_PLANES = 6;
    static frustum_planes: plane_t[] = Array(Clipping.NUM_PLANES);

    static lerp(a: number, b: number, t: number): number {
        let result: number = a + t * (b - a);
        return result;
    }

    static initFrustumPlanes(fovx: number, fovy: number, z_near: number, z_far: number): void {
        let cos_half_fovx: number = Math.cos(fovx / 2);
        let sin_half_fovx: number = Math.sin(fovx / 2);
        let cos_half_fovy: number = Math.cos(fovy / 2);
        let sin_half_fovy: number = Math.sin(fovy / 2);
        let origin: vec3_t = [0, 0, 0];

        Clipping.frustum_planes[FrustumPlanes.LEFT_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [cos_half_fovx, 0, sin_half_fovx]
        }

        Clipping.frustum_planes[FrustumPlanes.RIGHT_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [-cos_half_fovx, 0, sin_half_fovx]
        }

        Clipping.frustum_planes[FrustumPlanes.TOP_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [0, -cos_half_fovy, sin_half_fovy]
        }

        Clipping.frustum_planes[FrustumPlanes.BOTTOM_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [0, cos_half_fovy, sin_half_fovy]
        }

        Clipping.frustum_planes[FrustumPlanes.NEAR_FRUSTUM_PLANE] = {
            'point': [0, 0, z_near],
            'normal': [0, 0, 1]
        }

        Clipping.frustum_planes[FrustumPlanes.FAR_FRUSTUM_PLANE] = {
            'point': [0, 0, z_far],
            'normal': [0, 0, -1]
        }
    }

    static createPolygonFromTriangle(v0: vec3_t, v1: vec3_t, v2: vec3_t, colour: vec4_t): polygon_t {
        let polygon: polygon_t = {
            'vertices': [v0, v1, v2],
            'num_vertices': 3,
            'colour': colour
        };
        return polygon;
    }

    static clipPolygon(polygon: polygon_t): polygon_t {
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.LEFT_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.RIGHT_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.TOP_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.BOTTOM_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.NEAR_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.FAR_FRUSTUM_PLANE);
        return polygon;
    }

    static clipPolygonAgainstPlane(polygon: polygon_t, plane: FrustumPlanes): polygon_t {
        // get the relevant plane
        let point: vec3_t = Clipping.frustum_planes[plane].point;
        let normal: vec3_t = Clipping.frustum_planes[plane].normal;

        let inside_vertices: vec3_t[] = Array(Clipping.MAX_NUM_POLY_VERTICES);
        let num_inside_vertices: number = 0;

        // let current_vertex: vec3_t = polygon.vertices[0];
        let idx: number = 0;
        let current_vertex: vec3_t = polygon.vertices[idx];
        let previous_vertex: vec3_t = polygon.vertices[polygon.num_vertices - 1];
        let current_dot: number = 0;

        if (point == undefined || previous_vertex == undefined) {
            return polygon;
        }

        let previous_dot: number = mathHelper.dot(mathHelper.subtract(previous_vertex, point), normal);

        // while current and last are different, i.e. not at the end
        while (current_vertex != polygon.vertices[polygon.num_vertices]) {

            if (point == undefined || previous_vertex == undefined) {
                return polygon;
            }

            current_dot = mathHelper.dot(mathHelper.subtract(current_vertex, point), normal);

            // if vertex pair is inside-outside, find intersection
            if ((current_dot * previous_dot) < 0) {
                // find the interpolation factor t: dotQ1 / (dotQ1 - dotQ2)
                let t: number = previous_dot / (previous_dot - current_dot);

                // calculate intersection point I = Q1 + t(Q2-Q1)
                let intersection_point: vec3_t = [
                    Clipping.lerp(previous_vertex[VectorIndex.X], current_vertex[VectorIndex.X], t),
                    Clipping.lerp(previous_vertex[VectorIndex.Y], current_vertex[VectorIndex.Y], t),
                    Clipping.lerp(previous_vertex[VectorIndex.Z], current_vertex[VectorIndex.Z], t)
                ];

                // insert intersection point into list of "inside vertices"
                inside_vertices[num_inside_vertices] = intersection_point;
                num_inside_vertices++;
            }

            // current vertex is within the current frustum plane
            if (current_dot > 0) {
                inside_vertices[num_inside_vertices] = current_vertex;
                num_inside_vertices++;
            }

            // move to the next vertex
            previous_dot = current_dot;
            previous_vertex = current_vertex;
            current_vertex = polygon.vertices[idx + 1];
            idx++;
        }

        // copy the list of inside vertices to the destination polygon (out param)
        for (let i = 0; i < num_inside_vertices; i++) {
            polygon.vertices[i] = inside_vertices[i];
        }
        polygon.num_vertices = num_inside_vertices;
        return polygon;
    }

    static trianglesFromPolygon(polygon: polygon_t): triangle_t[] {

        let triangles: triangle_t[] = [];
        for (let i = 0; i < polygon.num_vertices - 2; i++) {
            let index0: number = 0;
            let index1: number = i + 1;
            let index2: number = i + 2;
            let triangle: triangle_t = {
                'points': [
                    Vector.vec3_to_vec4(polygon.vertices[index0]),
                    Vector.vec3_to_vec4(polygon.vertices[index1]),
                    Vector.vec3_to_vec4(polygon.vertices[index2])
                ],
                'colour': polygon.colour
            }

            triangles.push(triangle);
        }
        return triangles;
    }
}