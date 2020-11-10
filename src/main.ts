import MainMenu from './menu/main'

console.log(globalThis.platform) // undefined
MainMenu({
    onstart() {
        console.log(globalThis.platform) // number
    }
})
