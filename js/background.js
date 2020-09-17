window.working = false;
curtab = null;

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		steamapi: null,
		tmapi: null,
		steamid: null,
		tradelink: null,
		needAuth: false,
		profileEdited: false,
		stage: 0,
		lvlup: 1,
		current: null,
		mode: null,
		errors: [],
		stages: [],
		attempts: 0,
		accepttrades: false,
		accepttimer: 30,
		tradeapi: false,
		custom: {
			base: false,
			gets: false,
			online: false
		},
		customsettings: {
			lvlup: 1,
			steamapiid: true,
			tmapi: true,
			tradelink: true,
			group: null,
			groupon: false,
			name: null,
			nameon: false,
			info: null,
			infoon: false
		}
	}, () => {});
});

window.queue = queue = () => {
	storage.set({current: null});
	storage.get(['mode', 'stage', 'stages', 'current'], (res) => {
		if(res.stages[res.stage - 1] == "getSteamApiSteamId")
			gettingapi = false;
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
				stop();
			}
		}
	});
}

function stop()
{
	working = false;
	storage.set({mode: null, stage: 0, current: null});
	if(curtab)
		chrome.tabs.remove(curtab);
	curtab = null;
}

function errorhandler(msg, dostop=false)
{
	console.log(msg);
	storage.get(['errors'], (res) => {
		res.errors.push(msg);
		storage.set(res);
		if(dostop)
			stop();
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
		case "error":
			switch(req.type)
			{
				case "cardcheck":
					errorhandler(`Не удалось получить информацию по карточке ${req.data}. Код ошибки: ${req.errorcode}.`, true);
					break;
				case "cardbuy":
					errorhandler(`Не удалось выставить ордер на покупку карточки ${req.data}. Код ошибки: ${req.errorcode}.`, true);
					break;
				case "ordercheck":
					errorhandler(`Не удалось проверить ордер на покупку карточки ${req.data}. Код ошибки: ${req.errorcode}.`);
					break;
				case "levelup":
					errorhandler(`Не удалось создать значок (значки). Код ошибки: ${req.errorcode}.`);
					break;
				case "getgems":
					errorhandler(`Не удалось превратить смайлик ${req.data} в самоцветы. Код ошибки: ${req.errorcode}.`);
					break;
				case "searchgems":
					errorhandler(`Не удалось найти подходящий смайлик для превращения в самоцветы.`);
					break;
				case "ajax":
					errorhandler(`Не удалось отправить запрос API на этапе ${req.stage}. Код ошибки: ${req.textStatus}. Текст ошибки: ${req.errorThrown}`, req.stop);
					break;
				case "post":
					errorhandler(`Не удалось найти поле для ввода статуса.`);
					break;
				case "like":
					errorhandler(`Не удалось найти статус, чтобы поставить лайк.`);
					break;
				case "explore":
					errorhandler(`Не нашел кнопку след рекомендации.`);
					break;
				case "searchavatar":
					storage.get(['attempts', 'stages'], res => {
						if(res.attempts < 3)
						{
							res.stages.push('SetupCommunityAvatar');
							res.attempts++;
							storage.set(res);
						}
						else errorhandler(`Не удалось найти официальные аватарки.`);
					});
					break;
				case "ava":
					storage.get(['attempts', 'stages'], res => {
						if(res.attempts < 3)
						{
							res.stages.push('SetupCommunityAvatar');
							res.attempts++;
							storage.set(res);
						}
						else errorhandler(`Не удалось установить аватар.`);
					});
					break;
				case "searchbages":
					errorhandler(`Не удалось получить информацию по значкам.`, true);
					break;
				case "discovery":
					errorhandler(`Не удалось начать просмотр списка рекомендаций.`);
					break;
				case "csrf":
					errorhandler(`Не удалось получить csrf (market).`);
					break;
				case "markettrade":
					errorhandler(`market не принял новый tradelink. Код ошибки: ${req.errorcode}`);
					break;
				case "marketapi":
					errorhandler(`Не удалось получить market api.`);
					break;
				case "privacy":
					errorhandler(`Не удалось установить настройки приватности. Код ошибки: ${req.errorcode}`);
					break;
				case "profilesave":
					errorhandler(`Не удалось сохранить профиль.`);
					break;
				case "realname":
					errorhandler(`Не удалось установить реальное имя.`);
					break;
				case "badge":
					errorhandler(`Не удалось установить значок.`);
					break;
				case "background":
					errorhandler(`Не удалось найти фоны профиля`);
					break;
				case "summary":
					errorhandler(`Не удалось установить информацию о себе.`);
					break;
				case "wishlist":
					errorhandler(`Не удалось добавить игру в список желаемого.`);
					break;
				case "sharedfile":
					errorhandler(`Не удалось подписаться на мастерскую. Код ошибки: ${req.errorcode}`);
					break;
				case "steamapi":
					errorhandler(`Не удалось получить steamapi.`);
					break;
				case "steamauth":
					errorhandler(`Не удалось авторизоваться в маркете через стим.`, true);
					break;
				case "tradelink":
					errorhandler(`Не удалось получить trade link.`, true);
					break;
				case "markettradelink":
					errorhandler(`Trade link не был получен, невозможно его установить в market.`, true);
					break;
				case "nogroupid":
					errorhandler(`Не удалось найти группу, которую можно установить как главную.`);
					break;
				case "nosteamid":
					errorhandler(`Не удалось получить steamid, возможно вы не авторизованы!`, true);
					break;
				case "nosessionid":
					errorhandler(`Не удалось получить sessionid, возможно вы не авторизованы!`, true);
					break;
				case "noapitoken":
					errorhandler(`Не удалось получить apitoken, возможно вы не авторизованы!`, true);
					break;
				case "SetFavoriteBadge":
					errorhandler(`Не удалось установить значок на показ`);
					break;
			}
			queue();
			break;
		case "bages":
			// Вырезано: UseDiscoveryQueue
			let needs = ["ViewBroadcast", "SubscribeToWorkshopItem", "RateUpContentInActivityFeed", "AddItemToWishlist", "JoinGroup", "SearchInDiscussions", "FeatureBadgeOnProfile"];
			let arr = ['getFreeLicenses'];
			let profile = [];
			let profilearr = ["AddSummary", "MainGroup", "SetupCommunityRealName"];
			for(var el in req.bages)
			{
				//req.bages[el] = true;
				if(needs.includes(el) && req.bages[el])
				{
					// if(el == "FeatureBadgeOnProfile")
					// 	profilearr.push(el);
					// else arr.push(el);
					arr.push(el);
				}
			}
			arr.push("SetupCommunityAvatar", "ProfileEdit", "Privacy");
			//arr.push("AddItemToWishlist");
			storage.get(["stages", "mode"], res => {
				arr.push('Chat');
				console.log(arr.concat(res.stages));
				storage.set({stages: arr.concat(res.stages), stage: 0, profilearr: profilearr}, queue);
			})
			break;
		case "start":
			storage.get(['custom', 'customsettings'], (res) => {
				if(!window.working)
					if(!req.continue)
					{
						// Начать заново
						window.working = true;
						storage.set({mode: req.mode, stage: 0, stages: [], attempts: 0});

						let stages = [];

						if(req.mode == 5)
						{
							if(res.customsettings.steamapiid)
								stages.push('getSteamApiSteamId');
							if(res.customsettings.tradelink)
								stages.push('getTradeLink');
							if(res.customsettings.tmapi)
								stages.push('marketAuth');
							if(res.customsettings.lvlup > 1)
								stages.push('Level');
							storage.set({stages: stages});
							checkprofile();
							return;
						}

						if(req.mode % 2 == 0)
						{
							stages.push("getSteamApiSteamId", "getTradeLink", "marketAuth");
						}
						
						if(req.mode < 4)
						{
							if(req.mode < 2)
							{
								storage.set({lvlup: 7});
								stages.push('Level');
							}
							else storage.set({lvlup: 1});
							storage.set({stages: stages});
							checkprofile();
						} else
						{
							storage.set({stages: stages});
							queue();
						}
					} else
					{
						// Продолжение после сбоя
					}
			});
			break;
		case "stop":
			stop();
	}
});

var gettingapi = false;

function hookerAPI(details)
{
	if(details.type != "xmlhttprequest" && !gettingapi)
		return;
	for(var n in details.requestHeaders){
		if(details.requestHeaders[n].name == "Accept-Language"){
			details.requestHeaders[n].value = 'en-US;q=0.8,en;q=0.7';
			break;
		}
	}
	return {requestHeaders:details.requestHeaders};
}

function hookerHeaders(details)
{
	if(details.type != "xmlhttprequest")
		return;
	for(var n in details.requestHeaders){
		if(details.requestHeaders[n].name == "Cookie"){
			details.requestHeaders[n].value = '';
		}
		if(details.requestHeaders[n].name == "Accept-Language"){
			details.requestHeaders[n].value = 'en-US;q=0.8,en;q=0.7';
		}
	}
	return {requestHeaders:details.requestHeaders};
}

function hookerTM(details)
{
	if(details.type != "xmlhttprequest")
		return;
	for(var n in details.requestHeaders){
		if(details.requestHeaders[n].name == "Cookie"){
			details.requestHeaders[n].value = details.requestHeaders[n].value.replace('_language=en', '_language=ru');
			break;
		}
	}
	console.log(details);
	return {requestHeaders:details.requestHeaders};
}

function hookerBages(details)
{
	if(details.type != "xmlhttprequest")
		return;
	for(var n in details.requestHeaders){
		if(details.requestHeaders[n].name == "Accept-Language"){
			details.requestHeaders[n].value = 'ru,en;q=0.9,en-US;q=0.8,ru-RU;q=0.7';
			break;
		}
	}
	console.log(details);
	return {requestHeaders:details.requestHeaders};
}

chrome.webRequest.onBeforeSendHeaders.addListener(hookerBages,
	{
		urls:["https://steamcommunity.com/profiles/*/ajaxcraftbadge/", "https://steamcommunity.com/id/*/ajaxcraftbadge/"]
	},
	[
		"requestHeaders",
		"blocking",
		"extraHeaders"
	]);

chrome.webRequest.onBeforeSendHeaders.addListener(hookerTM,
{
	urls:["https://market.csgo.com/docs"]
},
[
	"requestHeaders",
	"blocking",
	"extraHeaders"
]);

chrome.webRequest.onBeforeSendHeaders.addListener(hookerHeaders,
{
	urls:["https://steamcommunity.com/groups/*"]
},
[
	"requestHeaders",
	"blocking",
	"extraHeaders"
]);

chrome.webRequest.onBeforeSendHeaders.addListener(hookerAPI,
{
	urls:["https://steamcommunity.com/dev/apikey"]
},
[
	"requestHeaders",
	"blocking",
	"extraHeaders"
]);

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.tabs.create({url: 'popup.html'});
})
