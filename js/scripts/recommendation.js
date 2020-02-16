function recommendation()
{
	storage.get(["discovery"], res => {
		if(res.discovery)
			jQuery("#next_in_queue_form").submit();
	});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "discovery")
			runWorkshop();
	});
}

window.addEventListener("load", start, false);