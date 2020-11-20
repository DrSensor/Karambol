import type { InstancedMesh, Mesh, Vector3 } from '@babylonjs/core'
import type { System as S } from '../engine'

import { Random } from '../utils'
import { BoxBuilder as MeshBuilder } from '@babylonjs/core/Meshes/Builders/boxBuilder'

export namespace Obstacle {
    export const meshes: (Mesh | InstancedMesh)[] = []

    interface EventHandler {
        onorigin?(mesh: Mesh): void
        oninstance?(mesh: InstancedMesh): void
    }
    type RandomMeshes = EventHandler & {
        count?: number,
        position?: Vec3<Rangeof<number>> | (Rangeof<number | Vector3>)
    }
    type RandomCubes = RandomMeshes & { size?: number, scale?: Rangeof<number> }

    export const randomCube = (props: RandomCubes): S => function system(
        world, { state, scene: { main } }) {
        const { onorigin, oninstance
            , count = 1, size
            , position = [0, 0]
            , scale = [1, 1]
        } = props
        switch (state) {
            case 'stop':
                while (meshes.length > 0) meshes.pop().dispose()
                world.removeSystem(system); break
            case 'start':
                const origin = MeshBuilder.CreateBox('box', { size }, main)
                onorigin?.(origin); meshes.push(origin)

                for (const i of Array(count - 1)) {
                    const instance = Object.assign(origin.createInstance('box'), {
                        position: Random.vector3(position),
                        scaling: Random.uniform.vector3(scale),
                    } as InstancedMesh)
                    oninstance?.(instance); meshes.push(instance)
                }; break
        }
    }
}
