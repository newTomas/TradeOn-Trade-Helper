function start()
{
	const bg = chrome.extension.getBackgroundPage();

	storage.get(['custom', 'steamapi', 'tmapi', 'steamid', 'tradelink', 'errors', 'customsettings'], (res) => {
		jQuery('#steamapi').val(res.steamapi);
		jQuery('#tmapi').val(res.tmapi);
		jQuery('#steamid').val(res.steamid);
		jQuery('#tradelink').val(res.tradelink);
		
		jQuery('#base').prop("checked", res.custom.base);
		jQuery('#gets').prop("checked", res.custom.gets);
		jQuery('#online').prop("checked", res.custom.online);
		jQuery('#getsteamapiid').prop("checked", res.customsettings.steamapiid);
		jQuery('#gettmapi').prop("checked", res.customsettings.tmapi);
		jQuery('#gettradelink').prop("checked", res.customsettings.tradelink);

		if(res.customsettings.group)
		{
			jQuery('[name=group][value=specific]').prop("checked", true);
			jQuery('#group').val(res.customsettings.group);
		}
		else jQuery('[name=group][value=random]').prop("checked", true);

		if(res.customsettings.name)
		{
			jQuery('[name=name][value=specific]').prop("checked", true);
			jQuery('#name').val(res.customsettings.name);
		}
		else jQuery('[name=name][value=random]').prop("checked", true);

		if(res.customsettings.info)
		{
			jQuery('[name=info][value=specific]').prop("checked", true);
			jQuery('#info').val(res.customsettings.info);
		}
		else jQuery('[name=info][value=random]').prop("checked", true);

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
				case "errors":
					jQuery('#errorlog').val(changes[key].newValue.join('\n'));
					break;
				case "custom":
					jQuery('#base').prop("checked", changes[key].newValue.base);
					jQuery('#gets').prop("checked", changes[key].newValue.gets);
					jQuery('#online').prop("checked", changes[key].newValue.online);
					break;
				case "customsettings":
					jQuery('#getsteamapiid').prop("checked", changes[key].newValue.steamapiid);
					jQuery('#gettmapi').prop("checked", changes[key].newValue.tmapi);
					jQuery('#gettradelink').prop("checked", changes[key].newValue.tradelink);
					break;
			}
		}
	});

	jQuery('#gets').change((e) => {
		storage.get(['custom', 'customsettings'], (res) => {
			if(e.target.checked && !Object.values(res.customsettings).includes(true))
			{
				res.customsettings.steamapiid = true;
				res.customsettings.tmapi = true;
				res.customsettings.tradelink = true;
			}
			res.custom[e.target.id] = e.target.checked;
			storage.set(res);
		});
	});

	jQuery('#base, #online').change((e) => {
		storage.get(['custom'], (res) => {
			res.custom[e.target.id] = e.target.checked;
			storage.set(res);
		});
	});

	jQuery('#getsteamapiid, #gettmapi, #gettradelink').change((e) => {
		storage.get(['custom', 'customsettings'], (res) => {
			res.customsettings[e.target.name] = e.target.checked;
			if(!Object.values(res.customsettings).includes(true))
				res.custom.gets = false;
			storage.set(res);
		});
	});

	jQuery('.fa-caret-down, .fa-caret-up').click((e) => {
		jQuery(e.originalEvent.path[1]).find('div.droplist').toggleClass('hidden');
		jQuery(e.target).toggleClass('fa-caret-down');
		jQuery(e.target).toggleClass('fa-caret-up');
	});

	jQuery('#group').blur((e) => {
		const regex = new RegExp('(http|https):\/\/steamcommunity\.com\/groups\/(.+)');
		if(!regex.test(jQuery('#group').val()))
		{
			jQuery('[name=group][value=random]').prop("checked", true);
			storage.get(["customsettings"], (res) => {
				res.customsettings.group = null;
				storage.set(res);
			});
			return false;
		}
		if(jQuery(`[name=group][value=specific]`).prop('checked'))
			storage.get(['customsettings'], res => {
				res.customsettings.group = jQuery('#group').val();
				storage.set(res);
			});
	});

	jQuery('#name, #info').blur(e => {
		if(jQuery(`[name=${e.target.id}][value=specific]`).prop('checked'))
			storage.get(['customsettings'], res => {
				res.customsettings[e.target.id] = e.target.value;
				storage.set(res);
			});
	});

	jQuery('[name=group][value=specific]').click((e) => {
		const regex = new RegExp('(http|https):\/\/steamcommunity\.com\/groups\/(.+)');
		if(!regex.test(jQuery('#group').val()))
			return false;
		storage.get(['customsettings'], res => {
			res.customsettings.group = jQuery('#group').val();
			storage.set(res);
		});
	});
	
	jQuery('input[value=random]').click(e => {
		storage.get(['customsettings'], (res) => {
			res.customsettings[e.target.name] = null;
			storage.set(res);
		});
	});

	jQuery('[name=name][value=specific], [name=info][value=specific]').click(e => {
		storage.get(['customsettings'], res => {
			res.customsettings[e.target.name] = jQuery(`#${e.target.name}`).val();
			storage.set(res);
		});
	});

	jQuery("footer input").on("click", function() {
		this.select();
		document.execCommand('copy');
	});
}

window.addEventListener("load", start, false);