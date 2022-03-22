# Jobr Plus

A Chrome and Firefox extension to make Jobr usable.

## Packaging/Distribution

1. Make sure you've done `npm i` or `npm ci` to install packages
2. Run `npm run build` from the repo root dir
3. ZIP up contents of dist/chrome/ and dist/firefox/ separately (on *nix, `npm run package` will do this for you)
4. Upload Firefox ZIP to https://addons.mozilla.org/en-US/developers/addon/jobr-plus/versions
5. Upload Chrome ZIP to https://chrome.google.com/u/0/webstore/devconsole/652299e7-781d-49fb-b060-8ce2b15ff222/fefdkpcfagpbfbdckpllofaomafhpnak/edit/package
