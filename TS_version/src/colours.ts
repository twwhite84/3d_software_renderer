import { vec4_t } from "./vector";

export class Colour {
    static readonly RED: vec4_t = [255, 0, 0, 255];
    static readonly GREEN: vec4_t = [0, 255, 0, 255];
    static readonly BLUE: vec4_t = [0, 0, 255, 255];
    static readonly YELLOW: vec4_t = [255, 255, 0, 255];
    static readonly CYAN: vec4_t = [0, 255, 255, 255];
    static readonly MAGENTA: vec4_t = [255, 0, 255, 255];
    static readonly WHITE: vec4_t = [255, 255, 255, 255];
    static readonly BLACK: vec4_t = [0, 0, 0, 255];
}