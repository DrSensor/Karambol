import type { Observable } from '~/src/utils'

type ORecord<T = any> = Observable.RecordOf<T>
type OProxy<T extends ORecord> = Observable.AsProxy<T>

export const
    proxy = <T extends ORecord>(obj: T): OProxy<T> =>
        // @ts-expect-error
        new Proxy(obj, {
            get: (target, p): T =>
                typeof p === 'string' ? target[p]() : undefined,

            set(target, p, value) {
                if (typeof p !== 'string') return
                target[p](value)
                return true
            },
        }),

    observableWithProxy = <T extends ORecord>(record: T) =>
        ({ ...record, proxy: proxy(record) }),

    proxyWithObservable = <T extends ORecord>(value: T): OProxy<T> & { observable: T } =>
        Object.create(proxy(value), { observable: { value } })


export namespace Record {
    export type Observable<T> = Observable.Record<T>
}
