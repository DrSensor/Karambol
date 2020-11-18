import canvas, { game as init, Level } from './game'
import menu, { MainMenu } from './menu'
import hud, { HUD } from './hud'

import { Style } from './utils'

console.log(globalThis.platform) // undefined

const game = init()

MainMenu({
    onstart({ view }) {
        // const {score} = HUD().observable
        // score(100)
        const display = HUD()
        display.score = 100

        Style.swap('zIndex', menu, canvas, hud)
        Level.sandbox(game).start({ fullscreen: false, cursor: true })
        console.log(globalThis.platform) // number
        console.log(view)
    }
})
