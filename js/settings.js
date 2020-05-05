function start()
{
	const bg = chrome.extension.getBackgroundPage();

	storage.get(['customsettings'], (res) => {
		jQuery('.settingitem input[type=text]').eq(0).val(res.customsettings.group);
		jQuery('.settingitem input[type=text]').eq(1).val(res.customsettings.name);
		jQuery('.settingitem input[type=text]').eq(2).val(res.customsettings.info);
		jQuery('#apisettings svg').eq(0).toggleClass('on', res.customsettings.steamapiid);
		jQuery('#apisettings svg').eq(1).toggleClass('on', res.customsettings.tmapi);
		jQuery('#apisettings svg').eq(2).toggleClass('on', res.customsettings.tradelink);

		jQuery('#lvlup input').val(res.customsettings.lvlup);

		if(res.customsettings.groupon)
		{
			jQuery('input[name=group]').eq(1).prop("checked", true);
		}
		else jQuery('input[name=group]').eq(0).prop("checked", true);

		if(res.customsettings.nameon)
		{
			jQuery('input[name=name]').eq(1).prop("checked", true);
		}
		else jQuery('input[name=name]').eq(0).prop("checked", true);

		if(res.customsettings.infoon)
		{
			jQuery('input[name=info]').eq(1).prop("checked", true);
		}
		else jQuery('input[name=info]').eq(0).prop("checked", true);
	});

	// chrome.storage.onChanged.addListener(function(changes, namespace) {
	// 	console.log(changes);
	// 	for(var key in changes)
	// 	{
	// 		switch(key)
	// 		{
	// 			case "customsettings":
	// 				// jQuery('.settingitem input[type=text]').eq(0).val(changes[key].newValue.group);
	// 				// jQuery('.settingitem input[type=text]').eq(1).val(changes[key].newValue.name);
	// 				// jQuery('.settingitem input[type=text]').eq(2).val(changes[key].newValue.info);
	// 				// jQuery('#apisettings svg').eq(0).toggleClass('on', changes[key].newValue.steamapiid);
	// 				// jQuery('#apisettings svg').eq(1).toggleClass('on', changes[key].newValue.tmapi);
	// 				// jQuery('#apisettings svg').eq(2).toggleClass('on', changes[key].newValue.tradelink);

	// 				// jQuery('#lvlup input').val(changes[key].newValue.lvlup);

	// 				// if(changes[key].newValue.groupon)
	// 				// {
	// 				// 	jQuery('[name=group]').eq(1).prop("checked", true);
	// 				// }
	// 				// else jQuery('[name=group]').eq(0).prop("checked", true);

	// 				// if(changes[key].newValue.nameon)
	// 				// {
	// 				// 	jQuery('[name=name]').eq(1).prop("checked", true);
	// 				// }
	// 				// else jQuery('[name=name]').eq(0).prop("checked", true);

	// 				// if(changes[key].newValue.infoon)
	// 				// {
	// 				// 	jQuery('[name=info]').eq(1).prop("checked", true);
	// 				// }
	// 				// else jQuery('[name=info]').eq(0).prop("checked", true);
	// 				break;
	// 		}
	// 	}
	// });

	jQuery('#profilesettings input[type=radio][name=group]').change(e => {
		if(!jQuery('input[type=text][name=group]').val() && e.target.value == "on")
		{
			//jQuery('#profilesettings input[name=group][value=off]').prop('checked', true);
			jQuery('#profilesettings input[name=group][type=text]').addClass('wrong');
			return false;
		}
		if(e.target.value == "off")
			jQuery('#profilesettings input[name=group][type=text]').removeClass('wrong');
		storage.get(['customsettings'], res => {
			res.customsettings.groupon = (e.target.value == "on");
			storage.set(res);
		});
	});

	jQuery('#profilesettings input[type=radio][name=name]').change(e => {
		if(!jQuery('input[type=text][name=name]').val())
		{
			//jQuery('#profilesettings input[name=name][value=off]').prop('checked', true);
			jQuery('#profilesettings input[name=name][type=text]').addClass('wrong');
			return false;
		}
		storage.get(['customsettings'], res => {
			res.customsettings.nameon = (e.target.value == "on");
			storage.set(res);
		});
	});

	jQuery('#profilesettings input[type=radio][name=info]').change(e => {
		if(!jQuery('input[type=text][name=info]').val())
		{
			//jQuery('#profilesettings input[name=info][value=off]').prop('checked', true);
			jQuery('#profilesettings input[name=info][type=text]').addClass('wrong');
			return false;
		}
		storage.get(['customsettings'], res => {
			res.customsettings.infoon = (e.target.value == "on");
			storage.set(res);
		});
	});

	jQuery('input[type=text][name=group]').change(e => {
		storage.get(['customsettings'], res => {
			let regex = /^(http|https):\/\/steamcommunity\.com\/groups\/.+/;
			if(e.target.value && !regex.test(e.target.value))
			{
				e.target.value = res.customsettings.group;
				return;
			}
			res.customsettings.group = e.target.value;
			if(!e.target.value)
				res.customsettings.groupon = false;
			else if(jQuery('#profilesettings input[name=group][value=on]').prop('checked'))
			{
				res.customsettings.groupon = true;
			}
			jQuery('#profilesettings input[name=group][type=text]').removeClass('wrong');
			storage.set(res);
		});
	});

	jQuery('input[type=text][name=name]').change(e => {
		storage.get(['customsettings'], res => {
			res.customsettings.name = e.target.value;
			if(!e.target.value)
				res.customsettings.nameon = false;
			else if(jQuery('#profilesettings input[name=name][value=on]').prop('checked'))
			{
				res.customsettings.nameon = true;
			}
			jQuery('#profilesettings input[name=name][type=text]').removeClass('wrong');
			storage.set(res);
		});
	});

	jQuery('input[type=text][name=info]').change(e => {
		storage.get(['customsettings'], res => {
			res.customsettings.info = e.target.value;
			if(!e.target.value)
				res.customsettings.infoon = false;
			else if(jQuery('#profilesettings input[name=info][value=on]').prop('checked'))
			{
				res.customsettings.infoon = true;
			}
			jQuery('#profilesettings input[name=info][type=text]').removeClass('wrong');
			storage.set(res);
		});
	});

	jQuery('#apisettings .powersvg').eq(0).on('click', e => {
		var target = jQuery('#apisettings .powersvg').eq(0);
		target.toggleClass('on');
		storage.get(['customsettings'], res => {
			res.customsettings.steamapiid = target.hasClass('on');
			storage.set(res);
		});
	});

	jQuery('#apisettings .powersvg').eq(1).on('click', e => {
		var target = jQuery('#apisettings .powersvg').eq(1);
		target.toggleClass('on');
		storage.get(['customsettings'], res => {
			res.customsettings.tmapi = target.hasClass('on');
			storage.set(res);
		});
	});

	jQuery('#apisettings .powersvg').eq(2).on('click', e => {
		var target = jQuery('#apisettings .powersvg').eq(2);
		target.toggleClass('on');
		storage.get(['customsettings'], res => {
			res.customsettings.tradelink = target.hasClass('on');
			storage.set(res);
		});
	});

	jQuery('#lvlup input').change(e => {
		var num = parseInt(e.target.value);
		storage.get('customsettings', res => {
			if(num < 1 || num > 7)
			{
				e.target.value = res.customsettings.lvlup;
			}
			else
			{
				res.customsettings.lvlup = num;
				storage.set(res);
			}
		});
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