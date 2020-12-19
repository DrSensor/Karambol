// https://flow.org/en/docs/types/utilities
declare type Values<T> = T[keyof T]

/** Recursively filter non-method of an interface
 * @see- https://stackoverflow.com/a/55480598/5221998
 * @example
 * DTO<Game> as { fullscreen: boolean, cursor: boolean }
 * interface Game {
 *   start(): void, pause: () => void
 *   fullscreen: boolean, cursor: boolean
 * }
 */
declare type DTO<T> = {
    [P in {
        [K in keyof T]: T[K] extends Function ? never : K
    }[keyof T]]

    : T[P] extends object ? DTO<T[P]> : T[P]
}

/** When extended in generic, it will narrow the type into it's literal
 * @see- https://stackoverflow.com/a/46013198/5221998
 * @example
 * const primitive = <T extends any[]>(...args: T) => args
 * primitive('password', 123)   as [string, number]
 * 
 * const literal = <T extends Narrowable[]>(...args: T) => args
 * literal('password', 123)     as ['password', 123]
*/
type Narrowable = string | number | boolean | undefined | null | void | {};

/** Narrow literal type into it's primitive 
 * @example 
 * ToPrimitive<2>       as number
 * ToPrimitive<number>  as number
*/
type ToPrimitive<T> = T extends number ? number : T extends string ? string : T extends boolean ? boolean : {
    [K in keyof T]: ToPrimitive<T[K]>
}

/** Infer type of an Array/Tuple
 * @see- https://github.com/microsoft/TypeScript/issues/13298#issuecomment-423390349
 * @example
 * ElementOf<[number, number]>      as number
 * ElementOf<[number, string]>      as string | number
 * ElementOf<number[]>              as number
*/
type ElementOf<T> = T extends (infer E)[] ? E : T

/** Narrow single or empty tuple as array 
 * @example
 * NarrowTuple<[]>                  as unknown[]        // not []
 * NarrowTuple<[number]>            as number[]         // not [number]
 * NarrowTuple<[number, number]>    as [number, number] // still same
*/
type NarrowTuple<T extends unknown[]> = T extends Readonly<[infer E] | []> ? E[] : T

/** Convert array of generic into generic of array
 * @waitfor https://github.com/Microsoft/TypeScript/issues/1213
 * @example 
 * Transpose<[T<number>, T<string>]>    as T<[number, string]>
 * Transpose<T<number>[]>               as T<number[]>
 */
// type Transpose<S extends T<_>[]> = { [K in keyof S]: S[K] extends T<infer D> ? D : never }

// complementing https://github.com/sindresorhus/type-fest/blob/master/source/basic.d.ts
type PrimitiveConstructor =
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | SymbolConstructor
    | BigIntConstructor

type TypedArrayConstructor =
    | Int8ArrayConstructor
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Int32ArrayConstructor
    | Uint32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor
    | BigInt64ArrayConstructor
    | BigUint64ArrayConstructor
////////////////////////////////////////////////////////////////////////////////////

type Void = void | Promise<void>
type NotFunction<T> = Exclude<T, Function>
type Writeable<T> = { -readonly [P in keyof T]: T[P] }

declare namespace ArrayOf {
    export type WritableReturnType<T> = { -readonly [K in keyof T]: T[K] extends ReturnType<infer E> ? ReturnType<T[K]> : never }
}

type Rangeof<T> = [T, T]
type Vec2<T> = { x: T, y: T }
type Vec3<T> = Vec2<T> & { z: T }
type Vec4<T> = Vec3<T> & { w: T }

declare module '*.csv' {
    const url: string
    export default url
}

/** @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/snowpack-env/index.d.ts */
interface ImportMeta { }
