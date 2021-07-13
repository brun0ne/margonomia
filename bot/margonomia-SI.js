// ==UserScript==
// @name         Margonomia
// @version      1.0
// @description  TODO
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
				if(document.getElementById("au1") == null || document.getElementById("auctions").style.display !== "block"){
					window.location.reload();
				}
			}, 1000*9)

			setTimeout(function(){
				try{
					check_list(search_list);
				}
				catch(e){
					window.location.reload();
				}
			}, 1000*11);

		}, randint(5*1000, 10*1000));
	}

	function checkIfMore(){
		let all_next = document.getElementsByClassName("next");
		let next_button;

		for(let i = 0; i < all_next.length; i++){
			if(all_next[i].onclick != null){
				if(all_next[i].onclick.toString().includes("ah_page")){
					next_button = all_next[i];
					break;
				}
			}
		}

		if(next_button != null){
			next_button.click();
			return true;
		}
		else
			return false;
	}

	function getPrices(search) {
		let raw_arr = Array.from(document.getElementsByClassName("buyout"));

		let int_arr = [];

		if (raw_arr.length == 0)
			return [];

		for (let i = 0; i < raw_arr.length; i++) {
			let quantity_el_list = raw_arr[i].parentElement.parentElement.getElementsByTagName("small");
			let quantity;

			if(quantity_el_list.length > 0){
				quantity = parseInt(quantity_el_list[0].innerHTML);
			}

			let price = parseInt(raw_arr[i].onclick.toString().split(", ")[1].split(")")[0]);

			let name = raw_arr[i].parentElement.parentElement.children[1].innerHTML.split(" (")[0];

			if (search.toLowerCase() !== name.toLowerCase()){
				console.log("NAME MATCHING ERROR");
				continue;
			}

			if(quantity != null){
				price /= quantity;
				price = Math.round(price);
			}

			//console.log(price, quantity);

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

	function getSearchValue() {
		let text = document.getElementById("ah_search").value;
		return text;
	}

	function setSearchValue(text) {
		document.getElementById("ah_search").value = text;
	}

	function refreshAuction() {
		document.querySelector("[onclick='ah_apply()']").click()
	}

	function setType(type) {
		switch (type) {
			case "jednoręczne":
				document.getElementById("au1").click()
				break;
			case "dwuręczne":
				document.getElementById("au2").click()
				break;
			case "półtoraręczne":
				document.getElementById("au3").click()
				break;
			case "dystansowe":
				document.getElementById("au4").click()
				break;
			case "pomocnicze":
				document.getElementById("au5").click()
				break;
			case "różdżki":
				document.getElementById("au6").click()
				break;
			case "laski":
				document.getElementById("au7").click()
				break;
			case "zbroje":
				document.getElementById("au8").click()
				break;
			case "hełmy":
				document.getElementById("au9").click()
				break;
			case "buty":
				document.getElementById("au10").click()
				break;
			case "rękawice":
				document.getElementById("au11").click()
				break;
			case "pierścienie":
				document.getElementById("au12").click()
				break;
			case "naszyjniki":
				document.getElementById("au13").click()
				break;
			case "tarcze":
				document.getElementById("au14").click()
				break;
			case "neutralne":
				document.getElementById("au15").click()
				break;
			case "konsumpcyjne":
				document.getElementById("au16").click()
				break;
			case "strzały":
				document.getElementById("au21").click()
				break;
			case "talizmany":
				document.getElementById("au22").click()
				break;
			case "konsumpcyjne":
				document.getElementById("au23").click()
				break;
			case "konsumpcyjne":
				document.getElementById("au99").click()
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

	const MINUTES = 60;

	const SERVER_URL = "https://margonomia.pl/";

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
			pass: "asmxSdnaxlD231"
		});
	}

	function check(name) {
		console.log("Trying: " + name);

		setTimeout(
			refreshAuction,
			2000
		);
		setTimeout(function() {
			let prices = getPrices(name);

			if(prices === false)
				return false;

			// CHECK up to 3 pages
			if(checkIfMore()){
				setTimeout(function(){
					let prices2 = getPrices(name);

					if(prices2 === false)
						return false;

					prices = prices.concat(prices2);

					if(checkIfMore()){
						setTimeout(function(){
							let prices3 = getPrices(name);

							if(prices3 === false)
								return false;

							prices = prices.concat(prices3);
						}, 500);
					}
				}, 500);
			}

			setTimeout(function(){
				//console.log(prices);
				let lowest_price = getLowestPrice(prices);

				console.log("Saving price: " + lowest_price + " for item: " + name);

				saveLowestPrice(name, lowest_price);
			}, 1500);

		}, 3000);
	}

	function track(type, name) {
		let s = setType(type);

		if(s === false){
			console.log("Wrong type, ABORT");
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
		if(document.getElementById("au1") == null || document.getElementById("auctions").style.display !== "block"){
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
	}

	function setup(search_list, interval) {
		check_list(search_list);

		/*setInterval(function() {
			check_list(search_list);
		}, interval);*/
	}

	setTimeout(function() {
		console.log("Margonomia running");
		setup(SEARCH, MINUTES * 60 * 1000);
	}, 10 * 1000);

	setInterval(function(){
		if(document.body.innerHTML.includes("Liczba pozostałych prób")){ // CAPTCHA
			console.log("CAPTCHA");
			leave();
		}
	}, 3*1000);
})();
