import type { Component } from './utils'
import { o, h } from 'sinuous'

import { lifecycle, transition, _ } from './utils'
import { Platform } from '~/game.config'

export interface EventListener {
    readonly onstart: (menu: ReturnType<typeof lifecycle>) => void
}

export const Menu = ({ onstart }: Partial<EventListener> = {}) => {
    const // event handler
        start = () => {
            if (platform != Platform.Desktop) screen.orientation.lock('portrait-primary')
            // TODO(sinuous): make PR for h(tag: () => DocumentFragment, ...)
            onstart?.(lifecycle(<_>{View()}</_>))
            View(_)
        }

    const // component
        Main = () => <>
            <button onClick={start}>Start</button>
            <button onClick={transition(Credits, View)}>Credits</button>
        </>,

        Credits = () => <>
            <button onClick={transition(Main, View)}>Back</button>
            <p>Credits:</p>
        </>,

        View = o<Component>(Main)

    return <>{View}</>
}
