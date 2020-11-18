import { o, hs as h } from 'sinuous'
import { proxyWithObservable as proxy } from './utils'
import Score from './score'

const HeadsUpDisplay = () => {
    const score = o(0)

    hud.append(h([
        <Score value={score} x={90} y={90} scale={1.5} />
    ]))

    return proxy({ score })
}, hud = document.getElementById('hud') as
    Element as SVGElement

export {
    hud as default, HeadsUpDisplay,
    HeadsUpDisplay as HUD
}
