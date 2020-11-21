import type { Scene } from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths/math'
import * as Util from '~/src/utils'

export namespace Scene {
    export type Collection<T extends string = string> = { [K in T]: Scene }
    export type Required<T extends string> = Scene.Collection<T>
    export type Optional<T extends string> = Partial<Scene.Required<T>>
}

export namespace Convert {
    const { assign } = Object
    export const asVector3 = (vec: Vec3<number | Rangeof<number>>): Vector3 | Rangeof<Vector3> =>
        Vec3.isRangeofNumber(vec) ? [
            new Vector3(vec.x[0], vec.y[0], vec.z[0]),
            new Vector3(vec.x[1], vec.y[1], vec.z[1])
        ] : assign(new Vector3(), vec)
}

export namespace Random {
    export const { between, numlist } = Util.Random
    export const
        vector3 = (range: Vec3<Rangeof<number>> | Rangeof<number | Vector3>) => {
            range = range instanceof Array ? range : Convert.asVector3(range) as Rangeof<Vector3>
            return Vector3.FromArray(Range.isVector3(range) ? [
                between(range[0].x, range[1].x),
                between(range[0].y, range[1].y),
                between(range[0].z, range[1].z)
            ] : numlist(3, range as Rangeof<number>))
        }

    export namespace uniform {
        export const { numlist } = Util.Random.uniform
        export const
            vector3 = (range: Rangeof<number>) => Vector3.FromArray(numlist(3, range))
    }
}

export namespace Vec3 {
    export const isNumber = (vec: Vec3<any>): vec is Vec3<number> => Object.values(vec).every(t => typeof t === 'number')
    export const isRangeofNumber = (vec: Vec3<any>): vec is Vec3<Rangeof<number>> => Object.values(vec).every(t => Range.isNumber(t))
}

export namespace Range {
    export const { isNumber } = Util.Range
    export const isVector3 = (range: Rangeof<any>): range is Rangeof<Vector3> => range.every(t => t instanceof Vector3)
}
