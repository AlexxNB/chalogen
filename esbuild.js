const { build } = require('esbuild');

const DEV = process.argv.includes('--dev');

// ES-module
build({
    entryPoints: ['./src/main.js'],
    platform: 'node',
    format: "cjs",
    outfile: './dist/changeloger.js',
    minify: !DEV,
    bundle: true,
});
