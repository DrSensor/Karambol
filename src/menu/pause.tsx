// TODO(user inactive): use requestIdleCallback to hide PauseMenu while dim the screen
// TODO(user active): diplay PauseMenu in menu.onhover
// TODO: replace requestIdleCallback with IdleDetector when landed
// https://www.chromestatus.com/feature/4590256452009984

import type { Component } from './utils'
import { o, h } from 'sinuous'

import root from './index'
import { Style, lifecycle, _ } from './utils'
import intersect from 'lodash/intersection'

type Event = 'pause' | 'exit' | 'resume'

export type EventListener = { readonly [K in `on${Event}`]:
    (lastView: ReturnType<typeof lifecycle>) => Void
}

type Props = EventListener & {
    ["toggle-keys"]?:
    | string[]
    // | { key: string } & Record<'alt' | 'ctrl' | 'shift' | 'meta', boolean>,
    hidden: boolean,
}

export const Menu = ({
    onexit, onresume, onpause,
    hidden, "toggle-keys": toggleKeys = [],
}: Props) => {
    const toggleStyles = ['background', 'pointerEvents'] as Style.Inline[]
        , browserKeys = intersect([ // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
            'Escape', 'F11', 'GoBack'
        ], toggleKeys)

    const // event handler
        keytoggle = (e: KeyboardEvent) => {
            if (!toggleKeys.includes(e.key)
                || (document.fullscreenElement &&
                    browserKeys.includes(e.key))
            ) return

            e.preventDefault(); e.stopPropagation()
            hidden ? pause() : resume()
        },
        listenKey = (listen: boolean) => {
            const event = 'keydown'
                , call = listen ? 'add' : 'remove'
                // @ts-expect-error
                , eventListener = (ev, handler) => document[
                    `${call}EventListener`](ev, handler)
            eventListener(event, keytoggle)
        },

        style = {
            set: () => Style.set(toggleStyles, 'none', root),
            reset: () => Style.reset(toggleStyles, root),
        },

        pause = () => {
            onpause(lifecycle(<_>{View()}</_>))
            View(Menu); hidden = false
            style.reset()
        },

        resume = () => {
            onresume(lifecycle(<_>{View()}</_>))
            View(Toggler); hidden = true
            style.set()
        },

        exit = () => {
            onexit(lifecycle(<_>{View()}</_>))
            View(_); hidden = true
            listenKey(false)
        }

    listenKey(true)
    const // component
        Toggler = () => <>
            <button style="pointer-events: auto" onClick={pause}>Pause</button>
        </>,

        Menu = () => <>
            <button onClick={resume}>Resume</button>
            <button onClick={exit}>Exit</button>
        </>,

        View = o<Component>(hidden ? Toggler : Menu)
    if (hidden) style.set()

    return <>{View}</>
}

export { Menu as default }
