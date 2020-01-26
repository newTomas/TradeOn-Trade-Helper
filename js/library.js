let storage = {};

storage.set = (changes, callback = null) => {
	chrome.storage.sync.set(changes, (res) => {
		if(callback != null)
			callback(res);
	});
}

storage.get = (keys, callback) => {
	chrome.storage.sync.get(keys, function(result) {
		callback(result);
	});
}