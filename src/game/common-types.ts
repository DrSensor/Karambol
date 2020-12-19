import type { DataType } from '@javelin/ecs'
import type { Transpose } from './utils'

import { createDataType, createComponentType } from './utils'
const { min, max } = Math

export const range = (minValue: number, maxValue: number) =>
    createDataType<number>("range", val => max(minValue, min(val, maxValue)))

export * from './utils/ecs/standard_data_types'

////// data-types👆-💈-👇component-types //////

import { number, string, boolean, array } from '@javelin/ecs'

export const Position = createComponentType({
    x: number, y: number, z: number,
})
