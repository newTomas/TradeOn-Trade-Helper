function runWorkshop()
{
	storage.set({current: ""});
	if(jQuery('.selected:last')[0].id == 'SubscribeItemOptionAdd')
	{
		jQuery.ajax({
			url: "https://steamcommunity.com/sharedfiles/subscribe",
			method: "POST",
			data: jQuery('[name=PublishedFileSubscribe]').serialize()
		}).done(data =>
		{
				if(data.success != 1)
				{
					chrome.runtime.sendMessage({action: "error", type: "sharedfile", errorcode: data.success});
					return;
				}
				chrome.runtime.sendMessage({action: "queue"});
		}).fail((jqXHR, textStatus, errorThrown) => {
			chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "подписки на мастерскую", textStatus: textStatus, errorThrown: errorThrown, stop: false});
		});
	}
	else chrome.runtime.sendMessage({action: "queue"});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "workshop")
			runWorkshop();
	});
}

window.addEventListener("load", start, false);