function chat()
{
	var i = setInterval(() => {
		if(document.getElementById('arrowBase')){
			clearInterval(i);
			chrome.runtime.sendMessage({action: "queue"});
		}
	}, 100);
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "chat")
			chat();
	});
}

window.addEventListener("load", start, false);