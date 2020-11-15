import type { Mesh } from '@babylonjs/core'
import type { System } from '../engine'

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'

export namespace Obstacle {
    export const meshes: Mesh[] = []

    export const createBox: System = (world, {
        state, scene: { main }
    }) => {
        switch (state) {
            case 'stop':
                world.removeSystem(createBox)
                while (meshes.length > 0) meshes.pop().dispose()
                break
            case 'start':
                meshes.push(MeshBuilder.CreateBox('box', {}, main))
                break
        }
    }
}
