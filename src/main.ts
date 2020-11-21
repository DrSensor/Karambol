import { Game, Level } from './game'
import { Menu } from './menu'
import { HUD } from './hud'

const game = Game({
    fullscreen: false,
    cursor: true,

    onstart: () => console.debug('game start'),
    onresume: () => console.debug('game resume'),
    onpause: () => console.debug('game pause'),
    onstop: () => console.debug('game stop'),
})

let display: ReturnType<typeof HUD>

Menu({
    hotkey: {
        pause: ['Escape', 'Enter']
    },

    onstart() {
        // TODO: use Topic to update hud display inside game.system
        display = HUD()
        display.score = 100
        Level.sandbox(game).start()
    },

    onresume: () => game.start(),
    onpause: () => game.pause(),

    onexit() {
        display.destroy()
        game.stop()
    },
})
