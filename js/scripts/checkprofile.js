function runCheck()
{
	jQuery("body").append("<script>jQuery('body').append(\"<p id='steamid' style='display: none;'>\"+g_steamID+\"</p>\")</script>");
	let steamid = jQuery("#steamid").text();
	if(!steamid)
	{
		storage.set({checkprofile: false});
		chrome.runtime.sendMessage({action: "queue"});
	} else
	{
		jQuery.ajax({
			url: "https://steamcommunity.com/profiles/"+ steamid +"/badges/2"
		}).done((data) => {
			html = jQuery.parseHTML(data);
			bages = {};
			jQuery(html).find(".badge_detail_tasks").children().find('img').each((i, el) => {
				var cur = el.src.substring(72, el.src.length - 8).split('_');
				bages[cur[0]] = (cur[1] != 'on');
			});
			chrome.runtime.sendMessage({action: "bages", bages: bages});
			//close();
		});
	}
}

function start()
{
	storage.get(["current"], res => {
		if(res.current = "checkprofile")
			runCheck();
	});
}

window.addEventListener("load", start, false);