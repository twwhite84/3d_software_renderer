import { vec4_t } from "./linalg";

export const Colour = {
    RED: [255, 0, 0, 255] as vec4_t,
    GREEN: [0, 255, 0, 255] as vec4_t,
    BLUE: [0, 0, 255, 255] as vec4_t,
    YELLOW: [255, 255, 0, 255] as vec4_t,
    CYAN: [0, 255, 255, 255] as vec4_t,
    MAGENTA: [255, 0, 255, 255] as vec4_t,
    WHITE: [255, 255, 255, 255] as vec4_t,
    BLACK: [0, 0, 0, 255] as vec4_t,
    BROWN: [165, 42, 42, 255] as vec4_t,
} as const;