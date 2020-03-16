function marketAuth2()
{
	storage.set({needAuth: false});
	if(jQuery('#openidForm').length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "steamauth"});
		return;
	}
	//chrome.runtime.sendMessage({action: "queue"});
	jQuery('#openidForm').submit();
}

function start()
{
	storage.get(["needAuth"], res => {
		if(res.needAuth)
		marketAuth2();
	});
}

window.addEventListener("load", start, false);