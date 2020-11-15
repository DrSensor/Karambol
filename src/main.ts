import init, { canvas } from './engine'
import { Obstacle } from './system'
import { MainMenu, menu } from './menu'

import { Style } from './utils'

console.log(globalThis.platform) // undefined

const game = init({
    systems: [Obstacle.createBox]
})

MainMenu({
    onstart({ view }) {
        Style.swap(canvas, menu, 'zIndex')
        game.start({ fullscreen: false, cursor: true })
        console.log(globalThis.platform) // number
        console.log(view)
    }
})
