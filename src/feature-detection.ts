import { csv } from 'd3-fetch'
import DeviceDetector from 'device-detector-js'
import arcoreDevices from '~/vendor/ARCore/arcore_devicelist.csv'

csv(arcoreDevices).then(data => {
    const
        detector = new DeviceDetector({
            skipBotDetection: true, versionTruncation: 0,
        }),
        { device } = detector.parse(navigator.userAgent)

    if (
        device?.type === 'desktop'
    ) globalThis.platform = Platform.Desktop

    else if ( // TODO: compare UA with arcore_devicelist.csv
        navigator.xr?.isSessionSupported('immersive-ar')
        && data.some(
            row => device?.model.includes(row['Model Name']!))
    ) globalThis.platform = Platform.AR

    else if (
        navigator.xr?.isSessionSupported('immersive-vr')
    ) globalThis.platform = Platform.VR

    else if ( // TODO: rather than orientation, use resolution or device pixel ration
        device?.type === 'mobile'
        || window.ondeviceorientation
        && window.ondevicemotion
        && window.ontouchstart
    ) globalThis.platform = Platform.Mobile

    else globalThis.platform = Platform.Unknown
})


export const enum Platform { AR, VR, Mobile, Desktop, Unknown }

declare global {
    var platform: Platform
}
