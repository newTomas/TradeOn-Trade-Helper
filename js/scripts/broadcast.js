function runBroadcast()
{
	storage.set({broadcast: false});
	setTimeout(() => {
		chrome.runtime.sendMessage({action: "queue"});
	}, 5000);
}

function start()
{
	storage.get(["broadcast"], res => {
		if(res.broadcast)
			runBroadcast();
	});
}

window.addEventListener("load", start, false);