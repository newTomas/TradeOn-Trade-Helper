function discussions()
{
	storage.set({current: null});
	jQuery.ajax({
		url: "https://steamcommunity.com/discussions/forum/search/?q="+topWords[Math.round(Math.random() * (topWords.length - 1))]
	}).done(function() {
		chrome.runtime.sendMessage({action: "queue"});
	}).fail((jqXHR, textStatus, errorThrown) => {
		chrome.runtime.sendMessage({action: "error", type: "ajax", stage: "поиска по обсуждениям", textStatus: textStatus, errorThrown: errorThrown, stop: false});
	});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "discussions")
		{
			discussions();
		}
	});
}

start();
//window.addEventListener("load", start, false);