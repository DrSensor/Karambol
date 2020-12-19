import type { InstancedMesh, Mesh, Vector3 } from '@babylonjs/core'
import type { Default } from '@declarative-babylonjs/ecs'

import { Random } from '~/src/utils'
import { string, number, range } from '../common-types'
import { query, attached, changed } from '@javelin/ecs'
import { createComponentType } from '../utils'
import { CylinderBuilder as MeshBuilder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder'

export const Coin = createComponentType({
    name: "coin",
    type: Random.crypto(Uint8Array),
    schema: {
        diameter: number, // diameter have effect on thickness
        thickness: range(0, 1),
        weight: number, // in gram
    }
})

export const Player = createComponentType({
    name: "input",
    type: Random.crypto(Uint8Array),
    schema: {
        name: string,
    }
})

interface C {
    start(): void, pause: () => void
    fullscreen: true, cursor: true
}

export const Input = createComponentType({
    name: "input",
    type: Random.crypto(Uint8Array),
    schema: {
        flick: number,
    }
})

const playerInputed = query(Player, changed(Input))

interface Striker { max: number }
export const striker = (props?: Striker, mesh: Mesh = undefined!): Default.System => function system(
    world, { state, scene: { main } }
) {
    switch (state) {
        case 'start':
            mesh ??= MeshBuilder.CreateCylinder('coin_striker', {}, main)
            break
        case 'playing':
            for (const [, [player, input]] of playerInputed(world)) {
                input.flick = 10
            }
        case 'stop':
            mesh.dispose()
            world.removeSystem(system); break
    }
}

interface Pawns { }
export const pawns = (props?: Pawns, ...meshes: Mesh[]): Default.System => function system(
    world, { state, scene: { main } }
) {
    switch (state) {
        case 'stop':
            world.removeSystem(system); break
        case 'start':
            break
    }
}
