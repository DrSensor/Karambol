import type { JSX } from 'sinuous'
import type { Observable } from '~/src/utils'

import menu from './index'

type Props = Observable.RecordOf<any>

type Element = JSX.Element | DocumentFragment
type Component = (() => Element) | Element
type O<C> = Observable.O<C>

interface LifeCycle {
    view: Element
    destroy(): void

    into<Args extends [], Self extends LifeCycle>(
        Menu: (...opts: Args) => Self,
        ...opts: Args
    ): Self
}

const
    lifecycle = (view: Element): LifeCycle => ({
        view,
        destroy: () => {
            if (view.parentNode) view.parentNode.removeChild(view)
            else while (menu.firstChild) menu.removeChild(menu.lastChild)
        },
        into: (Menu, ...opts) => {
            const comp = Menu(...opts), parent = view.parentNode
            parent.append(comp.view)
            parent.removeChild(view)
            return comp
        },
    }),
    render = <T extends Props>(view: Element, props?: T) => {
        menu.append(view)
        return { ...lifecycle(view), ...props }
    }

/** Handy JSX workaround for returning `h(null,{},OComponent())` */
export const _ = null

// import { memo } from 'memo' // TOOD: replace with fast-memoize
// import { root } from 'sinuous/observable'
// const // @ts-ignore
//     memoComp = memo(comp => memo((props, children) => root(() => comp(props, children)))) as (comp: any) => any,
//     dynamic = comp => (props, ...children) => () => memoComp(comp())(props, children)

export type { Component, Observable, JSX }
export { lifecycle, render, /* dynamic */ }
