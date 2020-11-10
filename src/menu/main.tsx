import { o, h } from 'sinuous'

import { render, lifecycle, /* dynamic */ } from './.utils'
import type { Component } from './.utils'

// import { styled, css } from 'goober'

interface EventListener {
    onstart(menu: ReturnType<typeof lifecycle> & {/* reserved for propsState */ }): void
}

export default ({ onstart }: Partial<EventListener> = {}) => {
    const menu = o(null), View = h([() => menu()])

    const // event handler
        transition = (comp: Component) => () => menu(comp),

        start = () => {
            menu(null)
            screen.orientation.lock('portrait-primary')
            onstart({ ...lifecycle(View)/* , reserved for propsState */ })
        }

    const // component
        Main = () => h([
            <button onClick={start}>Start</button>,
            <button onClick={transition(Credits)}>Credits</button>,
        ]),

        Credits = () => h([
            <button onClick={transition(Main)}>Back</button>,
            <p>Credits:</p>,
        ]),

        Menu = () => { menu(Main); return View }

    // TODO: use this JSX when https://github.com/luwes/sinuous/issues/147 resolved
    // return render(<Menu />)
    return render(Menu())
}
