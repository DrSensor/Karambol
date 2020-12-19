// TODO: use CSS-in-JS (goober) for defining color, dimension, etc

import type { Record } from './utils'
import { hs as h } from 'sinuous'

type Dimension = { x: number, y: number, scale: number }
type Score = { value: number }
type Props =
    & Record.Observable<Score>
    & Partial<Dimension>

export default ({
    value: score,
    x, y, scale: s = 1,
}: Props) =>
    <g transform={`translate(${x},${y}) scale(${s},${s})`}>
        <text filter="blur(.01rem)" fill="green">
            {score}
        </text>
        <circle filter="blur(1)"
            fill-opacity=".3" fill="lightgreen"
            stroke="green" r="10" />
    </g>
