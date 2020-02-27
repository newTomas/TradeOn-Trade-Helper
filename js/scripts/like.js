function like()
{
	storage.set({current: null});
	let sessionid = getSessionid();

	if(jQuery('[id^=vote_up_userstatus_]:first').length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "like"});
		return;
	}
	var arr = jQuery('[id^=vote_up_userstatus_]:first')[0].id.split('_').reverse();
	jQuery.ajax({
		method: 'POST',
		url: `https://steamcommunity.com/actions/LogFriendActivityUpvote`,
		data: {
			sessionID: sessionid
		}
	})
	.done(function() {
		chrome.runtime.sendMessage({action: "queue"});
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "лайка поста", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	});

	// jQuery.ajax({
	// 	method: 'POST',
	// 	url: `https://steamcommunity.com/comment/UserStatusPublished/voteup/${arr[0]}/${arr[1]}/`,
	// 	data: {
	// 		vote: 1,
	// 		count: 6,
	// 		sessionid: sessionid,
	// 		feature2: -1,
	// 		newestfirstpagination: true
	// 	}
	// })
	// .done(function() {
	// 	chrome.runtime.sendMessage({action: "queue"});
	// }).fail((jqXHR, textStatus, errorThrown) => {
	// 	chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "лайка поста", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	// });
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "like")
			like();
	});
}

window.addEventListener("load", start, false);