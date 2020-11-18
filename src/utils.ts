import type { Observable } from 'sinuous/observable'
export namespace Observable {
    export type Record<T extends {}> = { [O in keyof T]: Observable<T[O]> }
    export type RecordOf<T> = { [key: string]: Observable<T> }
    export type AsProxy<T extends Record<any>> = { [K in keyof T]: ReturnType<T[K]> }
}

export namespace Style {
    type AnyElement = HTMLElement | SVGElement
    export type Inline = Exclude<keyof DTO<CSSStyleDeclaration>, 'length' | 'parentRule'>

    export const
        swap = (style: Inline, ...elements: AnyElement[]) => {
            const swap = (el1: AnyElement, el2: AnyElement) => {
                const tmp = getComputedStyle(el1)[style]
                el1.style[style] = getComputedStyle(el2)[style]
                el2.style[style] = tmp
            }; for (const i of elements.keys()) {
                const { length } = elements, el = elements
                if (i == length - 1) /*swap(el[i], el[0])*/break // don't rotate
                else if (length > 2) swap(el[i], el[i + 1])
            }
        },
        reset = (el: HTMLElement, style?: Inline) =>
            style ? el.style[style] = null : el.removeAttribute('style')
}

export namespace Random {
    export const
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
