let storage = {};

var freePackages =
[
6328, // ProtoGalaxy
21289, // Bloodline Champions
21290, // Dragon Nest
21291, // Americas Army 3
21292, // Global Agenda
21293, // Tribes: Ascend
21294, // Forsaken World
21295, // Rusty Hearts
21296, // CrimeCraft GangWars
21297, // Stronghold Kingdoms
21298, // Tactical Intervention
21299, // HOMEFRONT Demo
21300, // Spiral Knights
21301, // Puzzle Pirates
21302, // A.V.A - Alliance of Valiant Arms
21303, // Super Monday Night Combat
21304, // Age of Empires Online
21305, // Pandora Saga: Weapons of Balance
21306, // War Inc. Battlezone
21307, // Memoir 44 Online
21308, // MicroVolts Surge
21309, // Brawl Busters
21310, // Neverwinter
21311, // APB Reloaded
21312, // Fallen Earth
21313, // World of Battles
21314, // Realm of the Mad God
21315, // Magic: The Gathering � Tactics
21316, // PoxNora
21317, // EverQuest II
21318, // Americas Army: Proving Grounds Beta
21319, // EverQuest Free-to-Play
21320, // Gotham City Impostors: Free To Play
21321, // Archeblade
21322, // Moon Breakers
21323, // Loadout
21324, // War of the Immortals
21325, // RaceRoom Racing Experience
21326, // Bullet Run
21327, // Star Conflict
21328, // Vindictus
21329, // Combat Arms
21330, // Mabinogi
21331, // Dungeon Fighter Online
21332, // Atlantica
21333, // Arctic Combat
21334, // C9
21335, // The Lord of the Rings Online�
21336, // Super Crate Box
21337, // Dwarfs F2P
21338, // ROSE Online
21339, // Dungeon Party
21340, // Dungeonland
21341, // PlanetSide 2
21342, // Frontline Tactics
21343, // The Banner Saga: Factions
21344, // Football Superstars
21345, // District 187
21346, // Champions of Regnum
21347, // Uncharted Waters Online
21348, // RIDGE RACER� Driftopia
21349, // Construct 2 Free
21350, // Warframe
21351, // Ragnarok Online 2
21352, // March of War
21353, // War Thunder
21354, // Shadow Warrior Classic (1997)
21355, // Arcane Saga Online
21356, // Pinball Arcade
21357, // Path of Exile
21358, // Panzar
21359, // Tom Clancys Ghost Recon Phantoms - NA
21360, // Dragon Nest Europe
21361, // Dragons and Titans
21362, // Tom Clancys Ghost Recon Phantoms - EU
21363, // Fiesta Online
21364, // Thinking with Time Machine
21365, // Fiesta Online NA
31606, // Magic 2015 Demo Steam Store and Retail Key
33980, // World of Guns // (unaddable – sub 0)
34295, // La Tale
35341, // Steam Sub 35341 // Dark Blood
35650, // EVGA Precision X
41518, // Steam Sub 41518 (GAR Default store package)
42551, // Overcast - Walden and the Werewolf - Soundtrack
42558, // Steam Sub 42558 // Royal Quest
42889, // Dusty Revenge - Almost Human
43316, // Only If
43716, // Face of Mankind
44226, // Robocraft
44986, // Grand Chase
45117, // Quantum Rush Online
45123, // Unturned
45217, // Cakewalk Loop Manager
45660, // Defiance
45705, // Floating Point
45767, // Velvet Sundown
45800, // CRYENGINE - Sample Assets
45946, // Reversion: The Escape
46138, // March of War // (unaddable – sub 0)
46481, // Firefall
46682, // Star Trek Online
46693, // OMSI 2 - AI-Articulated Bus for Vienna
47144, // Warface
47182, // NEOTOKYO (NEOTOKYO°)
47235, // Steam Sub 47235 (The Expendabros)
47267, // Champions Online - Free for All
47333, // Aura Kingdom
47466, // Heroes & Generals
47514, // Sunrider
47669, // Xam
47670, // Tom Clancy's Ghost Recon Phantoms - EU: Assault Starter Pack FREE
47673, // Tom Clancy's Ghost Recon Phantoms - NA: Assault Starter Pack FREE
47674, // Tom Clancy's Ghost Recon Phantoms - EU: Support Starter Pack FREE
47675, // Tom Clancy's Ghost Recon Phantoms - NA: Support Starter Pack FREE
47676, // Tom Clancy's Ghost Recon Phantoms - EU: Recon Starter Pack FREE
47677, // Tom Clancy's Ghost Recon Phantoms - NA: Recon Starter Pack FREE
47709, // The Forgotten Ones
48316, // Dead Island Epidemic Free Access
48901, // Nosgoth Base Game Default Package
48909, // Marvel Heroes // (unaddable – sub 0)
48959, // Saira
48998, // Amazing World
49027, // Rise of Incarnates Beta
49298, // Team Fortress 2 - Free On-Demand
49307, // Dota 2 - Free On-Demand // (unaddable – sub 0)
];

storage.set = async (changes, callback = null) => {
	chrome.storage.sync.set(changes, (res) => {
		if(callback != null)
			callback(res);
	});
}

storage.get = async (keys, callback) => {
	chrome.storage.sync.get(keys, function(result) {
		callback(result);
	});
}

function getSteamid()
{
	jQuery("body").append("<script>jQuery('body').append(\"<p id='steamid' style='display: none;'>\"+g_steamID+\"</p>\")</script>");
	let steamid = jQuery("#steamid").text();
	if(!steamid)
	{
		chrome.runtime.sendMessage({action: "error", type: "nosteamid"});
		throw "steamid отсутствует!";
	}
	return steamid;
}

function getSessionid()
{
	jQuery("body").append("<script>jQuery('body').append(\"<p id='sessionid' style='display: none;'>\"+g_sessionID+\"</p>\")</script>");
	let sessionid = jQuery("#sessionid").text();
	if(!sessionid)
	{
		chrome.runtime.sendMessage({action: "error", type: "nosessionid"});
		throw "sessionid отсутствует!";
	}
	return sessionid;
}

async function getSteamApiSteamId()
{
	gettingapi = true;
	storage.set({current: "steamapi"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://steamcommunity.com/dev/apikey'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://steamcommunity.com/dev/apikey', active: false}, (tab) => {
		curtab = tab.id;
	});
}

async function getTradeLink()
{
	storage.set({current: "tradelink"});
	storage.get(["steamid"], res => {
		if(curtab)
			chrome.tabs.update(curtab, {url: `https://steamcommunity.com/profiles/${res.steamid}/tradeoffers/privacy`}, tab => {
				curtab = tab.id;
			});
		else chrome.tabs.create({url: `https://steamcommunity.com/profiles/${res.steamid}/tradeoffers/privacy`, active: false}, (tab) => {
			curtab = tab.id;
		});
	})
}

async function marketAuth()
{
	storage.set({current: "market"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://market.csgo.com/sell'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://market.csgo.com/sell', active: false}, (tab) => {
		curtab = tab.id;
	});
}

async function checkprofile()
{
	storage.set({current: "checkprofile"});
	chrome.tabs.create({url: 'https://steamcommunity.com/', active: false}, tab => {
		curtab = tab.id;
	});
}

async function ViewBroadcast()
{
	storage.set({current: "broadcast"});
	if(curtab)
		chrome.tabs.update(curtab, {url: topbroadcast}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: topbroadcast, active: false}, tab => {
		curtab = tab.id;
	});
}

async function SubscribeToWorkshopItem()
{
	storage.set({current: "workshop"});
	if(curtab)
		chrome.tabs.update(curtab, {url: top30workshop[Math.round(Math.random() * 29)]}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: top30workshop[Math.round(Math.random() * 29)], active: false}, tab => {
		curtab = tab.id;
	});
}

async function UseDiscoveryQueue()
{
	storage.set({current: "discovery"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://store.steampowered.com/explore/'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://store.steampowered.com/explore/', active: false}, tab => {
		curtab = tab.id;
	});
}

async function RateUpContentInActivityFeed()
{
	storage.set({current: "activity"});
	if(curtab)
		chrome.tabs.update(curtab, {url: 'https://steamcommunity.com/id/me/home/'}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: 'https://steamcommunity.com/id/me/home/', active: false}, tab => {
		curtab = tab.id;
	});
}

async function AddItemToWishlist()
{
	storage.set({current: "wishlist"});
	if(curtab)
		chrome.tabs.update(curtab, {url: topgames[Math.round(Math.random()*24)]}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: topgames[Math.round(Math.random()*24)], active: false}, tab => {
		curtab = tab.id;
	});
}

async function JoinGroup()
{
	storage.set({current: "group"});
	storage.get(['customsettings', 'mode'], res => {
		let group;
		if(res.mode == 5 && res.customsettings.groupon && res.customsettings.group)
			group = res.customsettings.group;
		else group = top100group[Math.round(Math.random()*(top100group.length - 1))];

		if(curtab)
			chrome.tabs.update(curtab, {url: group}, tab => {
				curtab = tab.id;
			});
		else chrome.tabs.create({url: group, active: false}, tab => {
			curtab = tab.id;
		});
	});
}

async function ProfileEdit()
{
	storage.set({current: "profileedit", profileEdited: false});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/id/me/edit"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/id/me/edit", active: false}, tab => {
		curtab = tab.id;
	});
}

async function SearchInDiscussions()
{
	storage.set({current: "discussions"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/discussions/"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/discussions/", active: false}, tab => {
		curtab = tab.id;
	});
}

async function SetupCommunityAvatar()
{
	storage.set({current: "avatar"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/actions/GameAvatars/"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/actions/GameAvatars/", active: false}, tab => {
		curtab = tab.id;
	});
}

async function Privacy()
{
	storage.set({current: "privacy"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/id/me/edit/settings"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/id/me/edit/settings", active: false}, tab => {
		curtab = tab.id;
	});
}

async function Chat()
{
	storage.set({current: "chat"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/chat/"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/chat/", active: false}, tab => {
		curtab = tab.id;
	});
}

async function Level()
{
	storage.set({current: "level"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/market/"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/market/", active: false}, tab => {
		curtab = tab.id;
	});
}

async function Gems()
{
	storage.set({current: "gems"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://steamcommunity.com/"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://steamcommunity.com/", active: false}, tab => {
		curtab = tab.id;
	});
}

async function getFreeLicenses(){
	storage.set({current: "getFreeLicenses"});
	if(curtab)
		chrome.tabs.update(curtab, {url: "https://store.steampowered.com/"}, tab => {
			curtab = tab.id;
		});
	else chrome.tabs.create({url: "https://store.steampowered.com/", active: false}, tab => {
		curtab = tab.id;
	});
}