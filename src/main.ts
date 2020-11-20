import canvas, { game as init, Level } from './game'
import menu, { MainMenu, PauseMenu } from './menu'
import hud, { HUD } from './hud'

import { Style } from './utils'

// globalThis.platform must be accessed on func/callback/listener
// console.log(globalThis.platform) // undefined

// TODO(user inactive): use requestIdleCallback to hide PauseMenu while dim the screen
// TODO(user active): diplay PauseMenu in menu.onhover
// TODO: replace requestIdleCallback with IdleDetector when landed
// https://www.chromestatus.com/feature/4590256452009984
let pause: ReturnType<typeof PauseMenu>
const zIndexReset = () => Style.reset('zIndex', menu, canvas, hud)
    , zIndexSwap = () => Style.swap('zIndex', menu, canvas, hud)
    , game = init({
        fullscreen: true, cursor: true,
        onstart: zIndexSwap,
        onresume() { pause.destroy(); zIndexSwap() },
        onpause() { pause = gmenu.pause() },
        onstop() { gmenu.main() }
    })
    , gmenu = {
        pause: () => {
            zIndexReset()
            return PauseMenu({
                onresume() { game.start() },
                onexit() { game.stop() }
            })
        },
        main: () => {
            zIndexReset()
            document.removeEventListener('keydown', handleKey.pause)
            return MainMenu({
                onstart({ view }) {
                    // const {score} = HUD().observable
                    // score(100)
                    const display = HUD()
                    display.score = 100

                    Level.sandbox(game).start()
                    document.addEventListener('keydown', handleKey.pause)
                }
            })
        }
    }
    , handleKey = {
        pause(this: { pause: ReturnType<typeof PauseMenu> },
            { key }: KeyboardEvent) {
            if (!['Enter', 'Escape'].includes(key)) return
            switch (game.state) {
                case 'playing': return game.pause({ fullscreen: true })
                case 'pause': return game.start()
            }
        }
    }

gmenu.main()
