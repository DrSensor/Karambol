#!/usr/bin/env -S node --experimental-json-modules

import degit from 'degit'
import { get } from 'https'
import { createWriteStream, promises } from 'fs'
import { fileURLToPath } from 'url'
import { join, extname, basename, dirname } from 'path'

const __dirname = fileURLToPath(dirname(import.meta.url)),
    { rm } = promises, recursive = true, force = true


ARCore: {
    const output = join(__dirname, 'ARCore/')
    rm(output, { force, recursive })
    degit('rolandsmeenk/ARCore-devices', { force }).clone(output)
}

Ammojs: {
    const { main, files } = (await import('./ammojs/package.json')).default

    const workdir = join(__dirname, 'ammojs')

    for (const file of [main, ...files]) rm(join(workdir, file), { force })
    for (const url of [
        //WARNING: the original ammo.js kripken can't be used by Babylon.js
        // 'https://kripken.github.io/ammo.js/builds/ammo.js'

        // TODO: make ./vendor/ammojs can be imported as ES module
        'https://cdn.babylonjs.com/ammo.js',

        // TODO: find a way to resolve ammo.wasm.wasm
        // 'https://cdn.babylonjs.com/ammo.wasm.js',
        // 'https://cdn.babylonjs.com/ammo.wasm.wasm',
    ]) get(url, response => {
        let output
        switch (extname(url)) {
            case '.js': output = join(workdir, main); break
            case '.wasm': output = join(workdir, basename(url)); break
        }
        response.pipe(createWriteStream(output))
    })
}
