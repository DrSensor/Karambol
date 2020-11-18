import type { JSX } from 'sinuous'
import type { Observable } from 'sinuous/observable'

import menu from './index'

type Props = { [key: string]: Observable<any> }

type Element = JSX.Element | DocumentFragment
type Component = (() => Element) | Element

interface LifeCycle {
    view: Element
    destroy(): Element

    into<Args extends [], Self extends LifeCycle>(
        Menu: (...opts: Args) => Self,
        ...opts: Args
    ): Self
}

const
    lifecycle = (view: Element): LifeCycle => ({
        view,
        destroy: () => view.parentNode.removeChild(view),
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

// import { memo } from 'memo' // TOOD: replace with fast-memoize
// import { root } from 'sinuous/observable'
// const // @ts-ignore
//     memoComp = memo(comp => memo((props, children) => root(() => comp(props, children)))) as (comp: any) => any,
//     dynamic = comp => (props, ...children) => () => memoComp(comp())(props, children)

export type { Component, Observable, JSX }
export { lifecycle, render, /* dynamic */ }
