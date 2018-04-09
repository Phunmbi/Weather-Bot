var chatSubmit = document.getElementById("chatsubmit"); //caching the submit button.
var chatText = document.getElementById("chattext"); // and the input field.
var form = document.querySelector("form");
var chatSpace = document.getElementById("chatspace"); //as well as the general chatspace cause we'll be reusing all these.

chatText.focus(); // auto focus on the input field.

chatSubmit.addEventListener("click", function (e) {
	e.preventDefault(); //prevent the default behaviour of a form reloading the entire page when it submits

	//Then we create all the new elements that will house each message
	var newUserMessageDivUser = document.createElement("div");
	var newUserMessageDivBot = document.createElement("div");
	var newSubDivUser = document.createElement("div");
	var newSubDivBot = document.createElement("div");
	var userMessage = document.createElement("p");
	var botMessage = document.createElement("p");
	var clearFloatDivUser = document.createElement("div");
	var clearFloatDivBot = document.createElement("div");

	//then we add the necessary classes to transfer the styles
	newSubDivUser.className = "chatmessage";
	clearFloatDivUser.className = "after-chatmessage";
	newUserMessageDivUser.className = "messagediv";

	// then we append them to the necessary quarters to create the message structure we need.

	userMessage.innerHTML = chatText.value;
	newSubDivUser.appendChild(userMessage);
	newUserMessageDivUser.appendChild(newSubDivUser);
	newUserMessageDivUser.appendChild(clearFloatDivUser);
	chatSpace.appendChild(newUserMessageDivUser);

	// Now for the bot's response using a web worker
	// first we need to filter throught the user's input and grab the city we are working wit
	var unchecked = chatText.value;
	function checkCityName(unchecked) {
		var check = /\bin\b/;
		var checkResult = unchecked.search(check);
		return checkResult += 3;
	}

	var userInput = unchecked.slice(checkCityName(unchecked), unchecked.length);

	var web_worker;
	if (typeof (Worker) !== "undefined") {
		if (typeof (web_worker) == "undefined") {
			web_worker = new Worker("js/worker.js");
			web_worker.postMessage(userInput);
		}
		web_worker.onmessage = function (event) {
			botMessage.innerHTML = "The temperature for " + event.data.name + " is " + event.data.main.temp + " &#8451;" + " with a weather possibility of " + event.data.weather[0].description;
			newSubDivBot.className = "botmessage";
			clearFloatDivBot.className = "after-botmessage";
			newUserMessageDivBot.className = "messagediv";

			newSubDivBot.appendChild(botMessage);
			newUserMessageDivBot.appendChild(newSubDivBot);
			newUserMessageDivBot.appendChild(clearFloatDivBot);
			chatSpace.appendChild(newUserMessageDivBot);

			web_worker.terminate();
			web_worker = undefined;
		};
	}

	// Then we reset the form field for new messages.
	form.reset();
});


// Here we deal with the themes
// First we define the behaviour of the dropdown (to drop when clicked on and retract when clicked on again)
var dropmenu = document.getElementById("mydropmenu");
dropmenu.addEventListener("click", function () {
	document.getElementById("mymenucontent").classList.toggle("show");
});

// then we make the provision for it to retract also when any other part of the window is clicked on as well.
window.onclick = function (event) {
	if (!event.target.matches('.dropmenu')) {

		var dropdowns = document.getElementsByClassName("menucontent");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
};

// Now we define the themes themselves
var green = document.getElementById("green");
var dark = document.getElementById("dark");
var header = document.getElementById("header");
var section = document.getElementById("section");

// defining the behaviour, content and trigger of the green coloured theme.
green.addEventListener("click", function () {
	header.classList.remove("darktheme");
	header.classList.add("greentheme");
	section.style.backgroundImage = "url(img/bgpattern1.jpg)";

});

// Doing the same for the dark theme.
dark.addEventListener("click", function () {
	header.classList.remove("greentheme");
	header.classList.add("darktheme");
	section.style.backgroundImage = "url(img/bgpattern2.jpg";
});