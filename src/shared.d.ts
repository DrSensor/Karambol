declare type DTO<T> = _DataPropertiesOnly<T>
// https://stackoverflow.com/a/55480598/5221998
type _DataPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type _DataPropertiesOnly<T> = {
    [P in _DataPropertyNames<T>]: T[P] extends object ? DTO<T[P]> : T[P]
}

type Rangeof<T> = [T, T]
type Vec2<T> = { x: T, y: T }
type Vec3<T> = Vec2<T> & { z: T }
type Vec4<T> = Vec3<T> & { w: T }

declare module '*.csv' {
    const url: string
    export default url
}
