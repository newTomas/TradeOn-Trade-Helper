function ava()
{
	storage.set({current: null});
	if(jQuery('#avatarForm').length == 0)
	{
		chrome.runtime.sendMessage({action: "error", type: "ava"});
		return;
	}
	jQuery.ajax({
		method: "POST",
		url: jQuery('#avatarForm')[0].action,
		data: jQuery('#avatarForm').serialize()
	}).done(function() {
		chrome.runtime.sendMessage({action: "queue"});
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "установки аватарки", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "ava")
			ava();
	});
}

window.addEventListener("load", start, false);