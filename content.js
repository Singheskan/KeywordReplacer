// content.js

function getRandomWord() {
    const words = ["banana", "computer", "elephant", "pencil", "guitar"];
    return words[Math.floor(Math.random() * words.length)];
}

// Replace keywords in the text
function replaceKeywords(keywords, target) {
    let value = target.value;
    keywords.forEach(keyword => {
        if (keyword) {  // Check that the keyword is not empty
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');  // Match whole words
            value = value.replace(regex, getRandomWord());
        }
    });
    target.value = value;
}

// Listen for input events on all text fields
document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'textarea' || target.tagName.toLowerCase() === 'input') {
        const currentUrl = window.location.href;

        // Get general and specific keywords
        browser.storage.local.get(["generalKeywords", "websiteKeywords"]).then((result) => {
            const generalKeywords = result.generalKeywords ? result.generalKeywords.split(',').map(k => k.trim()) : [];
            const websiteKeywords = result.websiteKeywords || [];

            // Get the specific keywords for the current website
            let specificKeywords = [];
            websiteKeywords.forEach(entry => {
                if (currentUrl.includes(entry.website)) {
                    specificKeywords = specificKeywords.concat(entry.keywords.split(',').map(k => k.trim()));
                }
            });

            // Combine general and specific keywords
            const allKeywords = generalKeywords.concat(specificKeywords).filter(k => k.length > 0); // Remove empty keywords
            replaceKeywords(allKeywords, target);
        });
    }
});
