var left = 5;
var sessionid;
var steamid;
var level;

var cur = 0;
var arrq = [
	{
		hashname: '730-Balkan',
		id: 1115010,
		name: 'Balkan'
	},
	{
		hashname: '730-SWAT',
		id: 1115040,
		name: 'SWAT'
	},
	{
		hashname: '730-Anarchist',
		id: 1115101,
		name: 'Anarchist'
	},
	{
		hashname: '730-IDF',
		id: 1115050,
		name: 'IDF'
	},
	{
		hashname: '730-FBI',
		id: 1115074,
		name: 'FBI'
	},
];

var checkcur = -1;
var checkq = [];

function Level()
{
	jQuery("body").append("<script>jQuery('body').append(\"<p id='sessionid' style='display: none;'>\"+g_sessionID+\"</p>\")</script>");
	sessionid = jQuery("#sessionid").text();

	jQuery("body").append("<script>jQuery('body').append(\"<p id='steamid' style='display: none;'>\"+g_steamID+\"</p>\")</script>");
	steamid = jQuery("#steamid").text();

	storage.get(["level"], res => {
		level = res.level;
		queue();
	});
}

function queue()
{
	if(cur < arrq.length)
	{
		startbuy(arrq[cur].hashname, arrq[cur].id, arrq[cur].name);
		cur++;
	}
}

function checkqueue()
{
	if(checkq.length != 0)
	{
		if(checkcur >= checkq.length - 1)
			checkcur = 0;
		else checkcur++;
		checking(checkq[checkcur].id, checkq[checkcur].name);
	}
}

async function startbuy(hashname, id, name)
{
	jQuery.ajax({
		url: `https://steamcommunity.com/market/itemordershistogram?country=RU&language=russian&currency=5&item_nameid=${id}`
	}).done((data) => {
		if(data.success)
		{
			var i = 0;
			for(; data.sell_order_graph[i][1] < level * 5; i++);
			jQuery.ajax({
				method: "POST",
				url: "https://steamcommunity.com/market/createbuyorder/",
				data: {
					sessionid: sessionid,
					currency: 5,
					appid: 753,
					market_hash_name: hashname,
					price_total: Math.round(data.sell_order_graph[i][0] * 100 * level),
					quantity: level
				}
			}).done((data) => {
				if(data.success == 1)
				{
					checkq.push({
						id: data.buy_orderid,
						name: name
					})
					if(checkq.length == 1)
						checkqueue();
					queue();
					console.log(data);
				} else
				{
					chrome.runtime.sendMessage({action: "error", type: "cardbuy", data: name, errorcode: data.success});
					done();
				}
			});
		} else
		{
			chrome.runtime.sendMessage({action: "error", type: "cardcheck", data: name, errorcode: data.success});
			done();
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
				done();
				checkq.splice(checkcur, 1);
				checkcur--;
			}
		} else
		{
			chrome.runtime.sendMessage({action: "error", type: "ordercheck", data: name, errorcode: data.success});
		}
		setTimeout(checkqueue, 2000);
	});
}

function done()
{
	console.log('one done...');
	left--;
	if(!left)
	{
		storage.set({current: "levelup"}, () => {
			location.href = `https://steamcommunity.com/profiles/${steamid}/gamecards/730/`;
		});
	}
}

function start()
{
	// storage.get(["current"], res => {
	// 	if(res.current == "level")
	// 		Level();
	// });
}

window.addEventListener("load", start, false);