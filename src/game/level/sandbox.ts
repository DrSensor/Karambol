import type { Level } from '../engine'
import { Obstacle } from '../system'

export default {
    systems: [Obstacle.createBox]
} as Level
