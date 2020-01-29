function getTradeLink2()
{
	storage.set({
		tradelink: jQuery('#trade_offer_access_url').val()
	});
	chrome.runtime.sendMessage({action: "queue"});
	close();
}

window.addEventListener("load", getTradeLink2, false);