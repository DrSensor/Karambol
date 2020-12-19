import type { Observable } from '~/src/utils'
import root from './index'

type ORecord<T = any> = Observable.RecordOf<T>
type OProxy<T extends ORecord> = Observable.AsProxy<T>

export const
    proxy = <T extends ORecord>(obj: T): OProxy<T> =>
        // @ts-expect-error
        new Proxy(obj, {
            get: (target, p): T =>
                typeof p === 'string' ? target[p]() : undefined,

            set(target, p, value) {
                if (typeof p !== 'string') return false
                target[p](value)
                return true
            },
        }),

    observableWithProxy = <T extends ORecord>(record: T) =>
        ({ ...record, proxy: proxy(record) }),

    proxyWithObservable = <T extends ORecord>(value: T): OProxy<T> & { observable: T } =>
        Object.create(proxy(value), { observable: { value } })

export interface Lifecycle {
    destroy(): void
}

export const lifecycle: { [key in keyof Lifecycle]: PropertyDescriptor } = {
    // TODO: destroy() should cleanup memory (including proxy and observable variable)
    destroy: { value: () => { while (root.firstChild) root.removeChild(root.lastChild!) } }
}

export namespace Record {
    export type Observable<T> = Observable.Record<T>
}
