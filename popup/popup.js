document.addEventListener('DOMContentLoaded', () => {
    // Load saved preferences including dark mode
    browser.storage.local.get(["darkMode", "generalKeywords", "websiteKeywords", "replacementPairs", "enableAutomaticReplacement"]).then((result) => {
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
        }
        if (result.replacementPairs) {
            document.getElementById('replacement-pairs').value = result.replacementPairs;
        }
        if (result.enableAutomaticReplacement) {
            document.getElementById('enable-automatic-replacement').checked = result.enableAutomaticReplacement;
        }
    });

    // Add the rainbow shine effect to the Ko-fi button
    const supportButton = document.getElementById('support');
    supportButton.classList.add('rainbow-shine');
    // Set a timeout to remove the rainbow animation after 2 seconds
    setTimeout(() => {
        supportButton.classList.remove('rainbow-shine');
    }, 2000);

    // Add event listener to the Dark Mode toggle button
    document.getElementById('toggle-dark-mode').addEventListener('click', () => {
        toggleDarkMode();
    });

    // Add event listener to save button
    document.getElementById('save').addEventListener('click', () => {
        saveConfiguration();
    });

    // Add event listener to the checkbox
    // document.getElementById('enable-automatic-replacement').addEventListener('change', () => {
    //     toggleAutomaticReplacement();
    // });

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
    const replacementPairs = document.getElementById('replacement-pairs').value;
    const websiteKeywordPairs = Array.from(document.getElementsByClassName('website-keyword-pair')).map(pair => ({
        website: pair.querySelector('.website').value,
        keywords: pair.querySelector('.keywords').value,
    }));
    //const enableAutomaticReplacement = document.getElementById('enable-automatic-replacement').checked; // Use .checked for checkbox 


    console.log("burh")
    // Save the data to storage
    browser.storage.local.set({
        generalKeywords: generalKeywords,
        replacementPairs: replacementPairs,
        websiteKeywords: websiteKeywordPairs,
        //enableAutomaticReplacement: enableAutomaticReplacement
    });

    // Display status
    const status = document.getElementById('status');
    status.textContent = 'Saved!';
    setTimeout(() => {
        status.textContent = '';
    }, 2000);
    console.log("bruh")
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

function toggleAutomaticReplacement() {
    const checkbox = document.getElementById('enable-automatic-replacement');
    const isAutomaticReplacement = checkbox.checked; // Use .checked for checkbox
    const elements = document.querySelectorAll('textarea, input[type="text"], button, #status');

    elements.forEach(element => {
        element.classList.toggle('enable-automatic-replacement', isAutomaticReplacement);
    });

    // Save the automatic replacement preference
    browser.storage.local.set({ enableAutomaticReplacement: isAutomaticReplacement });
}

function enableAutomaticReplacement() {
    const checkbox = document.getElementById('enable-automatic-replacement');
    checkbox.checked = true; // Ensure checkbox is checked
    const elements = document.querySelectorAll('textarea, input[type="text"], button, #status');
    elements.forEach(element => {
        element.classList.add('enable-automatic-replacement');
    });
}