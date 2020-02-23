function LevelUp()
{
	jQuery("body").append("<script>jQuery('body').append(\"<p id='sessionid' style='display: none;'>\"+g_sessionID+\"</p>\")</script>");
	var sessionid = jQuery("#sessionid").text();

	jQuery("body").append("<script>jQuery('body').append(\"<p id='steamid' style='display: none;'>\"+g_steamID+\"</p>\")</script>");
	steamid = jQuery("#steamid").text();

	storage.get(["level"], res => {
		jQuery.ajax({
			method: 'POST',
			url: `https://steamcommunity.com/profiles/${steamid}/ajaxcraftbadge/`,
			data: {
				appid: 730,
				series: 1,
				border_color: 0,
				levels: res.level,
				sessionid: sessionid
			}
		})
		.done(function( msg ) {
			if(msg.success != 1)
				chrome.runtime.sendMessage({action: "error", type: "levelup", errorcode: msg.success});
			else
			{
				var background = false;
				var smile = false;
				msg.rgDroppedItems.forEach(el => {
					if(el.label == "Фон")
						background = true;
					if(el.label == "Смайлик")
						smile = true;
				});
				storage.get(["stages"], (res) => {
					var a = {stages: []};
					if(smile)
						a.stages.push('Gems');
					if(background)
					{
						a.stages.push('ProfileEdit');
						a.profilearr = ['Background'];
					}
					a.stages = res.stages.concat(a.stages);
					storage.set(a);
				});
			}
			chrome.runtime.sendMessage({action: "queue"});
		});
	});
}

function start()
{
	// storage.get(["current"], res => {
	// 	if(res.current == "levelup")
	// 		LevelUp();
	// });
}

window.addEventListener("load", start, false);