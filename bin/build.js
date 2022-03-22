import fs from 'fs/promises';
import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import createManifest from '../manifest.js';

const watch = process.argv.includes('--watch');

const BROWSER_TARGETS = ['chrome', 'firefox'];
const VERSION = process.env.npm_package_version;

async function build(browserTarget) {
    const outdir = 'dist/' + browserTarget;
    fs.rm(outdir, {recursive: true, force: true});
    
    await esbuild.build({
        entryPoints: [
            'src/content/jobr-plus.js',
            'src/popup/main.js'
        ],
        bundle: true,
        watch,
        outdir,
        outbase: 'src',
        plugins: [sveltePlugin()]
    });
    
    const manifest = createManifest({
        browserTarget,
        version: VERSION
    });
    
    await fs.writeFile(`./${outdir}/manifest.json`, JSON.stringify(manifest));
    await fs.cp('icons', outdir + '/icons', { recursive: true });
    await fs.copyFile('src/popup/index.html', outdir + '/popup/index.html');
}

await Promise.all(
    BROWSER_TARGETS.map(build)
);
