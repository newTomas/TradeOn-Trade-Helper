function post()
{
	storage.get(["activity"], res => {
		if(res.activity)
		{
			jQuery.find("a[id^='vote_up']")[0].click();
			chrome.runtime.sendMessage({action: "queue"});
		}
	});
}

window.addEventListener("load", post, false);