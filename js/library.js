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

async function getSteamApiSteamId()
{
	storage.set({step: 1, current: "steamapi"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://steamcommunity.com/dev/apikey'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://steamcommunity.com/dev/apikey'}, (tab) => {
		curtab = tab.id;
	});
}

async function getTradeLink()
{
	storage.set({step: 1, current: "tradelink"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://steamcommunity.com/id/me/tradeoffers/privacy'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://steamcommunity.com/id/me/tradeoffers/privacy'}, (tab) => {
		curtab = tab.id;
	});
}

async function marketAuth()
{
	storage.set({step: 1, current: "market"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://market.csgo.com/'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://market.csgo.com/'}, (tab) => {
		curtab = tab.id;
	});
}

async function checkprofile()
{
	storage.set({step: 1, current: "checkprofile"});
	chrome.tabs.create({url: 'https://steamcommunity.com/', active: false}, tab => {
		curtab = tab.id;
	});
}

async function ViewBroadcast()
{
	storage.set({step: 1, current: "broadcast"});
	if(curtab)
		chrome.tabs.update(curtab, {url: topbroadcast}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: topbroadcast}, tab => {
		curtab = tab.id;
	});
}

async function SubscribeToWorkshopItem()
{
	storage.set({step: 1, current: "workshop"});
	chrome.tabs.create({url: top30workshop[Math.round(Math.random() * 29)]});
}

async function UseDiscoveryQueue()
{
	storage.set({step: 1, current: "discovery"});
	chrome.tabs.create({url: 'https://store.steampowered.com/explore/'});
}

async function RateUpContentInActivityFeed()
{
	storage.set({step: 1, current: "activity"});
	chrome.tabs.create({url: 'https://steamcommunity.com/id/me/home/'});
}