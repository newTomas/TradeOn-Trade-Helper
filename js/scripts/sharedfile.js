function runWorkshop()
{
	storage.set({workshop: false});
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
	storage.get(["workshop"], res => {
		if(res.workshop)
			runWorkshop();
	});
}

window.addEventListener("load", start, false);