import canvas, { game as init, Level } from './game'
import menu, { MainMenu } from './menu'

import { Style } from './utils'

console.log(globalThis.platform) // undefined

const game = init()

MainMenu({
    onstart({ view }) {
        Style.swap(canvas, menu, 'zIndex')
        Level.sandbox(game).start({ fullscreen: false, cursor: true })
        console.log(globalThis.platform) // number
        console.log(view)
    }
})
