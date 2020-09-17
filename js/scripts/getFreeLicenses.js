var sessionId;

async function getFreeLicense(subid){
	console.log('got', subid);
	return new Promise((resolve, reject) => {
		jQuery.ajax({
			url: 'https://store.steampowered.com/checkout/addfreelicense/',
			data: {
				action: 'add_to_cart',
				sessionid: sessionId,
				subid: subid
      },
      method: 'POST'
		}).then(data => {
			console.log(data);
			resolve();
		});
	});
}

async function wait(ms){
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}

async function getFreeLicenses(){
  sessionId = getSessionid();
	var count = Math.round(Math.random() * 10 + 4);
	await getFreeLicense(329385); // cs go
	for(var i = 0; i < count; i++){
    var cur = Math.round(Math.random() * (freePackages.length - 1));
    var el = freePackages.splice(cur, 1);
    await getFreeLicense(el[0]);
    await wait(1000);
  }
  chrome.runtime.sendMessage({action: "queue"});
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "getFreeLicenses")
      getFreeLicenses();
	});
}

window.addEventListener("load", start, false);