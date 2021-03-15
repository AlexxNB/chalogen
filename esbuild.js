const { build } = require('esbuild');
const fs = require('fs/promises');
const pkg = require('./package.json');

const DEV = process.argv.includes('--dev');

// Top-level Await? Ha-Ha
(async ()=>{
    try{
        // Build emoji list
        await build_emoji();

        // Build lib
        await build({
            entryPoints: ['./src/module.js'],
            platform: 'node',
            format: "cjs",
            outfile: pkg.main,
            minify: !DEV,
            sourcemap: DEV && 'inline',
            bundle: true,
            external: [
                ...Object.keys(pkg.dependencies||{}),
                ...Object.keys(pkg.peerDependencies||{}),
            ]
        });

        // Build CLI
        await build({
            entryPoints: ['./src/bin.js'],
            platform: 'node',
            format: "cjs",
            sourcemap: DEV && 'inline',
            outfile: pkg.bin.chalogen,
            minify: !DEV,
            bundle: true,
        });

        await fs.chmod(pkg.bin.chalogen,0o755);

        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
})()

async function build_emoji(){
    const list = require('gitmojis').gitmojis;
    const result = list.reduce((o,e) => {
        o[e.code] = e.emoji;
        return o;
    },{});

    try{
        await fs.mkdir('dist');
    }catch{}

    await fs.writeFile('dist/emoji.json',JSON.stringify(result));

}