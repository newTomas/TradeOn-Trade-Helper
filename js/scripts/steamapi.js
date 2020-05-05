function getSteamApiSteamId2()
{
	storage.set({current: ""});
	let steamid = getSteamid();
	if(!jQuery("#steamid").text())
		chrome.runtime.sendMessage({
			action: "stop"
		});
	else switch(jQuery('#bodyContents_ex h2')[0].textContent)
	{
		case "Your Steam Web API Key":
			storage.set({
				steamapi: jQuery('#bodyContents_ex p:first')[0].textContent.split(' ')[1],
				steamid: steamid
			});
			chrome.runtime.sendMessage({action: "queue"});
			break;
		case "Register for a new Steam Web API Key":
			jQuery.ajax({
				method: "POST",
				url: "https://steamcommunity.com/dev/registerkey",
				data: {
					domain: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
					sessionid: jQuery("[name=sessionid]").val(),
					agreeToTerms: "agreed",
					Submit: "Зарегистрировать"
				}
			})
			.done(function( msg ) {
				console.log(msg);
				var html = jQuery.parseHTML(msg);
				storage.set({
					steamapi: jQuery(html).find('#bodyContents_ex p:first')[0].textContent.split(' ')[1],
					steamid: steamid
				});
				chrome.runtime.sendMessage({action: "queue"});
			}).fail((jqXHR, textStatus, errorThrown) => {
				chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "получения steamapi", textStatus: textStatus, errorThrown: errorThrown, stop: false});
			});
			break;
		default:
			chrome.runtime.sendMessage({action: "error", type: "steamapi"});
	}
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "steamapi")
			getSteamApiSteamId2();
	});
}

window.addEventListener("load", start, false);