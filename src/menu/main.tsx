import type { Component } from './utils'
import { o, h } from 'sinuous'

import { render, lifecycle, _ } from './utils'
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
            // TODO(sinuous): make PR for h(tag: () => DocumentFragment, ...)
            onstart(lifecycle(<_>{Menu()}</_>))
            Menu(_)
        }

    const // component
        Menu = o<Component>(_),

        Main = () => <>
            <button onClick={start}>Start</button>
            <button onClick={transition(Credits, Menu)}>Credits</button>
        </>,

        Credits = () => <>
            <button onClick={transition(Main, Menu)}>Back</button>
            <p>Credits:</p>
        </>,

        View = () => { Menu(Main); return <>{Menu}</> }

    // TODO: use this JSX when https://github.com/luwes/sinuous/issues/147 resolved
    // return render(<Menu />)
    return render(View())
}
