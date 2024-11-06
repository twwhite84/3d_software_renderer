import { triangle_t } from "./triangle";
import { dot_v3d, sub_v3d, v3d_to_v4d, vec2_t, vec3_t, vec4_t, X, Y, Z } from "./linalg";

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
    num_vertices: number;
    colour: vec4_t;
};

export class Clipping {
    private static readonly MAX_NUM_POLY_VERTICES = 10
    private static readonly MAX_NUM_POLY_TRIANGLES = 10
    private static readonly NUM_PLANES = 6;
    private static frustum_planes: plane_t[] = Array(Clipping.NUM_PLANES);

    private static lerp(a: number, b: number, t: number): number {
        let result: number = a + t * (b - a);
        return result;
    }

    public static initFrustumPlanes(fovx: number, fovy: number, z_near: number, z_far: number): void {
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

    public static createPolygonFromTriangle(v0: vec3_t, v1: vec3_t, v2: vec3_t, colour: vec4_t): polygon_t {
        let polygon: polygon_t = {
            'vertices': [v0, v1, v2],
            'num_vertices': 3,
            'colour': colour,
        };
        return polygon;
    }

    public static clipPolygon(polygon: polygon_t): polygon_t {
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.LEFT_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.RIGHT_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.TOP_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.BOTTOM_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.NEAR_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.FAR_FRUSTUM_PLANE);
        return polygon;
    }

    private static clipPolygonAgainstPlane(polygon: polygon_t, plane: FrustumPlanes): polygon_t {
        let point: vec3_t = Clipping.frustum_planes[plane].point;
        let normal: vec3_t = Clipping.frustum_planes[plane].normal;
        let inside_vertices: vec3_t[] = [];

        let current_vertex: vec3_t = polygon.vertices[polygon.vertices.length];
        let previous_vertex: vec3_t = polygon.vertices[polygon.vertices.length - 1];

        if (previous_vertex != undefined) {
            let previous_dot: number = dot_v3d(sub_v3d(previous_vertex, point), normal);

            for (let i = 0; i < polygon.num_vertices; i++) {
                current_vertex = polygon.vertices[i];
                let current_dot: number = dot_v3d(sub_v3d(current_vertex, point), normal);

                // if vertex pair is inside-outside, find intersection
                if ((current_dot * previous_dot) < 0) {
                    let t: number = previous_dot / (previous_dot - current_dot);
                    let intersection_point: vec3_t = [
                        Clipping.lerp(previous_vertex[X], current_vertex[X], t),
                        Clipping.lerp(previous_vertex[Y], current_vertex[Y], t),
                        Clipping.lerp(previous_vertex[Z], current_vertex[Z], t)
                    ];

                    inside_vertices.push(intersection_point);
                }

                // current vertex is within the current frustum plane
                if (current_dot > 0) {
                    inside_vertices.push(current_vertex);
                }

                previous_dot = current_dot;
                previous_vertex = current_vertex;
            }
        }

        polygon.vertices = inside_vertices;
        polygon.num_vertices = inside_vertices.length;
        return polygon;
    }

    public static trianglesFromPolygon(polygon: polygon_t): triangle_t[] {

        let triangles: triangle_t[] = [];
        for (let i = 0; i < polygon.num_vertices - 2; i++) {
            let index0: number = 0;
            let index1: number = i + 1;
            let index2: number = i + 2;
            let triangle: triangle_t = {
                'points': [
                    v3d_to_v4d(polygon.vertices[index0]),
                    v3d_to_v4d(polygon.vertices[index1]),
                    v3d_to_v4d(polygon.vertices[index2])
                ],
                'colour': polygon.colour,
            }

            triangles.push(triangle);
        }
        return triangles;
    }
}
