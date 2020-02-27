function group()
{
	if(jQuery('.error_ctn').length)
	{
		err();
		return;
	}
	if(jQuery('.grouppage_join_area:first').length)
	{
		if(jQuery('.grouppage_join_area:first')[0].innerText == "Присоединиться")
			jQuery('.grouppage_join_area:first').children()[0].click();
		else
			err();
	}
	else chrome.runtime.sendMessage({action: "queue"});
}

function err()
{
	storage.get(['stage', 'customsettings'], (res) => {
		if(!res.customsettings.group)
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