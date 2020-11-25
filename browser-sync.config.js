const { GHOST, PORT, BROWSER } = process.env
    , { parse } = JSON
    , asIf = (val, ty) => typeof parse(val ?? null) === ty ? val : null

/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
/** @type {import("browser-sync").Options} */
module.exports = {
    port: parse(PORT ?? 8080),
    server: "build",
    files: [
        "src/**", "res/**", "assets/**",
        "index.html", "game.config.json"
    ],
    open: Boolean(parse(BROWSER ?? true)),
    browser: asIf(BROWSER, 'string') ?? ".scripts/browser.sh",
    ghostMode: Boolean(parse(GHOST ?? false)),
    watchEvents: ["change", "add"],
    https: {
        key: "snowpack.key",
        cert: "snowpack.crt"
    }
}
