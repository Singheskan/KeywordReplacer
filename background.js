// background.js

// Listen for messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "getKeywords") {
        browser.storage.local.get(["generalKeywords", "websiteKeywords"]).then((result) => {
            sendResponse({
                generalKeywords: result.generalKeywords ? result.generalKeywords.split(',').map(k => k.trim()) : [],
                websiteKeywords: result.websiteKeywords || []
            });
        });
        return true; // Required to keep the sendResponse function alive
    }
});
