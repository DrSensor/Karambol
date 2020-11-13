import init, { canvas } from './engine'
import { MainMenu, menu } from './menu'

import { MeshBuilder } from '@babylonjs/core'
import { Style } from './utils'

console.log(globalThis.platform) // undefined

const game = init({
    onstart({ scene }) {
        MeshBuilder.CreateBox('box', {},
            // scene.main // optional
        )
    },
})

MainMenu({
    onstart({ view }) {
        // swapStyle([canvas, 'zIndex'], [menu, 'zIndex'])
        Style.swap(canvas, menu, 'zIndex')
        game.start({ fullscreen: false, cursor: true })
        console.log(globalThis.platform) // number
        console.log(view)
    }
})
