import { Engine } from '@babylonjs/core/Engines/engine'
import World from '@declarative-babylonjs/ecs'
import canvas from './index'

export default (options: Parameters<typeof World>[1]) =>
    World(Engine, { canvas, ...options })
