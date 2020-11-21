import type { Component } from './utils'

import { o, h } from 'sinuous'
import { render, _ } from './utils'

import * as Main from './main'
import * as Pause from './pause'

const root = document.getElementById('menu') as HTMLDivElement

interface Keymap {
    pause: string[]
}

type EventListener =
    & Main.EventListener
    & Pause.EventListener

type Props =
    & { hotkey?: Keymap }
    & EventListener

const Menu = ({
    hotkey, onstart,
    onexit, ...pauseListener
}: Props) => {
    const View = o<Component>(_)

    const home = () => View(<Main.Menu
        onstart={view => {
            onstart(view)
            View(<Pause.Menu hidden
                toggle-keys={hotkey?.pause}{...pauseListener}
                onexit={view => { onexit(view); home() }}
            />)
        }}
    />); home()

    return render(<>{View}</>)
}

export { root as default, Menu }
