function explore()
{
	storage.get(["discovery"], res => {
		if(res.discovery)
		{
			if(jQuery("#discovery_queue_start_link").parent().attr("style") != "display: none;")
			{
				jQuery("#discovery_queue_start_link")[0].click();
			}
			else
			{
				chrome.runtime.sendMessage({action: "queue"});
				close();
			}
		}
	});
}

window.addEventListener("load", explore, false);