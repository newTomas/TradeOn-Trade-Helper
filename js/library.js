let storage = {};

storage.set = async (changes, callback = null) => {
	chrome.storage.sync.set(changes, (res) => {
		if(callback != null)
			callback(res);
	});
}

storage.get = async (keys, callback) => {
	chrome.storage.sync.get(keys, function(result) {
		callback(result);
	});
}

async function getSteamApiSteamId(step)
{
	if(step == 0)
	{
		storage.set({step: 1});
		chrome.tabs.create({url: 'https://steamcommunity.com/dev/apikey'}, (tab) => {
			getSteamApiSteamId1(tab);
		});
	}
}

async function getTradeLink(step)
{
	if(step == 0)
	{
		storage.set({step: 1});
		chrome.tabs.create({url: 'https://steamcommunity.com/id/me/tradeoffers/privacy'}, (tab) => {
			getTradeLink1(tab);
		});
	}
}

async function marketAuth(step)
{
	if(step == 0)
	{
		storage.set({step: 1, marketStep: true});
		chrome.tabs.create({url: 'https://market.csgo.com/'});
	}
}

async function checkprofile(step)
{
	storage.set({step: 1, checkprofile: true});
	chrome.tabs.create({url: 'https://steamcommunity.com/'});
}

async function ViewBroadcast(step)
{
	if(step == 0)
	{
		storage.set({step: 1, broadcast: true});
		chrome.tabs.create({url: topbroadcast}, (tab) => {
			curtab = tab.id;
		});
	}
}

async function SubscribeToWorkshopItem(step)
{
	if(step == 0)
	{
		storage.set({step: 1, workshop: true});
		chrome.tabs.create({url: top30workshop[Math.round(Math.random() * 29)]}, (tab) => {
			curtab = tab.id;
		});
	}
}

async function getSteamApiSteamId1(tab)
{
	chrome.tabs.executeScript(tab.id, {
		file: "js/jquery-3.4.1.min.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "js/library.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "js/scripts/steamapi.js"
	});
}

async function getTradeLink1(tab)
{
	chrome.tabs.executeScript(tab.id, {
		file: "js/jquery-3.4.1.min.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "js/library.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "js/scripts/tradelink.js"
	});
}