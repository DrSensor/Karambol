import type { JSX } from 'sinuous'
import type { Observable } from '~/src/utils'

import root from './index'

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
            else while (root.firstChild) root.removeChild(root.lastChild!)
        },
        into: (Menu, ...opts) => {
            const comp = Menu(...opts), parent = view.parentNode ?? root
            parent.append(comp.view)
            parent.removeChild(view)
            return comp
        },
    }),
    render = <T extends Props>(view: Element, props?: T) => {
        root.append(view)
        return { ...lifecycle(view), ...props }
    }

/** For use with event attribute like `onclick` */
export const transition = <C = Component>(comp: C, o: O<C>) => () => o(comp)

/** Handy JSX workaround for constructing `h(null,{},OComponent())` */
export const _ = null as unknown as () => Element

// import { memo } from 'memo' // TOOD: replace with fast-memoize
// import { root } from 'sinuous/observable'
// const // @ts-ignore
//     memoComp = memo(comp => memo((props, children) => root(() => comp(props, children)))) as (comp: any) => any,
//     dynamic = comp => (props, ...children) => () => memoComp(comp())(props, children)

export type { Component, Observable, JSX }
export { lifecycle, render, /* dynamic */ }
export { Style } from '~/src/utils'
