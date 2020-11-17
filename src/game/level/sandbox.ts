import type { Level } from '../engine'
import { Obstacle } from '../system'

export default {
    systems: [
        Obstacle.randomCube({
            count: 100, size: 15,
            scale: [.5, 3],
            position: {
                x: [-100, 100],
                z: [-200, 500],
                y: [0, 0], // TODO: accept shorthand for [n,n] as single n value
            },
            // TODO: parameter to align object surface
            // along specific axis with specific offset
            // so that it doesn't appear floating
            // (using mesh.anchor maybe 🤔)
        })
    ]
} as Level
