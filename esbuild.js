const { build } = require('esbuild');
const fs = require('fs/promises');
const pkg = require('./package.json');

const DEV = process.argv.includes('--dev');

// Top-level Await? Ha-Ha
(async ()=>{
    try{

        // Build lib
        await build({
            entryPoints: ['./src/lib.js'],
            platform: 'node',
            format: "cjs",
            outfile: pkg.main,
            minify: !DEV,
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
            outfile: pkg.bin,
            minify: !DEV,
            bundle: true,
        });

        await fs.chmod(pkg.bin,0o755);

        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
})()