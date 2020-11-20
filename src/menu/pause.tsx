import type { Component } from './utils'
import { o, h } from 'sinuous'

import { render, lifecycle, _ } from './utils'

interface EventListener {
    onexit(menu: ReturnType<typeof lifecycle>): void
    onresume(menu: ReturnType<typeof lifecycle>): void
}

export default ({ onexit, onresume }: EventListener) => {
    const menu = () => lifecycle(<_>{Menu()}</_>)
        , destroy = (listener: Values<EventListener>) => {
            listener(menu()); Menu(_)
        }
        , resume = () => destroy(onresume)
        , exit = () => destroy(onexit)


    const Menu = o<Component>(_)
        , Pause = () => <>
            <button onClick={resume}>Resume</button>
            <button onClick={exit}>Exit</button>
        </>
        , View = () => { Menu(Pause); return <>{Menu}</> }


    return render(View())
}
