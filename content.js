document.addEventListener('mouseup', function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.runtime.sendMessage({ type: 'fetchMeaning', word: selectedText });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'speakMeaning') {
        const utterance = new SpeechSynthesisUtterance(`${message.word} means ${message.meaning}`);
        window.speechSynthesis.speak(utterance);
    }
});
