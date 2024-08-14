// options.js

// Load saved keywords
browser.storage.local.get("keywords").then((result) => {
    document.getElementById("keywords").value = result.keywords ? result.keywords.join(", ") : "";
});

// Save keywords
document.getElementById("save").addEventListener("click", () => {
    const keywords = document.getElementById("keywords").value.split(",").map(keyword => keyword.trim());
    browser.storage.local.set({keywords: keywords}).then(() => {
        alert("Keywords saved!");
    });
});
