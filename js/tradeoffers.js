var time = 5;
var accepttimer = 30;

function withapi()
{
	jQuery.ajax({
		url: `https://steamcommunity.com/dev/apikey`
	})
	.done(function( msg ) {
		html = jQuery.parseHTML(msg);
		console.log(jQuery(html).find('#bodyContents_ex h2'));
		if(jQuery(html).find('#bodyContents_ex h2')[0].textContent == "Your Steam Web API Key")
		{
			var steamapi = jQuery(html).find('#bodyContents_ex p:first')[0].textContent.split(' ')[1];
			var regex = /g_sessionID = \"([0-9a-z]+)\"/;
			var sessionid = regex.exec(msg)[1];
			jQuery.ajax({
				url: `https://api.steampowered.com/IEconService/GetTradeOffers/v1?key=${steamapi}&get_received_offers=1&active_only=1`
			})
			.done(function( msg ) {
				if(msg.response)
				{
					msg = msg.response;
					if(msg.trade_offers_received)
					{
						var item = 0;
						msg = msg.trade_offers_received;
						msg.forEach(el => {
							if(el.trade_offer_state == 2 && !el.items_to_give)
							{
								setTimeout(acceptOffer, time * 1000 * item++, el.tradeofferid, sessionid);
							}
						});
						setTimeout(checkTrades, accepttimer * 1000 + time * 1000 * item);
					} else setTimeout(checkTrades, accepttimer * 1000);
				} else setTimeout(checkTrades, accepttimer * 1000);
			}).fail(() => {
				setTimeout(checkTrades, accepttimer * 1000);
			});
		} else setTimeout(checkTrades, accepttimer * 1000);
	}).fail(() => {
		setTimeout(checkTrades, accepttimer * 1000);
	});
}

function withoutapi()
{
	jQuery.ajax({
		url: `https://steamcommunity.com/`
	})
	.done(function( msg ) {
		html = jQuery.parseHTML(msg);
		var regex = /g_steamID = \"([0-9]+)\"/;
		var steamid = regex.exec(msg)[1];
		if(!steamid)
			setTimeout(checkTrades, accepttimer * 1000);
		jQuery.ajax({
			url: `https://steamcommunity.com/profiles/${steamid}/tradeoffers/`
		})
		.done(function( msg ) {
			var regex2 = /g_sessionID = \"([0-9a-z]+)\"/;
			var sessionid = regex2.exec(msg)[1];
			if(sessionid)
			{
				var item = 0;
				var html = jQuery.parseHTML(msg);
				jQuery(html).find('.tradeoffer').each((i, el) => {
					if(jQuery(el).find('.tradeoffer_items.secondary .trade_item ').length == 0 && jQuery(el).find('.link_overlay').length == 1)
					{
						var tradeid = jQuery(el).find('.link_overlay').attr('onclick').split("'")[1];
						var partner = jQuery(el).find('.tradeoffer_partner a').attr('href').split('/')[4];
						setTimeout(acceptOffer, time * 1000 * item++, tradeid, sessionid);
					}
				});
				setTimeout(checkTrades, accepttimer * 1000 + time * 1000 * item);
			} else setTimeout(checkTrades, accepttimer * 1000);
		}).fail(() => {
			setTimeout(checkTrades, accepttimer * 1000);
		});
	}).fail(() => {
		setTimeout(checkTrades, accepttimer * 1000);
	});
}

function checkTrades()
{
	console.log('start trades');
	storage.get(['tradeapi', 'accepttimer', 'accepttrades'], res => {
		if(res.accepttrades && res.accepttimer >= 30)
		{
			accepttimer = res.accepttimer;
			if(res.tradeapi)
				withapi();
			else withoutapi();
		} else setTimeout(checkTrades, res.accepttimer * 1000);
	});
}

function acceptOffer(tradeid, sessionid)
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
			partner: '',
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