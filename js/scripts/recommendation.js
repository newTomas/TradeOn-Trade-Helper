var loaded = false;

function recommendation()
{
	if(jQuery("#next_in_queue_form").length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "explore"});
		return;
	}
	jQuery("#next_in_queue_form").submit();
}

function waitNextButton()
{
	if(loaded)
	{
		recommendation();
		return;
	}
	
	if(jQuery("#next_in_queue_form").length == 0)
	{
		setTimeout(waitNextButton, 100);
		return;
	}

	jQuery("#next_in_queue_form").submit();
}

function runWishlist()
{
	if(jQuery('#app_agegate').length)
	{
		let sessionid = getSessionid();
		jQuery.ajax({
			method: "POST",
			url: location.href.replace(/agecheck/, 'agecheckset'),
			data: {
				sessionid: sessionid,
				ageDay: 1,
				ageMonth: "January",
				ageYear: 1999
			}
		}).done((data) => {
			location.href = location.href.replace(/agecheck/, '')
		}).fail((jqXHR, textStatus, errorThrown) => {
			chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "подтверждения возраста", textStatus: textStatus, errorThrown: errorThrown, stop: false});
		});
		return;
	}
	if(jQuery('#add_to_wishlist_area').children().length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "wishlist"});
		return;
	}
	jQuery('#add_to_wishlist_area').children()[0].click();
	chrome.runtime.sendMessage({action: "queue"});
}

function waitWishButton()
{
	if(loaded)
	{
		runWishlist();
		return;
	}
	
	if(jQuery('#app_agegate').length == 0 && jQuery('#add_to_wishlist_area').children().length == 0)
	{
		setTimeout(waitWishButton, 100);
		return;
	}

	runWishlist();
}

// function start()
// {
// 	storage.get(["current"], res => {
// 		if(res.current == "discovery")
// 			loaded = true;
// 		else if(res.current == "wishlist")
// 			runWishlist();
// 	});
// }

// window.addEventListener("load", start, false);

storage.get(["current"], res => {
	switch(res.current)
	{
		case "discovery":
			waitNextButton();
			window.addEventListener("load", () => {loaded = true}, false);
			break;
		case "wishlist":
			waitWishButton();
			window.addEventListener("load", () => {loaded = true}, false);
			break;
	}
});