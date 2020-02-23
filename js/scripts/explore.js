function explore()
{
	if(jQuery("#discovery_queue_start_link").parent().length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "discovery"});
		return;
	}
	
	if(jQuery("#discovery_queue_start_link").parent().attr("style") != "display: none;")
	{
		jQuery("#discovery_queue_start_link")[0].click();
	}
	else
	{
		chrome.runtime.sendMessage({action: "queue"});
	}
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "discovery")
		{
			explore();
		}
	});
}

window.addEventListener("load", start, false);