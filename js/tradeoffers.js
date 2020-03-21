function checkTrades()
{
	console.log('start trades');
	storage.get(['steamid','accepttrades', 'accepttimer'], res => {
		if(res.accepttrades && res.accepttimer > 5 && res.steamid)
		{
			jQuery.ajax({
				url: `https://steamcommunity.com/profiles/${res.steamid}/tradeoffers/`
			})
			.done(function( msg ) {
				var regex2 = /g_sessionID = \"([0-9a-z]+)\"/;
				var sessionid = regex2.exec(msg)[1];
				if(sessionid)
				{
					var html = jQuery.parseHTML(msg);
					jQuery(html).find('.tradeoffer').each((i, el) => {
						if(jQuery(el).find('.tradeoffer_items.secondary .trade_item ').length == 0 && jQuery(el).find('.link_overlay').length == 1)
						{
							var tradeid = jQuery(el).find('.link_overlay').attr('onclick').split("'")[1];
							var partner = jQuery(el).find('.tradeoffer_partner a').attr('href').split('/')[4];
							acceptOffer(tradeid, sessionid, partner);
						}
					});
				}
			});
		}
		setTimeout(checkTrades, res.accepttimer * 1000);
	});
}

function acceptOffer(tradeid, sessionid, partner)
{
	chrome.webRequest.onBeforeSendHeaders.addListener(hookerHeaders,
	{
		urls:["https://steamcommunity.com/tradeoffer/*/accept"]
	},
	[
		"requestHeaders",
		"blocking",
		"extraHeaders"
	]);

	jQuery.ajax({
		method: 'POST',
		url: `https://steamcommunity.com/tradeoffer/${tradeid}/accept`,
		data: {
			sessionid: sessionid,
			serverid: 1,
			tradeofferid: tradeid,
			partner: partner,
			captcha: ''
		}
	})
	.done(function( msg ) {
		console.log(msg);
	}).always(() => {
		chrome.webRequest.onBeforeSendHeaders.removeListener(hookerHeaders);
	});
}

function hookerHeaders(details)
{
	var newRef = 'https://steamcommunity.com/tradeoffer/new/';
	var hasRef = false;
	for(var n in details.requestHeaders){
		hasRef = details.requestHeaders[n].name == "Referer";
		if(hasRef){
			details.requestHeaders[n].value = newRef;
			break;
		}
	}
	if(!hasRef){
		details.requestHeaders.push({name:"Referer",value:newRef});
	}
	return {requestHeaders:details.requestHeaders};
}

checkTrades();