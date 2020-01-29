function start()
{
	const bg = chrome.extension.getBackgroundPage();

	const modes = ['fullstart', 'decorstart', 'gettinginfostart', 'customstart'];

	storage.get(['steamapi', 'tmapi', 'steamid', 'tradelink', 'mode'], (res) => {
		document.getElementById('steamapi').value = res.steamapi;
		document.getElementById('tmapi').value = res.tmapi;
		document.getElementById('steamid').value = res.steamid;
		document.getElementById('tradelink').value = res.tradelink;
		if(bg.working)
		{
			document.getElementById(modes[res.mode]).classList.add('runned');
		} else if(res.mode)
		{
			console.log('Выполнение скрипта было прервано!');
			// Было прервано!
		}
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		console.log(changes);
		for(var key in changes)
		{
			switch(key)
			{
				case "steamapi":
					document.getElementById('steamapi').value = changes[key].newValue;
					break;
				case "tmapi":
					document.getElementById('tmapi').value = changes[key].newValue;
					break;
				case "steamid":
					document.getElementById('steamid').value = changes[key].newValue;
					break;
				case "tradelink":
					document.getElementById('tradelink').value = changes[key].newValue;
					break;
				case "mode":
					if(bg.working)
						document.getElementById(modes[changes[key].newValue]).classList.add('runned');
					else document.getElementById(modes[changes[key].oldValue]).classList.remove('runned');
					break;
			}
		}
		// if('working' in changes)
		// {
		// 	document.getElementById('start').disabled = changes['working'].newValue;
		// }
	});

	document.getElementById('fullstart').onclick = (e) => {
		if(bg.working && !e.target.classList.contains('runned'))
			return;
		if(bg.working)
		{
			chrome.runtime.sendMessage({
				action: "stop"
			});
		} else
		{
			chrome.runtime.sendMessage({
				action: "start",
				mode: 0,
				continue: false
			});
		}
	}

	document.getElementById('decorstart').onclick = (e) => {
		if(bg.working && !e.target.classList.contains('runned'))
			return;
		if(bg.working)
		{
			chrome.runtime.sendMessage({
				action: "stop"
			});
		} else
		{
			chrome.runtime.sendMessage({
				action: "start",
				mode: 1,
				continue: false
			});
		}
	}

	document.getElementById('gettinginfostart').onclick = (e) => {
		if(bg.working && !e.target.classList.contains('runned'))
			return;
		if(bg.working)
		{
			chrome.runtime.sendMessage({
				action: "stop"
			});
		} else
		{
			chrome.runtime.sendMessage({
				action: "start",
				mode: 2,
				continue: false
			});
		}
	}

	document.getElementById('customstart').onclick = (e) => {
		if(bg.working && !e.target.classList.contains('runned'))
			return;
		if(bg.working)
		{
			chrome.runtime.sendMessage({
				action: "stop"
			});
		} else
		{
			chrome.runtime.sendMessage({
				action: "start",
				mode: 3,
				continue: false,
				stages: []
			});
		}
	}
	
	jQuery("footer input").on("click", function() {
		this.select();
		document.execCommand('copy');
	});
}

window.addEventListener("load", start, false);