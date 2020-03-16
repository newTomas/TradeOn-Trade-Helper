function marketAuth()
{
	if(jQuery('#button-auth-steam').length == 0)
	{
		storage.get(["tradelink", "steamid"], res =>{
			if(/http:\/\/steamcommunity.com\/profiles\/([0-9]+)\/tradeoffers\/privacy/.exec(jQuery('.formpart.col1:first a').attr('href'))[1] != res.steamid)
			{
				location.href = "https://market.csgo.com/login/out";
				return;
			}
			storage.set({current: null});
			jQuery('.formpart.col1:first a').attr('href')
			if(!res.tradelink)
			{
				chrome.runtime.sendMessage({action: "error", type: "markettradelink"});
				return;
			}
			var csrf = jQuery('[name=csrf-token]').attr('content');
			if(!csrf)
			{
				chrome.runtime.sendMessage({action: "error", type: "csrf"});
				return;
			}
			jQuery.ajax({
				method: 'POST',
				url: 'https://market.csgo.com/sell/newcode/'+res.tradelink.split('=')[2],
				headers: {
					'x-csrf-token': csrf
				}
			})
			.done(function( msg ) {
				if(msg.result)
					jQuery.ajax({
						method: 'POST',
						url: 'https://market.csgo.com/docs',
						data: {
							action: 'new-api-key',
							_csrf: csrf
						}
					})
					.done(function( msg ) {
						var html = jQuery.parseHTML(msg);
						if(!jQuery(html).find('.col0:first').text())
						{
							chrome.runtime.sendMessage({action: "error", type: "marketapi"});
							return;
						}
						storage.set({
							tmapi: jQuery(html).find('.col0:first').text()
						});
						chrome.runtime.sendMessage({action: "queue"});
					}).fail((jqXHR, textStatus, errorThrown) => {
						chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "получения market api", textStatus: textStatus, errorThrown: errorThrown, stop: false});
					});
				else chrome.runtime.sendMessage({action: "error", type: "markettrade", errorcode: msg.result});
			}).fail((jqXHR, textStatus, errorThrown) => {
				chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "установки tradelink", textStatus: textStatus, errorThrown: errorThrown, stop: false});
			});
		});
	}
	else
	{
		storage.set({current: "market", needAuth: true});
		location.href = "https://market.csgo.com/login";
	}
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "market")
			marketAuth();
	});
}

window.addEventListener("load", start, false);