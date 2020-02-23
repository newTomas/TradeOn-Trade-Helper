function privacy()
{
	storage.set({current: ""});
	let sessionid = getSessionid();
	let steamid = getSteamid();
	jQuery.ajax({
		method: "POST",
		url: `https://steamcommunity.com/profiles/${steamid}/ajaxsetprivacy/`,
		data: {
			sessionid: sessionid,
			Privacy: '{"PrivacyProfile":3,"PrivacyInventory":3,"PrivacyInventoryGifts":1,"PrivacyOwnedGames":1,"PrivacyPlaytime":3,"PrivacyFriendsList":1}',
			eCommentPermission: 2
		}
	}).done(function(data) {
		if(data.success == 1)
			chrome.runtime.sendMessage({action: "queue"});
		else chrome.runtime.sendMessage({action: "error", type: "privacy", errorcode: data.success});
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "установки настроек приватности", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "privacy")
		{
			privacy();
		}
	});
}

window.addEventListener("load", start, false);