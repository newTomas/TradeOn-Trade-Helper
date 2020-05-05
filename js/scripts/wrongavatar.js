function wrongavatar()
{
    storage.set({current: 'avatar'});
    location.href = "https://steamcommunity.com/actions/GameAvatars/";
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "ava")
			wrongavatar();
	});
}

window.addEventListener("load", start, false);