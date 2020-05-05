function profileEdit()
{
	storage.get(["profilearr"], res => {
		res.profilearr.forEach(el => {
			window[el]();
		});
	});
}

async function End()
{
	storage.set({profileEdited: true}, () => {
		if(jQuery(".btn_green_white_innerfade.btn_medium").length == 0)
		{
			chrome.runtime.sendMessage({action: "error", type: "profilesave"});
			return;
		}
		
		jQuery(".btn_green_white_innerfade.btn_medium").click();
	});
}

async function Background()
{
	let sessionid = getSessionid();
	jQuery.ajax({
		method: "POST",
		url: "https://steamcommunity.com/id/me/ajaxgetplayerbackgrounds",
		data:
		{
			sessionid: sessionid
		}
	}).done(function(data) {
		let id = data.data.profilebackgroundsowned[0].communityitemid;
		if(!id)
		{
			chrome.runtime.sendMessage({action: "error", type: "background"});
			console.log(data);
		}
		else
		{
			jQuery('#profile_background').val(id);
			End();
		}
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "получения списка фонов", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	});
}

async function SetupCommunityRealName()
{
	if(jQuery("#real_name").length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "realname"});
		return;
	}
	storage.get(["customsettings", "mode"], res => {
		let name;
		if(res.mode == 5 && res.customsettings.nameon && res.customsettings.name)
			name = res.customsettings.name;
		else name = topnames[Math.round(Math.random()*199)];

		jQuery("#real_name").val(name);
	});
}

async function FeatureBadgeOnProfile()
{
	try
	{
		jQuery(".btn_grey_white_innerfade.btn_small").eq(2).click();
		jQuery(".group_list_option").eq(1).click();
	}
	catch(e)
	{
		chrome.runtime.sendMessage({action: "error", type: "badge"});
	}
}

async function AddSummary()
{
	if(jQuery('#summary').length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "summary"});
		return;
	}
	storage.get(["customsettings", "mode"], res => {
		let summary;
		if(res.mode == 5 && res.customsettings.infoon && res.customsettings.info)
			summary = res.customsettings.info;
		else summary = topWords[Math.round(Math.random() * (topWords.length - 1))];

		jQuery('#summary').val(summary);
	});
}

async function MainGroup()
{
	jQuery.ajax({
		url: "https://steamcommunity.com/id/me/ajaxgroupinvite?select_primary=1"
	}).done(function(data) {
		var html = jQuery.parseHTML(data);
		var groupid = jQuery(html).find('.group_list_option:first').data('groupid');
		if(!groupid)
		{
			chrome.runtime.sendMessage({action: "error", type: "nogroupid"});
		}
		jQuery('#primary_group_steamid').val(groupid);
		End();
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "установки главной группы", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	});
}

function start()
{
	storage.get(["current", "profileEdited"], res => {
		if(res.current == "profileedit")
		{
			if(!res.profileEdited)
				profileEdit();
			else chrome.runtime.sendMessage({action: "queue"});
		}
	});
}

window.addEventListener("load", start, false);