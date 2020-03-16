storage.get(["current"], res => {
	if(res.current == "market")
		location.href = 'https://market.csgo.com/sell';
});