// ==UserScript==
// @name         Margonomia
// @version      2.0
// @description  Prices Bot
// @author       Brun0ne
// @match        http://*.margonem.com/
// @match        https://*.margonem.com/
// @match        http://*.margonem.pl/
// @match        https://*.margonem.pl/
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
	'use strict';

	const MINUTES = 60;
	const SERVER_URL = "http://localhost:8881/";
	const INTERVAL_MODE = true;

	function simulateKeyPress(character, delay) {
		setTimeout(function(){
  			jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
		}, randint(100, 1500) + delay*1000);
  	}

	function leave() {
		let myWindow = window.open("", "_self");
		myWindow.document.write("");
		setTimeout(function() {myWindow.close();}, 1000);
	}

	function restabilize(search_list){
		// LOGGED OUT?

		setTimeout(function(){
			simulateKeyPress("d", 0);
			simulateKeyPress("d", 1);
			simulateKeyPress("a", 2);
			simulateKeyPress("a", 3);

			setTimeout(function(){
				document.querySelector('[tip="<b>Aukcjoner</b><span ></span>"]').dispatchEvent(new Event("click"));
			}, 1000*5);

			setTimeout(function(){
				document.getElementsByClassName("icon icon LINE_OPTION")[0].click();
			}, 1000*7);

			setTimeout(function(){
				if(get_auction(1) == null){
					window.location.reload();
				}
			}, 1000*9)

			setTimeout(function(){
				try{
					check_list(search_list);
				}
				catch(e){
					console.log(e); 
					window.location.reload();
				}
			}, 1000*11);

		}, randint(5*1000, 10*1000));
	}

	function getPrices(search) {
		let raw_arr = Array.from(document.getElementsByClassName("auction-table")[0].childNodes);

		let int_arr = [];

		if (raw_arr.length == 0)
			return [];

		for (let i = 0; i < raw_arr.length; i++) {
			let quantity_el_list = raw_arr[i].getElementsByTagName("small");
			let quantity;

			if(quantity_el_list.length > 0){
				quantity = parseInt(quantity_el_list[0].innerHTML);
			}

			// Parsing
			let price = raw_arr[i].getElementsByClassName("auction-cost-label");

			if(price.length == 0)
				continue;
			else	
				price = price[0].innerHTML;

			if(price.replaceAll(" ", "") === "") // only auction, no buy now
				continue;

			let last_char = price.slice(-1); // k, m, g
			let num_str;

			if(["k", "m", "g"].includes(last_char))
				num_str = price.slice(0, -1); // everything before
			else
				num_str = price;

			if(price.includes("+")) // this item is selling for + SŁ
				continue;

			let mult = 1;
			if (last_char == "k") mult = 1000; // 10^3
			else if (last_char == "m") mult = 1000000; // 10^6
			else if (last_char == "g") mult = 1000000000; // 10^9

			price = parseFloat(num_str) * mult;

			// Item name
			let name = raw_arr[i].getElementsByClassName("auction-item-name")[0].innerHTML.split(" (")[0];

			if (search.toLowerCase() !== name.toLowerCase()){
				console.log("NAME MATCHING ERROR");
				continue;
			}

			if(quantity != null){
				price /= quantity;
				price = Math.round(price);
			}

			int_arr.push(price);
		}

		return int_arr;
	}

	function getLowestPrice(num_arr) {
		let lowest = Infinity;

		for (let i = 0; i < num_arr.length; i++) {
			if (num_arr[i] < lowest)
				lowest = num_arr[i];
		}

		return lowest;
	}

	function setSearchValue(text) {
		document.querySelectorAll('[placeholder="Nazwa przedmiotu"]')[0].value = text;
	}

	function refreshAuction() {
		document.querySelectorAll('[name="Odśwież"]')[0].click();
	}

	function get_auction(number){
        return document.getElementsByClassName("auction-category-" + number)[0];
    }

	function setType(type) {
		switch (type) {
			case "jednoręczne":
				get_auction(1).click()
				break;
			case "dwuręczne":
				get_auction(2).click()
				break;
			case "półtoraręczne":
				get_auction(3).click()
				break;
			case "dystansowe":
				get_auction(4).click()
				break;
			case "pomocnicze":
				get_auction(5).click()
				break;
			case "różdżki":
				get_auction(6).click()
				break;
			case "laski":
				get_auction(7).click()
				break;
			case "zbroje":
				get_auction(8).click()
				break;
			case "hełmy":
				get_auction(9).click()
				break;
			case "buty":
				get_auction(10).click()
				break;
			case "rękawice":
				get_auction(11).click()
				break;
			case "pierścienie":
				get_auction(12).click()
				break;
			case "naszyjniki":
				get_auction(13).click()
				break;
			case "tarcze":
				get_auction(14).click()
				break;
			case "neutralne":
				get_auction(15).click()
				break;
			case "konsumpcyjne":
				get_auction(16).click()
				break;
			case "strzały":
				get_auction(21).click()
				break;
			case "talizmany":
				get_auction(22).click()
				break;
			case "torby":
				get_auction(24).click()
				break;
			case "recepty":
				get_auction(27).click()
				break;

			default:
				console.log("setType(): wrong type");
				return false;
		}
		return true;
	}

	/////////////////

	const SEARCH = [{
			name: "Łeb Mithrylowej Łapy",
			type: "neutralne"
		},
		{
			name: "Kamasze wypełnione wydzieliną",
			type: "buty"
		},
		{
			name: "Przeszywająca cięciwa pustyni",
			type: "dystansowe"
		},
		{
			name: "Klejnot obsydianu",
			type: "neutralne"
		},
		{
			name: "Znak igni",
			type: "naszyjniki"
		},
		{
			name: "Ognisty złoty miecz",
			type: "jednoręczne"
		},
		{
			name: "Skórzana kurta jeźdźca błyskawic",
			type: "zbroje"
		},
		{
			name: "Ochrona żaru",
			type: "naszyjniki"
		},
		{
			name: "Zaklęta dusza szlachcianki",
			type: "neutralne"
		},
		{
			name: "Głowa zbira",
			type: "neutralne"
		},
		{
			name: "Kolczuga straży honorowej",
			type: "zbroje"
		},
		{
			name: "Przebicie ślepego wąwozu",
			type: "dystansowe"
		},
		{
			name: "Maska złodzieja",
			type: "hełmy"
		},
		{
			name: "Magiczny kaptur Kotołaka",
			type: "hełmy"
		},
		{
			name: "Paszcza wilczych rytuałów",
			type: "hełmy"
		},
		{
			name: "Tnąca cięciwa umysłu",
			type: "dystansowe"
		},
		{
			name: "Dwoiste buty leśnego trapera",
			type: "buty"
		},
		{
			name: "Ochrona posępnego władcy",
			type: "zbroje"
		},
		{
			name: "Kamasze wypełnione wydzieliną",
			type: "buty"
		},
		{
			name: "Kaftan przesiąknięty flegmą",
			type: "zbroje"
		},
		{
			name: "Zbójeckie złotko",
			type: "naszyjniki"
		},
		{
			name: "Pancerz orczych lordów",
			type: "zbroje"
		},
		{
			name: "Karmazynowy chwyt demona",
			type: "rękawice"
		},
		{
			name: "Siła spełnienia",
			type: "pierścienie"
		},
		{
			name: "Osłona Choukkera",
			type: "tarcze"
		},
		{
			name: "Kapelusz bardzo mrocznego Patryka",
			type: "hełmy"
		},
		{
			name: "Zatruty sztylet bandyty",
			type: "pomocnicze"
		},
		{
			name: "Bransolety potęgi Patryka",
			type: "rękawice"
		},
		{
			name: "Łuskowa zbroja Thowara",
			type: "zbroje"
		},
		{
			name: "Buty władców grobowców",
			type: "buty"
		},
		{
			name: "Talizman chitynowych płytek",
			type: "naszyjniki"
		},
		{
			name: "Tarcza świtu baśni",
			type: "tarcze"
		},
		{
			name: "Topór kościeja",
			type: "jednoręczne"
		},
		{
			name: "Rdzeń Świadomości",
			type: "naszyjniki"
		},
		{
			name: "Maska Akumu",
			type: "hełmy"
		},
		{
			name: "Naramienniki samca alfa",
			type: "rękawice"
		}
	];

	function randint(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function sendAJAX(command, args) {
		let args_text = "";

		for (var key in args) {
			if (args.hasOwnProperty(key)) {
				args_text += key + "=" + args[key] + "&";
			}
		}

		const xhttp = new XMLHttpRequest();

		xhttp.onload = function() {
			//console.log(this.responseText);
		}

		xhttp.open("GET", SERVER_URL + command + "?" + args_text, true);
		xhttp.send();
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	/////////////////

	function saveLowestPrice(name, lowest_price){
		if(lowest_price == Infinity || isNaN(lowest_price)){
			console.log("INF")
			lowest_price = 0;
		}

		let to_print;
		if (lowest_price == 0)
			to_print = "NOT_AVAIL";
		else
			to_print = lowest_price;

		print_line("Sending price: " + to_print + " for item " + name.substring(0, 10) + "..");

		let timestamp = new Date().toLocaleString("pl-PL", {hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"}).replaceAll(".", "-").replace(",", "").split(" ");

		var time = timestamp[1];
		var mdy = timestamp[0];

		mdy = mdy.split('-');
		var month = mdy[0];
		var day = mdy[1];
		var year = mdy[2];

		var formattedDate = year + '-' + day + '-' + month + ' ' + time + ".000";

		sendAJAX("save_price", {
			search: name,
			price: lowest_price,
			time: formattedDate,
			pass: "TEST"
		});
	}

	function check(name) {
		console.log("Trying: " + name);

		setTimeout(
			refreshAuction,
			2000
		);

		function scroll_down_auction_list(){
			document.getElementsByClassName("scroll-pane")[0].scrollIntoView(false);
		}

		// this should get everything loaded
		setTimeout(scroll_down_auction_list, 3000);
		setTimeout(scroll_down_auction_list, 3100);
		setTimeout(scroll_down_auction_list, 3200);
		setTimeout(scroll_down_auction_list, 3300);
		setTimeout(scroll_down_auction_list, 3400);
		setTimeout(scroll_down_auction_list, 3500);

		setTimeout(function() {
			let prices = getPrices(name);

			if(prices === false)
				return false;

			setTimeout(function(){
				let lowest_price = getLowestPrice(prices);

				saveLowestPrice(name, lowest_price);
			}, 1500);

		}, 4000);
	}

	function track(type, name) {
		let s = setType(type);

		if(s === false){
			print_line("Wrong type!");
			return false;
		}

		setTimeout(
			function() {
				setSearchValue(name);
			},
			1000
		);
	}

	function check_list(search_list) {
		if(get_auction(1) == null){
		    print_line("Stabilizing...");
			restabilize(search_list);
			return false;
		}

		shuffleArray(search_list);

		for (let i = 0; i < search_list.length; i++) {
			let name = search_list[i].name;
			let type = search_list[i].type;

			setTimeout(function() {
				track(type, name);
				check(name);
			}, 5500*(i+1));
		}

		setTimeout(function() { // end
			document.innerHTML = "ended";

			for (var i = 1; i < 99999; i++)
        		window.clearInterval(i);
		}, 5500*(search_list.length+1));
	}

	function setup(search_list, interval) {
		// run once
		check_list(search_list);
		if (INTERVAL_MODE){
			setInterval(function() { // run price grabbing periodically
				print_line("Interval mode: starting run")
				check_list(search_list);
			}, interval);
		}
	}

	setup_display();
	print_line("Initializing Margonomia...");
	setTimeout(function() {
		print_line("Margonomia started!");
		setup(SEARCH, MINUTES * 60 * 1000);
	}, 10 * 1000);

	setInterval(function(){
		if(document.body.innerHTML.includes("Liczba pozostałych prób")){ // CAPTCHA
			console.log("CAPTCHA");
			leave();
		}
	}, 3*1000);

	/////////////////////////
	// DISPLAY

	function setup_display(){
		let div = document.createElement("div");
		div.style.cssText = "position: fixed; top: 1%; left: 1%; width: 400px; height: 100px; background: black; overflow-y: auto; font-family: Consolas, Consolas; font-size: 1.2vh; z-index: 99;";
		div.id = "margonomia_display";
		document.body.append(div);
	}

	function print_line(text){
		let span  = document.createElement("span");
		span.append(text);
		let br = document.createElement("br");

		const display = document.getElementById("margonomia_display");
		display.append(span);
		display.append(br);

		span.scrollIntoView();
	}
})();
