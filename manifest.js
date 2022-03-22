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
    ],
    
    page_action: browserTarget === 'chrome' ? undefined : {
        default_icon: {
            "19": "icons/icon-19.png",
            "38": "icons/icon-38.png"
        },
        default_title: "Jobr Plus",
        default_popup: "popup/index.html"
    },
    
    action: browserTarget === 'chrome' ? {
        default_icon: {
            "16": "icons/icon-16.png",
            "24": "icons/icon-24.png",
            "32": "icons/icon-32.png"
        },
        default_title: "Jobr Plus",
        default_popup: "popup/index.html"
    } : undefined
});
  