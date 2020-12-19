import has from "~/game.config"

import { Game, Level } from './game'
import { Menu } from './menu'
import { HUD } from './hud'

const startLevel = Level[has.startLevel]

const game = Game({
    fullscreen: false,
    cursor: true,

    onstart: () => console.debug('game start'),
    onresume: () => console.debug('game resume'),
    onpause: () => console.debug('game pause'),
    onstop: () => console.debug('game stop'),
})

let display: ReturnType<typeof HUD> = (has.menu || has.hud && HUD()) as any

if (has.menu) Menu({

    hotkey: {
        pause: ['Escape', 'Enter']
    },

    onstart() {
        // TODO: use Topic to update hud display inside game.system
        display = has.hud && HUD()
        display.score = 100
        startLevel(game).start()
    },

    onresume: () => game.start(),
    onpause: () => game.pause(),

    onexit() {
        display.destroy()
        game.stop()
    },
})

else startLevel(game).start()
