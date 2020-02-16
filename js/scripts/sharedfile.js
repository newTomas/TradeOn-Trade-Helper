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
					// Обработка ошибок...
				}
				chrome.runtime.sendMessage({action: "queue"});
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