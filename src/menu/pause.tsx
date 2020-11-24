// TODO(user inactive): use requestIdleCallback to hide PauseMenu while dim the screen
// TODO(user active): diplay PauseMenu in menu.onhover
// TODO: replace requestIdleCallback with IdleDetector when landed
// https://www.chromestatus.com/feature/4590256452009984

import type { Component } from './utils'
import { o, h } from 'sinuous'

import root from './index'
import { Style, lifecycle } from './utils'
import intersect from 'lodash/intersection'

import { Icon, _ } from './utils/components'
import {
    faPlayCircle as btnPlay,
    faPause as icoPause,
    faPauseCircle as btnPause,
    faSignOutAlt as icoExit,
} from '@fortawesome/free-solid-svg-icons'
// import { faPlayCircle as faPlay } from '@fortawesome/free-regular-svg-icons'

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
            if (listen) document.addEventListener(event, keytoggle)
            else document.removeEventListener(event, keytoggle)
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
        Toggler = () =>
            <button onClick={pause} name="pause" class="indicator">
                <Icon def={btnPause} />
            </button>,

        Menu = () => <>
            <Icon def={icoPause} class='indicator' />

            {/* Menu Buttons */}
            <button onClick={resume} name="resume" class="fab">
                <Icon def={btnPlay} />
            </button>
            <button onClick={exit} name="exit">
                Exit <Icon def={icoExit} />
            </button>
        </>,

        View = o<Component>(hidden ? Toggler : Menu)
    if (hidden) style.set()

    return <>{View}</>
}

export { Menu as default }
