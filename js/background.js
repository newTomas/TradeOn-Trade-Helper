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
		current: null,
		mode: null,
		errors: [],
		stages: [],
		custom: {
			base: false,
			gets: false,
			online: false
		},
		customsettings: {
			steamapiid: true,
			tmapi: true,
			tradelink: true,
			group: null,
			name: null,
			info: null
		}
	}, () => {});
});

window.queue = queue = () => {
	storage.set({current: null});
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
					errorhandler(`Не удалось получить информацию по карточке ${req.data}. Код ошибки: ${req.errorcode}.`);
					break;
				case "cardbuy":
					errorhandler(`Не удалось выставить ордер на покупку карточки ${req.data}. Код ошибки: ${req.errorcode}.`);
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
				case "searchavatar":
					errorhandler(`Не удалось найти официальные аватарки.`);
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
			}
			queue();
			break;
		case "bages":
			let needs = ["ViewBroadcast", "SubscribeToWorkshopItem", "UseDiscoveryQueue", "RateUpContentInActivityFeed", "AddItemToWishlist", "JoinGroup", "SetupCommunityRealName", "SearchInDiscussions", "FeatureBadgeOnProfile", "SetupCommunityAvatar"];
			let arr = [];
			let profile = [];
			let profilearr = ["AddSummary", "MainGroup"];
			for(var el in req.bages)
			{
				req.bages[el] = true;
				if(needs.includes(el) && req.bages[el])
				{
					if(el == "SetupCommunityRealName" || el == "FeatureBadgeOnProfile")
						profilearr.push(el);
					else arr.push(el);
				}
			}
			//profilearr = ["FeatureBadgeOnProfile", "SetupCommunityRealName"];
			arr.push("ProfileEdit", "Privacy");
			storage.get(["stages", "mode"], res => {
				if(res.mode != 3)
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
						storage.set({mode: req.mode, stage: 0, stages: []});
						if(req.mode == 3)
						{
							let stages = [];
							if(res.custom.gets)
							{
								if(res.customsettings.steamapiid)
									stages.push('getSteamApiSteamId');
								if(res.customsettings.tradelink)
									stages.push('getTradeLink');
								if(res.customsettings.tmapi)
									stages.push('marketAuth');
							}
							if(res.custom.online)
								stages.push('Chat');
							storage.set({stages: stages});
							if(res.custom.base)
								checkprofile();
							else queue();
						}
						else
						{
							if(req.mode == 0 || req.mode == 2)
								storage.set({stages: ["getSteamApiSteamId", "getTradeLink", "marketAuth"]});
							if(req.mode < 2)
								checkprofile();
							else queue();
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

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.tabs.create({url: 'popup.html'});
})