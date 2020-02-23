function post()
{
	storage.set({current: null});
	
	var word = topWords[Math.round( Math.random()*(topWords.length - 1) )];
	if(jQuery("#blotter_statuspost_textarea").length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "post"});
		return;
	}
	
	jQuery("#blotter_statuspost_textarea").val(word);
	jQuery("#blotter_statuspost_submit").click();
	storage.set({current: "like"});
	location.href = "https://steamcommunity.com/id/me/myactivity/";
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "activity")
			group();
	});
}

window.addEventListener("load", post, false);