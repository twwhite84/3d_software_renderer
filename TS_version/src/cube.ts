import { Colour } from "./colours";
import { vec3_t, vec4_t } from "./vector";

export interface face_t {
    vertexIndices: vec3_t,
    colour: vec4_t
}

export class Cube {

    vertices: vec3_t[] = [
        [-1.0, -1.0, 1.0],  //0
        [1.0, -1.0, 1.0],   //1
        [-1.0, 1.0, 1.0],   //2
        [1.0, 1.0, 1.0],    //3
        [-1.0, 1.0, -1.0],  //4
        [1.0, 1.0, -1.0],   //5
        [-1.0, -1.0, -1.0], //6
        [1.0, -1.0, -1.0]   //7
    ]

    faces: face_t[] = [
        { 'vertexIndices': [0, 1, 2], 'colour': Colour.RED },     //s1
        { 'vertexIndices': [2, 1, 3], 'colour': Colour.RED },
        { 'vertexIndices': [2, 3, 4], 'colour': Colour.GREEN },   //s2
        { 'vertexIndices': [4, 3, 5], 'colour': Colour.GREEN },
        { 'vertexIndices': [4, 5, 6], 'colour': Colour.BLUE },    //s3
        { 'vertexIndices': [6, 5, 7], 'colour': Colour.BLUE },
        { 'vertexIndices': [6, 7, 0], 'colour': Colour.YELLOW },  //s4
        { 'vertexIndices': [0, 7, 1], 'colour': Colour.YELLOW },
        { 'vertexIndices': [1, 7, 3], 'colour': Colour.MAGENTA }, //s5
        { 'vertexIndices': [3, 7, 5], 'colour': Colour.MAGENTA },
        { 'vertexIndices': [6, 0, 4], 'colour': Colour.CYAN },    //s6
        { 'vertexIndices': [4, 0, 2], 'colour': Colour.CYAN },
    ]

    rotation: vec3_t = [0, 0, 0];
    scale: vec3_t = [1.0, 1.0, 1.0];
    translation: vec3_t = [0, 0, 0];

    constructor(position: vec3_t) {
        this.translation = position;
    }
}



