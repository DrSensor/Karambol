import { o, hs as h } from 'sinuous'
import { proxyWithObservable as proxy, lifecycle } from './utils'
import Score from './score'

const root = document.getElementById('hud') as Element as SVGElement

const HeadsUpDisplay = () => {
    const score = o(0)

    root.append(<>
        <Score value={score} x={90} y={90} scale={1.5} />
    </>)

    return Object.create(proxy({ score }), lifecycle)
}

export {
    root as default, HeadsUpDisplay,
    HeadsUpDisplay as HUD
}
