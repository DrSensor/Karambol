import type { Default, default as game } from '@declarative-babylonjs/ecs'
import { Coin } from '../system'

const sandbox: Default.Level = {
    systems: [
        Coin.striker({
            max: 1
        })
    ]
}

export default (world: ReturnType<typeof game>) => {
    for (const system of sandbox.systems!) world.addSystem(system)
    return world
}
