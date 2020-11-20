import type { Component } from './utils'
import { o, h } from 'sinuous'

import { render, lifecycle } from './utils'

interface EventListener {
    onexit(menu: ReturnType<typeof lifecycle>): void
    onresume(menu: ReturnType<typeof lifecycle>): void
}

export default ({ onexit, onresume }: EventListener) => {
    const menu = () => lifecycle(h(null, null, Menu()))
        , destroy = (listener: Values<EventListener>) => {
            listener(menu()); Menu(null)
        }
        , resume = () => destroy(onresume)
        , exit = () => destroy(onexit)


    const Menu = o<Component>(null)
        , Pause = () => h([
            <button onClick={resume}>Resume</button>,
            <button onClick={exit}>Exit</button>,
        ])
        , View = () => { Menu(Pause); return h([Menu]) }


    return render(View())
}
