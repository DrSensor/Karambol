export namespace Style {
    export type Inline = Exclude<keyof DTO<CSSStyleDeclaration>, 'length' | 'parentRule'>

    export const swap = (el1: HTMLElement, el2: HTMLElement, style: Inline) => {
        const tmp = getComputedStyle(el1)[style]
        el1.style[style] = getComputedStyle(el2)[style]
        el2.style[style] = tmp
    }

    export const reset = (el: HTMLElement, style?: Inline) =>
        style ? el.style[style] = null : el.removeAttribute('style')
}


import { Vector3 } from '@babylonjs/core/Maths/math'

export namespace Convert {
    const { assign } = Object
    export const asVector3 = ({ x, y, z }: Vec3<number | Rangeof<number>>): Vector3 | Rangeof<Vector3> =>
        Vec3.isRangeofNumber({ x, y, z }) ? [
            new Vector3(x[0], y[0], z[0]),
            new Vector3(x[1], y[1], z[1])
        ] : assign(new Vector3(), { x, y, z })
}

export namespace Random {
    export const
        between = (...[min, max]: Rangeof<number>) => Math.random() * (max - min) + min,
        numlist = (count: number, [min, max]: Rangeof<number>) =>
            Array.from(Array(count), () => between(min, max)),

        vector3 = (range: Vec3<Rangeof<number>> | Rangeof<number | Vector3>) => {
            range = range instanceof Array ? range : Convert.asVector3(range) as Rangeof<Vector3>
            return Vector3.FromArray(Range.isVector3(range) ? [
                between(range[0].x, range[1].x),
                between(range[0].y, range[1].y),
                between(range[0].z, range[1].z)
            ] : numlist(3, range as Rangeof<number>))
        }

    export namespace uniform {
        export const
            numlist = (count: number, range: Rangeof<number>) =>
                Array(count).fill(between(...range)) as number[],
            vector3 = (range: Rangeof<number>) => Vector3.FromArray(numlist(3, range))
    }
}

export namespace Vec3 {
    export const isNumber = (vec: Vec3<any>): vec is Vec3<number> => Object.values(vec).every(t => typeof t === 'number')
    export const isRangeofNumber = (vec: Vec3<any>): vec is Vec3<Rangeof<number>> => Object.values(vec).every(t => Range.isNumber(t))
}

export namespace Range {
    export const isNumber = (range: Rangeof<any>): range is Rangeof<number> => range.every(t => typeof t === 'number')
    export const isVector3 = (range: Rangeof<any>): range is Rangeof<Vector3> => range.every(t => t instanceof Vector3)
}
