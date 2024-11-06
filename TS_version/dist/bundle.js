/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Camera: () => (/* binding */ Camera)
/* harmony export */ });
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");
/* harmony import */ var _matrices__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrices */ "./src/matrices.ts");



var Camera = /** @class */ (function () {
    function Camera() {
        this.position = [0, 0, 0];
        this.direction = [0, 0, 1];
        this.up = [0, 1, 0];
        this.right = [1, 0, 0];
        this.forward_velocity = [0, 0, 0];
        this.yaw = 0.0;
        this.pitch = 0.0;
    }
    Camera.prototype.getPosition = function () { return this.position; };
    Camera.prototype.setPosition = function (position) { this.position = position; };
    Camera.prototype.getDirection = function () { return this.direction; };
    Camera.prototype.setDirection = function (direction) { this.direction = direction; };
    Camera.prototype.getUp = function () { return this.up; };
    Camera.prototype.setUp = function (up) { this.up = up; };
    Camera.prototype.getRight = function () { return this.right; };
    Camera.prototype.setRight = function (right) { this.right = right; };
    Camera.prototype.getYaw = function () { return this.yaw; };
    Camera.prototype.setYaw = function (yaw) { this.yaw = yaw; };
    Camera.prototype.getPitch = function () { return this.pitch; };
    Camera.prototype.setPitch = function (pitch) { this.pitch = pitch; };
    Camera.prototype.getForwardVelocity = function () { return this.forward_velocity; };
    Camera.prototype.setForwardVelocity = function (fv) { this.forward_velocity = fv; };
    Camera.prototype.getTarget = function () {
        var target = [0, 0, 1];
        var yaw_rotation = _matrices__WEBPACK_IMPORTED_MODULE_1__.Matrices.make_rotator_y(this.yaw);
        var pitch_rotation = _matrices__WEBPACK_IMPORTED_MODULE_1__.Matrices.make_rotator_x(this.pitch);
        var camera_rotation = _linalg__WEBPACK_IMPORTED_MODULE_0__.eye_m4d;
        camera_rotation = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_m4d)(pitch_rotation, camera_rotation);
        camera_rotation = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_m4d)(yaw_rotation, camera_rotation);
        var camera_direction = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_m4d_v4d)(camera_rotation, (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.v3d_to_v4d)(target));
        this.direction = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.v4d_to_v3d)(camera_direction);
        this.right = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.cross_v3d)(this.direction, this.up);
        target = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.add_v3d)(this.position, this.direction);
        return target;
    };
    Camera.prototype.rotateCameraX = function (pitch_radians) { this.pitch += pitch_radians; };
    Camera.prototype.rotateCameraY = function (yaw_radians) { this.yaw += yaw_radians; };
    return Camera;
}());



/***/ }),

/***/ "./src/clipping.ts":
/*!*************************!*\
  !*** ./src/clipping.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Clipping: () => (/* binding */ Clipping),
/* harmony export */   FrustumPlanes: () => (/* binding */ FrustumPlanes)
/* harmony export */ });
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");

var FrustumPlanes;
(function (FrustumPlanes) {
    FrustumPlanes[FrustumPlanes["LEFT_FRUSTUM_PLANE"] = 0] = "LEFT_FRUSTUM_PLANE";
    FrustumPlanes[FrustumPlanes["RIGHT_FRUSTUM_PLANE"] = 1] = "RIGHT_FRUSTUM_PLANE";
    FrustumPlanes[FrustumPlanes["TOP_FRUSTUM_PLANE"] = 2] = "TOP_FRUSTUM_PLANE";
    FrustumPlanes[FrustumPlanes["BOTTOM_FRUSTUM_PLANE"] = 3] = "BOTTOM_FRUSTUM_PLANE";
    FrustumPlanes[FrustumPlanes["NEAR_FRUSTUM_PLANE"] = 4] = "NEAR_FRUSTUM_PLANE";
    FrustumPlanes[FrustumPlanes["FAR_FRUSTUM_PLANE"] = 5] = "FAR_FRUSTUM_PLANE";
})(FrustumPlanes || (FrustumPlanes = {}));
;
var Clipping = /** @class */ (function () {
    function Clipping() {
    }
    Clipping.lerp = function (a, b, t) {
        var result = a + t * (b - a);
        return result;
    };
    Clipping.initFrustumPlanes = function (fovx, fovy, z_near, z_far) {
        var cos_half_fovx = Math.cos(fovx / 2);
        var sin_half_fovx = Math.sin(fovx / 2);
        var cos_half_fovy = Math.cos(fovy / 2);
        var sin_half_fovy = Math.sin(fovy / 2);
        var origin = [0, 0, 0];
        Clipping.frustum_planes[FrustumPlanes.LEFT_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [cos_half_fovx, 0, sin_half_fovx]
        };
        Clipping.frustum_planes[FrustumPlanes.RIGHT_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [-cos_half_fovx, 0, sin_half_fovx]
        };
        Clipping.frustum_planes[FrustumPlanes.TOP_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [0, -cos_half_fovy, sin_half_fovy]
        };
        Clipping.frustum_planes[FrustumPlanes.BOTTOM_FRUSTUM_PLANE] = {
            'point': origin,
            'normal': [0, cos_half_fovy, sin_half_fovy]
        };
        Clipping.frustum_planes[FrustumPlanes.NEAR_FRUSTUM_PLANE] = {
            'point': [0, 0, z_near],
            'normal': [0, 0, 1]
        };
        Clipping.frustum_planes[FrustumPlanes.FAR_FRUSTUM_PLANE] = {
            'point': [0, 0, z_far],
            'normal': [0, 0, -1]
        };
    };
    Clipping.createPolygonFromTriangle = function (v0, v1, v2, colour) {
        var polygon = {
            'vertices': [v0, v1, v2],
            'num_vertices': 3,
            'colour': colour,
        };
        return polygon;
    };
    Clipping.clipPolygon = function (polygon) {
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.LEFT_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.RIGHT_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.TOP_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.BOTTOM_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.NEAR_FRUSTUM_PLANE);
        polygon = Clipping.clipPolygonAgainstPlane(polygon, FrustumPlanes.FAR_FRUSTUM_PLANE);
        return polygon;
    };
    Clipping.clipPolygonAgainstPlane = function (polygon, plane) {
        var point = Clipping.frustum_planes[plane].point;
        var normal = Clipping.frustum_planes[plane].normal;
        var inside_vertices = [];
        var current_vertex = polygon.vertices[polygon.vertices.length];
        var previous_vertex = polygon.vertices[polygon.vertices.length - 1];
        if (previous_vertex != undefined) {
            var previous_dot = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_v3d)((0,_linalg__WEBPACK_IMPORTED_MODULE_0__.sub_v3d)(previous_vertex, point), normal);
            for (var i = 0; i < polygon.num_vertices; i++) {
                current_vertex = polygon.vertices[i];
                var current_dot = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_v3d)((0,_linalg__WEBPACK_IMPORTED_MODULE_0__.sub_v3d)(current_vertex, point), normal);
                // if vertex pair is inside-outside, find intersection
                if ((current_dot * previous_dot) < 0) {
                    var t = previous_dot / (previous_dot - current_dot);
                    var intersection_point = [
                        Clipping.lerp(previous_vertex[_linalg__WEBPACK_IMPORTED_MODULE_0__.X], current_vertex[_linalg__WEBPACK_IMPORTED_MODULE_0__.X], t),
                        Clipping.lerp(previous_vertex[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y], current_vertex[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y], t),
                        Clipping.lerp(previous_vertex[_linalg__WEBPACK_IMPORTED_MODULE_0__.Z], current_vertex[_linalg__WEBPACK_IMPORTED_MODULE_0__.Z], t)
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
    };
    Clipping.trianglesFromPolygon = function (polygon) {
        var triangles = [];
        for (var i = 0; i < polygon.num_vertices - 2; i++) {
            var index0 = 0;
            var index1 = i + 1;
            var index2 = i + 2;
            var triangle = {
                'points': [
                    (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.v3d_to_v4d)(polygon.vertices[index0]),
                    (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.v3d_to_v4d)(polygon.vertices[index1]),
                    (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.v3d_to_v4d)(polygon.vertices[index2])
                ],
                'colour': polygon.colour,
            };
            triangles.push(triangle);
        }
        return triangles;
    };
    Clipping.MAX_NUM_POLY_VERTICES = 10;
    Clipping.MAX_NUM_POLY_TRIANGLES = 10;
    Clipping.NUM_PLANES = 6;
    Clipping.frustum_planes = Array(Clipping.NUM_PLANES);
    return Clipping;
}());



/***/ }),

/***/ "./src/colours.ts":
/*!************************!*\
  !*** ./src/colours.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Colour: () => (/* binding */ Colour)
/* harmony export */ });
var Colour = /** @class */ (function () {
    function Colour() {
    }
    Colour.RED = [255, 0, 0, 255];
    Colour.GREEN = [0, 255, 0, 255];
    Colour.BLUE = [0, 0, 255, 255];
    Colour.YELLOW = [255, 255, 0, 255];
    Colour.CYAN = [0, 255, 255, 255];
    Colour.MAGENTA = [255, 0, 255, 255];
    Colour.WHITE = [255, 255, 255, 255];
    Colour.BLACK = [0, 0, 0, 255];
    Colour.BROWN = [165, 42, 42, 255];
    return Colour;
}());



/***/ }),

/***/ "./src/input.ts":
/*!**********************!*\
  !*** ./src/input.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Input: () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.ts");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");



var Input = /** @class */ (function () {
    function Input() {
    }
    Input.registerKeyDown = function (event) {
        Input.keysDown[event.key] = true;
    };
    Input.registerKeyUp = function (event) {
        Input.keysDown[event.key] = false;
    };
    Input.handleMouseEvent = function (event, ts_delta) {
        var camera = _main__WEBPACK_IMPORTED_MODULE_0__.Main.getCamera();
        camera.setYaw(camera.getYaw() + event.movementX * 0.1 * ts_delta);
        camera.setPitch(camera.getPitch() + event.movementY * 0.1 * ts_delta * Input.yflip);
        var y_clamp = (89 * Math.PI) / 180;
        if (camera.getPitch() > y_clamp)
            camera.setPitch(y_clamp);
        if (camera.getPitch() < -y_clamp)
            camera.setPitch(-y_clamp);
    };
    Input.processInput = function (ts_delta) {
        var camera = _main__WEBPACK_IMPORTED_MODULE_0__.Main.getCamera();
        // toggle backface culling
        if (Input.keysDown['c'] && Input.keyAlreadyDown_c == false) {
            _renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.cull_mode = !_renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.cull_mode;
            Input.keyAlreadyDown_c = true;
        }
        if (!Input.keysDown['c']) {
            Input.keyAlreadyDown_c = false;
        }
        // toggle render vertices
        if (Input.keysDown['1'] && Input.keyAlreadyDown_1 == false) {
            _renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.render_options.vertex = !_renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.render_options.vertex;
            Input.keyAlreadyDown_1 = true;
        }
        if (!Input.keysDown['1']) {
            Input.keyAlreadyDown_1 = false;
        }
        // toggle render wireframe
        if (Input.keysDown['2'] && Input.keyAlreadyDown_2 == false) {
            _renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.render_options.wireframe = !_renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.render_options.wireframe;
            Input.keyAlreadyDown_2 = true;
        }
        if (!Input.keysDown['2']) {
            Input.keyAlreadyDown_2 = false;
        }
        // toggle render filled triangles
        if (Input.keysDown['3'] && Input.keyAlreadyDown_3 == false) {
            _renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.render_options.filled = !_renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer.render_options.filled;
            Input.keyAlreadyDown_3 = true;
        }
        if (!Input.keysDown['3']) {
            Input.keyAlreadyDown_3 = false;
        }
        // toggle y-axis flip
        if (Input.keysDown['i'] && Input.keyAlreadyDown_i == false) {
            Input.yflip = -1 * Input.yflip;
            Input.keyAlreadyDown_i = true;
        }
        if (!Input.keysDown['i']) {
            Input.keyAlreadyDown_i = false;
        }
        // walk forward
        if (Input.keysDown['w']) {
            camera.setForwardVelocity((0,_linalg__WEBPACK_IMPORTED_MODULE_2__.mult_v3d_s)(camera.getDirection(), 1.0 * ts_delta));
            camera.setPosition((0,_linalg__WEBPACK_IMPORTED_MODULE_2__.add_v3d)(camera.getPosition(), camera.getForwardVelocity()));
        }
        // walk backward
        if (Input.keysDown['s']) {
            camera.setForwardVelocity((0,_linalg__WEBPACK_IMPORTED_MODULE_2__.mult_v3d_s)(camera.getDirection(), -1.0 * ts_delta));
            camera.setPosition((0,_linalg__WEBPACK_IMPORTED_MODULE_2__.add_v3d)(camera.getPosition(), camera.getForwardVelocity()));
        }
        // pan up
        if (Input.keysDown['e']) {
            camera.setPosition([
                camera.getPosition()[_linalg__WEBPACK_IMPORTED_MODULE_2__.X],
                camera.getPosition()[_linalg__WEBPACK_IMPORTED_MODULE_2__.Y] + (3.0 * ts_delta),
                camera.getPosition()[_linalg__WEBPACK_IMPORTED_MODULE_2__.Z]
            ]);
        }
        // pan down
        if (Input.keysDown['q']) {
            camera.setPosition([
                camera.getPosition()[_linalg__WEBPACK_IMPORTED_MODULE_2__.X],
                camera.getPosition()[_linalg__WEBPACK_IMPORTED_MODULE_2__.Y] - (3.0 * ts_delta),
                camera.getPosition()[_linalg__WEBPACK_IMPORTED_MODULE_2__.Z]
            ]);
        }
        // strafe left
        if (Input.keysDown['a']) {
            camera.setPosition((0,_linalg__WEBPACK_IMPORTED_MODULE_2__.add_v3d)(camera.getPosition(), (0,_linalg__WEBPACK_IMPORTED_MODULE_2__.mult_v3d_s)(camera.getRight(), 3.0 * ts_delta)));
        }
        // strafe right
        if (Input.keysDown['d']) {
            camera.setPosition((0,_linalg__WEBPACK_IMPORTED_MODULE_2__.add_v3d)(camera.getPosition(), (0,_linalg__WEBPACK_IMPORTED_MODULE_2__.mult_v3d_s)(camera.getRight(), -3.0 * ts_delta)));
        }
    };
    Input.keysDown = {};
    Input.keyAlreadyDown_1 = false;
    Input.keyAlreadyDown_2 = false;
    Input.keyAlreadyDown_3 = false;
    Input.keyAlreadyDown_c = false;
    Input.keyAlreadyDown_i = false;
    Input.yflip = -1;
    return Input;
}());



/***/ }),

/***/ "./src/linalg.ts":
/*!***********************!*\
  !*** ./src/linalg.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ W),
/* harmony export */   X: () => (/* binding */ X),
/* harmony export */   Y: () => (/* binding */ Y),
/* harmony export */   Z: () => (/* binding */ Z),
/* harmony export */   add_v3d: () => (/* binding */ add_v3d),
/* harmony export */   cross_v3d: () => (/* binding */ cross_v3d),
/* harmony export */   div_v3d_s: () => (/* binding */ div_v3d_s),
/* harmony export */   dot_m4d: () => (/* binding */ dot_m4d),
/* harmony export */   dot_m4d_v4d: () => (/* binding */ dot_m4d_v4d),
/* harmony export */   dot_v3d: () => (/* binding */ dot_v3d),
/* harmony export */   dot_v4d: () => (/* binding */ dot_v4d),
/* harmony export */   eye_m4d: () => (/* binding */ eye_m4d),
/* harmony export */   mult_v3d_s: () => (/* binding */ mult_v3d_s),
/* harmony export */   norm_v3d: () => (/* binding */ norm_v3d),
/* harmony export */   sub_v3d: () => (/* binding */ sub_v3d),
/* harmony export */   v3d_to_v4d: () => (/* binding */ v3d_to_v4d),
/* harmony export */   v4d_to_v3d: () => (/* binding */ v4d_to_v3d)
/* harmony export */ });
var X = 0, Y = 1, Z = 2, W = 3;
var eye_m4d = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
function add_v3d(v1, v2) {
    var result = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        result[i] += (v1[i] + v2[i]);
    }
    return result;
}
function sub_v3d(v1, v2) {
    var result = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        result[i] += (v1[i] - v2[i]);
    }
    return result;
}
function div_v3d_s(v, s) {
    var result = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        result[i] += (v[i] / s);
    }
    return result;
}
function mult_v3d_s(v, s) {
    var result = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        result[i] += (v[i] * s);
    }
    return result;
}
function dot_m4d_v4d(M, v) {
    var result = [0, 0, 0, 0];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            result[i] += (M[i][j] * v[j]);
        }
    }
    return result;
}
function dot_m4d(M1, M2) {
    var result = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var row = M1[i];
            var col = [M2[0][j], M2[1][j], M2[2][j], M2[3][j]];
            result[i][j] = dot_v4d(row, col);
        }
    }
    return result;
}
function dot_v3d(v1, v2) {
    var result = 0;
    for (var i = 0; i < 3; i++) {
        result += (v1[i] * v2[i]);
    }
    return result;
}
function dot_v4d(v1, v2) {
    var result = 0;
    for (var i = 0; i < 4; i++) {
        result += (v1[i] * v2[i]);
    }
    return result;
}
function norm_v3d(v) {
    var result = 0;
    for (var i = 0; i < 3; i++) {
        result += Math.pow(v[i], 2);
    }
    result = Math.sqrt(result);
    return result;
}
function cross_v3d(v1, v2) {
    var result = [0, 0, 0];
    result[X] = v1[Y] * v2[Z] - v1[Z] * v2[Y];
    result[Y] = v1[Z] * v2[X] - v1[X] * v2[Z];
    result[Z] = v1[X] * v2[Y] - v1[Y] * v2[X];
    return result;
}
function v4d_to_v3d(v) {
    var result = [v[X], v[Y], v[Z]];
    return result;
}
function v3d_to_v4d(v) {
    var result = [v[X], v[Y], v[Z], 1.0];
    return result;
}


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Main: () => (/* binding */ Main)
/* harmony export */ });
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ "./src/camera.ts");
/* harmony import */ var _clipping__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clipping */ "./src/clipping.ts");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input */ "./src/input.ts");
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");
/* harmony import */ var _matrices__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./matrices */ "./src/matrices.ts");
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mesh */ "./src/mesh.ts");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");








var Main = /** @class */ (function () {
    function Main() {
    }
    Main.init = function () {
        Main.meshes.push(new _mesh__WEBPACK_IMPORTED_MODULE_5__.Cube([-3, 0, -5]));
        Main.meshes.push(new _mesh__WEBPACK_IMPORTED_MODULE_5__.Pyramid([0, 0, 0]));
        Main.meshes.push(new _mesh__WEBPACK_IMPORTED_MODULE_5__.Prism([-7, 4, -3]));
        Main.meshes.push(new _mesh__WEBPACK_IMPORTED_MODULE_5__.Ground([0, -1, 0]));
        Main.aspect_y = _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.height / _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.width;
        Main.aspect_x = _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.width / _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.height;
        Main.fov_y = 90 * (Math.PI / 180);
        Main.fov_x = 2.0 * Math.atan(Math.tan(Main.fov_y / 2) * (Main.aspect_x));
        Main.z_near = 0.1;
        Main.z_far = 20.0;
        Main.projection_matrix = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_perspective(Main.fov_y, Main.aspect_y, Main.z_near, Main.z_far);
        Main.triangles = [];
        // Main.z_buffer = [];
        _clipping__WEBPACK_IMPORTED_MODULE_1__.Clipping.initFrustumPlanes(Main.fov_x, Main.fov_y, Main.z_near, Main.z_far);
        Main.camera.setPosition([0, 0, -8]);
    };
    Main.project = function (vertices) {
        var projected_vertices = [];
        vertices.forEach(function (vertex) {
            var projected_vertex = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.perspective_divide(Main.projection_matrix, vertex);
            // scale to viewport
            projected_vertex[_linalg__WEBPACK_IMPORTED_MODULE_3__.X] *= (_renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.width / 2.0);
            projected_vertex[_linalg__WEBPACK_IMPORTED_MODULE_3__.Y] *= (_renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.height / 2.0);
            // account for 2D pixel coordinates having inverse y-axis
            projected_vertex[_linalg__WEBPACK_IMPORTED_MODULE_3__.Y] *= -1;
            // center
            projected_vertex[_linalg__WEBPACK_IMPORTED_MODULE_3__.X] += (_renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.width / 2.0);
            projected_vertex[_linalg__WEBPACK_IMPORTED_MODULE_3__.Y] += (_renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.height / 2.0);
            projected_vertices.push(projected_vertex);
        });
        return projected_vertices;
    };
    Main.shouldCull = function (vertices) {
        // clockwise ordering, renderer is LHCS
        var a = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v4d_to_v3d)(vertices[0]);
        var b = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v4d_to_v3d)(vertices[1]);
        var c = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v4d_to_v3d)(vertices[2]);
        // get normal to triangle
        var ab = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.sub_v3d)(b, a);
        var ac = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.sub_v3d)(c, a);
        ab = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.div_v3d_s)(ab, (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.norm_v3d)(ab));
        ac = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.div_v3d_s)(ac, (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.norm_v3d)(ac));
        var normal = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.cross_v3d)(ab, ac);
        normal = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.div_v3d_s)(normal, (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.norm_v3d)(normal));
        // check alignment between camera-to-vertex and normal
        var camera_ray = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.sub_v3d)([0, 0, 0], a);
        var dot_normal_camera = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_v3d)(normal, camera_ray);
        if (dot_normal_camera < 0) {
            return true;
        }
        return false;
    };
    Main.update = function () {
        // update camera
        var camera_target = Main.camera.getTarget();
        var view_matrix = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_view(Main.camera.getPosition(), camera_target, Main.camera.getUp());
        Main.meshes.forEach(function (mesh) {
            // prepare transform matrix from any updated mesh properties
            var scale_matrix = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_scaler(mesh.scale[_linalg__WEBPACK_IMPORTED_MODULE_3__.X], mesh.scale[_linalg__WEBPACK_IMPORTED_MODULE_3__.Y], mesh.scale[_linalg__WEBPACK_IMPORTED_MODULE_3__.Z]);
            var translation_matrix = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_translator(mesh.translation[_linalg__WEBPACK_IMPORTED_MODULE_3__.X], mesh.translation[_linalg__WEBPACK_IMPORTED_MODULE_3__.Y], mesh.translation[_linalg__WEBPACK_IMPORTED_MODULE_3__.Z]);
            var rotation_matrix_x = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_rotator_x(mesh.rotation[_linalg__WEBPACK_IMPORTED_MODULE_3__.X]);
            var rotation_matrix_y = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_rotator_y(mesh.rotation[_linalg__WEBPACK_IMPORTED_MODULE_3__.Y]);
            var rotation_matrix_z = _matrices__WEBPACK_IMPORTED_MODULE_4__.Matrices.make_rotator_z(mesh.rotation[_linalg__WEBPACK_IMPORTED_MODULE_3__.Z]);
            var world_matrix = _linalg__WEBPACK_IMPORTED_MODULE_3__.eye_m4d;
            world_matrix = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d)(world_matrix, scale_matrix);
            world_matrix = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d)(rotation_matrix_z, world_matrix);
            world_matrix = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d)(rotation_matrix_y, world_matrix);
            world_matrix = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d)(rotation_matrix_x, world_matrix);
            world_matrix = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d)(translation_matrix, world_matrix);
            var _loop_1 = function (i) {
                var face = mesh.faces[i];
                var v0 = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v3d_to_v4d)(mesh.vertices[face.vertexIndices[0]]);
                var v1 = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v3d_to_v4d)(mesh.vertices[face.vertexIndices[1]]);
                var v2 = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v3d_to_v4d)(mesh.vertices[face.vertexIndices[2]]);
                // apply transforms
                var transformed_vertices = [v0, v1, v2];
                transformed_vertices.forEach(function (vertex, index) {
                    var transformed_vertex = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d_v4d)(world_matrix, vertex);
                    transformed_vertex = (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.dot_m4d_v4d)(view_matrix, transformed_vertex);
                    transformed_vertices[index] = transformed_vertex;
                });
                // culling
                if (_renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.cull_mode == true && Main.shouldCull(transformed_vertices)) {
                    return "continue";
                }
                // clipping
                var polygon = _clipping__WEBPACK_IMPORTED_MODULE_1__.Clipping.createPolygonFromTriangle((0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v4d_to_v3d)(transformed_vertices[0]), (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v4d_to_v3d)(transformed_vertices[1]), (0,_linalg__WEBPACK_IMPORTED_MODULE_3__.v4d_to_v3d)(transformed_vertices[2]), face.colour);
                polygon = _clipping__WEBPACK_IMPORTED_MODULE_1__.Clipping.clipPolygon(polygon);
                var clipped_triangles = _clipping__WEBPACK_IMPORTED_MODULE_1__.Clipping.trianglesFromPolygon(polygon);
                // projection
                clipped_triangles.forEach(function (triangle) {
                    var projected_vertices = Main.project(triangle.points);
                    var triangle_to_render = {
                        points: projected_vertices,
                        colour: face.colour,
                    };
                    Main.triangles.push(triangle_to_render);
                });
            };
            for (var i = 0; i < mesh.faces.length; i++) {
                _loop_1(i);
            }
        });
    };
    Main.render = function () {
        _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.clear();
        _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.clearZBuffer();
        Main.triangles.forEach(function (triangle) {
            _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.render(triangle);
        });
        _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.refresh();
        Main.triangles = [];
    };
    Main.mainloop = function (timestamp) {
        Main.ts = timestamp;
        Main.ts_delta = (Main.ts - Main.ts_old) / 1000;
        Main.ts_old = Main.ts;
        _input__WEBPACK_IMPORTED_MODULE_2__.Input.processInput(Main.ts_delta);
        Main.update();
        Main.render();
        requestAnimationFrame(Main.mainloop);
    };
    Main.getDelta = function () {
        return Main.ts_delta;
    };
    Main.getCamera = function () {
        return Main.camera;
    };
    Main.run = function () {
        document.addEventListener('keydown', _input__WEBPACK_IMPORTED_MODULE_2__.Input.registerKeyDown);
        document.addEventListener('keyup', _input__WEBPACK_IMPORTED_MODULE_2__.Input.registerKeyUp);
        _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.addEventListener('click', function () {
            _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas.requestPointerLock();
        });
        document.addEventListener('mousemove', function (event) {
            if (document.pointerLockElement === _renderer__WEBPACK_IMPORTED_MODULE_6__.Renderer.canvas) {
                _input__WEBPACK_IMPORTED_MODULE_2__.Input.handleMouseEvent(event, Main.getDelta());
            }
        });
        Main.init();
        requestAnimationFrame(Main.mainloop);
    };
    Main.meshes = [];
    Main.aspect_x = 0;
    Main.aspect_y = 0;
    Main.fov_x = 0;
    Main.fov_y = 0;
    Main.z_near = 0;
    Main.z_far = 0;
    Main.projection_matrix = _linalg__WEBPACK_IMPORTED_MODULE_3__.eye_m4d;
    Main.triangles = [];
    // private static z_buffer: number[] = [];
    Main.ts = 0;
    Main.ts_delta = 0;
    Main.ts_old = 0;
    Main.camera = new _camera__WEBPACK_IMPORTED_MODULE_0__.Camera();
    return Main;
}());

Main.run();


/***/ }),

/***/ "./src/matrices.ts":
/*!*************************!*\
  !*** ./src/matrices.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Matrices: () => (/* binding */ Matrices)
/* harmony export */ });
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");

var Matrices = /** @class */ (function () {
    function Matrices() {
    }
    Matrices.make_scaler = function (sx, sy, sz) {
        // [ sx  0  0  0 ]
        // [  0  sy 0  0 ]
        // [  0  0  sz 0 ]
        // [  0  0  0  1 ]
        return [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];
    };
    Matrices.make_translator = function (tx, ty, tz) {
        // [ 1  0  0  tx ]
        // [ 0  1  0  ty ]
        // [ 0  0  1  tz ]
        // [ 0  0  0   1 ]
        return [
            [1, 0, 0, tx],
            [0, 1, 0, ty],
            [0, 0, 1, tz],
            [0, 0, 0, 1]
        ];
    };
    Matrices.make_rotator_x = function (angle) {
        // [ 1  0  0  0 ]
        // [ 0  c -s  0 ]
        // [ 0  s  c  0 ]
        // [ 0  0  0  1 ]
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            [1, 0, 0, 0],
            [0, c, -s, 0],
            [0, s, c, 0],
            [0, 0, 0, 1]
        ];
    };
    Matrices.make_rotator_y = function (angle) {
        // [ c  0  s  0 ]
        // [ 0  1  0  0 ]
        // [-s  0  c  0 ]
        // [ 0  0  0  1 ]
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            [c, 0, s, 0],
            [0, 1, 0, 0],
            [-s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    };
    Matrices.make_rotator_z = function (angle) {
        // [ c -s  0  0 ]
        // [ s  c  0  0 ]
        // [ 0  0  1  0 ]
        // [ 0  0  0  1 ]
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            [c, -s, 0, 0],
            [s, c, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    };
    Matrices.make_perspective = function (fov, aspect, znear, zfar) {
        // [(h/w)(1/tan(foc/2)) 0               0          0               ]
        // [0                   (1/tan(fov/2))  0          0               ]
        // [0                   0               zf/(zf-zn) -(zf*zn)/(zf-zn)]
        // [0                   0               1          0               ]
        var r0c0 = aspect * (1 / Math.tan(fov / 2));
        var r1c1 = 1 / Math.tan(fov / 2);
        var r2c2 = zfar * (zfar - znear);
        var r2c3 = (-zfar * znear) / (zfar - znear);
        return [
            [r0c0, 0, 0, 0],
            [0, r1c1, 0, 0],
            [0, 0, r2c2, r2c3],
            [0, 0, 1.0, 0]
        ];
    };
    Matrices.make_view = function (eye, target, up) {
        // get x,y,z axes relative to camera position and direction
        var z = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.sub_v3d)(target, eye);
        var z_unit = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.div_v3d_s)(z, (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.norm_v3d)(z));
        var x = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.cross_v3d)(up, z);
        var x_unit = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.div_v3d_s)(x, (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.norm_v3d)(x));
        var y = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.cross_v3d)(z_unit, x_unit);
        return [
            [x_unit[0], x_unit[1], x_unit[2], -(0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_v3d)(x_unit, eye)],
            [y[0], y[1], y[2], -(0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_v3d)(y, eye)],
            [z_unit[0], z_unit[1], z_unit[2], -(0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_v3d)(z_unit, eye)],
            [0, 0, 0, 1]
        ];
    };
    Matrices.perspective_divide = function (projection_matrix, v) {
        var result = (0,_linalg__WEBPACK_IMPORTED_MODULE_0__.dot_m4d_v4d)(projection_matrix, v);
        var x = 0, y = 1, z = 2, w = 3;
        // perform perspective divide with original z-value now stored in w
        if (result[w] != 0.0) {
            result[x] /= result[w];
            result[y] /= result[w];
            result[z] /= result[w];
        }
        return result;
    };
    return Matrices;
}());



/***/ }),

/***/ "./src/mesh.ts":
/*!*********************!*\
  !*** ./src/mesh.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cube: () => (/* binding */ Cube),
/* harmony export */   Ground: () => (/* binding */ Ground),
/* harmony export */   Prism: () => (/* binding */ Prism),
/* harmony export */   Pyramid: () => (/* binding */ Pyramid)
/* harmony export */ });
/* harmony import */ var _colours__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colours */ "./src/colours.ts");

/*--------------------------------------------------------------------------------------------------------------------*/
var Cube = /** @class */ (function () {
    function Cube(position) {
        this.vertices = [
            [-1.0, -1.0, 1.0], //0
            [1.0, -1.0, 1.0], //1
            [-1.0, 1.0, 1.0], //2
            [1.0, 1.0, 1.0], //3
            [-1.0, 1.0, -1.0], //4
            [1.0, 1.0, -1.0], //5
            [-1.0, -1.0, -1.0], //6
            [1.0, -1.0, -1.0] //7
        ];
        this.faces = [
            { 'vertexIndices': [0, 1, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.RED }, //s1
            { 'vertexIndices': [2, 1, 3], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.RED },
            { 'vertexIndices': [2, 3, 4], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.GREEN }, //s2
            { 'vertexIndices': [4, 3, 5], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.GREEN },
            { 'vertexIndices': [4, 5, 6], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLUE }, //s3
            { 'vertexIndices': [6, 5, 7], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLUE },
            { 'vertexIndices': [6, 7, 0], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.YELLOW }, //s4
            { 'vertexIndices': [0, 7, 1], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.YELLOW },
            { 'vertexIndices': [1, 7, 3], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA }, //s5
            { 'vertexIndices': [3, 7, 5], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA },
            { 'vertexIndices': [6, 0, 4], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.CYAN }, //s6
            { 'vertexIndices': [4, 0, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.CYAN },
        ];
        this.rotation = [0, 0, 0];
        this.scale = [1.0, 1.0, 1.0];
        this.translation = [0, 0, 0];
        this.translation = position;
    }
    return Cube;
}());

/*--------------------------------------------------------------------------------------------------------------------*/
var Pyramid = /** @class */ (function () {
    function Pyramid(position) {
        this.vertices = [
            [-1, -1, 1], // 0
            [1, -1, 1], // 1
            [0, 1, 0], // 2
            [1, -1, -1], // 3
            [-1, -1, -1], // 4
        ];
        this.faces = [
            { 'vertexIndices': [0, 1, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.RED }, //1
            { 'vertexIndices': [1, 3, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.GREEN }, //2
            { 'vertexIndices': [4, 0, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLUE }, //3
            { 'vertexIndices': [3, 4, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA }, //4
            { 'vertexIndices': [3, 1, 0], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA }, //5
            { 'vertexIndices': [4, 3, 0], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA }, //6
        ];
        this.rotation = [0, 0, 0];
        this.scale = [1.0, 1.0, 1.0];
        this.translation = [0, 0, 0];
        this.translation = position;
    }
    return Pyramid;
}());

/*--------------------------------------------------------------------------------------------------------------------*/
var Prism = /** @class */ (function () {
    function Prism(position) {
        this.vertices = [
            [-1, -5, 1],
            [1, -5, 1],
            [-1, 5, 1],
            [1, 5, 1],
            [-1, 5, -1],
            [1, 5, -1],
            [-1, -5, -1],
            [1, -5, -1]
        ];
        this.faces = [
            { 'vertexIndices': [0, 1, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.RED }, //s1
            { 'vertexIndices': [2, 1, 3], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.RED },
            { 'vertexIndices': [2, 3, 4], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.GREEN }, //s2
            { 'vertexIndices': [4, 3, 5], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.GREEN },
            { 'vertexIndices': [4, 5, 6], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLUE }, //s3
            { 'vertexIndices': [6, 5, 7], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLUE },
            { 'vertexIndices': [6, 7, 0], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.YELLOW }, //s4
            { 'vertexIndices': [0, 7, 1], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.YELLOW },
            { 'vertexIndices': [1, 7, 3], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA }, //s5
            { 'vertexIndices': [3, 7, 5], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.MAGENTA },
            { 'vertexIndices': [6, 0, 4], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.CYAN }, //s6
            { 'vertexIndices': [4, 0, 2], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.CYAN },
        ];
        this.rotation = [0, 0, 0];
        this.scale = [1.0, 1.0, 1.0];
        this.translation = [0, 0, 0];
        this.translation = position;
    }
    return Prism;
}());

/*--------------------------------------------------------------------------------------------------------------------*/
var Ground = /** @class */ (function () {
    function Ground(position) {
        this.vertices = [
            [-10, 0, -10],
            [10, 0, -10],
            [10, 0, 10],
            [-10, 0, 10]
        ];
        this.faces = [
            { 'vertexIndices': [2, 1, 0], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BROWN },
            { 'vertexIndices': [3, 2, 0], 'colour': _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BROWN },
        ];
        this.rotation = [0, 0, 0];
        this.scale = [1.0, 1.0, 1.0];
        this.translation = [0, 0, 0];
        this.translation = position;
    }
    return Ground;
}());



/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* binding */ Renderer)
/* harmony export */ });
/* harmony import */ var _colours__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colours */ "./src/colours.ts");
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");
/* harmony import */ var _triangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./triangle */ "./src/triangle.ts");



var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.clear = function () {
        Renderer.pixel_buffer.fill(0);
    };
    Renderer.refresh = function () {
        Renderer.context.putImageData(Renderer.image_data, 0, 0);
    };
    Renderer.drawPixel = function (x, y, colour) {
        var R = 0, G = 1, B = 2, A = 3;
        var offset = (y * Renderer.canvas.width + x) * 4;
        Renderer.pixel_buffer[offset + 0] = colour[R];
        Renderer.pixel_buffer[offset + 1] = colour[G];
        Renderer.pixel_buffer[offset + 2] = colour[B];
        Renderer.pixel_buffer[offset + 3] = colour[A];
    };
    Renderer.drawVertex = function (x, y, s, colour) {
        for (var row = x; row < (x + s); row++) {
            for (var column = y; column < (y + s); column++) {
                Renderer.drawPixel(row, column, colour);
            }
        }
    };
    // DDA algorithm, this isn't efficient
    Renderer.drawLine = function (x0, y0, x1, y1, colour) {
        var dx = (x1 - x0);
        var dy = (y1 - y0);
        var longest_side_length = (Math.abs(dx) >= Math.abs(dy)) ? Math.abs(dx) : Math.abs(dy);
        var x_inc = dx / longest_side_length;
        var y_inc = dy / longest_side_length;
        var current_x = x0;
        var current_y = y0;
        for (var i = 0; i <= Math.round(longest_side_length); i++) {
            Renderer.drawPixel(Math.round(current_x), Math.round(current_y), colour);
            current_x += x_inc;
            current_y += y_inc;
        }
    };
    Renderer.drawTriangle = function (triangle) {
        var x0 = triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.X];
        var y0 = triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y];
        var x1 = triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.X];
        var y1 = triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y];
        var x2 = triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.X];
        var y2 = triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y];
        Renderer.drawLine(x0, y0, x1, y1, _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLACK);
        Renderer.drawLine(x1, y1, x2, y2, _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLACK);
        Renderer.drawLine(x2, y2, x0, y0, _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLACK);
    };
    Renderer.fillTriangle = function (triangle) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        var x0 = Math.round(triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.X]);
        var y0 = Math.round(triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]);
        var z0 = triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.Z];
        var w0 = triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.W];
        var x1 = Math.round(triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.X]);
        var y1 = Math.round(triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]);
        var z1 = triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.Z];
        var w1 = triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.W];
        var x2 = Math.round(triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.X]);
        var y2 = Math.round(triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]);
        var z2 = triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.Z];
        var w2 = triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.W];
        // sort vertices by y-axis
        if (y0 > y1) {
            _a = [x1, x0], x0 = _a[0], x1 = _a[1];
            _b = [y1, y0], y0 = _b[0], y1 = _b[1];
            _c = [z1, z0], z0 = _c[0], z1 = _c[1];
            _d = [w1, w0], w0 = _d[0], w1 = _d[1];
        }
        if (y1 > y2) {
            _e = [x2, x1], x1 = _e[0], x2 = _e[1];
            _f = [y2, y1], y1 = _f[0], y2 = _f[1];
            _g = [z2, z1], z1 = _g[0], z2 = _g[1];
            _h = [w2, w1], w1 = _h[0], w2 = _h[1];
        }
        if (y0 > y1) {
            _j = [x1, x0], x0 = _j[0], x1 = _j[1];
            _k = [y1, y0], y0 = _k[0], y1 = _k[1];
            _l = [z1, z0], z0 = _l[0], z1 = _l[1];
            _m = [w1, w0], w0 = _m[0], w1 = _m[1];
        }
        // create vector points
        var a = [x0, y0, z0, w0];
        var b = [x1, y1, z1, w1];
        var c = [x2, y2, z2, w2];
        // fill flat bottom half
        var inv_slope_1 = 0, inv_slope_2 = 0;
        if ((y1 - y0) != 0)
            inv_slope_1 = (x1 - x0) / Math.abs(y1 - y0);
        if ((y2 - y0) != 0)
            inv_slope_2 = (x2 - x0) / Math.abs(y2 - y0);
        if (y1 - y0 != 0) {
            for (var y = y0; y <= y1; y++) {
                var x_start = Math.round(x1 + (y - y1) * inv_slope_1);
                var x_end = Math.round(x0 + (y - y0) * inv_slope_2);
                // ensure x_end is on right
                if (x_end < x_start) {
                    _o = [x_start, x_end], x_end = _o[0], x_start = _o[1];
                }
                for (var x = x_start; x < x_end; x++) {
                    // get depth info for pixel
                    var p = [x, y];
                    var weights = _triangle__WEBPACK_IMPORTED_MODULE_2__.Triangle.findWeights([a[_linalg__WEBPACK_IMPORTED_MODULE_1__.X], a[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]], [b[_linalg__WEBPACK_IMPORTED_MODULE_1__.X], b[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]], [c[_linalg__WEBPACK_IMPORTED_MODULE_1__.X], c[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]], p);
                    var alpha = weights[_linalg__WEBPACK_IMPORTED_MODULE_1__.X];
                    var beta = weights[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y];
                    var gamma = weights[_linalg__WEBPACK_IMPORTED_MODULE_1__.Z];
                    var interp_recp_w = 1 - ((alpha / a[_linalg__WEBPACK_IMPORTED_MODULE_1__.W]) + (beta / b[_linalg__WEBPACK_IMPORTED_MODULE_1__.W]) + (gamma / c[_linalg__WEBPACK_IMPORTED_MODULE_1__.W]));
                    // redraw pixel if this one is closer to camera
                    if (interp_recp_w < Renderer.getZBufferAt(x, y)) {
                        Renderer.drawPixel(x, y, triangle.colour);
                        Renderer.setZBufferAt(x, y, interp_recp_w);
                    }
                }
            }
        }
        // render flat top (lower split of triangle)
        inv_slope_1 = 0;
        inv_slope_2 = 0;
        if ((y2 - y1) != 0)
            inv_slope_1 = (x2 - x1) / Math.abs(y2 - y1);
        if ((y2 - y0) != 0)
            inv_slope_2 = (x2 - x0) / Math.abs(y2 - y0);
        if (y2 - y1 != 0) {
            for (var y = y1; y <= y2; y++) {
                var x_start = Math.round(x1 + (y - y1) * inv_slope_1);
                var x_end = Math.round(x0 + (y - y0) * inv_slope_2);
                if (x_end < x_start) {
                    _p = [x_end, x_start], x_start = _p[0], x_end = _p[1];
                }
                for (var x = x_start; x < x_end; x++) {
                    // get depth info for pixel
                    var p = [x, y];
                    var weights = _triangle__WEBPACK_IMPORTED_MODULE_2__.Triangle.findWeights([a[_linalg__WEBPACK_IMPORTED_MODULE_1__.X], a[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]], [b[_linalg__WEBPACK_IMPORTED_MODULE_1__.X], b[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]], [c[_linalg__WEBPACK_IMPORTED_MODULE_1__.X], c[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y]], p);
                    var alpha = weights[_linalg__WEBPACK_IMPORTED_MODULE_1__.X];
                    var beta = weights[_linalg__WEBPACK_IMPORTED_MODULE_1__.Y];
                    var gamma = weights[_linalg__WEBPACK_IMPORTED_MODULE_1__.Z];
                    var interp_recp_w = 1 - ((alpha / a[_linalg__WEBPACK_IMPORTED_MODULE_1__.W]) + (beta / b[_linalg__WEBPACK_IMPORTED_MODULE_1__.W]) + (gamma / c[_linalg__WEBPACK_IMPORTED_MODULE_1__.W]));
                    // redraw pixel if this one is closer to camera
                    if (interp_recp_w < Renderer.getZBufferAt(x, y)) {
                        Renderer.drawPixel(x, y, triangle.colour);
                        Renderer.setZBufferAt(x, y, interp_recp_w);
                    }
                }
            }
        }
    };
    Renderer.render = function (triangle) {
        // paint filled triangles
        if (Renderer.render_options.filled == true) {
            Renderer.fillTriangle(triangle);
        }
        // paint vertices
        if (Renderer.render_options.vertex == true) {
            var x = Math.round(triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.X] - 2);
            var y = Math.round(triangle.points[0][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y] - 2);
            Renderer.drawVertex(x, y, 4, _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLACK);
            x = Math.round(triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.X] - 2);
            y = Math.round(triangle.points[1][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y] - 2);
            Renderer.drawVertex(x, y, 4, _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLACK);
            x = Math.round(triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.X] - 2);
            y = Math.round(triangle.points[2][_linalg__WEBPACK_IMPORTED_MODULE_1__.Y] - 2);
            Renderer.drawVertex(x, y, 4, _colours__WEBPACK_IMPORTED_MODULE_0__.Colour.BLACK);
        }
        // paint lines
        if (Renderer.render_options.wireframe == true) {
            Renderer.drawTriangle(triangle);
        }
    };
    Renderer.clearZBuffer = function () {
        Renderer.z_buffer.fill(1);
    };
    Renderer.getZBufferAt = function (x, y) {
        if (x < 0 || x >= Renderer.canvas.width || y < 0 || y >= Renderer.canvas.height) {
            return 1.0;
        }
        return Renderer.z_buffer[(Renderer.canvas.width * y) + x];
    };
    Renderer.setZBufferAt = function (x, y, value) {
        if (x < 0 || x >= Renderer.canvas.width || y < 0 || y >= Renderer.canvas.height) {
            return;
        }
        Renderer.z_buffer[(Renderer.canvas.width * y) + x] = value;
    };
    return Renderer;
}());

(function () {
    Renderer.canvas = document.getElementById("my-canvas");
    Renderer.canvas.style.background = 'black';
    Renderer.canvas.width = 320;
    Renderer.canvas.height = 200;
    Renderer.context = Renderer.canvas.getContext('2d');
    Renderer.image_data = Renderer.context.getImageData(0, 0, Renderer.canvas.width, Renderer.canvas.height);
    Renderer.pixel_buffer = Renderer.image_data.data;
    Renderer.render_options = {
        vertex: false,
        wireframe: false,
        filled: true,
    };
    Renderer.z_buffer = Array(Renderer.canvas.width * Renderer.canvas.height).fill(1);
    Renderer.cull_mode = true;
})();


/***/ }),

/***/ "./src/triangle.ts":
/*!*************************!*\
  !*** ./src/triangle.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Triangle: () => (/* binding */ Triangle)
/* harmony export */ });
/* harmony import */ var _linalg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linalg */ "./src/linalg.ts");

var Triangle = /** @class */ (function () {
    function Triangle() {
    }
    Triangle.findWeights = function (a, b, c, p) {
        var AC = [(c[0] - a[0]), (c[1] - a[1])];
        var AB = [(b[0] - a[0]), (b[1] - a[1])];
        var PC = [(c[0] - p[0]), (c[1] - p[1])];
        var PB = [(b[0] - p[0]), (b[1] - p[1])];
        var AP = [(p[0] - a[0]), (p[1] - a[1])];
        // ||ACxAB||
        var area_parallelogram_abc = (AC[_linalg__WEBPACK_IMPORTED_MODULE_0__.X] * AB[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y] - AC[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y] * AB[_linalg__WEBPACK_IMPORTED_MODULE_0__.X]);
        var alpha = (PC[_linalg__WEBPACK_IMPORTED_MODULE_0__.X] * PB[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y] - PC[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y] * PB[_linalg__WEBPACK_IMPORTED_MODULE_0__.X]) / area_parallelogram_abc;
        var beta = (AC[_linalg__WEBPACK_IMPORTED_MODULE_0__.X] * AP[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y] - AC[_linalg__WEBPACK_IMPORTED_MODULE_0__.Y] * AP[_linalg__WEBPACK_IMPORTED_MODULE_0__.X]) / area_parallelogram_abc;
        var gamma = 1.0 - alpha - beta;
        var weights = [alpha, beta, gamma];
        return weights;
    };
    return Triangle;
}());



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0Q0FBTSxDQUFDLEdBQUcsRUFBRSxFQUFNLElBQUk7WUFDOUQsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0Q0FBTSxDQUFDLEdBQUcsRUFBRTtZQUNwRCxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLDRDQUFNLENBQUMsS0FBSyxFQUFFLEVBQUksSUFBSTtZQUM5RCxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLDRDQUFNLENBQUMsS0FBSyxFQUFFO1lBQ3RELEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsNENBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBSyxJQUFJO1lBQzlELEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsNENBQU0sQ0FBQyxJQUFJLEVBQUU7WUFDckQsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0Q0FBTSxDQUFDLE1BQU0sRUFBRSxFQUFHLElBQUk7WUFDOUQsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0Q0FBTSxDQUFDLE1BQU0sRUFBRTtZQUN2RCxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLDRDQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSTtZQUM5RCxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFD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QUUsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2Q7UUFFRCxVQUFLLEdBQWE7WUFDZCxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLDRDQUFNLENBQUMsR0FBRyxFQUFFLEVBQU0sSUFBSTtZQUM5RCxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLDRDQUFNLENBQUMsR0FBRyxFQUFFO1lBQ3BELEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsNENBQU0sQ0FBQyxLQUFLLEVBQUUsRUFBSSxJQUFJO1lBQzlELEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsNENBQU0sQ0FBQyxLQUFLLEVBQUU7WUFDdEQsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0Q0FBTSxDQUFDLElBQUksRUFBRSxFQUFLLElBQUk7WUFDOUQsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENB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c0NBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLHNDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsc0NBQUMsQ0FBQyxDQUNoQyxDQUFDO1FBQ0YsSUFBSSxLQUFLLEdBQVcsQ0FDaEIsRUFBRSxDQUFDLHNDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsc0NBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLHNDQUFDLENBQUMsQ0FDaEMsR0FBRyxzQkFBc0IsQ0FBQztRQUMzQixJQUFJLElBQUksR0FBVyxDQUNmLEVBQUUsQ0FBQyxzQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLHNDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsc0NBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQ0FBQyxDQUFDLENBQ2hDLEdBQUcsc0JBQXNCLENBQUM7UUFDM0IsSUFBSSxLQUFLLEdBQVcsR0FBRyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFFdkMsSUFBSSxPQUFPLEdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7VUNoQ0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWIvLi9zcmMvY2FtZXJhLnRzIiwid2VicGFjazovL3dlYi8uL3NyYy9jbGlwcGluZy50cyIsIndlYnBhY2s6Ly93ZWIvLi9zcmMvY29sb3Vycy50cyIsIndlYnBhY2s6Ly93ZWIvLi9zcmMvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vd2ViLy4vc3JjL2xpbmFsZy50cyIsIndlYnBhY2s6Ly93ZWIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly93ZWIvLi9zcmMvbWF0cmljZXMudHMiLCJ3ZWJwYWNrOi8vd2ViLy4vc3JjL21lc2gudHMiLCJ3ZWJwYWNrOi8vd2ViLy4vc3JjL3JlbmRlcmVyLnRzIiwid2VicGFjazovL3dlYi8uL3NyYy90cmlhbmdsZS50cyIsIndlYnBhY2s6Ly93ZWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2ViL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly93ZWIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXllX200ZCwgbXR4NF90LCB2ZWMzX3QsIHZlYzRfdCB9IGZyb20gJy4vbGluYWxnJztcclxuaW1wb3J0IHsgYWRkX3YzZCwgY3Jvc3NfdjNkLCBkb3RfbTRkLCBkb3RfbTRkX3Y0ZCwgdjNkX3RvX3Y0ZCwgdjRkX3RvX3YzZCB9IGZyb20gJy4vbGluYWxnJztcclxuaW1wb3J0IHsgTWF0cmljZXMgfSBmcm9tICcuL21hdHJpY2VzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEge1xyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbjogdmVjM190ID0gWzAsIDAsIDBdO1xyXG4gICAgcHJpdmF0ZSBkaXJlY3Rpb246IHZlYzNfdCA9IFswLCAwLCAxXTtcclxuICAgIHByaXZhdGUgdXA6IHZlYzNfdCA9IFswLCAxLCAwXTtcclxuICAgIHByaXZhdGUgcmlnaHQ6IHZlYzNfdCA9IFsxLCAwLCAwXTtcclxuICAgIHByaXZhdGUgZm9yd2FyZF92ZWxvY2l0eTogdmVjM190ID0gWzAsIDAsIDBdO1xyXG4gICAgcHJpdmF0ZSB5YXc6IG51bWJlciA9IDAuMDtcclxuICAgIHByaXZhdGUgcGl0Y2g6IG51bWJlciA9IDAuMDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0UG9zaXRpb24oKTogdmVjM190IHsgcmV0dXJuIHRoaXMucG9zaXRpb247IH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UG9zaXRpb24ocG9zaXRpb246IHZlYzNfdCkgeyB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGlyZWN0aW9uKCk6IHZlYzNfdCB7IHJldHVybiB0aGlzLmRpcmVjdGlvbjsgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREaXJlY3Rpb24oZGlyZWN0aW9uOiB2ZWMzX3QpIHsgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VXAoKTogdmVjM190IHsgcmV0dXJuIHRoaXMudXA7IH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VXAodXA6IHZlYzNfdCkgeyB0aGlzLnVwID0gdXA7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UmlnaHQoKSB7IHJldHVybiB0aGlzLnJpZ2h0OyB9XHJcblxyXG4gICAgcHVibGljIHNldFJpZ2h0KHJpZ2h0OiB2ZWMzX3QpIHsgdGhpcy5yaWdodCA9IHJpZ2h0OyB9XHJcblxyXG4gICAgcHVibGljIGdldFlhdygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55YXc7IH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WWF3KHlhdzogbnVtYmVyKSB7IHRoaXMueWF3ID0geWF3OyB9XHJcblxyXG4gICAgcHVibGljIGdldFBpdGNoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnBpdGNoOyB9XHJcblxyXG4gICAgcHVibGljIHNldFBpdGNoKHBpdGNoOiBudW1iZXIpIHsgdGhpcy5waXRjaCA9IHBpdGNoOyB9XHJcblxyXG4gICAgcHVibGljIGdldEZvcndhcmRWZWxvY2l0eSgpIHsgcmV0dXJuIHRoaXMuZm9yd2FyZF92ZWxvY2l0eTsgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRGb3J3YXJkVmVsb2NpdHkoZnY6IHZlYzNfdCkgeyB0aGlzLmZvcndhcmRfdmVsb2NpdHkgPSBmdjsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUYXJnZXQoKTogdmVjM190IHtcclxuICAgICAgICBsZXQgdGFyZ2V0OiB2ZWMzX3QgPSBbMCwgMCwgMV07XHJcbiAgICAgICAgbGV0IHlhd19yb3RhdGlvbjogbXR4NF90ID0gTWF0cmljZXMubWFrZV9yb3RhdG9yX3kodGhpcy55YXcpO1xyXG4gICAgICAgIGxldCBwaXRjaF9yb3RhdGlvbjogbXR4NF90ID0gTWF0cmljZXMubWFrZV9yb3RhdG9yX3godGhpcy5waXRjaCk7XHJcbiAgICAgICAgbGV0IGNhbWVyYV9yb3RhdGlvbjogbXR4NF90ID0gZXllX200ZDtcclxuICAgICAgICBjYW1lcmFfcm90YXRpb24gPSBkb3RfbTRkKHBpdGNoX3JvdGF0aW9uLCBjYW1lcmFfcm90YXRpb24pO1xyXG4gICAgICAgIGNhbWVyYV9yb3RhdGlvbiA9IGRvdF9tNGQoeWF3X3JvdGF0aW9uLCBjYW1lcmFfcm90YXRpb24pO1xyXG4gICAgICAgIGxldCBjYW1lcmFfZGlyZWN0aW9uOiB2ZWM0X3QgPSBkb3RfbTRkX3Y0ZChjYW1lcmFfcm90YXRpb24sIHYzZF90b192NGQodGFyZ2V0KSk7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB2NGRfdG9fdjNkKGNhbWVyYV9kaXJlY3Rpb24pO1xyXG4gICAgICAgIHRoaXMucmlnaHQgPSBjcm9zc192M2QodGhpcy5kaXJlY3Rpb24sIHRoaXMudXApO1xyXG4gICAgICAgIHRhcmdldCA9IGFkZF92M2QodGhpcy5wb3NpdGlvbiwgdGhpcy5kaXJlY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZUNhbWVyYVgocGl0Y2hfcmFkaWFuczogbnVtYmVyKSB7IHRoaXMucGl0Y2ggKz0gcGl0Y2hfcmFkaWFuczsgfVxyXG4gICAgcHVibGljIHJvdGF0ZUNhbWVyYVkoeWF3X3JhZGlhbnM6IG51bWJlcikgeyB0aGlzLnlhdyArPSB5YXdfcmFkaWFuczsgfVxyXG59XHJcbiIsImltcG9ydCB7IHRyaWFuZ2xlX3QgfSBmcm9tIFwiLi90cmlhbmdsZVwiO1xyXG5pbXBvcnQgeyBkb3RfdjNkLCBzdWJfdjNkLCB2M2RfdG9fdjRkLCB2ZWMyX3QsIHZlYzNfdCwgdmVjNF90LCBYLCBZLCBaIH0gZnJvbSBcIi4vbGluYWxnXCI7XHJcblxyXG5leHBvcnQgZW51bSBGcnVzdHVtUGxhbmVzIHtcclxuICAgIExFRlRfRlJVU1RVTV9QTEFORSxcclxuICAgIFJJR0hUX0ZSVVNUVU1fUExBTkUsXHJcbiAgICBUT1BfRlJVU1RVTV9QTEFORSxcclxuICAgIEJPVFRPTV9GUlVTVFVNX1BMQU5FLFxyXG4gICAgTkVBUl9GUlVTVFVNX1BMQU5FLFxyXG4gICAgRkFSX0ZSVVNUVU1fUExBTkVcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBwbGFuZV90IHtcclxuICAgIHBvaW50OiB2ZWMzX3Q7XHJcbiAgICBub3JtYWw6IHZlYzNfdDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBwb2x5Z29uX3Qge1xyXG4gICAgdmVydGljZXM6IHZlYzNfdFtdO1xyXG4gICAgbnVtX3ZlcnRpY2VzOiBudW1iZXI7XHJcbiAgICBjb2xvdXI6IHZlYzRfdDtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGlwcGluZyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBNQVhfTlVNX1BPTFlfVkVSVElDRVMgPSAxMFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTUFYX05VTV9QT0xZX1RSSUFOR0xFUyA9IDEwXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBOVU1fUExBTkVTID0gNjtcclxuICAgIHByaXZhdGUgc3RhdGljIGZydXN0dW1fcGxhbmVzOiBwbGFuZV90W10gPSBBcnJheShDbGlwcGluZy5OVU1fUExBTkVTKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsZXJwKGE6IG51bWJlciwgYjogbnVtYmVyLCB0OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IGEgKyB0ICogKGIgLSBhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdEZydXN0dW1QbGFuZXMoZm92eDogbnVtYmVyLCBmb3Z5OiBudW1iZXIsIHpfbmVhcjogbnVtYmVyLCB6X2ZhcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNvc19oYWxmX2Zvdng6IG51bWJlciA9IE1hdGguY29zKGZvdnggLyAyKTtcclxuICAgICAgICBsZXQgc2luX2hhbGZfZm92eDogbnVtYmVyID0gTWF0aC5zaW4oZm92eCAvIDIpO1xyXG4gICAgICAgIGxldCBjb3NfaGFsZl9mb3Z5OiBudW1iZXIgPSBNYXRoLmNvcyhmb3Z5IC8gMik7XHJcbiAgICAgICAgbGV0IHNpbl9oYWxmX2Zvdnk6IG51bWJlciA9IE1hdGguc2luKGZvdnkgLyAyKTtcclxuICAgICAgICBsZXQgb3JpZ2luOiB2ZWMzX3QgPSBbMCwgMCwgMF07XHJcblxyXG4gICAgICAgIENsaXBwaW5nLmZydXN0dW1fcGxhbmVzW0ZydXN0dW1QbGFuZXMuTEVGVF9GUlVTVFVNX1BMQU5FXSA9IHtcclxuICAgICAgICAgICAgJ3BvaW50Jzogb3JpZ2luLFxyXG4gICAgICAgICAgICAnbm9ybWFsJzogW2Nvc19oYWxmX2ZvdngsIDAsIHNpbl9oYWxmX2ZvdnhdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBDbGlwcGluZy5mcnVzdHVtX3BsYW5lc1tGcnVzdHVtUGxhbmVzLlJJR0hUX0ZSVVNUVU1fUExBTkVdID0ge1xyXG4gICAgICAgICAgICAncG9pbnQnOiBvcmlnaW4sXHJcbiAgICAgICAgICAgICdub3JtYWwnOiBbLWNvc19oYWxmX2ZvdngsIDAsIHNpbl9oYWxmX2ZvdnhdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBDbGlwcGluZy5mcnVzdHVtX3BsYW5lc1tGcnVzdHVtUGxhbmVzLlRPUF9GUlVTVFVNX1BMQU5FXSA9IHtcclxuICAgICAgICAgICAgJ3BvaW50Jzogb3JpZ2luLFxyXG4gICAgICAgICAgICAnbm9ybWFsJzogWzAsIC1jb3NfaGFsZl9mb3Z5LCBzaW5faGFsZl9mb3Z5XVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQ2xpcHBpbmcuZnJ1c3R1bV9wbGFuZXNbRnJ1c3R1bVBsYW5lcy5CT1RUT01fRlJVU1RVTV9QTEFORV0gPSB7XHJcbiAgICAgICAgICAgICdwb2ludCc6IG9yaWdpbixcclxuICAgICAgICAgICAgJ25vcm1hbCc6IFswLCBjb3NfaGFsZl9mb3Z5LCBzaW5faGFsZl9mb3Z5XVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQ2xpcHBpbmcuZnJ1c3R1bV9wbGFuZXNbRnJ1c3R1bVBsYW5lcy5ORUFSX0ZSVVNUVU1fUExBTkVdID0ge1xyXG4gICAgICAgICAgICAncG9pbnQnOiBbMCwgMCwgel9uZWFyXSxcclxuICAgICAgICAgICAgJ25vcm1hbCc6IFswLCAwLCAxXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQ2xpcHBpbmcuZnJ1c3R1bV9wbGFuZXNbRnJ1c3R1bVBsYW5lcy5GQVJfRlJVU1RVTV9QTEFORV0gPSB7XHJcbiAgICAgICAgICAgICdwb2ludCc6IFswLCAwLCB6X2Zhcl0sXHJcbiAgICAgICAgICAgICdub3JtYWwnOiBbMCwgMCwgLTFdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUG9seWdvbkZyb21UcmlhbmdsZSh2MDogdmVjM190LCB2MTogdmVjM190LCB2MjogdmVjM190LCBjb2xvdXI6IHZlYzRfdCk6IHBvbHlnb25fdCB7XHJcbiAgICAgICAgbGV0IHBvbHlnb246IHBvbHlnb25fdCA9IHtcclxuICAgICAgICAgICAgJ3ZlcnRpY2VzJzogW3YwLCB2MSwgdjJdLFxyXG4gICAgICAgICAgICAnbnVtX3ZlcnRpY2VzJzogMyxcclxuICAgICAgICAgICAgJ2NvbG91cic6IGNvbG91cixcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBwb2x5Z29uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xpcFBvbHlnb24ocG9seWdvbjogcG9seWdvbl90KTogcG9seWdvbl90IHtcclxuICAgICAgICBwb2x5Z29uID0gQ2xpcHBpbmcuY2xpcFBvbHlnb25BZ2FpbnN0UGxhbmUocG9seWdvbiwgRnJ1c3R1bVBsYW5lcy5MRUZUX0ZSVVNUVU1fUExBTkUpO1xyXG4gICAgICAgIHBvbHlnb24gPSBDbGlwcGluZy5jbGlwUG9seWdvbkFnYWluc3RQbGFuZShwb2x5Z29uLCBGcnVzdHVtUGxhbmVzLlJJR0hUX0ZSVVNUVU1fUExBTkUpO1xyXG4gICAgICAgIHBvbHlnb24gPSBDbGlwcGluZy5jbGlwUG9seWdvbkFnYWluc3RQbGFuZShwb2x5Z29uLCBGcnVzdHVtUGxhbmVzLlRPUF9GUlVTVFVNX1BMQU5FKTtcclxuICAgICAgICBwb2x5Z29uID0gQ2xpcHBpbmcuY2xpcFBvbHlnb25BZ2FpbnN0UGxhbmUocG9seWdvbiwgRnJ1c3R1bVBsYW5lcy5CT1RUT01fRlJVU1RVTV9QTEFORSk7XHJcbiAgICAgICAgcG9seWdvbiA9IENsaXBwaW5nLmNsaXBQb2x5Z29uQWdhaW5zdFBsYW5lKHBvbHlnb24sIEZydXN0dW1QbGFuZXMuTkVBUl9GUlVTVFVNX1BMQU5FKTtcclxuICAgICAgICBwb2x5Z29uID0gQ2xpcHBpbmcuY2xpcFBvbHlnb25BZ2FpbnN0UGxhbmUocG9seWdvbiwgRnJ1c3R1bVBsYW5lcy5GQVJfRlJVU1RVTV9QTEFORSk7XHJcbiAgICAgICAgcmV0dXJuIHBvbHlnb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2xpcFBvbHlnb25BZ2FpbnN0UGxhbmUocG9seWdvbjogcG9seWdvbl90LCBwbGFuZTogRnJ1c3R1bVBsYW5lcyk6IHBvbHlnb25fdCB7XHJcbiAgICAgICAgbGV0IHBvaW50OiB2ZWMzX3QgPSBDbGlwcGluZy5mcnVzdHVtX3BsYW5lc1twbGFuZV0ucG9pbnQ7XHJcbiAgICAgICAgbGV0IG5vcm1hbDogdmVjM190ID0gQ2xpcHBpbmcuZnJ1c3R1bV9wbGFuZXNbcGxhbmVdLm5vcm1hbDtcclxuICAgICAgICBsZXQgaW5zaWRlX3ZlcnRpY2VzOiB2ZWMzX3RbXSA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudF92ZXJ0ZXg6IHZlYzNfdCA9IHBvbHlnb24udmVydGljZXNbcG9seWdvbi52ZXJ0aWNlcy5sZW5ndGhdO1xyXG4gICAgICAgIGxldCBwcmV2aW91c192ZXJ0ZXg6IHZlYzNfdCA9IHBvbHlnb24udmVydGljZXNbcG9seWdvbi52ZXJ0aWNlcy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZlcnRleCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IHByZXZpb3VzX2RvdDogbnVtYmVyID0gZG90X3YzZChzdWJfdjNkKHByZXZpb3VzX3ZlcnRleCwgcG9pbnQpLCBub3JtYWwpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2x5Z29uLm51bV92ZXJ0aWNlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X3ZlcnRleCA9IHBvbHlnb24udmVydGljZXNbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudF9kb3Q6IG51bWJlciA9IGRvdF92M2Qoc3ViX3YzZChjdXJyZW50X3ZlcnRleCwgcG9pbnQpLCBub3JtYWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIHZlcnRleCBwYWlyIGlzIGluc2lkZS1vdXRzaWRlLCBmaW5kIGludGVyc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKChjdXJyZW50X2RvdCAqIHByZXZpb3VzX2RvdCkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHQ6IG51bWJlciA9IHByZXZpb3VzX2RvdCAvIChwcmV2aW91c19kb3QgLSBjdXJyZW50X2RvdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVyc2VjdGlvbl9wb2ludDogdmVjM190ID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDbGlwcGluZy5sZXJwKHByZXZpb3VzX3ZlcnRleFtYXSwgY3VycmVudF92ZXJ0ZXhbWF0sIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDbGlwcGluZy5sZXJwKHByZXZpb3VzX3ZlcnRleFtZXSwgY3VycmVudF92ZXJ0ZXhbWV0sIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDbGlwcGluZy5sZXJwKHByZXZpb3VzX3ZlcnRleFtaXSwgY3VycmVudF92ZXJ0ZXhbWl0sIHQpXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zaWRlX3ZlcnRpY2VzLnB1c2goaW50ZXJzZWN0aW9uX3BvaW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjdXJyZW50IHZlcnRleCBpcyB3aXRoaW4gdGhlIGN1cnJlbnQgZnJ1c3R1bSBwbGFuZVxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRfZG90ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2lkZV92ZXJ0aWNlcy5wdXNoKGN1cnJlbnRfdmVydGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c19kb3QgPSBjdXJyZW50X2RvdDtcclxuICAgICAgICAgICAgICAgIHByZXZpb3VzX3ZlcnRleCA9IGN1cnJlbnRfdmVydGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwb2x5Z29uLnZlcnRpY2VzID0gaW5zaWRlX3ZlcnRpY2VzO1xyXG4gICAgICAgIHBvbHlnb24ubnVtX3ZlcnRpY2VzID0gaW5zaWRlX3ZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gcG9seWdvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyaWFuZ2xlc0Zyb21Qb2x5Z29uKHBvbHlnb246IHBvbHlnb25fdCk6IHRyaWFuZ2xlX3RbXSB7XHJcblxyXG4gICAgICAgIGxldCB0cmlhbmdsZXM6IHRyaWFuZ2xlX3RbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9seWdvbi5udW1fdmVydGljZXMgLSAyOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4MDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgbGV0IGluZGV4MTogbnVtYmVyID0gaSArIDE7XHJcbiAgICAgICAgICAgIGxldCBpbmRleDI6IG51bWJlciA9IGkgKyAyO1xyXG4gICAgICAgICAgICBsZXQgdHJpYW5nbGU6IHRyaWFuZ2xlX3QgPSB7XHJcbiAgICAgICAgICAgICAgICAncG9pbnRzJzogW1xyXG4gICAgICAgICAgICAgICAgICAgIHYzZF90b192NGQocG9seWdvbi52ZXJ0aWNlc1tpbmRleDBdKSxcclxuICAgICAgICAgICAgICAgICAgICB2M2RfdG9fdjRkKHBvbHlnb24udmVydGljZXNbaW5kZXgxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgdjNkX3RvX3Y0ZChwb2x5Z29uLnZlcnRpY2VzW2luZGV4Ml0pXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgJ2NvbG91cic6IHBvbHlnb24uY29sb3VyLFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaCh0cmlhbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cmlhbmdsZXM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdmVjNF90IH0gZnJvbSBcIi4vbGluYWxnXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3VyIHtcclxuICAgIHN0YXRpYyByZWFkb25seSBSRUQ6IHZlYzRfdCA9IFsyNTUsIDAsIDAsIDI1NV07XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgR1JFRU46IHZlYzRfdCA9IFswLCAyNTUsIDAsIDI1NV07XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgQkxVRTogdmVjNF90ID0gWzAsIDAsIDI1NSwgMjU1XTtcclxuICAgIHN0YXRpYyByZWFkb25seSBZRUxMT1c6IHZlYzRfdCA9IFsyNTUsIDI1NSwgMCwgMjU1XTtcclxuICAgIHN0YXRpYyByZWFkb25seSBDWUFOOiB2ZWM0X3QgPSBbMCwgMjU1LCAyNTUsIDI1NV07XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgTUFHRU5UQTogdmVjNF90ID0gWzI1NSwgMCwgMjU1LCAyNTVdO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IFdISVRFOiB2ZWM0X3QgPSBbMjU1LCAyNTUsIDI1NSwgMjU1XTtcclxuICAgIHN0YXRpYyByZWFkb25seSBCTEFDSzogdmVjNF90ID0gWzAsIDAsIDAsIDI1NV07XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgQlJPV046IHZlYzRfdCA9IFsxNjUsNDIsNDIsMjU1XTtcclxufVxyXG4iLCJpbXBvcnQgeyBNYWluIH0gZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBhZGRfdjNkLCBtdWx0X3YzZF9zLCBYLCBZLCBaIH0gZnJvbSBcIi4vbGluYWxnXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXQge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGtleXNEb3duOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5QWxyZWFkeURvd25fMTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5QWxyZWFkeURvd25fMjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5QWxyZWFkeURvd25fMzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5QWxyZWFkeURvd25fYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5QWxyZWFkeURvd25faTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgeWZsaXA6IG51bWJlciA9IC0xO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgSW5wdXQua2V5c0Rvd25bZXZlbnQua2V5XSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgSW5wdXQua2V5c0Rvd25bZXZlbnQua2V5XSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaGFuZGxlTW91c2VFdmVudChldmVudDogTW91c2VFdmVudCwgdHNfZGVsdGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IE1haW4uZ2V0Q2FtZXJhKCk7XHJcbiAgICAgICAgY2FtZXJhLnNldFlhdyhjYW1lcmEuZ2V0WWF3KCkgKyBldmVudC5tb3ZlbWVudFggKiAwLjEgKiB0c19kZWx0YSk7XHJcbiAgICAgICAgY2FtZXJhLnNldFBpdGNoKGNhbWVyYS5nZXRQaXRjaCgpICsgZXZlbnQubW92ZW1lbnRZICogMC4xICogdHNfZGVsdGEgKiBJbnB1dC55ZmxpcCk7XHJcbiAgICAgICAgbGV0IHlfY2xhbXA6IG51bWJlciA9ICg4OSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGlmIChjYW1lcmEuZ2V0UGl0Y2goKSA+IHlfY2xhbXApIGNhbWVyYS5zZXRQaXRjaCh5X2NsYW1wKTtcclxuICAgICAgICBpZiAoY2FtZXJhLmdldFBpdGNoKCkgPCAteV9jbGFtcCkgY2FtZXJhLnNldFBpdGNoKC15X2NsYW1wKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NJbnB1dCh0c19kZWx0YTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gTWFpbi5nZXRDYW1lcmEoKTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIGJhY2tmYWNlIGN1bGxpbmdcclxuICAgICAgICBpZiAoSW5wdXQua2V5c0Rvd25bJ2MnXSAmJiBJbnB1dC5rZXlBbHJlYWR5RG93bl9jID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIFJlbmRlcmVyLmN1bGxfbW9kZSA9ICFSZW5kZXJlci5jdWxsX21vZGU7XHJcbiAgICAgICAgICAgIElucHV0LmtleUFscmVhZHlEb3duX2MgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIUlucHV0LmtleXNEb3duWydjJ10pIHtcclxuICAgICAgICAgICAgSW5wdXQua2V5QWxyZWFkeURvd25fYyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIHJlbmRlciB2ZXJ0aWNlc1xyXG4gICAgICAgIGlmIChJbnB1dC5rZXlzRG93blsnMSddICYmIElucHV0LmtleUFscmVhZHlEb3duXzEgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgUmVuZGVyZXIucmVuZGVyX29wdGlvbnMudmVydGV4ID0gIVJlbmRlcmVyLnJlbmRlcl9vcHRpb25zLnZlcnRleDtcclxuICAgICAgICAgICAgSW5wdXQua2V5QWxyZWFkeURvd25fMSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghSW5wdXQua2V5c0Rvd25bJzEnXSkge1xyXG4gICAgICAgICAgICBJbnB1dC5rZXlBbHJlYWR5RG93bl8xID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0b2dnbGUgcmVuZGVyIHdpcmVmcmFtZVxyXG4gICAgICAgIGlmIChJbnB1dC5rZXlzRG93blsnMiddICYmIElucHV0LmtleUFscmVhZHlEb3duXzIgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgUmVuZGVyZXIucmVuZGVyX29wdGlvbnMud2lyZWZyYW1lID0gIVJlbmRlcmVyLnJlbmRlcl9vcHRpb25zLndpcmVmcmFtZTtcclxuICAgICAgICAgICAgSW5wdXQua2V5QWxyZWFkeURvd25fMiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghSW5wdXQua2V5c0Rvd25bJzInXSkge1xyXG4gICAgICAgICAgICBJbnB1dC5rZXlBbHJlYWR5RG93bl8yID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0b2dnbGUgcmVuZGVyIGZpbGxlZCB0cmlhbmdsZXNcclxuICAgICAgICBpZiAoSW5wdXQua2V5c0Rvd25bJzMnXSAmJiBJbnB1dC5rZXlBbHJlYWR5RG93bl8zID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIFJlbmRlcmVyLnJlbmRlcl9vcHRpb25zLmZpbGxlZCA9ICFSZW5kZXJlci5yZW5kZXJfb3B0aW9ucy5maWxsZWQ7XHJcbiAgICAgICAgICAgIElucHV0LmtleUFscmVhZHlEb3duXzMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIUlucHV0LmtleXNEb3duWyczJ10pIHtcclxuICAgICAgICAgICAgSW5wdXQua2V5QWxyZWFkeURvd25fMyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIHktYXhpcyBmbGlwXHJcbiAgICAgICAgaWYgKElucHV0LmtleXNEb3duWydpJ10gJiYgSW5wdXQua2V5QWxyZWFkeURvd25faSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBJbnB1dC55ZmxpcCA9IC0xICogSW5wdXQueWZsaXA7XHJcbiAgICAgICAgICAgIElucHV0LmtleUFscmVhZHlEb3duX2kgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIUlucHV0LmtleXNEb3duWydpJ10pIHtcclxuICAgICAgICAgICAgSW5wdXQua2V5QWxyZWFkeURvd25faSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gd2FsayBmb3J3YXJkXHJcbiAgICAgICAgaWYgKElucHV0LmtleXNEb3duWyd3J10pIHtcclxuICAgICAgICAgICAgY2FtZXJhLnNldEZvcndhcmRWZWxvY2l0eShtdWx0X3YzZF9zKGNhbWVyYS5nZXREaXJlY3Rpb24oKSwgMS4wICogdHNfZGVsdGEpKTtcclxuICAgICAgICAgICAgY2FtZXJhLnNldFBvc2l0aW9uKGFkZF92M2QoY2FtZXJhLmdldFBvc2l0aW9uKCksIGNhbWVyYS5nZXRGb3J3YXJkVmVsb2NpdHkoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gd2FsayBiYWNrd2FyZFxyXG4gICAgICAgIGlmIChJbnB1dC5rZXlzRG93blsncyddKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYS5zZXRGb3J3YXJkVmVsb2NpdHkobXVsdF92M2RfcyhjYW1lcmEuZ2V0RGlyZWN0aW9uKCksIC0xLjAgKiB0c19kZWx0YSkpO1xyXG4gICAgICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oYWRkX3YzZChjYW1lcmEuZ2V0UG9zaXRpb24oKSwgY2FtZXJhLmdldEZvcndhcmRWZWxvY2l0eSgpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwYW4gdXBcclxuICAgICAgICBpZiAoSW5wdXQua2V5c0Rvd25bJ2UnXSkge1xyXG4gICAgICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oW1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLmdldFBvc2l0aW9uKClbWF0sXHJcbiAgICAgICAgICAgICAgICBjYW1lcmEuZ2V0UG9zaXRpb24oKVtZXSArICgzLjAgKiB0c19kZWx0YSksXHJcbiAgICAgICAgICAgICAgICBjYW1lcmEuZ2V0UG9zaXRpb24oKVtaXVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBhbiBkb3duXHJcbiAgICAgICAgaWYgKElucHV0LmtleXNEb3duWydxJ10pIHtcclxuICAgICAgICAgICAgY2FtZXJhLnNldFBvc2l0aW9uKFtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5nZXRQb3NpdGlvbigpW1hdLFxyXG4gICAgICAgICAgICAgICAgY2FtZXJhLmdldFBvc2l0aW9uKClbWV0gLSAoMy4wICogdHNfZGVsdGEpLFxyXG4gICAgICAgICAgICAgICAgY2FtZXJhLmdldFBvc2l0aW9uKClbWl1cclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzdHJhZmUgbGVmdFxyXG4gICAgICAgIGlmIChJbnB1dC5rZXlzRG93blsnYSddKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYS5zZXRQb3NpdGlvbihcclxuICAgICAgICAgICAgICAgIGFkZF92M2QoY2FtZXJhLmdldFBvc2l0aW9uKCksIG11bHRfdjNkX3MoY2FtZXJhLmdldFJpZ2h0KCksIDMuMCAqIHRzX2RlbHRhKSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHN0cmFmZSByaWdodFxyXG4gICAgICAgIGlmIChJbnB1dC5rZXlzRG93blsnZCddKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYS5zZXRQb3NpdGlvbihcclxuICAgICAgICAgICAgICAgIGFkZF92M2QoY2FtZXJhLmdldFBvc2l0aW9uKCksIG11bHRfdjNkX3MoY2FtZXJhLmdldFJpZ2h0KCksIC0zLjAgKiB0c19kZWx0YSkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCB0eXBlIHZlYzJfdCA9IFtudW1iZXIsIG51bWJlcl07XHJcbmV4cG9ydCB0eXBlIHZlYzNfdCA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgdmVjNF90ID0gW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbmV4cG9ydCB0eXBlIG10eDNfdCA9IFt2ZWMzX3QsIHZlYzNfdCwgdmVjM190XTtcclxuZXhwb3J0IHR5cGUgbXR4NF90ID0gW3ZlYzRfdCwgdmVjNF90LCB2ZWM0X3QsIHZlYzRfdF07XHJcbmV4cG9ydCBjb25zdCBYID0gMCwgWSA9IDEsIFogPSAyLCBXID0gMztcclxuXHJcbmV4cG9ydCBjb25zdCBleWVfbTRkOiBtdHg0X3QgPSBbXHJcbiAgICBbMSwgMCwgMCwgMF0sXHJcbiAgICBbMCwgMSwgMCwgMF0sXHJcbiAgICBbMCwgMCwgMSwgMF0sXHJcbiAgICBbMCwgMCwgMCwgMV1cclxuXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRfdjNkKHYxOiB2ZWMzX3QsIHYyOiB2ZWMzX3QpOiB2ZWMzX3Qge1xyXG4gICAgbGV0IHJlc3VsdDogdmVjM190ID0gWzAsIDAsIDBdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICByZXN1bHRbaV0gKz0gKHYxW2ldICsgdjJbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN1Yl92M2QodjE6IHZlYzNfdCwgdjI6IHZlYzNfdCk6IHZlYzNfdCB7XHJcbiAgICBsZXQgcmVzdWx0OiB2ZWMzX3QgPSBbMCwgMCwgMF07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgIHJlc3VsdFtpXSArPSAodjFbaV0gLSB2MltpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGl2X3YzZF9zKHY6IHZlYzNfdCwgczogbnVtYmVyKTogdmVjM190IHtcclxuICAgIGxldCByZXN1bHQ6IHZlYzNfdCA9IFswLCAwLCAwXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0W2ldICs9ICh2W2ldIC8gcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbXVsdF92M2Rfcyh2OiB2ZWMzX3QsIHM6IG51bWJlcik6IHZlYzNfdCB7XHJcbiAgICBsZXQgcmVzdWx0OiB2ZWMzX3QgPSBbMCwgMCwgMF07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgIHJlc3VsdFtpXSArPSAodltpXSAqIHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRvdF9tNGRfdjRkKE06IG10eDRfdCwgdjogdmVjNF90KTogdmVjNF90IHtcclxuICAgIGxldCByZXN1bHQ6IHZlYzRfdCA9IFswLCAwLCAwLCAwXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA0OyBqKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0W2ldICs9IChNW2ldW2pdICogdltqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRvdF9tNGQoTTE6IG10eDRfdCwgTTI6IG10eDRfdCk6IG10eDRfdCB7XHJcbiAgICBsZXQgcmVzdWx0OiBtdHg0X3QgPSBbXHJcbiAgICAgICAgWzAsIDAsIDAsIDBdLFxyXG4gICAgICAgIFswLCAwLCAwLCAwXSxcclxuICAgICAgICBbMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgWzAsIDAsIDAsIDBdXHJcbiAgICBdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA0OyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IHJvdzogdmVjNF90ID0gTTFbaV07XHJcbiAgICAgICAgICAgIGxldCBjb2w6IHZlYzRfdCA9IFtNMlswXVtqXSwgTTJbMV1bal0sIE0yWzJdW2pdLCBNMlszXVtqXV07XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXVtqXSA9IGRvdF92NGQocm93LCBjb2wpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkb3RfdjNkKHYxOiB2ZWMzX3QsIHYyOiB2ZWMzX3QpOiBudW1iZXIge1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9ICh2MVtpXSAqIHYyW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkb3RfdjRkKHYxOiB2ZWM0X3QsIHYyOiB2ZWM0X3QpOiBudW1iZXIge1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9ICh2MVtpXSAqIHYyW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBub3JtX3YzZCh2OiB2ZWMzX3QpOiBudW1iZXIge1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IHZbaV0gKiogMjtcclxuICAgIH1cclxuICAgIHJlc3VsdCA9IE1hdGguc3FydChyZXN1bHQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyb3NzX3YzZCh2MTogdmVjM190LCB2MjogdmVjM190KTogdmVjM190IHtcclxuICAgIGxldCByZXN1bHQ6IHZlYzNfdCA9IFswLCAwLCAwXTtcclxuICAgIHJlc3VsdFtYXSA9IHYxW1ldICogdjJbWl0gLSB2MVtaXSAqIHYyW1ldO1xyXG4gICAgcmVzdWx0W1ldID0gdjFbWl0gKiB2MltYXSAtIHYxW1hdICogdjJbWl07XHJcbiAgICByZXN1bHRbWl0gPSB2MVtYXSAqIHYyW1ldIC0gdjFbWV0gKiB2MltYXTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2NGRfdG9fdjNkKHY6IHZlYzRfdCk6IHZlYzNfdCB7XHJcbiAgICBsZXQgcmVzdWx0OiB2ZWMzX3QgPSBbdltYXSwgdltZXSwgdltaXV07XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdjNkX3RvX3Y0ZCh2OiB2ZWMzX3QpOiB2ZWM0X3Qge1xyXG4gICAgbGV0IHJlc3VsdDogdmVjNF90ID0gW3ZbWF0sIHZbWV0sIHZbWl0sIDEuMF07XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsImltcG9ydCB7IENhbWVyYSB9IGZyb20gJy4vY2FtZXJhJztcclxuaW1wb3J0IHsgQ2xpcHBpbmcsIHBvbHlnb25fdCB9IGZyb20gJy4vY2xpcHBpbmcnO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4vaW5wdXQnO1xyXG5pbXBvcnQgeyBtdHg0X3QsIHZlYzNfdCwgdmVjNF90LCBYLCBZLCBaLCBleWVfbTRkIH0gZnJvbSAnLi9saW5hbGcnO1xyXG5pbXBvcnQgeyBjcm9zc192M2QsIGRpdl92M2RfcywgZG90X200ZCwgZG90X200ZF92NGQsIGRvdF92M2QsIG5vcm1fdjNkLCBzdWJfdjNkLCB2M2RfdG9fdjRkLCB2NGRfdG9fdjNkIH0gZnJvbSAnLi9saW5hbGcnO1xyXG5pbXBvcnQgeyBNYXRyaWNlcyB9IGZyb20gJy4vbWF0cmljZXMnO1xyXG5pbXBvcnQgeyBDdWJlLCBmYWNlX3QsIEdyb3VuZCwgTWVzaCwgUHJpc20sIFB5cmFtaWQgfSBmcm9tICcuL21lc2gnO1xyXG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xyXG5pbXBvcnQgeyB0cmlhbmdsZV90IH0gZnJvbSAnLi90cmlhbmdsZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpbiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNoZXM6IE1lc2hbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXNwZWN0X3g6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3BlY3RfeTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhdGljIGZvdl94OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZm92X3k6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB6X25lYXI6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB6X2ZhcjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhdGljIHByb2plY3Rpb25fbWF0cml4OiBtdHg0X3QgPSBleWVfbTRkO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdHJpYW5nbGVzOiB0cmlhbmdsZV90W10gPSBbXTtcclxuICAgIC8vIHByaXZhdGUgc3RhdGljIHpfYnVmZmVyOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdHM6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB0c19kZWx0YTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhdGljIHRzX29sZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhdGljIGNhbWVyYTogQ2FtZXJhID0gbmV3IENhbWVyYSgpO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluaXQoKSB7XHJcbiAgICAgICAgTWFpbi5tZXNoZXMucHVzaChuZXcgQ3ViZShbLTMsIDAsIC01XSkpO1xyXG4gICAgICAgIE1haW4ubWVzaGVzLnB1c2gobmV3IFB5cmFtaWQoWzAsIDAsIDBdKSk7XHJcbiAgICAgICAgTWFpbi5tZXNoZXMucHVzaChuZXcgUHJpc20oWy03LCA0LCAtM10pKTtcclxuICAgICAgICBNYWluLm1lc2hlcy5wdXNoKG5ldyBHcm91bmQoWzAsIC0xLCAwXSkpO1xyXG5cclxuICAgICAgICBNYWluLmFzcGVjdF95ID0gUmVuZGVyZXIuY2FudmFzLmhlaWdodCAvIFJlbmRlcmVyLmNhbnZhcy53aWR0aDtcclxuICAgICAgICBNYWluLmFzcGVjdF94ID0gUmVuZGVyZXIuY2FudmFzLndpZHRoIC8gUmVuZGVyZXIuY2FudmFzLmhlaWdodDtcclxuICAgICAgICBNYWluLmZvdl95ID0gOTAgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgTWFpbi5mb3ZfeCA9IDIuMCAqIE1hdGguYXRhbihNYXRoLnRhbihNYWluLmZvdl95IC8gMikgKiAoTWFpbi5hc3BlY3RfeCkpO1xyXG4gICAgICAgIE1haW4uel9uZWFyID0gMC4xO1xyXG4gICAgICAgIE1haW4uel9mYXIgPSAyMC4wO1xyXG4gICAgICAgIE1haW4ucHJvamVjdGlvbl9tYXRyaXggPSBNYXRyaWNlcy5tYWtlX3BlcnNwZWN0aXZlKE1haW4uZm92X3ksIE1haW4uYXNwZWN0X3ksIE1haW4uel9uZWFyLCBNYWluLnpfZmFyKTtcclxuICAgICAgICBNYWluLnRyaWFuZ2xlcyA9IFtdO1xyXG4gICAgICAgIC8vIE1haW4uel9idWZmZXIgPSBbXTtcclxuICAgICAgICBDbGlwcGluZy5pbml0RnJ1c3R1bVBsYW5lcyhNYWluLmZvdl94LCBNYWluLmZvdl95LCBNYWluLnpfbmVhciwgTWFpbi56X2Zhcik7XHJcbiAgICAgICAgTWFpbi5jYW1lcmEuc2V0UG9zaXRpb24oWzAsIDAsIC04XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJvamVjdCh2ZXJ0aWNlczogdmVjNF90W10pOiB2ZWM0X3RbXSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RlZF92ZXJ0aWNlczogdmVjNF90W10gPSBbXTtcclxuICAgICAgICB2ZXJ0aWNlcy5mb3JFYWNoKHZlcnRleCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWRfdmVydGV4OiB2ZWM0X3QgPSBNYXRyaWNlcy5wZXJzcGVjdGl2ZV9kaXZpZGUoTWFpbi5wcm9qZWN0aW9uX21hdHJpeCwgdmVydGV4KTtcclxuICAgICAgICAgICAgLy8gc2NhbGUgdG8gdmlld3BvcnRcclxuICAgICAgICAgICAgcHJvamVjdGVkX3ZlcnRleFtYXSAqPSAoUmVuZGVyZXIuY2FudmFzLndpZHRoIC8gMi4wKTtcclxuICAgICAgICAgICAgcHJvamVjdGVkX3ZlcnRleFtZXSAqPSAoUmVuZGVyZXIuY2FudmFzLmhlaWdodCAvIDIuMCk7XHJcbiAgICAgICAgICAgIC8vIGFjY291bnQgZm9yIDJEIHBpeGVsIGNvb3JkaW5hdGVzIGhhdmluZyBpbnZlcnNlIHktYXhpc1xyXG4gICAgICAgICAgICBwcm9qZWN0ZWRfdmVydGV4W1ldICo9IC0xO1xyXG4gICAgICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICAgICAgcHJvamVjdGVkX3ZlcnRleFtYXSArPSAoUmVuZGVyZXIuY2FudmFzLndpZHRoIC8gMi4wKTtcclxuICAgICAgICAgICAgcHJvamVjdGVkX3ZlcnRleFtZXSArPSAoUmVuZGVyZXIuY2FudmFzLmhlaWdodCAvIDIuMCk7XHJcblxyXG4gICAgICAgICAgICBwcm9qZWN0ZWRfdmVydGljZXMucHVzaChwcm9qZWN0ZWRfdmVydGV4KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvamVjdGVkX3ZlcnRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHNob3VsZEN1bGwodmVydGljZXM6IHZlYzRfdFtdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gY2xvY2t3aXNlIG9yZGVyaW5nLCByZW5kZXJlciBpcyBMSENTXHJcbiAgICAgICAgbGV0IGE6IHZlYzNfdCA9IHY0ZF90b192M2QodmVydGljZXNbMF0pO1xyXG4gICAgICAgIGxldCBiOiB2ZWMzX3QgPSB2NGRfdG9fdjNkKHZlcnRpY2VzWzFdKTtcclxuICAgICAgICBsZXQgYzogdmVjM190ID0gdjRkX3RvX3YzZCh2ZXJ0aWNlc1syXSk7XHJcblxyXG4gICAgICAgIC8vIGdldCBub3JtYWwgdG8gdHJpYW5nbGVcclxuICAgICAgICBsZXQgYWI6IHZlYzNfdCA9IHN1Yl92M2QoYiwgYSk7XHJcbiAgICAgICAgbGV0IGFjOiB2ZWMzX3QgPSBzdWJfdjNkKGMsIGEpO1xyXG4gICAgICAgIGFiID0gZGl2X3YzZF9zKGFiLCBub3JtX3YzZChhYikpO1xyXG4gICAgICAgIGFjID0gZGl2X3YzZF9zKGFjLCBub3JtX3YzZChhYykpO1xyXG4gICAgICAgIGxldCBub3JtYWw6IHZlYzNfdCA9IGNyb3NzX3YzZChhYiwgYWMpO1xyXG4gICAgICAgIG5vcm1hbCA9IGRpdl92M2Rfcyhub3JtYWwsIG5vcm1fdjNkKG5vcm1hbCkpO1xyXG5cclxuICAgICAgICAvLyBjaGVjayBhbGlnbm1lbnQgYmV0d2VlbiBjYW1lcmEtdG8tdmVydGV4IGFuZCBub3JtYWxcclxuICAgICAgICBsZXQgY2FtZXJhX3JheTogdmVjM190ID0gc3ViX3YzZChbMCwgMCwgMF0sIGEpO1xyXG4gICAgICAgIGxldCBkb3Rfbm9ybWFsX2NhbWVyYTogbnVtYmVyID0gZG90X3YzZChub3JtYWwsIGNhbWVyYV9yYXkpO1xyXG4gICAgICAgIGlmIChkb3Rfbm9ybWFsX2NhbWVyYSA8IDApIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHVwZGF0ZSBjYW1lcmFcclxuICAgICAgICBsZXQgY2FtZXJhX3RhcmdldDogdmVjM190ID0gTWFpbi5jYW1lcmEuZ2V0VGFyZ2V0KCk7XHJcbiAgICAgICAgbGV0IHZpZXdfbWF0cml4OiBtdHg0X3QgPSBNYXRyaWNlcy5tYWtlX3ZpZXcoTWFpbi5jYW1lcmEuZ2V0UG9zaXRpb24oKSwgY2FtZXJhX3RhcmdldCwgTWFpbi5jYW1lcmEuZ2V0VXAoKSk7XHJcblxyXG4gICAgICAgIE1haW4ubWVzaGVzLmZvckVhY2gobWVzaCA9PiB7XHJcbiAgICAgICAgICAgIC8vIHByZXBhcmUgdHJhbnNmb3JtIG1hdHJpeCBmcm9tIGFueSB1cGRhdGVkIG1lc2ggcHJvcGVydGllc1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVfbWF0cml4OiBtdHg0X3QgPSBNYXRyaWNlcy5tYWtlX3NjYWxlcihtZXNoLnNjYWxlW1hdLCBtZXNoLnNjYWxlW1ldLCBtZXNoLnNjYWxlW1pdKTtcclxuICAgICAgICAgICAgbGV0IHRyYW5zbGF0aW9uX21hdHJpeDogbXR4NF90ID0gTWF0cmljZXMubWFrZV90cmFuc2xhdG9yKFxyXG4gICAgICAgICAgICAgICAgbWVzaC50cmFuc2xhdGlvbltYXSwgbWVzaC50cmFuc2xhdGlvbltZXSwgbWVzaC50cmFuc2xhdGlvbltaXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBsZXQgcm90YXRpb25fbWF0cml4X3g6IG10eDRfdCA9IE1hdHJpY2VzLm1ha2Vfcm90YXRvcl94KG1lc2gucm90YXRpb25bWF0pO1xyXG4gICAgICAgICAgICBsZXQgcm90YXRpb25fbWF0cml4X3k6IG10eDRfdCA9IE1hdHJpY2VzLm1ha2Vfcm90YXRvcl95KG1lc2gucm90YXRpb25bWV0pO1xyXG4gICAgICAgICAgICBsZXQgcm90YXRpb25fbWF0cml4X3o6IG10eDRfdCA9IE1hdHJpY2VzLm1ha2Vfcm90YXRvcl96KG1lc2gucm90YXRpb25bWl0pO1xyXG4gICAgICAgICAgICBsZXQgd29ybGRfbWF0cml4OiBtdHg0X3QgPSBleWVfbTRkO1xyXG4gICAgICAgICAgICB3b3JsZF9tYXRyaXggPSBkb3RfbTRkKHdvcmxkX21hdHJpeCwgc2NhbGVfbWF0cml4KTtcclxuICAgICAgICAgICAgd29ybGRfbWF0cml4ID0gZG90X200ZChyb3RhdGlvbl9tYXRyaXhfeiwgd29ybGRfbWF0cml4KTtcclxuICAgICAgICAgICAgd29ybGRfbWF0cml4ID0gZG90X200ZChyb3RhdGlvbl9tYXRyaXhfeSwgd29ybGRfbWF0cml4KTtcclxuICAgICAgICAgICAgd29ybGRfbWF0cml4ID0gZG90X200ZChyb3RhdGlvbl9tYXRyaXhfeCwgd29ybGRfbWF0cml4KTtcclxuICAgICAgICAgICAgd29ybGRfbWF0cml4ID0gZG90X200ZCh0cmFuc2xhdGlvbl9tYXRyaXgsIHdvcmxkX21hdHJpeCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2guZmFjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBmYWNlOiBmYWNlX3QgPSBtZXNoLmZhY2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IHYwOiB2ZWM0X3QgPSB2M2RfdG9fdjRkKG1lc2gudmVydGljZXNbZmFjZS52ZXJ0ZXhJbmRpY2VzWzBdXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdjE6IHZlYzRfdCA9IHYzZF90b192NGQobWVzaC52ZXJ0aWNlc1tmYWNlLnZlcnRleEluZGljZXNbMV1dKTtcclxuICAgICAgICAgICAgICAgIGxldCB2MjogdmVjNF90ID0gdjNkX3RvX3Y0ZChtZXNoLnZlcnRpY2VzW2ZhY2UudmVydGV4SW5kaWNlc1syXV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGFwcGx5IHRyYW5zZm9ybXNcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZF92ZXJ0aWNlczogdmVjNF90W10gPSBbdjAsIHYxLCB2Ml07XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZF92ZXJ0aWNlcy5mb3JFYWNoKCh2ZXJ0ZXgsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkX3ZlcnRleDogdmVjNF90ID0gZG90X200ZF92NGQod29ybGRfbWF0cml4LCB2ZXJ0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkX3ZlcnRleCA9IGRvdF9tNGRfdjRkKHZpZXdfbWF0cml4LCB0cmFuc2Zvcm1lZF92ZXJ0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkX3ZlcnRpY2VzW2luZGV4XSA9IHRyYW5zZm9ybWVkX3ZlcnRleDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGN1bGxpbmdcclxuICAgICAgICAgICAgICAgIGlmIChSZW5kZXJlci5jdWxsX21vZGUgPT0gdHJ1ZSAmJiBNYWluLnNob3VsZEN1bGwodHJhbnNmb3JtZWRfdmVydGljZXMpKSB7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2xpcHBpbmdcclxuICAgICAgICAgICAgICAgIGxldCBwb2x5Z29uOiBwb2x5Z29uX3QgPSBDbGlwcGluZy5jcmVhdGVQb2x5Z29uRnJvbVRyaWFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgICAgIHY0ZF90b192M2QodHJhbnNmb3JtZWRfdmVydGljZXNbMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHY0ZF90b192M2QodHJhbnNmb3JtZWRfdmVydGljZXNbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHY0ZF90b192M2QodHJhbnNmb3JtZWRfdmVydGljZXNbMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGZhY2UuY29sb3VyLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwb2x5Z29uID0gQ2xpcHBpbmcuY2xpcFBvbHlnb24ocG9seWdvbik7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xpcHBlZF90cmlhbmdsZXM6IHRyaWFuZ2xlX3RbXSA9IENsaXBwaW5nLnRyaWFuZ2xlc0Zyb21Qb2x5Z29uKHBvbHlnb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHByb2plY3Rpb25cclxuICAgICAgICAgICAgICAgIGNsaXBwZWRfdHJpYW5nbGVzLmZvckVhY2godHJpYW5nbGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0ZWRfdmVydGljZXMgPSBNYWluLnByb2plY3QodHJpYW5nbGUucG9pbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHJpYW5nbGVfdG9fcmVuZGVyOiB0cmlhbmdsZV90ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHByb2plY3RlZF92ZXJ0aWNlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3VyOiBmYWNlLmNvbG91cixcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIE1haW4udHJpYW5nbGVzLnB1c2godHJpYW5nbGVfdG9fcmVuZGVyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVuZGVyKCkge1xyXG4gICAgICAgIFJlbmRlcmVyLmNsZWFyKCk7XHJcbiAgICAgICAgUmVuZGVyZXIuY2xlYXJaQnVmZmVyKCk7XHJcbiAgICAgICAgTWFpbi50cmlhbmdsZXMuZm9yRWFjaCh0cmlhbmdsZSA9PiB7XHJcbiAgICAgICAgICAgIFJlbmRlcmVyLnJlbmRlcih0cmlhbmdsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUmVuZGVyZXIucmVmcmVzaCgpO1xyXG4gICAgICAgIE1haW4udHJpYW5nbGVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFpbmxvb3AodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBNYWluLnRzID0gdGltZXN0YW1wO1xyXG4gICAgICAgIE1haW4udHNfZGVsdGEgPSAoTWFpbi50cyAtIE1haW4udHNfb2xkKSAvIDEwMDA7XHJcbiAgICAgICAgTWFpbi50c19vbGQgPSBNYWluLnRzO1xyXG5cclxuICAgICAgICBJbnB1dC5wcm9jZXNzSW5wdXQoTWFpbi50c19kZWx0YSk7XHJcbiAgICAgICAgTWFpbi51cGRhdGUoKTtcclxuICAgICAgICBNYWluLnJlbmRlcigpO1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoTWFpbi5tYWlubG9vcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXREZWx0YSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYWluLnRzX2RlbHRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2FtZXJhKCk6IENhbWVyYSB7XHJcbiAgICAgICAgcmV0dXJuIE1haW4uY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcnVuKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBJbnB1dC5yZWdpc3RlcktleURvd24pO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgSW5wdXQucmVnaXN0ZXJLZXlVcCk7XHJcbiAgICAgICAgUmVuZGVyZXIuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBSZW5kZXJlci5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT09IFJlbmRlcmVyLmNhbnZhcykge1xyXG4gICAgICAgICAgICAgICAgSW5wdXQuaGFuZGxlTW91c2VFdmVudChldmVudCwgTWFpbi5nZXREZWx0YSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBNYWluLmluaXQoKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoTWFpbi5tYWlubG9vcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1haW4ucnVuKCk7IiwiaW1wb3J0IHsgbXR4NF90LCB2ZWMzX3QsIHN1Yl92M2QsIGRpdl92M2Rfcywgbm9ybV92M2QsIGNyb3NzX3YzZCwgZG90X3YzZCwgdmVjNF90LCBkb3RfbTRkX3Y0ZCB9IGZyb20gJy4vbGluYWxnJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaWNlcyB7XHJcbiAgICBzdGF0aWMgbWFrZV9zY2FsZXIoc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3o6IG51bWJlcik6IG10eDRfdCB7XHJcbiAgICAgICAgLy8gWyBzeCAgMCAgMCAgMCBdXHJcbiAgICAgICAgLy8gWyAgMCAgc3kgMCAgMCBdXHJcbiAgICAgICAgLy8gWyAgMCAgMCAgc3ogMCBdXHJcbiAgICAgICAgLy8gWyAgMCAgMCAgMCAgMSBdXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgW3N4LCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgWzAsIHN5LCAwLCAwXSxcclxuICAgICAgICAgICAgWzAsIDAsIHN6LCAwXSxcclxuICAgICAgICAgICAgWzAsIDAsIDAsIDFdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFrZV90cmFuc2xhdG9yKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIHR6OiBudW1iZXIpOiBtdHg0X3Qge1xyXG4gICAgICAgIC8vIFsgMSAgMCAgMCAgdHggXVxyXG4gICAgICAgIC8vIFsgMCAgMSAgMCAgdHkgXVxyXG4gICAgICAgIC8vIFsgMCAgMCAgMSAgdHogXVxyXG4gICAgICAgIC8vIFsgMCAgMCAgMCAgIDEgXVxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFsxLCAwLCAwLCB0eF0sXHJcbiAgICAgICAgICAgIFswLCAxLCAwLCB0eV0sXHJcbiAgICAgICAgICAgIFswLCAwLCAxLCB0el0sXHJcbiAgICAgICAgICAgIFswLCAwLCAwLCAxXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1ha2Vfcm90YXRvcl94KGFuZ2xlOiBudW1iZXIpOiBtdHg0X3Qge1xyXG4gICAgICAgIC8vIFsgMSAgMCAgMCAgMCBdXHJcbiAgICAgICAgLy8gWyAwICBjIC1zICAwIF1cclxuICAgICAgICAvLyBbIDAgIHMgIGMgIDAgXVxyXG4gICAgICAgIC8vIFsgMCAgMCAgMCAgMSBdXHJcbiAgICAgICAgbGV0IGM6IG51bWJlciA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICBsZXQgczogbnVtYmVyID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFsxLCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgWzAsIGMsIC1zLCAwXSxcclxuICAgICAgICAgICAgWzAsIHMsIGMsIDBdLFxyXG4gICAgICAgICAgICBbMCwgMCwgMCwgMV1cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYWtlX3JvdGF0b3JfeShhbmdsZTogbnVtYmVyKTogbXR4NF90IHtcclxuICAgICAgICAvLyBbIGMgIDAgIHMgIDAgXVxyXG4gICAgICAgIC8vIFsgMCAgMSAgMCAgMCBdXHJcbiAgICAgICAgLy8gWy1zICAwICBjICAwIF1cclxuICAgICAgICAvLyBbIDAgIDAgIDAgIDEgXVxyXG4gICAgICAgIGxldCBjOiBudW1iZXIgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgbGV0IHM6IG51bWJlciA9IE1hdGguc2luKGFuZ2xlKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBbYywgMCwgcywgMF0sXHJcbiAgICAgICAgICAgIFswLCAxLCAwLCAwXSxcclxuICAgICAgICAgICAgWy1zLCAwLCBjLCAwXSxcclxuICAgICAgICAgICAgWzAsIDAsIDAsIDFdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFrZV9yb3RhdG9yX3ooYW5nbGU6IG51bWJlcik6IG10eDRfdCB7XHJcbiAgICAgICAgLy8gWyBjIC1zICAwICAwIF1cclxuICAgICAgICAvLyBbIHMgIGMgIDAgIDAgXVxyXG4gICAgICAgIC8vIFsgMCAgMCAgMSAgMCBdXHJcbiAgICAgICAgLy8gWyAwICAwICAwICAxIF1cclxuICAgICAgICBsZXQgYzogbnVtYmVyID0gTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgIGxldCBzOiBudW1iZXIgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgW2MsIC1zLCAwLCAwXSxcclxuICAgICAgICAgICAgW3MsIGMsIDAsIDBdLFxyXG4gICAgICAgICAgICBbMCwgMCwgMSwgMF0sXHJcbiAgICAgICAgICAgIFswLCAwLCAwLCAxXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1ha2VfcGVyc3BlY3RpdmUoZm92OiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCB6bmVhcjogbnVtYmVyLCB6ZmFyOiBudW1iZXIpOiBtdHg0X3Qge1xyXG4gICAgICAgIC8vIFsoaC93KSgxL3Rhbihmb2MvMikpIDAgICAgICAgICAgICAgICAwICAgICAgICAgIDAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgLy8gWzAgICAgICAgICAgICAgICAgICAgKDEvdGFuKGZvdi8yKSkgIDAgICAgICAgICAgMCAgICAgICAgICAgICAgIF1cclxuICAgICAgICAvLyBbMCAgICAgICAgICAgICAgICAgICAwICAgICAgICAgICAgICAgemYvKHpmLXpuKSAtKHpmKnpuKS8oemYtem4pXVxyXG4gICAgICAgIC8vIFswICAgICAgICAgICAgICAgICAgIDAgICAgICAgICAgICAgICAxICAgICAgICAgIDAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgbGV0IHIwYzAgPSBhc3BlY3QgKiAoMSAvIE1hdGgudGFuKGZvdiAvIDIpKTtcclxuICAgICAgICBsZXQgcjFjMSA9IDEgLyBNYXRoLnRhbihmb3YgLyAyKTtcclxuICAgICAgICBsZXQgcjJjMiA9IHpmYXIgKiAoemZhciAtIHpuZWFyKTtcclxuICAgICAgICBsZXQgcjJjMyA9ICgtemZhciAqIHpuZWFyKSAvICh6ZmFyIC0gem5lYXIpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFtyMGMwLCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgWzAsIHIxYzEsIDAsIDBdLFxyXG4gICAgICAgICAgICBbMCwgMCwgcjJjMiwgcjJjM10sXHJcbiAgICAgICAgICAgIFswLCAwLCAxLjAsIDBdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFrZV92aWV3KGV5ZTogdmVjM190LCB0YXJnZXQ6IHZlYzNfdCwgdXA6IHZlYzNfdCk6IG10eDRfdCB7XHJcbiAgICAgICAgLy8gZ2V0IHgseSx6IGF4ZXMgcmVsYXRpdmUgdG8gY2FtZXJhIHBvc2l0aW9uIGFuZCBkaXJlY3Rpb25cclxuICAgICAgICBsZXQgeiA9IHN1Yl92M2QodGFyZ2V0LCBleWUpO1xyXG4gICAgICAgIGxldCB6X3VuaXQgPSBkaXZfdjNkX3Moeiwgbm9ybV92M2QoeikpO1xyXG4gICAgICAgIGxldCB4ID0gY3Jvc3NfdjNkKHVwLCB6KTtcclxuICAgICAgICBsZXQgeF91bml0ID0gZGl2X3YzZF9zKHgsIG5vcm1fdjNkKHgpKTtcclxuICAgICAgICBsZXQgeSA9IGNyb3NzX3YzZCh6X3VuaXQsIHhfdW5pdCk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgW3hfdW5pdFswXSwgeF91bml0WzFdLCB4X3VuaXRbMl0sIC1kb3RfdjNkKHhfdW5pdCwgZXllKV0sXHJcbiAgICAgICAgICAgIFt5WzBdLCB5WzFdLCB5WzJdLCAtZG90X3YzZCh5LCBleWUpXSxcclxuICAgICAgICAgICAgW3pfdW5pdFswXSwgel91bml0WzFdLCB6X3VuaXRbMl0sIC1kb3RfdjNkKHpfdW5pdCwgZXllKV0sXHJcbiAgICAgICAgICAgIFswLCAwLCAwLCAxXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlX2RpdmlkZShwcm9qZWN0aW9uX21hdHJpeDogbXR4NF90LCB2OiB2ZWM0X3QpOiB2ZWM0X3Qge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IHZlYzRfdCA9IGRvdF9tNGRfdjRkKHByb2plY3Rpb25fbWF0cml4LCB2KTtcclxuICAgICAgICBsZXQgeCA9IDAsIHkgPSAxLCB6ID0gMiwgdyA9IDM7XHJcblxyXG4gICAgICAgIC8vIHBlcmZvcm0gcGVyc3BlY3RpdmUgZGl2aWRlIHdpdGggb3JpZ2luYWwgei12YWx1ZSBub3cgc3RvcmVkIGluIHdcclxuICAgICAgICBpZiAocmVzdWx0W3ddICE9IDAuMCkge1xyXG4gICAgICAgICAgICByZXN1bHRbeF0gLz0gcmVzdWx0W3ddO1xyXG4gICAgICAgICAgICByZXN1bHRbeV0gLz0gcmVzdWx0W3ddO1xyXG4gICAgICAgICAgICByZXN1bHRbel0gLz0gcmVzdWx0W3ddO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvdXIgfSBmcm9tIFwiLi9jb2xvdXJzXCI7XHJcbmltcG9ydCB7IHZlYzNfdCwgdmVjNF90IH0gZnJvbSBcIi4vbGluYWxnXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIGZhY2VfdCB7XHJcbiAgICB2ZXJ0ZXhJbmRpY2VzOiB2ZWMzX3QsXHJcbiAgICBjb2xvdXI6IHZlYzRfdFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lc2gge1xyXG4gICAgdmVydGljZXM6IHZlYzNfdFtdO1xyXG4gICAgZmFjZXM6IGZhY2VfdFtdO1xyXG4gICAgcm90YXRpb246IHZlYzNfdDtcclxuICAgIHNjYWxlOiB2ZWMzX3Q7XHJcbiAgICB0cmFuc2xhdGlvbjogdmVjM190O1xyXG59XHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBDdWJlIGltcGxlbWVudHMgTWVzaCB7XHJcblxyXG4gICAgdmVydGljZXM6IHZlYzNfdFtdID0gW1xyXG4gICAgICAgIFstMS4wLCAtMS4wLCAxLjBdLCAgLy8wXHJcbiAgICAgICAgWzEuMCwgLTEuMCwgMS4wXSwgICAvLzFcclxuICAgICAgICBbLTEuMCwgMS4wLCAxLjBdLCAgIC8vMlxyXG4gICAgICAgIFsxLjAsIDEuMCwgMS4wXSwgICAgLy8zXHJcbiAgICAgICAgWy0xLjAsIDEuMCwgLTEuMF0sICAvLzRcclxuICAgICAgICBbMS4wLCAxLjAsIC0xLjBdLCAgIC8vNVxyXG4gICAgICAgIFstMS4wLCAtMS4wLCAtMS4wXSwgLy82XHJcbiAgICAgICAgWzEuMCwgLTEuMCwgLTEuMF0gICAvLzdcclxuICAgIF1cclxuXHJcbiAgICBmYWNlczogZmFjZV90W10gPSBbXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFswLCAxLCAyXSwgJ2NvbG91cic6IENvbG91ci5SRUQgfSwgICAgIC8vczFcclxuICAgICAgICB7ICd2ZXJ0ZXhJbmRpY2VzJzogWzIsIDEsIDNdLCAnY29sb3VyJzogQ29sb3VyLlJFRCB9LFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMiwgMywgNF0sICdjb2xvdXInOiBDb2xvdXIuR1JFRU4gfSwgICAvL3MyXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFs0LCAzLCA1XSwgJ2NvbG91cic6IENvbG91ci5HUkVFTiB9LFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNCwgNSwgNl0sICdjb2xvdXInOiBDb2xvdXIuQkxVRSB9LCAgICAvL3MzXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFs2LCA1LCA3XSwgJ2NvbG91cic6IENvbG91ci5CTFVFIH0sXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFs2LCA3LCAwXSwgJ2NvbG91cic6IENvbG91ci5ZRUxMT1cgfSwgIC8vczRcclxuICAgICAgICB7ICd2ZXJ0ZXhJbmRpY2VzJzogWzAsIDcsIDFdLCAnY29sb3VyJzogQ29sb3VyLllFTExPVyB9LFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMSwgNywgM10sICdjb2xvdXInOiBDb2xvdXIuTUFHRU5UQSB9LCAvL3M1XHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFszLCA3LCA1XSwgJ2NvbG91cic6IENvbG91ci5NQUdFTlRBIH0sXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFs2LCAwLCA0XSwgJ2NvbG91cic6IENvbG91ci5DWUFOIH0sICAgIC8vczZcclxuICAgICAgICB7ICd2ZXJ0ZXhJbmRpY2VzJzogWzQsIDAsIDJdLCAnY29sb3VyJzogQ29sb3VyLkNZQU4gfSxcclxuICAgIF1cclxuXHJcbiAgICByb3RhdGlvbjogdmVjM190ID0gWzAsIDAsIDBdO1xyXG4gICAgc2NhbGU6IHZlYzNfdCA9IFsxLjAsIDEuMCwgMS4wXTtcclxuICAgIHRyYW5zbGF0aW9uOiB2ZWMzX3QgPSBbMCwgMCwgMF07XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246IHZlYzNfdCkge1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSBwb3NpdGlvbjtcclxuICAgIH1cclxufVxyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5leHBvcnQgY2xhc3MgUHlyYW1pZCBpbXBsZW1lbnRzIE1lc2gge1xyXG5cclxuICAgIHZlcnRpY2VzOiB2ZWMzX3RbXSA9IFtcclxuICAgICAgICBbLTEsIC0xLCAxXSwgICAgLy8gMFxyXG4gICAgICAgIFsxLCAtMSwgMV0sICAgICAvLyAxXHJcbiAgICAgICAgWzAsIDEsIDBdLCAgICAgIC8vIDJcclxuICAgICAgICBbMSwgLTEsIC0xXSwgICAgLy8gM1xyXG4gICAgICAgIFstMSwgLTEsIC0xXSwgICAvLyA0XHJcbiAgICBdXHJcblxyXG4gICAgZmFjZXM6IGZhY2VfdFtdID0gW1xyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMCwgMSwgMl0sICdjb2xvdXInOiBDb2xvdXIuUkVEIH0sICAgICAgIC8vMVxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMSwgMywgMl0sICdjb2xvdXInOiBDb2xvdXIuR1JFRU4gfSwgICAgIC8vMlxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNCwgMCwgMl0sICdjb2xvdXInOiBDb2xvdXIuQkxVRSB9LCAgICAgIC8vM1xyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMywgNCwgMl0sICdjb2xvdXInOiBDb2xvdXIuTUFHRU5UQSB9LCAgIC8vNFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMywgMSwgMF0sICdjb2xvdXInOiBDb2xvdXIuTUFHRU5UQSB9LCAgIC8vNVxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNCwgMywgMF0sICdjb2xvdXInOiBDb2xvdXIuTUFHRU5UQSB9LCAgIC8vNlxyXG4gICAgXVxyXG5cclxuICAgIHJvdGF0aW9uOiB2ZWMzX3QgPSBbMCwgMCwgMF07XHJcbiAgICBzY2FsZTogdmVjM190ID0gWzEuMCwgMS4wLCAxLjBdO1xyXG4gICAgdHJhbnNsYXRpb246IHZlYzNfdCA9IFswLCAwLCAwXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogdmVjM190KSB7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmlzbSBpbXBsZW1lbnRzIE1lc2gge1xyXG5cclxuICAgIHZlcnRpY2VzOiB2ZWMzX3RbXSA9IFtcclxuICAgICAgICBbLTEsIC01LCAxXSxcclxuICAgICAgICBbMSwgLTUsIDFdLFxyXG4gICAgICAgIFstMSwgNSwgMV0sXHJcbiAgICAgICAgWzEsIDUsIDFdLFxyXG4gICAgICAgIFstMSwgNSwgLTFdLFxyXG4gICAgICAgIFsxLCA1LCAtMV0sXHJcbiAgICAgICAgWy0xLCAtNSwgLTFdLFxyXG4gICAgICAgIFsxLCAtNSwgLTFdXHJcbiAgICBdXHJcblxyXG4gICAgZmFjZXM6IGZhY2VfdFtdID0gW1xyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMCwgMSwgMl0sICdjb2xvdXInOiBDb2xvdXIuUkVEIH0sICAgICAvL3MxXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFsyLCAxLCAzXSwgJ2NvbG91cic6IENvbG91ci5SRUQgfSxcclxuICAgICAgICB7ICd2ZXJ0ZXhJbmRpY2VzJzogWzIsIDMsIDRdLCAnY29sb3VyJzogQ29sb3VyLkdSRUVOIH0sICAgLy9zMlxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNCwgMywgNV0sICdjb2xvdXInOiBDb2xvdXIuR1JFRU4gfSxcclxuICAgICAgICB7ICd2ZXJ0ZXhJbmRpY2VzJzogWzQsIDUsIDZdLCAnY29sb3VyJzogQ29sb3VyLkJMVUUgfSwgICAgLy9zM1xyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNiwgNSwgN10sICdjb2xvdXInOiBDb2xvdXIuQkxVRSB9LFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNiwgNywgMF0sICdjb2xvdXInOiBDb2xvdXIuWUVMTE9XIH0sICAvL3M0XHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFswLCA3LCAxXSwgJ2NvbG91cic6IENvbG91ci5ZRUxMT1cgfSxcclxuICAgICAgICB7ICd2ZXJ0ZXhJbmRpY2VzJzogWzEsIDcsIDNdLCAnY29sb3VyJzogQ29sb3VyLk1BR0VOVEEgfSwgLy9zNVxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMywgNywgNV0sICdjb2xvdXInOiBDb2xvdXIuTUFHRU5UQSB9LFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbNiwgMCwgNF0sICdjb2xvdXInOiBDb2xvdXIuQ1lBTiB9LCAgICAvL3M2XHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFs0LCAwLCAyXSwgJ2NvbG91cic6IENvbG91ci5DWUFOIH0sXHJcbiAgICBdXHJcblxyXG4gICAgcm90YXRpb246IHZlYzNfdCA9IFswLCAwLCAwXTtcclxuICAgIHNjYWxlOiB2ZWMzX3QgPSBbMS4wLCAxLjAsIDEuMF07XHJcbiAgICB0cmFuc2xhdGlvbjogdmVjM190ID0gWzAsIDAsIDBdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiB2ZWMzX3QpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uID0gcG9zaXRpb247XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuZXhwb3J0IGNsYXNzIEdyb3VuZCBpbXBsZW1lbnRzIE1lc2gge1xyXG4gICAgdmVydGljZXM6IHZlYzNfdFtdID0gW1xyXG4gICAgICAgIFstMTAsIDAsIC0xMF0sXHJcbiAgICAgICAgWzEwLCAwLCAtMTBdLFxyXG4gICAgICAgIFsxMCwgMCwgMTBdLFxyXG4gICAgICAgIFstMTAsIDAsIDEwXVxyXG4gICAgXTtcclxuXHJcbiAgICBmYWNlczogZmFjZV90W10gPSBbXHJcbiAgICAgICAgeyAndmVydGV4SW5kaWNlcyc6IFsyLCAxLCAwXSwgJ2NvbG91cic6IENvbG91ci5CUk9XTiB9LFxyXG4gICAgICAgIHsgJ3ZlcnRleEluZGljZXMnOiBbMywgMiwgMF0sICdjb2xvdXInOiBDb2xvdXIuQlJPV04gfSxcclxuICAgIF1cclxuXHJcbiAgICByb3RhdGlvbjogdmVjM190ID0gWzAsIDAsIDBdO1xyXG4gICAgc2NhbGU6IHZlYzNfdCA9IFsxLjAsIDEuMCwgMS4wXTtcclxuICAgIHRyYW5zbGF0aW9uOiB2ZWMzX3QgPSBbMCwgMCwgMF07XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246IHZlYzNfdCkge1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSBwb3NpdGlvbjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvdXIgfSBmcm9tICcuL2NvbG91cnMnO1xyXG5pbXBvcnQgeyB2ZWMyX3QsIHZlYzNfdCwgdmVjNF90LCBXLCBYLCBZLCBaIH0gZnJvbSAnLi9saW5hbGcnO1xyXG5pbXBvcnQgeyB0cmlhbmdsZV90LCBUcmlhbmdsZSB9IGZyb20gJy4vdHJpYW5nbGUnO1xyXG5cclxuaW50ZXJmYWNlIFJlbmRlck9wdGlvbnMge1xyXG4gICAgdmVydGV4OiBib29sZWFuLFxyXG4gICAgd2lyZWZyYW1lOiBib29sZWFuLFxyXG4gICAgZmlsbGVkOiBib29sZWFuLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyZXIge1xyXG4gICAgc3RhdGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBzdGF0aWMgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgc3RhdGljIGltYWdlX2RhdGE6IEltYWdlRGF0YTtcclxuICAgIHN0YXRpYyBwaXhlbF9idWZmZXI6IFVpbnQ4Q2xhbXBlZEFycmF5O1xyXG4gICAgc3RhdGljIHJlbmRlcl9vcHRpb25zOiBSZW5kZXJPcHRpb25zO1xyXG4gICAgc3RhdGljIHpfYnVmZmVyOiBudW1iZXJbXTtcclxuICAgIHN0YXRpYyBjdWxsX21vZGU6IGJvb2xlYW47XHJcblxyXG4gICAgc3RhdGljIHtcclxuICAgICAgICBSZW5kZXJlci5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15LWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgIFJlbmRlcmVyLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kID0gJ2JsYWNrJztcclxuICAgICAgICBSZW5kZXJlci5jYW52YXMud2lkdGggPSAzMjA7XHJcbiAgICAgICAgUmVuZGVyZXIuY2FudmFzLmhlaWdodCA9IDIwMDtcclxuICAgICAgICBSZW5kZXJlci5jb250ZXh0ID0gUmVuZGVyZXIuY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xyXG4gICAgICAgIFJlbmRlcmVyLmltYWdlX2RhdGEgPSBSZW5kZXJlci5jb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBSZW5kZXJlci5jYW52YXMud2lkdGgsIFJlbmRlcmVyLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIFJlbmRlcmVyLnBpeGVsX2J1ZmZlciA9IFJlbmRlcmVyLmltYWdlX2RhdGEuZGF0YTtcclxuICAgICAgICBSZW5kZXJlci5yZW5kZXJfb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdmVydGV4OiBmYWxzZSxcclxuICAgICAgICAgICAgd2lyZWZyYW1lOiBmYWxzZSxcclxuICAgICAgICAgICAgZmlsbGVkOiB0cnVlLFxyXG4gICAgICAgIH1cclxuICAgICAgICBSZW5kZXJlci56X2J1ZmZlciA9IEFycmF5KFJlbmRlcmVyLmNhbnZhcy53aWR0aCAqIFJlbmRlcmVyLmNhbnZhcy5oZWlnaHQpLmZpbGwoMSk7XHJcbiAgICAgICAgUmVuZGVyZXIuY3VsbF9tb2RlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2xlYXIoKSB7XHJcbiAgICAgICAgUmVuZGVyZXIucGl4ZWxfYnVmZmVyLmZpbGwoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlZnJlc2goKSB7XHJcbiAgICAgICAgUmVuZGVyZXIuY29udGV4dC5wdXRJbWFnZURhdGEoUmVuZGVyZXIuaW1hZ2VfZGF0YSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRyYXdQaXhlbCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29sb3VyOiB2ZWM0X3QpIHtcclxuICAgICAgICBjb25zdCBSID0gMCwgRyA9IDEsIEIgPSAyLCBBID0gMztcclxuICAgICAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSAoeSAqIFJlbmRlcmVyLmNhbnZhcy53aWR0aCArIHgpICogNDtcclxuICAgICAgICBSZW5kZXJlci5waXhlbF9idWZmZXJbb2Zmc2V0ICsgMF0gPSBjb2xvdXJbUl07XHJcbiAgICAgICAgUmVuZGVyZXIucGl4ZWxfYnVmZmVyW29mZnNldCArIDFdID0gY29sb3VyW0ddO1xyXG4gICAgICAgIFJlbmRlcmVyLnBpeGVsX2J1ZmZlcltvZmZzZXQgKyAyXSA9IGNvbG91cltCXTtcclxuICAgICAgICBSZW5kZXJlci5waXhlbF9idWZmZXJbb2Zmc2V0ICsgM10gPSBjb2xvdXJbQV07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRyYXdWZXJ0ZXgoeDogbnVtYmVyLCB5OiBudW1iZXIsIHM6IG51bWJlciwgY29sb3VyOiB2ZWM0X3QpIHtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSB4OyByb3cgPCAoeCArIHMpOyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gPSB5OyBjb2x1bW4gPCAoeSArIHMpOyBjb2x1bW4rKykge1xyXG4gICAgICAgICAgICAgICAgUmVuZGVyZXIuZHJhd1BpeGVsKHJvdywgY29sdW1uLCBjb2xvdXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEREQSBhbGdvcml0aG0sIHRoaXMgaXNuJ3QgZWZmaWNpZW50XHJcbiAgICBzdGF0aWMgZHJhd0xpbmUoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgY29sb3VyOiB2ZWM0X3QpIHtcclxuICAgICAgICBsZXQgZHggPSAoeDEgLSB4MCk7XHJcbiAgICAgICAgbGV0IGR5ID0gKHkxIC0geTApO1xyXG4gICAgICAgIGxldCBsb25nZXN0X3NpZGVfbGVuZ3RoID0gKE1hdGguYWJzKGR4KSA+PSBNYXRoLmFicyhkeSkpID8gTWF0aC5hYnMoZHgpIDogTWF0aC5hYnMoZHkpO1xyXG4gICAgICAgIGxldCB4X2luYyA9IGR4IC8gbG9uZ2VzdF9zaWRlX2xlbmd0aDtcclxuICAgICAgICBsZXQgeV9pbmMgPSBkeSAvIGxvbmdlc3Rfc2lkZV9sZW5ndGg7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRfeCA9IHgwO1xyXG4gICAgICAgIGxldCBjdXJyZW50X3kgPSB5MDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBNYXRoLnJvdW5kKGxvbmdlc3Rfc2lkZV9sZW5ndGgpOyBpKyspIHtcclxuICAgICAgICAgICAgUmVuZGVyZXIuZHJhd1BpeGVsKE1hdGgucm91bmQoY3VycmVudF94KSwgTWF0aC5yb3VuZChjdXJyZW50X3kpLCBjb2xvdXIpO1xyXG4gICAgICAgICAgICBjdXJyZW50X3ggKz0geF9pbmM7XHJcbiAgICAgICAgICAgIGN1cnJlbnRfeSArPSB5X2luYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRyYXdUcmlhbmdsZSh0cmlhbmdsZTogdHJpYW5nbGVfdCkge1xyXG4gICAgICAgIGxldCB4MDogbnVtYmVyID0gdHJpYW5nbGUucG9pbnRzWzBdW1hdO1xyXG4gICAgICAgIGxldCB5MDogbnVtYmVyID0gdHJpYW5nbGUucG9pbnRzWzBdW1ldO1xyXG4gICAgICAgIGxldCB4MTogbnVtYmVyID0gdHJpYW5nbGUucG9pbnRzWzFdW1hdO1xyXG4gICAgICAgIGxldCB5MTogbnVtYmVyID0gdHJpYW5nbGUucG9pbnRzWzFdW1ldO1xyXG4gICAgICAgIGxldCB4MjogbnVtYmVyID0gdHJpYW5nbGUucG9pbnRzWzJdW1hdO1xyXG4gICAgICAgIGxldCB5MjogbnVtYmVyID0gdHJpYW5nbGUucG9pbnRzWzJdW1ldO1xyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdMaW5lKHgwLCB5MCwgeDEsIHkxLCBDb2xvdXIuQkxBQ0spO1xyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdMaW5lKHgxLCB5MSwgeDIsIHkyLCBDb2xvdXIuQkxBQ0spO1xyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdMaW5lKHgyLCB5MiwgeDAsIHkwLCBDb2xvdXIuQkxBQ0spO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmaWxsVHJpYW5nbGUodHJpYW5nbGU6IHRyaWFuZ2xlX3QpIHtcclxuICAgICAgICBsZXQgeDA6IG51bWJlciA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzBdW1hdKTtcclxuICAgICAgICBsZXQgeTA6IG51bWJlciA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzBdW1ldKTtcclxuICAgICAgICBsZXQgejA6IG51bWJlciA9IHRyaWFuZ2xlLnBvaW50c1swXVtaXTtcclxuICAgICAgICBsZXQgdzA6IG51bWJlciA9IHRyaWFuZ2xlLnBvaW50c1swXVtXXTtcclxuICAgICAgICBsZXQgeDE6IG51bWJlciA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzFdW1hdKTtcclxuICAgICAgICBsZXQgeTE6IG51bWJlciA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzFdW1ldKTtcclxuICAgICAgICBsZXQgejE6IG51bWJlciA9IHRyaWFuZ2xlLnBvaW50c1sxXVtaXTtcclxuICAgICAgICBsZXQgdzE6IG51bWJlciA9IHRyaWFuZ2xlLnBvaW50c1sxXVtXXTtcclxuICAgICAgICBsZXQgeDI6IG51bWJlciA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzJdW1hdKTtcclxuICAgICAgICBsZXQgeTI6IG51bWJlciA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzJdW1ldKTtcclxuICAgICAgICBsZXQgejI6IG51bWJlciA9IHRyaWFuZ2xlLnBvaW50c1syXVtaXTtcclxuICAgICAgICBsZXQgdzI6IG51bWJlciA9IHRyaWFuZ2xlLnBvaW50c1syXVtXXTtcclxuXHJcbiAgICAgICAgLy8gc29ydCB2ZXJ0aWNlcyBieSB5LWF4aXNcclxuICAgICAgICBpZiAoeTAgPiB5MSkge1xyXG4gICAgICAgICAgICBbeDAsIHgxXSA9IFt4MSwgeDBdO1xyXG4gICAgICAgICAgICBbeTAsIHkxXSA9IFt5MSwgeTBdO1xyXG4gICAgICAgICAgICBbejAsIHoxXSA9IFt6MSwgejBdO1xyXG4gICAgICAgICAgICBbdzAsIHcxXSA9IFt3MSwgdzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHkxID4geTIpIHtcclxuICAgICAgICAgICAgW3gxLCB4Ml0gPSBbeDIsIHgxXTtcclxuICAgICAgICAgICAgW3kxLCB5Ml0gPSBbeTIsIHkxXTtcclxuICAgICAgICAgICAgW3oxLCB6Ml0gPSBbejIsIHoxXTtcclxuICAgICAgICAgICAgW3cxLCB3Ml0gPSBbdzIsIHcxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh5MCA+IHkxKSB7XHJcbiAgICAgICAgICAgIFt4MCwgeDFdID0gW3gxLCB4MF07XHJcbiAgICAgICAgICAgIFt5MCwgeTFdID0gW3kxLCB5MF07XHJcbiAgICAgICAgICAgIFt6MCwgejFdID0gW3oxLCB6MF07XHJcbiAgICAgICAgICAgIFt3MCwgdzFdID0gW3cxLCB3MF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjcmVhdGUgdmVjdG9yIHBvaW50c1xyXG4gICAgICAgIGxldCBhOiB2ZWM0X3QgPSBbeDAsIHkwLCB6MCwgdzBdO1xyXG4gICAgICAgIGxldCBiOiB2ZWM0X3QgPSBbeDEsIHkxLCB6MSwgdzFdO1xyXG4gICAgICAgIGxldCBjOiB2ZWM0X3QgPSBbeDIsIHkyLCB6MiwgdzJdO1xyXG5cclxuICAgICAgICAvLyBmaWxsIGZsYXQgYm90dG9tIGhhbGZcclxuICAgICAgICBsZXQgaW52X3Nsb3BlXzEgPSAwLCBpbnZfc2xvcGVfMiA9IDA7XHJcbiAgICAgICAgaWYgKCh5MSAtIHkwKSAhPSAwKSBpbnZfc2xvcGVfMSA9ICh4MSAtIHgwKSAvIE1hdGguYWJzKHkxIC0geTApO1xyXG4gICAgICAgIGlmICgoeTIgLSB5MCkgIT0gMCkgaW52X3Nsb3BlXzIgPSAoeDIgLSB4MCkgLyBNYXRoLmFicyh5MiAtIHkwKTtcclxuICAgICAgICBpZiAoeTEgLSB5MCAhPSAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB5MDsgeSA8PSB5MTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgeF9zdGFydCA9IE1hdGgucm91bmQoeDEgKyAoeSAtIHkxKSAqIGludl9zbG9wZV8xKTtcclxuICAgICAgICAgICAgICAgIGxldCB4X2VuZCA9IE1hdGgucm91bmQoeDAgKyAoeSAtIHkwKSAqIGludl9zbG9wZV8yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgeF9lbmQgaXMgb24gcmlnaHRcclxuICAgICAgICAgICAgICAgIGlmICh4X2VuZCA8IHhfc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBbeF9lbmQsIHhfc3RhcnRdID0gW3hfc3RhcnQsIHhfZW5kXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0geF9zdGFydDsgeCA8IHhfZW5kOyB4KyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IGRlcHRoIGluZm8gZm9yIHBpeGVsXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHA6IHZlYzJfdCA9IFt4LCB5XTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2VpZ2h0czogdmVjM190ID0gVHJpYW5nbGUuZmluZFdlaWdodHMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthW1hdLCBhW1ldXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2JbWF0sIGJbWV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY1tYXSwgY1tZXV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbHBoYTogbnVtYmVyID0gd2VpZ2h0c1tYXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmV0YTogbnVtYmVyID0gd2VpZ2h0c1tZXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZ2FtbWE6IG51bWJlciA9IHdlaWdodHNbWl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVycF9yZWNwX3c6IG51bWJlciA9IDEgLSAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChhbHBoYSAvIGFbV10pICsgKGJldGEgLyBiW1ddKSArIChnYW1tYSAvIGNbV10pXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVkcmF3IHBpeGVsIGlmIHRoaXMgb25lIGlzIGNsb3NlciB0byBjYW1lcmFcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJwX3JlY3BfdyA8IFJlbmRlcmVyLmdldFpCdWZmZXJBdCh4LCB5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZW5kZXJlci5kcmF3UGl4ZWwoeCwgeSwgdHJpYW5nbGUuY29sb3VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVuZGVyZXIuc2V0WkJ1ZmZlckF0KHgsIHksIGludGVycF9yZWNwX3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIGZsYXQgdG9wIChsb3dlciBzcGxpdCBvZiB0cmlhbmdsZSlcclxuICAgICAgICBpbnZfc2xvcGVfMSA9IDA7XHJcbiAgICAgICAgaW52X3Nsb3BlXzIgPSAwO1xyXG4gICAgICAgIGlmICgoeTIgLSB5MSkgIT0gMCkgaW52X3Nsb3BlXzEgPSAoeDIgLSB4MSkgLyBNYXRoLmFicyh5MiAtIHkxKTtcclxuICAgICAgICBpZiAoKHkyIC0geTApICE9IDApIGludl9zbG9wZV8yID0gKHgyIC0geDApIC8gTWF0aC5hYnMoeTIgLSB5MCk7XHJcbiAgICAgICAgaWYgKHkyIC0geTEgIT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHhfc3RhcnQgPSBNYXRoLnJvdW5kKHgxICsgKHkgLSB5MSkgKiBpbnZfc2xvcGVfMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgeF9lbmQgPSBNYXRoLnJvdW5kKHgwICsgKHkgLSB5MCkgKiBpbnZfc2xvcGVfMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoeF9lbmQgPCB4X3N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3hfc3RhcnQsIHhfZW5kXSA9IFt4X2VuZCwgeF9zdGFydF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHhfc3RhcnQ7IHggPCB4X2VuZDsgeCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCBkZXB0aCBpbmZvIGZvciBwaXhlbFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwOiB2ZWMyX3QgPSBbeCwgeV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdlaWdodHM6IHZlYzNfdCA9IFRyaWFuZ2xlLmZpbmRXZWlnaHRzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbYVtYXSwgYVtZXV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtiW1hdLCBiW1ldXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NbWF0sIGNbWV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWxwaGE6IG51bWJlciA9IHdlaWdodHNbWF07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJldGE6IG51bWJlciA9IHdlaWdodHNbWV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGdhbW1hOiBudW1iZXIgPSB3ZWlnaHRzW1pdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJwX3JlY3BfdzogbnVtYmVyID0gMSAtIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGFscGhhIC8gYVtXXSkgKyAoYmV0YSAvIGJbV10pICsgKGdhbW1hIC8gY1tXXSlcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyByZWRyYXcgcGl4ZWwgaWYgdGhpcyBvbmUgaXMgY2xvc2VyIHRvIGNhbWVyYVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnBfcmVjcF93IDwgUmVuZGVyZXIuZ2V0WkJ1ZmZlckF0KHgsIHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlbmRlcmVyLmRyYXdQaXhlbCh4LCB5LCB0cmlhbmdsZS5jb2xvdXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZW5kZXJlci5zZXRaQnVmZmVyQXQoeCwgeSwgaW50ZXJwX3JlY3Bfdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZW5kZXIodHJpYW5nbGU6IHRyaWFuZ2xlX3QpIHtcclxuXHJcbiAgICAgICAgLy8gcGFpbnQgZmlsbGVkIHRyaWFuZ2xlc1xyXG4gICAgICAgIGlmIChSZW5kZXJlci5yZW5kZXJfb3B0aW9ucy5maWxsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBSZW5kZXJlci5maWxsVHJpYW5nbGUodHJpYW5nbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGFpbnQgdmVydGljZXNcclxuICAgICAgICBpZiAoUmVuZGVyZXIucmVuZGVyX29wdGlvbnMudmVydGV4ID09IHRydWUpIHtcclxuICAgICAgICAgICAgbGV0IHggPSBNYXRoLnJvdW5kKHRyaWFuZ2xlLnBvaW50c1swXVtYXSAtIDIpO1xyXG4gICAgICAgICAgICBsZXQgeSA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzBdW1ldIC0gMik7XHJcbiAgICAgICAgICAgIFJlbmRlcmVyLmRyYXdWZXJ0ZXgoeCwgeSwgNCwgQ29sb3VyLkJMQUNLKTtcclxuICAgICAgICAgICAgeCA9IE1hdGgucm91bmQodHJpYW5nbGUucG9pbnRzWzFdW1hdIC0gMik7XHJcbiAgICAgICAgICAgIHkgPSBNYXRoLnJvdW5kKHRyaWFuZ2xlLnBvaW50c1sxXVtZXSAtIDIpO1xyXG4gICAgICAgICAgICBSZW5kZXJlci5kcmF3VmVydGV4KHgsIHksIDQsIENvbG91ci5CTEFDSyk7XHJcbiAgICAgICAgICAgIHggPSBNYXRoLnJvdW5kKHRyaWFuZ2xlLnBvaW50c1syXVtYXSAtIDIpO1xyXG4gICAgICAgICAgICB5ID0gTWF0aC5yb3VuZCh0cmlhbmdsZS5wb2ludHNbMl1bWV0gLSAyKTtcclxuICAgICAgICAgICAgUmVuZGVyZXIuZHJhd1ZlcnRleCh4LCB5LCA0LCBDb2xvdXIuQkxBQ0spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGFpbnQgbGluZXNcclxuICAgICAgICBpZiAoUmVuZGVyZXIucmVuZGVyX29wdGlvbnMud2lyZWZyYW1lID09IHRydWUpIHtcclxuICAgICAgICAgICAgUmVuZGVyZXIuZHJhd1RyaWFuZ2xlKHRyaWFuZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbGVhclpCdWZmZXIoKSB7XHJcbiAgICAgICAgUmVuZGVyZXIuel9idWZmZXIuZmlsbCgxKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0WkJ1ZmZlckF0KHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBSZW5kZXJlci5jYW52YXMud2lkdGggfHwgeSA8IDAgfHwgeSA+PSBSZW5kZXJlci5jYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxLjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZW5kZXJlci56X2J1ZmZlclsoUmVuZGVyZXIuY2FudmFzLndpZHRoICogeSkgKyB4XTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0WkJ1ZmZlckF0KHg6IG51bWJlciwgeTogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gUmVuZGVyZXIuY2FudmFzLndpZHRoIHx8IHkgPCAwIHx8IHkgPj0gUmVuZGVyZXIuY2FudmFzLmhlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFJlbmRlcmVyLnpfYnVmZmVyWyhSZW5kZXJlci5jYW52YXMud2lkdGggKiB5KSArIHhdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IHZlYzJfdCwgdmVjM190LCB2ZWM0X3QsIFgsIFkgfSBmcm9tIFwiLi9saW5hbGdcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgdHJpYW5nbGVfdCB7XHJcbiAgICBwb2ludHM6IHZlYzRfdFtdO1xyXG4gICAgY29sb3VyOiB2ZWM0X3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcblxyXG4gICAgc3RhdGljIGZpbmRXZWlnaHRzKGE6IHZlYzJfdCwgYjogdmVjMl90LCBjOiB2ZWMyX3QsIHA6IHZlYzJfdCk6IHZlYzNfdCB7XHJcblxyXG4gICAgICAgIGxldCBBQzogdmVjMl90ID0gWyhjWzBdIC0gYVswXSksIChjWzFdIC0gYVsxXSldO1xyXG4gICAgICAgIGxldCBBQjogdmVjMl90ID0gWyhiWzBdIC0gYVswXSksIChiWzFdIC0gYVsxXSldO1xyXG4gICAgICAgIGxldCBQQzogdmVjMl90ID0gWyhjWzBdIC0gcFswXSksIChjWzFdIC0gcFsxXSldO1xyXG4gICAgICAgIGxldCBQQjogdmVjMl90ID0gWyhiWzBdIC0gcFswXSksIChiWzFdIC0gcFsxXSldO1xyXG4gICAgICAgIGxldCBBUDogdmVjMl90ID0gWyhwWzBdIC0gYVswXSksIChwWzFdIC0gYVsxXSldO1xyXG5cclxuICAgICAgICAvLyB8fEFDeEFCfHxcclxuICAgICAgICBsZXQgYXJlYV9wYXJhbGxlbG9ncmFtX2FiYzogbnVtYmVyID0gKFxyXG4gICAgICAgICAgICBBQ1tYXSAqIEFCW1ldIC0gQUNbWV0gKiBBQltYXVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgbGV0IGFscGhhOiBudW1iZXIgPSAoXHJcbiAgICAgICAgICAgIFBDW1hdICogUEJbWV0gLSBQQ1tZXSAqIFBCW1hdXHJcbiAgICAgICAgKSAvIGFyZWFfcGFyYWxsZWxvZ3JhbV9hYmM7XHJcbiAgICAgICAgbGV0IGJldGE6IG51bWJlciA9IChcclxuICAgICAgICAgICAgQUNbWF0gKiBBUFtZXSAtIEFDW1ldICogQVBbWF1cclxuICAgICAgICApIC8gYXJlYV9wYXJhbGxlbG9ncmFtX2FiYztcclxuICAgICAgICBsZXQgZ2FtbWE6IG51bWJlciA9IDEuMCAtIGFscGhhIC0gYmV0YTtcclxuXHJcbiAgICAgICAgbGV0IHdlaWdodHM6IHZlYzNfdCA9IFthbHBoYSwgYmV0YSwgZ2FtbWFdO1xyXG4gICAgICAgIHJldHVybiB3ZWlnaHRzO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==