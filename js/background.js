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
		stages: []
	}, () => {});
});

window.queue = queue = () => {
	storage.set({current: ''});
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
				storage.set({mode: null, stage: 0, stages: []});
			}
		}
	});
}

function stop()
{
	working = false;
	storage.set({mode: null, stage: 0, current: null});
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
					console.error(`Не удалось получить информацию по карточке ${req.data}. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}.`);
					break;
				case "cardbuy":
					console.error(`Не удалось выставить ордер на покупку карточки ${req.data}. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}.`);
					break;
				case "ordercheck":
					console.error(`Не удалось проверить ордер на покупку карточки ${req.data}. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}.`);
					break;
				case "levelup":
					console.error(`Не удалось создать значок (значки). Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}.`);
					break;
				case "getgems":
					console.error(`Не удалось превратить смайлик ${req.data} в самоцветы. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}.`);
					break;
				case "searchgems":
					console.error(`Не удалось найти подходящий смайлик для превращения в самоцветы. Пожалуйста, убедитесь что стим работает корректно и подходящий смайлик есть, а после того как закончится работа скрипта, запустите повторно.`);
					break;
				case "ajax":
					console.error(`Не удалось отправить запрос API на этапе ${req.stage}. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.textStatus}. Текст ошибки: ${req.errorThrown}`);
					if(req.stop)
						stop();
					break;
				case "post":
					console.error(`Не удалось найти поле для ввода статуса. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "like":
					console.error(`Не удалось найти статус, чтобы поставить лайк. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "searchavatar":
					console.error(`Не удалось найти официальные аватарки. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "searchbages":
					console.error(`Не удалось получить информацию по значкам. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					stop();
					break;
				case "discovery":
					console.error(`Не удалось начать просмотр списка рекомендаций. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "csrf":
					console.error(`Не удалось получить csrf. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "markettrade":
					console.error(`market не принял новый tradelink. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}`);
					break;
				case "marketapi":
					console.error(`Не удалось получить market api. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "privacy":
					console.error(`Не удалось установить настройки приватности. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}`);
					break;
				case "profilesave":
					console.error(`Не удалось сохранить профиль. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "realname":
					console.error(`Не удалось установить реальное имя. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "badge":
					console.error(`Не удалось установить значок. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "summary":
					console.error(`Не удалось установить информацию о себе. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "wishlist":
					console.error(`Не удалось добавить игру в список желаемого. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "sharedfile":
					console.error(`Не удалось подписаться на мастерскую. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта. Код ошибки: ${req.errorcode}`);
					break;
				case "steamapi":
					console.error(`Не удалось получить steamapi. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "steamauth":
					console.error(`Не удалось авторизоваться в маркете через стим. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					stop();
					break;
				case "tradelink":
					console.error(`Не удалось получить trade link. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					stop();
					break;
				case "markettradelink":
					console.error(`Trade link не был получен, невозможно его установить в market. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					stop();
					break;
				case "nogroupid":
					console.error(`Не удалось найти группу, которую можно установить как главную. Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					break;
				case "nosteamid":
					console.error(`Не удалось получить steamid, возможно вы не авторизованы! Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					stop();
					break;
				case "nosessionid":
					console.error(`Не удалось получить sessionid, возможно вы не авторизованы! Пожалуйста, убедитесь что стим работает корректно, и запустите повторно, после того как закончится работа скрипта.`);
					stop();
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
			arr.push("ProfileEdit", "Privacy", "Chat");
			storage.get(["stages"], res => {
				console.log(arr.concat(res.stages));
				storage.set({stages: arr.concat(res.stages), stage: 0, profilearr: profilearr}, queue);
			})
			break;
		case "start":
			storage.get(['mode'], (res) => {
				if(!window.working)
					if(!req.continue)
					{
						// Начать заново
						window.working = true;
						storage.set({mode: req.mode, stage: 0, stages: []});
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
			stop();
	}
});

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.tabs.create({url: 'popup.html'});
})