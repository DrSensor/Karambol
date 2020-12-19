const { readFile } = require('fs').promises
const { transform } = require('esbuild')

module.exports = (snowpackConfig, { jsxFactory = 'jsx', jsxFragment = 'Fragment' }) => ({
    name: 'jsx-factory',
    resolve: {
        input: ['.tsx', '.jsx'],
        output: ['.js'],
    },
    async load({ filePath, fileExt }) {
        const
            content = await readFile(filePath, 'utf-8'),
            loader = fileExt.slice(fileExt.lastIndexOf('.') + 1),
            { code, map } = await transform(content,
                { loader, jsxFactory, jsxFragment })

        return { '.js': { code, map } }
    },
})
