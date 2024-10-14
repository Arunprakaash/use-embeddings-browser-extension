// This script runs in the extension context
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'log') {
        console.log(request.message);
        sendResponse({ status: 'logged' });
    }
});