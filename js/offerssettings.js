function start()
{
	const bg = chrome.extension.getBackgroundPage();

	storage.get(['custom', 'steamapi', 'tmapi', 'steamid', 'tradelink', 'errors', 'accepttrades', 'accepttimer'], (res) => {
		jQuery('#steamapi').val(res.steamapi);
		jQuery('#tmapi').val(res.tmapi);
		jQuery('#steamid').val(res.steamid);
		jQuery('#tradelink').val(res.tradelink);

		jQuery('#period').val(res.accepttimer);
		jQuery('#tradesswitch').prop("checked", res.accepttrades);

		jQuery('#errorlog').val(res.errors.join('\n'));
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		console.log(changes);
		for(var key in changes)
		{
			switch(key)
			{
				case "steamapi":
					document.getElementById('steamapi').value = changes[key].newValue;
					break;
				case "tmapi":
					document.getElementById('tmapi').value = changes[key].newValue;
					break;
				case "steamid":
					document.getElementById('steamid').value = changes[key].newValue;
					break;
				case "tradelink":
					document.getElementById('tradelink').value = changes[key].newValue;
					break;
				case "accepttimer":
					jQuery('#period').val(changes[key].newValue);
					break;
				case "accepttrades":
					jQuery('#tradesswitch').prop("checked", changes[key].newValue);
					break;
				case "errors":
					jQuery('#errorlog').val(changes[key].newValue.join('\n'));
					break;
			}
		}
	});

	jQuery('.fa-caret-down, .fa-caret-up').click((e) => {
		jQuery(e.originalEvent.path[1]).find('div.droplist').toggleClass('hidden');
		jQuery(e.target).toggleClass('fa-caret-down');
		jQuery(e.target).toggleClass('fa-caret-up');
	});

	jQuery('#period').blur(e => {
		if(e.target.valueAsNumber <= parseInt(e.target.max) && e.target.valueAsNumber >= parseInt(e.target.min))
		{
			storage.set({accepttimer: e.target.valueAsNumber});
		}
		else
		{
			storage.get(['accepttimer'], res => {
				e.target.valueAsNumber = res.accepttimer;
			});
		}
	});

	jQuery('#tradesswitch').change(e => {
		storage.set({accepttrades: e.target.checked});
	});

	jQuery("footer input").on("click", function() {
		this.select();
		document.execCommand('copy');
	});
}

window.addEventListener("load", start, false);