document.getElementById("enable").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
    alert("Audio delay enabled for current Google Meet.");
});

document.getElementById("disable").addEventListener("click", async () => {
    // Implement disable functionality if needed
    alert("Audio delay disabled.");
});
