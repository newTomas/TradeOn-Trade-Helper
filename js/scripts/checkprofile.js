function runCheck()
{
	storage.set({current: null});
	let steamid = getSteamid();

	jQuery.ajax({
		url: "https://steamcommunity.com/profiles/"+ steamid +"/badges/2"
	}).done((data) => {
		html = jQuery.parseHTML(data);
		bages = {};
		if(jQuery(html).find(".badge_detail_tasks").children().find('img').length == 0)
		{
			chrome.runtime.sendMessage({action: "error", type: "searchbages"});
			return;
		}
		jQuery(html).find(".badge_detail_tasks").children().find('img').each((i, el) => {
			var cur = el.src.substring(72, el.src.length - 8).split('_');
			bages[cur[0]] = (cur[1] != 'on');
		});
		chrome.runtime.sendMessage({action: "bages", bages: bages});
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "проверки профиля", textStatus: textStatus, errorThrown: errorThrown, stop: true});
	});
}

function runGems()
{
	storage.set({current: null});
	let steamid = getSteamid();
	let sessionid = getSessionid();

	jQuery.ajax({
		url: `https://steamcommunity.com/inventory/${steamid}/753/6?l=russian`
	}).done(function(data) {
		//console.log(data);
		var flag = false;
		for(var i = 0; i < data.descriptions.length; i++)
		{
			if(data.descriptions[i].market_fee_app != 730)
				continue;

			data.descriptions[i].tags.forEach(cur => {
				if(cur.localized_tag_name == "Смайлик")
				{
					flag = true;
					return true;
				}
			});
			if(flag)
				break;
		}
		if(flag)
		{
			for(var j = 0; j < data.assets.length; j++)
			{
				if(data.assets[j].classid == data.descriptions[i].classid)
					break;
			}
			jQuery.ajax({
				method: "POST",
				url: `https://steamcommunity.com/profiles/${steamid}/ajaxgrindintogoo/`,
				data: {
					sessionid: sessionid,
					appid: 730,
					assetid: data.assets[j].assetid,
					contextid: data.assets[j].contextid,
					goo_value_expected: 100
				}
			}).done(function(data) {
				if(data.success != 1)
					chrome.runtime.sendMessage({action: "error", type: "getgems", data: data.descriptions[i].market_name, errorcode: msg.success});
				chrome.runtime.sendMessage({action: "queue"});
			}).fail((jqXHR, textStatus, errorThrown) => {
				chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "преобразовании фона в самоцветы", textStatus: textStatus, errorThrown: errorThrown});
			});
		}
		else chrome.runtime.sendMessage({action: "error", type: "searchgems"});
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "получении инвентаря", textStatus: textStatus, errorThrown: errorThrown});
	});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "checkprofile")
			runCheck();
		else if(res.current == "gems")
			runGems();
	});
}

window.addEventListener("load", start, false);