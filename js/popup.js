function start()
{
	const bg = chrome.extension.getBackgroundPage();

	// storage.get(['stage', 'working'], (res) => {
	// 	console.log(res);
	// });

	// chrome.storage.onChanged.addListener(function(changes, namespace) {
	// 	console.log(changes);
	// 	if('working' in changes)
	// 	{
	// 		document.getElementById('start').disabled = changes['working'].newValue;
	// 	}
	// });

	// document.getElementById('start').addEventListener('click', function(el) {
	// 	console.log(el);
	// 	chrome.runtime.sendMessage({action: "start", stage: 1, step: 0});
	// });
	
	document.getElementById('test').onclick = () => {
		document.getElementById('test').select();
		document.execCommand('copy');
	};
}

window.addEventListener("load", start, false);