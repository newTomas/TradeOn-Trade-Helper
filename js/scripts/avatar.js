function avatar()
{
	storage.set({current: null});
	var arr = jQuery('[id*=delayedimage_ogg_avatars_]');
	if(arr.length == 0)
		chrome.runtime.sendMessage({action: "error", type: "searchavatar"});
	else
	{
		storage.set({current: "ava"});
		location.href = arr[Math.round(Math.random() * (arr.length - 1))].parentElement.href;
	}
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "avatar")
			avatar();
	});
}

window.addEventListener("load", start, false);