function marketAuth2()
{
	storage.get(['needAuth'], (res) => {
		if(res.needAuth)
		{
			storage.set({needAuth: false});
			chrome.runtime.sendMessage({action: "queue"});
			jQuery('#openidForm').submit();
		}
	});
}

window.addEventListener("load", marketAuth2, false);