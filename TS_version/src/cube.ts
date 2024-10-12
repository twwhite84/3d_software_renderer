import * as vector from './vector';

export class Cube {
    static readonly vertices: vector.vec3_t[] = [
        [-1.0, -1.0, 1.0],  //0
        [1.0, -1.0, 1.0],   //1
        [-1.0, 1.0, 1.0],   //2
        [1.0, 1.0, 1.0],    //3
        [-1.0, 1.0, -1.0],  //4
        [1.0, 1.0, -1.0],   //5
        [-1.0, -1.0, -1.0], //6
        [1.0, -1.0, -1.0]   //7
    ]

    static readonly faces: vector.vec3_t[] = [
        [0, 1, 2], [2, 1, 3], //s1
        [2, 3, 4], [4, 3, 5], //s2
        [4, 5, 6], [6, 5, 7], //s3
        [6, 7, 0], [0, 7, 1], //s4
        [1, 7, 3], [3, 7, 5], //s5
        [6, 0, 4], [4, 0, 2]  //s6
    ]

    static rotation: vector.vec3_t = [0, 0, 0]; 
    static scale: vector.vec3_t = [1.0, 1.0, 1.0];
    static translation: vector.vec3_t = [0, 0, 0];
}



