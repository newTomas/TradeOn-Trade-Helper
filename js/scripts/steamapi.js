function getSteamApiSteamId2()
{
	jQuery("body").append("<script>jQuery('body').append(\"<p id='steamid' style='display: none;'>\"+g_steamID+\"</p>\")</script>");
	if(!jQuery("#steamid").text())
		chrome.runtime.sendMessage({
			action: "stop"
		});
	else switch(jQuery('#bodyContents_ex h2')[0].textContent)
	{
		case "Ваш ключ Steam Web API":
			storage.set({
				steamapi: jQuery('#bodyContents_ex p:first')[0].textContent.split(' ')[1],
				steamid: jQuery("#steamid").text()
			});
			chrome.runtime.sendMessage({action: "queue"});
			close();
			break;
		case "Зарегистрировать новый ключ Steam Web API":
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
				var html = jQuery.parseHTML(msg);
				storage.set({
					steamapi: jQuery(html).find('#bodyContents_ex p:first')[0].textContent.split(' ')[1],
					steamid: jQuery("#steamid").text()
				});
				chrome.runtime.sendMessage({action: "queue"});
				close();
			});
		break;
	}
}

window.addEventListener("load", getSteamApiSteamId2, false);