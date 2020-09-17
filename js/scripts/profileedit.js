var steamid;
var apitoken;
var sessionid;

async function wait(ms){
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
}

async function profileEdit()
{
	steamid = getSteamid();
	sessionid = getSessionid();
	apitoken = getApiToken();
	var actions = ['SetFavoriteBadge', 'SetGroup'];

	for(var i = 0; i < actions.length; i++){
		await window[actions[i]]();
		await wait(500);
		chrome.runtime.sendMessage({action: "queue"});
	}

	// steamid = getSteamid();
	// storage.get(["profilearr"], res => {
	// 	res.profilearr.forEach(el => {
	// 		window[el]();
	// 	});
	// });
}

async function SetFavoriteBadge(){
	return new Promise((resolve, reject) => {
		jQuery.ajax({
			url: 'https://api.steampowered.com/IPlayerService/SetFavoriteBadge/v1',
			method: 'POST',
			data: {
				access_token: apitoken,
				badgeid: 2
			}
		}).then(data => {
			if(data.success){
				return resolve();
			} else {
				chrome.runtime.sendMessage({action: "error", type: "SetFavoriteBadge"});
				return resolve();
			}
		});
	});
}

async function SetGroup(){
	return new Promise((resolve, reject) => {
		jQuery.ajax({
			url: "https://steamcommunity.com/profiles/"+steamid+"/ajaxgroupinvite?select_primary=1&json=1"
		}).done(function(data) {
			var groupid = data[0].steamid;
			if(!groupid)
			{
				chrome.runtime.sendMessage({action: "error", type: "nogroupid"});
				return resolve();
			}
			jQuery.ajax({
				url: 'https://steamcommunity.com/profiles/' + steamid + '/edit',
				method: 'POST',
				data: {
					sessionID: sessionid,
					json: 1,
					type: 'favoriteclan',
					primary_group_steamid: groupid
				}
			}).then(data => {
				if(data.success){
					return resolve();
				} else {
					chrome.runtime.sendMessage({action: "error", type: "SetFavoriteBadge"});
					return resolve();
				}
			});
		}).fail((jqXHR, textStatus, errorThrown) => {
			chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "установки главной группы", textStatus: textStatus, errorThrown: errorThrown, stop: false});
			resolve();
		});
	});
}

async function MainInfo(){
	return new Promise((resolve, reject) => {
		storage.get(["customsettings", "mode"], res => {
			let name;
			if(res.mode == 5 && res.customsettings.nameon && res.customsettings.name)
				name = res.customsettings.name;
			else name = topnames[Math.round(Math.random() * (topnames.length - 1))];
			
			let summary;
			if(res.mode == 5 && res.customsettings.infoon && res.customsettings.info)
				summary = res.customsettings.info;
			else summary = topWords[Math.round(Math.random() * (topWords.length - 1))];

			jQuery.ajax({
				url: 'https://steamcommunity.com/profiles/' + steamid + '/edit',
				method: 'POST',
				data: {
					sessionID: sessionid,
					json: 1,
					type: 'profileSave',
					weblink_1_title: null,
					weblink_1_url: null,
					weblink_2_title: null,
					weblink_2_url: null,
					weblink_3_title: null,
					weblink_3_url: null,
					real_name: name,
					customURL: null,
					country: null,
					state: null,
					city: null,
					summary: summary
				}
			}).then(data => {
				if(data.success){
					return resolve();
				} else {
					chrome.runtime.sendMessage({action: "error", type: "SetFavoriteBadge"});
					return resolve();
				}
			});
		});
	});
}

async function End()
{
	storage.set({profileEdited: true}, () => {
		if(jQuery(".DialogButton._DialogLayout.Primary").length == 0)
		{
			chrome.runtime.sendMessage({action: "error", type: "profilesave"});
			return;
		}
		
		jQuery(".DialogButton._DialogLayout.Primary").click();
	});
}

async function Background()
{
	let sessionid = getSessionid();
	jQuery.ajax({
		method: "POST",
		url: "https://steamcommunity.com/profiles/"+steamid+"/ajaxgetplayerbackgrounds",
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

// async function FeatureBadgeOnProfile()
// {
// 	try
// 	{
// 		jQuery(".btn_grey_white_innerfade.btn_small").eq(2).click();
// 		jQuery(".group_list_option").eq(1).click();
// 	}
// 	catch(e)
// 	{
// 		chrome.runtime.sendMessage({action: "error", type: "badge"});
// 	}
// }

async function AddSummary()
{
	if(jQuery('textarea[name=summary]').length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "summary"});
		return;
	}
	storage.get(["customsettings", "mode"], res => {
		let summary;
		if(res.mode == 5 && res.customsettings.infoon && res.customsettings.info)
			summary = res.customsettings.info;
		else summary = topWords[Math.round(Math.random() * (topWords.length - 1))];

		jQuery('textarea[name=summary]').val(summary);
	});
}

// async function MainGroup()
// {
// 	jQuery.ajax({
// 		url: "https://steamcommunity.com/profiles/"+steamid+"/ajaxgroupinvite?select_primary=1"
// 	}).done(function(data) {
// 		var html = jQuery.parseHTML(data);
// 		var groupid = jQuery(html).find('.group_list_option:first').data('groupid');
// 		if(!groupid)
// 		{
// 			chrome.runtime.sendMessage({action: "error", type: "nogroupid"});
// 		}
// 		jQuery('#primary_group_steamid').val(groupid);
// 		End();
// 	}).fail((jqXHR, textStatus, errorThrown) => {
// 		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "установки главной группы", textStatus: textStatus, errorThrown: errorThrown, stop: false});
// 	});
// }

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