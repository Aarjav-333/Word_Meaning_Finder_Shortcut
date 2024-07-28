chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'wordMeaningFinder',
        title: 'Get meaning of "%s"',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'wordMeaningFinder') {
        fetchMeaning(info.selectionText, tab.id);
    }
});

async function fetchMeaning(word, tabId) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        const meaning = data[0].meanings[0].definitions[0].definition;

        // Inject content script if not already injected
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }

            // Send the meaning to the content script for speech synthesis
            chrome.tabs.sendMessage(tabId, { type: 'speakMeaning', word, meaning });

            // Create notification
            chrome.notifications.create('', {
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: `Meaning of ${word}`,
                message: meaning
            });
        });
    } catch (error) {
        console.error(error);
    }
}
