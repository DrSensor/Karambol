import { csv } from 'd3-fetch'

// @ts-ignore
import arcoreDevices from '~/vendor/ARCore/arcore_devicelist.csv'
import * as config from '~/game.config.json'


const canvas = document.getElementById('viewport')

console.log(canvas)
document.getElementById('menu').textContent = JSON.stringify(config)


csv(arcoreDevices).then(data => {
    document.getElementById('menu').textContent += '\n' + JSON.stringify(data)
})
