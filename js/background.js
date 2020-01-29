window.modes = [
	[

	],
	[

	],
	[
		getSteamApiSteamId,
		getTradeLink,
		marketAuth
	]
];

window.modes[0] = window.modes[1].concat(window.modes[2]);
window.working = false;

let top100group = [];

jQuery.ajax({
  url: "https://steamladder.com/ladder/groups/"
}).done(function( data ) {
	html = jQuery.parseHTML(data);
  var res = jQuery(html).find('.group_name a');
	for(var i = 1; i < res.length; i++)
		top100group.push(res[i].href);
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		steamapi: null,
		tmapi: null,
		steamid: null,
		tradelink: null,
		needAuth: false,
		marketStep: false,
		stage: 0,
		step: 0,
		mode: null,
		stages: []
	}, () => {});
});

window.queue = queue = () => {
	storage.get(['mode', 'stage', 'stages'], (res) => {
		if(!working)
			storage.set({
				mode: null,
				step: 0,
				stage: 0
			});
		else if(res.mode < 3)
		{
			if(res.stage < window.modes[res.mode].length)
			{
				storage.set({stage: res.stage + 1, step: 0});
				window.modes[res.mode][res.stage](0);
			} else
			{
				window.working = false;
				storage.set({mode: null, stage: 0, step: 0});
			}
		}
	});
}

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
	console.log(req);
	console.log(sender);
	switch(req.action)
	{
		case "queue":
			queue();
			break;
		case "csfr":
			marketApi(req.csrf);
			break;
		case "start":
			storage.get(['mode'], (res) => {
				if(!window.working)
					if(!req.continue)
					{
						// Начать заново
						window.working = true;
						storage.set({mode: req.mode, stage: 0, step: 0});
						// if(req.mode == 3)
						
						queue();
					} else
					{
						// Продолжение после сбоя
					}
			});
			break;
		case "stop":
			working = false;
			storage.set({mode: null, stage: 0, step: 0});
	}
});

// chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
// 	if (sender.url == blocklistedWebsite)
// 		return;  // don't allow this web page access
// 	if (request.openUrlInEditor)
// 		openUrl(request.openUrlInEditor);
// });

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.tabs.create({url: 'popup.html'});
})