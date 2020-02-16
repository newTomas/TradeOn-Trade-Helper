function post()
{
	storage.get(["activity"], res => {
		if(res.activity)
		{
			var arr = ["noob", "pro", "Boss", "NPC", "toxic", "Bug", "asap", "lol", "10Q", "kek", "bb", "Hello world!", "Lamer", "hi guys", "What's up?"];
			var word = arr[Math.round( Math.random()*(arr.length - 1) )];
			jQuery("#blotter_statuspost_textarea").val(word);
			jQuery("#blotter_statuspost_submit").click();
			location.href = "https://steamcommunity.com/id/me/myactivity/";
		}
	});
}

window.addEventListener("load", post, false);