# Jobr Plus

A Chrome and Firefox extension to make Jobr usable.

## Development

1. Make sure you've done `npm i` to install packages
2. Run `npm run dev` from the repo root dir

Any changes to `./src/**/*.js` files or `./src/**/*.svelte` files will be watched and automatically rebuilt. Changes to content scripts will require a reload of the Jobr page, but changes to popup UI can be seen by simply closing the popup and reopening it.

Any other file changes will require you to terminate the dev script and restart it. Changes to core files (e.g. manifest.js) may require you to reload the extension itself in your browser.

### Loading the Extension in Chrome

1. Go to [chrome://extensions/](chrome://extensions/)
2. Disable any other versions of Jobr Plus that may be active
3. Enable "Developer mode" in the top right corner
4. Click the "Load unpacked" button, and select the `./dist/chrome/` folder
5. Navigate to https://ferguson.jobr.mobi

### Loading the Add-on in Firefox
#### Using web-ext

1. Disable any other versions of Jobr Plus that may be active
2. Run `npm run dev:firefox` from the repo root to use the web-ext utility to open a Firefox window with the extension in dev mode

Note: Currently, if you want the build process to watch for changes while using web-ext, you'll need to have `npm run dev` and `npm run dev:firefox` going simultaneously but separately. We'll find a better way to incorporate the watcher into the one `npm run dev:firefox` command later.

### Manually

1. Run `npm run package`
2. Go to [about:addons](about:addons)
3. Disable any other versions of Jobr Plus that may be active
4. Click "Install Add-on From File" from the gear menu in the top right, and select `./dist/jobr-plus-firefox.zip`
5. Navigate to https://ferguson.jobr.mobi
6. Remove the temporary add-on from Firefox once you're done


## Packaging/Distribution

1. Make sure you've done `npm i` or `npm ci` to install packages
2. Run `npm run build` from the repo root dir
3. ZIP up contents of dist/chrome/ and dist/firefox/ separately (on Linux/macOS, `npm run package` will do this for you)
4. Upload Firefox ZIP to https://addons.mozilla.org/en-US/developers/addon/jobr-plus/versions
5. Upload Chrome ZIP to https://chrome.google.com/u/0/webstore/devconsole/652299e7-781d-49fb-b060-8ce2b15ff222/fefdkpcfagpbfbdckpllofaomafhpnak/edit/package

## Architecture

The build toolchain is set up to create extension files for Chrome and Firefox simultaneously. Extension files consist of a manifest.json, some icons, a JS script that gets injected into page content, and some HTML/CSS/JS for the UI of the extension's popup when the icon is clicked in the toolbar. The scripting for all of that is in `./bin/build.js`.

### manifest.json and Icons

Both Chrome and Firefox use a similar manifest.json spec, but Chrome uses v3 and Firefox uses v2, so they can't share the same manifest.json directly. Instead, we have a manifest.js file in the repo root with a function that generates the manifest data based on inputs like browser target and version number. The build script uses that to spit out separate files to `./dist/chrome/manifest.json` and `./dist/firefox/manifest.json`.

The build script also copies the ./icons/ directory into both browsers' dist directories.

### Content Script

The source for the content script is at `./src/content/jobr-plus.js`. The build script uses esbuild to bundle that script and its dependencies (jQuery and webextension-polyfill) into one `./dist/<browserTarget>/content/jobr-plus.js` file. The webextension-polyfill extension is primarily used to provide a unified cross-browser API for accessing the extension storage (e.g. shortcut button settings).

### Popup UI

The source for the popup UI is in the ./src/popup/ directory, and the build output goes into the `./dist/<browserTarget>/popup/` directory. The index.html file gets copied directly. The main.js file and its import graph are bundled by esbuild, with any *.svelte files compiled into JS and CSS by Svelte. A main.css file is automatically generated in the output from the combined Svelte styles, but there is no corresponding main.css source file.
