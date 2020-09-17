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
	var actions = ['SetFavoriteBadge', 'SetGroup', 'MainInfo'];

	for(var i = 0; i < actions.length; i++){
		await window[actions[i]]();
		await wait(1000);
	}

	chrome.runtime.sendMessage({action: "queue"});
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
			return resolve();
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
	console.log('MailInfo');
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

function start()
{
	storage.get(["current"], res => {
		if(res.current == "profileedit")
		{
			profileEdit();
		}
	});
}

window.addEventListener("load", start, false);