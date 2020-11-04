module.exports = {
    exclude: [".scripts/**", "vendor/install.*js"],
    devOptions: {
        open: ".scripts/browser.sh",
        secure: true
    },
    alias: { "~": "." },
    plugins: [
        ["@snowpack/plugin-optimize", {
            target: ["chrome81"], // target WebXR AR support
            preloadModules: true
        }],
        ["@snowpack/plugin-sass", { native: true }],
        "@snowpack/plugin-dotenv"
    ],
    installOptions: {
        polyfillNode: false,
        rollup: {
            plugins: [
                require("rollup-plugin-node-polyfills")({
                    fs: false // to support importing ammo.js as ES module
                })
            ]
        }
    }
}