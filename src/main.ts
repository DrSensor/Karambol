import canvas, { game as init, sandboxLevel } from './game'
import menu, { MainMenu } from './menu'

import { Style } from './utils'

console.log(globalThis.platform) // undefined

const game = init(sandboxLevel)

MainMenu({
    onstart({ view }) {
        Style.swap(canvas, menu, 'zIndex')
        game.start({ fullscreen: false, cursor: true })
        console.log(globalThis.platform) // number
        console.log(view)
    }
})
