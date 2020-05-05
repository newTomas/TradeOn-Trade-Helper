function LevelUp()
{
	storage.get(["level"], res => {
		jQuery.ajax({
			method: 'POST',
			url: `https://steamcommunity.com/profiles/${steamid}/ajaxcraftbadge/`,
			data: {
				appid: 730,
				series: 1,
				border_color: 0,
				levels: needspacks,
				sessionid: sessionid
			}
		})
		.done(function( msg ) {
			if(msg.success != 1)
				chrome.runtime.sendMessage({action: "error", type: "levelup", errorcode: msg.success});
			else
			{
				var background = false;
				var smile = false;
				msg.rgDroppedItems.forEach(el => {
					if(el.label == "Фон")
						background = true;
					if(el.label == "Смайлик")
						smile = true;
				});
				if(smile || background)
					storage.get(["stages"], (res) => {
						var a = {stages: []};
						if(smile)
							a.stages.push('Gems');
						if(background)
						{
							a.stages.push('ProfileEdit');
							a.profilearr = ['Background'];
						}
						a.stages = res.stages.concat(a.stages);
						storage.set(a);
					});
			}
			chrome.runtime.sendMessage({action: "queue"});
		});
	});
}

var sessionid;
var steamid;
var level;

var cur = 0;
var needs = {};
var checkq = [];
var total = 0;
var done = 0;
var data = {
	'730-Balkan': {
		id: 1115010,
		name: 'Balkan'
	},
	'730-SWAT': {
		id: 1115040,
		name: 'SWAT'
	},
	'730-Anarchist': {
		id: 1115101,
		name: 'Anarchist'
	},
	'730-IDF': {
		id: 1115050,
		name: 'IDF'
	},
	'730-FBI': {
		id: 1115074,
		name: 'FBI'
	}
}

function Level()
{
	sessionid = getSessionid();
	steamid = getSteamid();

	storage.get(["mode", "lvlup", "customsettings"], res => {
		if(res.mode == 5)
			level = res.customsettings.lvlup;
		else level = res.lvlup;
		console.log(`Buyng ${level - 2} sets`);
		run();
	});
}

var queue = [];

function next()
{
	if(queue.length)
		startbuy(queue[0].hashname, queue[0].id, queue[0].name);
	queue.splice(0, 1);
}

var needspacks;

function run()
{
	let curlvl = parseInt(jQuery('.badge_info_description div').eq(1).text()) || 0;
	if(curlvl < level - 2)
	{
		needs = {};
		needspacks = level - 2 - curlvl;
		let arr = ['730-Anarchist', '730-Balkan', '730-FBI', '730-IDF', '730-SWAT'];
		let cards = jQuery('.badge_card_set_card').find('.badge_card_set_text:first');
		let first = true;
		for(var i = 0; i < 5; i++){
			let curcard = cards.eq(i).find('.badge_card_set_text_qty');
			if(curcard.length)
			{
				needs[arr[i]] = needspacks - parseInt(curcard.text().slice(1));
				if(needs[arr[i]] < 0)
					needs[arr[i]] = 0;
				else if(needs[arr[i]] > 0)
				{
					total++;
					queue.push({
						hashname: arr[i],
						id: data[arr[i]].id,
						name: data[arr[i]].name
					})
				}
			} else
			{
				needs[arr[i]] = needspacks;
				total++;
				queue.push({
					hashname: arr[i],
					id: data[arr[i]].id,
					name: data[arr[i]].name
				})
			}
		}
		console.log(needs);
		next();
		if(total == 0)
			Done();
		else checkqueue();
	} else chrome.runtime.sendMessage({action: "queue"});
}

function checkqueue()
{
	if(done == total)
	{
		Done();
		return;
	}

	console.log(checkq);

	if(checkq.length != 0)
	{
		checking(checkq[0].id, checkq[0].name);
	}
	setTimeout(checkqueue, 2000);
}

async function startbuy(hashname, id, name)
{
	jQuery.ajax({
		url: `https://steamcommunity.com/market/itemordershistogram?country=RU&language=russian&currency=5&item_nameid=${id}`
	}).done((data) => {
		if(data.success)
		{
			var i = 0;
			console.log(data.sell_order_graph);
			console.log(level);
			for(; data.sell_order_graph[i][1] < level * 5; i++);
			jQuery.ajax({
				method: "POST",
				url: "https://steamcommunity.com/market/createbuyorder/",
				data: {
					sessionid: sessionid,
					currency: 5,
					appid: 753,
					market_hash_name: hashname,
					price_total: Math.round(data.sell_order_graph[i][0] * 100 * needs[hashname]),
					quantity: needs[hashname]
				}
			}).done((data) => {
				if(data.success == 1)
				{
					checkq.push({
						id: data.buy_orderid,
						name: name
					})
					console.log(data);
				} else
				{
					chrome.runtime.sendMessage({action: "error", type: "cardbuy", data: name, errorcode: data.success});
				}
			});
		} else
		{
			chrome.runtime.sendMessage({action: "error", type: "cardcheck", data: name, errorcode: data.success});
		}
	});
}

async function checking(orderid, name)
{
	jQuery.ajax({
		url: `https://steamcommunity.com/market/getbuyorderstatus/?sessionid=${sessionid}&buy_orderid=${orderid}`
	}).done((data) => {
		if(data.success)
		{
			if(data.quantity_remaining == "0")
			{
				checkq.splice(0, 1);
				done++;
				console.log('one done...');
				next();
			}
		} else
		{
			chrome.runtime.sendMessage({action: "error", type: "ordercheck", data: name, errorcode: data.success});
		}
	});
}

function Done()
{
	console.log('all done...');
	LevelUp();
}

function start()
{
	storage.get(["current"], res => {
		if(res.current == "level")
			Level();
	});
}

window.addEventListener("load", start, false);