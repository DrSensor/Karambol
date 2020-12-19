import type { Observable } from 'sinuous/observable'

export namespace Observable {
    export type O<T> = Observable<T>
    export type Record<T extends {}> = { [O in keyof T]: Observable<T[O]> }
    export type RecordOf<T> = { [key: string]: Observable<T> }
    export type AsProxy<T extends Record<any>> = { [K in keyof T]: ReturnType<T[K]> }
}

export namespace Style {
    type AnyElement = HTMLElement | SVGElement
    type Styles = Inline | Inline[] | `--${string}`
    export type Inline = Exclude<keyof DTO<CSSStyleDeclaration>, 'length' | 'parentRule'>

    /**@todo should be auto-generated based on res/theme/*.css */
    export type Theme = 'ocean'

    /**Predefined color under specifc theme */
    export type DominantColor = 'primary' | 'primary-variant' | 'secondary' | 'accent' | 'background'

    export function theme(name: Theme): void
    export function theme(): Theme
    export function theme(name?: Theme) {
        const stylesheet = document.getElementById('theme') as HTMLLinkElement
        if (name) stylesheet.href = '/res/theme/' + name + '.css'
        else return stylesheet.href.replace('/res/theme/', '').replace('.css', '') as Theme
    }

    export function color(prop: DominantColor, root?: Element): string
    export function color(key: DominantColor, value: string, root?: Element): void
    export function color(prop: DominantColor, val?: Element | string, root?: Element) {
        if (val instanceof Element) root = val
        const style = getComputedStyle(root ?? document.body)
        if (typeof val === 'string') style.setProperty(`--${prop}`, val)
        else return style.getPropertyValue(`--${prop}`)
    }

    export const
        swap = (style: Inline, ...elements: AnyElement[]) => {
            const el = elements, { length } = elements
                , swap = (el1: AnyElement, el2: AnyElement) => {
                    const tmp = getComputedStyle(el1)[style]
                    el1.style[style] = getComputedStyle(el2)[style]
                    el2.style[style] = tmp
                }

            if (length == 2) swap(el[0], el[1])
            else for (const i of elements.keys()) {
                if (i == length - 1) /*swap(el[i], el[0])*/break // don't rotate
                else swap(el[i], el[i + 1])
            }
        },
        reset = (styles?: Styles, ...elements: AnyElement[]) => {
            if (styles) Style.set(styles, '', ...elements)
            else for (const el of elements) el.removeAttribute('style')
        },
        set = (styles: Styles, value: string, ...elements: AnyElement[]) => {
            if (Array.isArray(styles)) for (const style of styles)
                for (const el of elements) el.style[style] = value
            else if (styles.startWith('--'))
                for (const el of elements) el.style.setProperty(styles, value)
            else
                for (const el of elements) el.style[styles] = value
        }
}

export namespace Random {
    export const
        crypto = (ctor: IntArrayCtor) =>
            Number(window.crypto.getRandomValues(new ctor(1))),
        between = (...[min, max]: Rangeof<number>) => Math.random() * (max - min) + min,
        numlist = (count: number, [min, max]: Rangeof<number>) =>
            Array.from(Array(count), () => between(min, max))

    export namespace uniform {
        export const numlist = (count: number, range: Rangeof<number>) =>
            Array(count).fill(between(...range)) as number[]
    }
}

export namespace Vec3 {
    export const
        isNumber = (vec: Vec3<any>): vec is Vec3<number> => Object.values(vec).every(t => typeof t === 'number'),
        isRangeofNumber = (vec: Vec3<any>): vec is Vec3<Rangeof<number>> => Object.values(vec).every(t => Range.isNumber(t))
}

export namespace Range {
    export const isNumber = (range: Rangeof<any>): range is Rangeof<number> => range.every(t => typeof t === 'number')
}

type Int8ArrayCtor = Uint8ArrayConstructor | Int8ArrayConstructor
type Int16ArrayCtor = Uint16ArrayConstructor | Int16ArrayConstructor
type Int32ArrayCtor = Uint32ArrayConstructor | Int32ArrayConstructor
type IntArrayCtor = Int8ArrayCtor | Int16ArrayCtor | Int32ArrayCtor
