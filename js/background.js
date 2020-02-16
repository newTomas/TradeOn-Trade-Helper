window.working = false;
curtab = null;

let top100group = [];
let top30workshop = [];
let topbroadcast = '';

jQuery.ajax({
  url: "https://steamladder.com/ladder/groups/"
}).done(function( data ) {
	html = jQuery.parseHTML(data);
  var res = jQuery(html).find('.group_name a');
	for(var i = 1; i < res.length; i++)
		top100group.push(res[i].href);
});

jQuery.ajax({
	url: "https://steamcommunity.com/workshop/browse/?appid=512900&browsesort=trend&section=readytouseitems"
}).done(function(data){
	html = jQuery.parseHTML(data);
	jQuery(html).find('.workshopItemTitle').each((i, el) => {
		top30workshop.push(jQuery(el)[0].parentElement.href)
	});
})

jQuery.ajax({
	url: "https://steamcommunity.com/apps/allcontenthome?l=russian&browsefilter=trend&appHubSubSection=13"
}).done(function(data){
	html = jQuery.parseHTML(data);
	topbroadcast = jQuery(html).find(".Broadcast_Card a:first")[0].href;
})

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		steamapi: null,
		tmapi: null,
		steamid: null,
		tradelink: null,
		needAuth: false,
		stage: 0,
		mode: null,
		stages: []
	}, () => {});
});

window.queue = queue = () => {
	storage.get(['mode', 'stage', 'stages'], (res) => {
		if(!working)
			storage.set({
				mode: null,
				stage: 0
			});
		else
		{
			if(res.stage < res.stages.length)
			{
				storage.set({stage: res.stage + 1});
				window[res.stages[res.stage]]();
			} else
			{
				chrome.tabs.remove(curtab);
				curtab = null;
				window.working = false;
				storage.set({mode: null, stage: 0});
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
		case "bages":
			let needs = ["ViewBroadcast", "SubscribeToWorkshopItem", "UseDiscoveryQueue", "RateUpContentInActivityFeed", "AddItemToWishlist", "JoinGroup", "SetupCommunityRealName", "SearchInDiscussions", "FeatureBadgeOnProfile", "SetupCommunityAvatar"];
			let arr = [];
			let profile = [];
			for(var el in req.bages)
			{
				if(needs.includes(el) && req.bages[el])
					arr.push(el);
			}
			arr.push("ViewBroadcast");
			storage.get(["stages"], res => {
				console.log(arr.concat(res.stages));
				storage.set({stages: arr.concat(res.stages), stage: 0}, queue);
			})
			break;
		case "start":
			storage.get(['mode'], (res) => {
				if(!window.working)
					if(!req.continue)
					{
						// Начать заново
						window.working = true;
						storage.set({mode: req.mode, stage: 0});
						if(req.mode == 0 || req.mode == 2)
							storage.set({stages: ["getSteamApiSteamId", "getTradeLink", "marketAuth"], stage: 0});
						if(req.mode < 2)
							checkprofile();
						else queue();
					} else
					{
						// Продолжение после сбоя
					}
			});
			break;
		case "stop":
			working = false;
			storage.set({mode: null, stage: 0});
	}
});

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.tabs.create({url: 'popup.html'});
})