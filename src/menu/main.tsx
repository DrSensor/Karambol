import type { Component } from './utils'
import { o, h } from 'sinuous'

import { render, lifecycle, /* dynamic */ } from './utils'
import { Platform } from '../feature-detection'

// import { styled, css } from 'goober'

interface EventListener {
    onstart(menu: ReturnType<typeof lifecycle> & {/* reserved for propsState */ }): void
}

export default ({ onstart }: Partial<EventListener> = {}) => {
    const // event handler
        transition = (comp: Component) => () => Menu(comp),

        start = () => {
            if (platform != Platform.Desktop) screen.orientation.lock('portrait-primary')
            onstart({ // TODO(sinuous): make PR for h(tag: () => DocumentFragment, ...)
                ...lifecycle(h(null, null, Menu()))
                /* , reserved for propsState */
            })
            Menu(null)
        }

    const // component
        Menu = o<Component>(null),

        Main = () => h([
            <button onClick={start}>Start</button>,
            <button onClick={transition(Credits)}>Credits</button>,
        ]),

        Credits = () => h([
            <button onClick={transition(Main)}>Back</button>,
            <p>Credits:</p>,
        ]),

        View = () => { Menu(Main); return h([Menu]) }

    // TODO: use this JSX when https://github.com/luwes/sinuous/issues/147 resolved
    // return render(<Menu />)
    return render(View())
}
