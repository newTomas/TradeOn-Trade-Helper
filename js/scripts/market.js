function marketAuth()
{
	if(jQuery('#button-auth-steam').length == 0)
	{
		storage.set({
			step: 3,
			marketStep: false
		});
		storage.get(["tradelink"], res =>{
			var csrf = jQuery('[name=csrf-token]').attr('content');
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
						storage.set({
							tmapi: jQuery(html).find('.col0:first').text()
						});
						chrome.runtime.sendMessage({action: "queue"});
					});
			});
		});
	}
	else
	{
		storage.set({step: 2, needAuth: true});
		location.href = "https://market.csgo.com/login";
	}
}

function start()
{
	storage.get(["marketStep"], res => {
		if(res.marketStep)
			marketAuth();
	});
}

window.addEventListener("load", start, false);