export default ({browserTarget, version}) => ({
    manifest_version: browserTarget === 'chrome' ? 3 : 2,
    name: "Jobr Plus",
    version,
    description: "Improves the UX of the Jobr interface for time entry.",
    icons: {
        "48": "icons/icon-48.png",
        "96": "icons/icon-96.png"
    },
  
    content_scripts: [
        {
            matches: ["*://*.jobr.mobi/*"],
            js: [
                "content/jobr-plus.js"
            ]
        }
    ]
});
  