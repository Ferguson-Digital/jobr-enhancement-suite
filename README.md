# Jobr Plus

A Chrome and Firefox extension to make Jobr usable.

IMPORTANT NOTE: Chrome requires a manifest version of 3, and Firefox requires a manifest version of 2. Otherwise, the code for both doesn't diverge significantly, but it will diverge more and more as we add things like settings panels.

## Packaging/Distribution

1. ZIP up manifest.json, jobr-plus.js, and jquery-3.6.0.slim.min.js together
2. Upload to https://addons.mozilla.org/en-US/developers/addon/jobr-enhancement-suite/versions
3. Change manifest version to 3
4. Upload to https://chrome.google.com/u/0/webstore/devconsole/652299e7-781d-49fb-b060-8ce2b15ff222/fefdkpcfagpbfbdckpllofaomafhpnak/edit/package
