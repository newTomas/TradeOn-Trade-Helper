function getTradeLink2()
{
	if(jQuery('#trade_offer_access_url').length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "tradelink"});
	}
	storage.set({
		tradelink: jQuery('#trade_offer_access_url').val()
	});
	chrome.runtime.sendMessage({action: "queue"});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "tradelink")
			getTradeLink2();
	});
}

window.addEventListener("load", start, false);