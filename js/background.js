//window.arr = [];

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		stage: 0,
		step: 0,
		working: false,
		stages: []
	}, () => {});
});

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
	storage.set({working: true});
	switch(req.action)
	{
		case "start":
			setTimeout(() => storage.set({working: false}), 3000);
	}
});

// chrome.browserAction.onClicked.addListener((tab) => {
// 	chrome.tabs.create({url: 'popup.html'});
// })