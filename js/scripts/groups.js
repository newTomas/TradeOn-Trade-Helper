function group()
{
	if(jQuery('.error_ctn').length)
	{
		err();
		return;
	}
	if(jQuery('.grouppage_join_area:first').length)
	{
		jQuery('.grouppage_join_area:first').children()[0].click();
	}
	else chrome.runtime.sendMessage({action: "queue"});
}

function err()
{
	storage.get(['stage', 'customsettings', 'mode'], (res) => {
		if(res.mode != 5 || !res.customsettings.groupon)
			storage.set({stage: res.stage - 1});
		chrome.runtime.sendMessage({action: "queue"});
	});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "group")
			group();
	});
}

window.addEventListener("load", start, false);