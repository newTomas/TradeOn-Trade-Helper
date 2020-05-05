function start()
{
	const bg = chrome.extension.getBackgroundPage();

	storage.get(['steamapi', 'tmapi', 'steamid', 'tradelink', 'accepttrades', 'tradeapi', 'accepttimer'], (res) => {
		jQuery('#steamapi').val(res.steamapi);
		jQuery('#tmapi').val(res.tmapi);
		jQuery('#steamid').val(res.steamid);
		jQuery('#tradelink').val(res.tradelink);
		jQuery('#bigpower').toggleClass('on', res.accepttrades);
		if(res.tradeapi)
			jQuery('#withapi').addClass('active');
		else jQuery('#withoutapi').addClass('active')
		jQuery('#period input').val(res.accepttimer);
		if(bg.working)
		{
			jQuery(`#${modes[res.mode]} svg.powersvg`).addClass('on');
		} else if(res.mode)
		{
			console.log('Выполнение скрипта было прервано!');
			// Было прервано!
		}
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		console.log(changes);
		for(var key in changes)
		{
			switch(key)
			{
				case "steamapi":
					jQuery('#steamapi').val(changes[key].newValue);
					break;
				case "tmapi":
					jQuery('#tmapi').val(changes[key].newValue);
					break;
				case "steamid":
					jQuery('#steamid').val(changes[key].newValue);
					break;
				case "tradelink":
					jQuery('#tradelink').val(changes[key].newValue);
					break;
				case "accepttrades":
					jQuery('#bigpower').toggleClass('on', changes[key].newValue);
					break;
				case "tradeapi":
					jQuery('#withapi').toggleClass('active', changes[key].newValue);
					jQuery('#withoutapi').toggleClass('active', !changes[key].newValue);
					break;
				case "accepttimer":
					jQuery('#period input').val(changes[key].newValue);
					break;
			}
		}
	});

	jQuery('#bigpower').on('click', e => {
		storage.set({accepttrades: !jQuery(e.currentTarget).hasClass('on')});
	});

	jQuery('#withoutapi').on('click', e => {
		if(!jQuery(e.currentTarget).hasClass('active')){
			storage.set({tradeapi: false});
		}
	});

	jQuery('#withapi').on('click', e => {
		if(!jQuery(e.currentTarget).hasClass('active')){
			storage.set({tradeapi: true});
		}
	});

	jQuery('#period input').on('change', e => {
		var num = parseInt(jQuery(e.currentTarget).val());
		if(num >= 30 && num <= 1800)
		{
			storage.set({accepttimer: num});
		} else storage.get(['accepttimer'], res => {
			e.currentTarget.value = res.accepttimer;
		});
	});

	jQuery('.switcher').on('click', e => {
		jQuery(e.currentTarget.parentElement).toggleClass('close');
	});
	
	jQuery("#info input").on("click", function() {
		this.select();
		navigator.clipboard.writeText(this.value);
	});

	jQuery('.infosvg').on('click', e => {
		jQuery(e.target.parentElement).find('.infocontent').show();
		jQuery(e.target.parentElement).find('.exit').show();
	});

	jQuery('.exit').on('click', e => {
		console.log(e);
		jQuery(e.target.parentElement).find('.infocontent').hide();
		jQuery(e.target.parentElement).find('.exit').hide();
	});
}

window.addEventListener("load", start, false);