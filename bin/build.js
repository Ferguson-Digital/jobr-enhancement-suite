import esbuild from 'esbuild';
import fs from 'fs/promises';
// import pkg from '../package.json';
import createManifest from '../manifest.js';

const watch = process.argv.includes('--watch');

const BROWSER_TARGETS = ['chrome', 'firefox'];
const VERSION = process.env.npm_package_version;

async function build(browserTarget) {
    const outdir = 'dist/' + browserTarget;
    
    await esbuild.build({
        entryPoints: [
            'src/content/jobr-plus.js'
        ],
        bundle: true,
        watch,
        outdir,
        outbase: 'src'
    });
    
    const manifest = createManifest({
        browserTarget,
        version: VERSION
    });
    
    await fs.writeFile(`./${outdir}/manifest.json`, JSON.stringify(manifest));
    await fs.cp('icons', outdir + '/icons', { recursive: true });
}

await Promise.all(
    BROWSER_TARGETS.map(build)
);
