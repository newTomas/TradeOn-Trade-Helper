function start()
{
	storage.get(["current"], res => {
		console.log(res.current);
		if(res.current == "level")
            location.href = `https://steamcommunity.com/profiles/${getSteamid()}/gamecards/730/`;
	});
}

window.addEventListener("load", start, false);