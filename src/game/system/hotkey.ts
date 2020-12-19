import type { Default } from '@declarative-babylonjs/ecs'

interface Hotkey {

}

export const hotkey = (props: Hotkey): Default.System => function system(
    world, { state, scene: { main } }
) {
    switch (state) {
        case 'stop':
            world.removeSystem(system); break
        case 'start':
            break
    }
}
