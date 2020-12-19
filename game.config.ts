export default {
    startLevel: "sandbox",
    menu: true,
    hud: true,
    debugLayer: false
} as const // wrong level will cause type error in main.ts 😉

export const enum Platform { AR, VR, Mobile, Desktop, Unknown }
