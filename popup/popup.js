// popup.js

document.addEventListener('DOMContentLoaded', () => {
    // Load saved preferences including dark mode
    browser.storage.local.get(["darkMode", "generalKeywords", "websiteKeywords"]).then((result) => {
        if (result.darkMode) {
            enableDarkMode();
        }
        if (result.generalKeywords) {
            document.getElementById('general-keywords').value = result.generalKeywords;
        }
        if (result.websiteKeywords) {
            const websiteKeywordsContainer = document.getElementById('website-keywords-container');
            // Clear the container to prevent duplicates
            websiteKeywordsContainer.innerHTML = '';
            result.websiteKeywords.forEach(pair => {
                // Add existing website keyword pairs
                addWebsiteKeywordPair(pair.website, pair.keywords);
            });
        } else {
            // If no websiteKeywords are saved, add one empty pair
            addWebsiteKeywordPair('', '');
        }
    });

    // Add the rainbow shine effect to the Ko-fi button
    const supportButton = document.getElementById('support');
    supportButton.classList.add('rainbow-shine');

    // Set a timeout to remove the rainbow animation after 2 seconds
    setTimeout(() => {
        supportButton.classList.remove('rainbow-shine');
    }, 2500);

    // Add event listener to the Dark Mode toggle button
    document.getElementById('toggle-dark-mode').addEventListener('click', () => {
        toggleDarkMode();
    });

    // Add event listener to save button
    document.getElementById('save').addEventListener('click', () => {
        saveConfiguration();
    });

    // Add event listener to add website button
    document.getElementById('add-website-keywords').addEventListener('click', () => {
        addWebsiteKeywordPair('', '');
    });

    // Add event listener to support button
    document.getElementById('support').addEventListener('click', () => {
        // Replace 'YOUR_KOFI_URL' with your actual Ko-fi link
        window.open('https://ko-fi.com/drifterduck', '_blank');
    });
});

function addWebsiteKeywordPair(website, keywords) {
    const container = document.getElementById('website-keywords-container');
    const pairDiv = document.createElement('div');
    pairDiv.classList.add('website-keyword-pair');

    const websiteInput = document.createElement('input');
    websiteInput.type = 'text';
    websiteInput.placeholder = 'Website URL';
    websiteInput.classList.add('website');
    websiteInput.value = website;

    const keywordsTextarea = document.createElement('textarea');
    keywordsTextarea.placeholder = 'Keywords (comma-separated)';
    keywordsTextarea.classList.add('keywords');
    keywordsTextarea.rows = 2;
    keywordsTextarea.cols = 20;
    keywordsTextarea.value = keywords;

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener('click', () => {
        pairDiv.remove();
    });

    pairDiv.appendChild(websiteInput);
    pairDiv.appendChild(keywordsTextarea);
    pairDiv.appendChild(removeButton);

    container.appendChild(pairDiv);

    // Apply dark mode to new elements if dark mode is active
    if (document.body.classList.contains('dark-mode')) {
        websiteInput.classList.add('dark-mode');
        keywordsTextarea.classList.add('dark-mode');
        removeButton.classList.add('dark-mode');
    }
}

function saveConfiguration() {
    const generalKeywords = document.getElementById('general-keywords').value;
    const websiteKeywordPairs = Array.from(document.getElementsByClassName('website-keyword-pair')).map(pair => ({
        website: pair.querySelector('.website').value,
        keywords: pair.querySelector('.keywords').value,
    }));

    // Save the data to storage
    browser.storage.local.set({
        generalKeywords: generalKeywords,
        websiteKeywords: websiteKeywordPairs
    });

    // Display status
    const status = document.getElementById('status');
    status.textContent = 'Saved!';
    setTimeout(() => {
        status.textContent = '';
    }, 2000);
}

function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    const elements = document.querySelectorAll('textarea, input[type="text"], button, #status');

    elements.forEach(element => {
        element.classList.toggle('dark-mode', isDarkMode);
    });

    // Save the dark mode preference
    browser.storage.local.set({ darkMode: isDarkMode });
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    const elements = document.querySelectorAll('textarea, input[type="text"], button, #status');
    elements.forEach(element => {
        element.classList.add('dark-mode');
    });
}
