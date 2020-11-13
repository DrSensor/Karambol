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
