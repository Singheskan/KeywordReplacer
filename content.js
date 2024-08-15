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

// Function to replace specific word pairs (e.g., "foo:bar")
function replaceSpecificPairs(pairs, target) {
    let value = target.value;
    pairs.forEach(pair => {
        const [keyword, replacement] = pair.split(':').map(k => k.trim());
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        value = value.replace(regex, replacement);
    });
    target.value = value;
}

// Function to replace names and emails
function replaceNameAndEmailPatterns(value) {
    // Define the patterns
    const namePattern = /\b(Mr\.|Ms\.|Mrs\.|Dr\.)?\s?[A-Z][a-z]*\s[A-Z][a-z]*\b/g;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi;

    // Replace with generic placeholders
    value = value.replace(namePattern, 'John Doe');
    value = value.replace(emailPattern, 'anonymous@example.com');

    return value;
}
// Listen for input events on all text fields
document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'textarea' || target.tagName.toLowerCase() === 'input') {
        const currentUrl = window.location.href;

        // Get stored keywords and replacement pairs
        browser.storage.local.get(["generalKeywords", "websiteKeywords", "replacementPairs", "enableAutomaticReplacement", "enableNameEmailReplacement"]).then((result) => {
            const generalKeywords = result.generalKeywords ? result.generalKeywords.split(',').map(k => k.trim()) : [];
            const websiteKeywords = result.websiteKeywords || [];
            const replacementPairs = result.replacementPairs ? result.replacementPairs.split(',').map(k => k.trim()) : [];
            const enableAutomaticReplacement = result.enableAutomaticReplacement !== false;
            const enableNameEmailReplacement = result.enableNameEmailReplacement !== false;

            // Get the specific keywords for the current website
            let specificKeywords = [];
            websiteKeywords.forEach(entry => {
                if (currentUrl.includes(entry.website)) {
                    specificKeywords = specificKeywords.concat(entry.keywords.split(',').map(k => k.trim()));
                }
            });

            // Combine general and specific keywords
            const allKeywords = generalKeywords.concat(specificKeywords).filter(k => k.length > 0); // Remove empty keywords
            
            // Apply keyword replacements
            replaceKeywords(allKeywords, target);

            // Apply specific pair replacements
            if (replacementPairs.length > 0) {
                replaceSpecificPairs(replacementPairs, target);
            }

            // Apply name and email replacements if enabled
            if (enableAutomaticReplacement && enableNameEmailReplacement) {
                target.value = replaceNameAndEmailPatterns(target.value);
            }
        });
    }
});
