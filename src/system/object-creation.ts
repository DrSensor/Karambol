import { Mesh, MeshBuilder } from '@babylonjs/core'
import { System } from '../engine'

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
