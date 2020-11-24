import { icon, layer, IconLookup, IconParams } from '@fortawesome/fontawesome-svg-core'
import { hs as h, JSX } from 'sinuous'

// TODO: remove import 'lodash/omit'
import omit from 'lodash/omit'
const { entries, fromEntries, keys } = Object

/** Handy JSX workaround for constructing `h(null,{},OComponent())` 
 * @example <caption>Return HTMLElement instead of DocumentFragment.</caption>
 * 
 * const View = o<JSX.Element>(<div />)
 * callback(<_>{View()}</_>) // pass HTMLDivElement
 * View(_) // remove <div />
*/
export const _ = null as unknown as () => Element


/** Component wrapper for using with FontAwesome 
 * @example <Icon def={faStop} />
 * @see https://fontawesome.com/how-to-use/javascript-api/methods/icon
*/
export const Icon = ({ def, ...props
}: { def: IconLookup } & IconParams & SVGAttributes
) => {
    const svgProps: SVGAttributes = fromEntries(entries(props).filter(([key]) => svgattr.includes(key)))
        , iconProps = omit(props, keys(svgProps))
    return <_>{...Array
        .from(icon(def, iconProps).node)
        .map((SVG: any) => <SVG {...svgProps} />)
    }</_>
}


/** TODO: support <IconSet /> using layer()
 * @see https://fontawesome.com/how-to-use/javascript-api/methods/layer
 * @example
 * <IconSet>
 *     <Icon def={faPlay} />
 *     <Icon def={faPause} />
 * </IconSet>
 * @todo create panel.indicator/notification using this
 */
const IconSet = layer(push => { }).node


// TODO: find a way to use 'ts-transformer-keys' within snowpack/esbuild
// https://github.com/kimamula/ts-transformer-keys
type SVGAttributes = { tabindex?: number } & Pick<JSX.SVGAttributes,
    'onClick' | 'onFocus' | 'onBlur' |
    'onKeyDown' | 'onKeyUp' |
    'style' | 'name' | 'class'
>            // 1. copy 👆
const svgattr/* 2. paste 👇 */: string[] = [
    'onClick', 'onFocus', 'onBlur',
    'onKeyDown', 'onKeyUp',
    'style', 'name', 'class'
    , 'tabindex'
] as (keyof SVGAttributes)[]
