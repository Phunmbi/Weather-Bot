var chatSubmit = document.getElementById("chatsubmit"); //caching the submit button.
var chatText = document.getElementById("chattext"); // and the input field.
var form = document.querySelector("form"); // And access to the form tag.
var chatSpace = document.getElementById("chatspace"); //as well as the general chatspace cause we'll be reusing all these.

chatText.focus(); // auto focus on the input field.



chatSubmit.addEventListener("click", function (e) {
	e.preventDefault(); //prevent the default behaviour of a form reloading the entire page when it submits

	function checkCityName(text) {
		var checkResult = text.match(/\b(in)\b/);
		if (checkResult !== null) {
			return checkResult.index += 3;
		}
	}

	// We have to check the user input that it is a valid input before adding it to the chat space
	if (chatText.value !== "" && chatText.value !== " ") {
		// We create all the new elements that will house each message
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
		// first we need to filter throught the user's input and grab the city we are working with
		// variable check to see if the variable is not empty. if it is. stop
		var uncheckedInput = chatText.value;
		var userInput = uncheckedInput.slice(checkCityName(uncheckedInput), uncheckedInput.length);

		// Here we define the web worker we'll be using to perform the api calls away from the main thread.
		var web_worker;
		if (typeof (Worker) !== "undefined") {
			if (typeof (web_worker) == "undefined") {
				web_worker = new Worker("js/worker.js");
				web_worker.postMessage(userInput);
			}

			// We handle the response from the web worker when it's ready, it should return the response from the api. if there is any
			web_worker.onmessage = function (event) {
				if (event.data.cod == 200) {
					botMessage.innerHTML = "The temperature for " + event.data.name + ", " + event.data.sys.country + " is " + event.data.main.temp + " &#8451;" + " with a weather possibility of " + event.data.weather[0].description;

					//then we add the necessary classes to transfer the styles
					newSubDivBot.className = "botmessage";
					clearFloatDivBot.className = "after-botmessage";
					newUserMessageDivBot.className = "messagediv";

					// then we append them to the necessary quarters to create the message structure we need.
					newSubDivBot.appendChild(botMessage);
					newUserMessageDivBot.appendChild(newSubDivBot);
					newUserMessageDivBot.appendChild(clearFloatDivBot);
					chatSpace.appendChild(newUserMessageDivBot);

					// Then we terminate the web worker and re initialize it as undefined.
					web_worker.terminate();
					web_worker = undefined;
				}
				if (event.data.cod == 404) {
					botMessage.innerHTML = event.data.message + ", Please enter a major city.";

					//then we add the necessary classes to transfer the styles
					newSubDivBot.className = "botmessage";
					clearFloatDivBot.className = "after-botmessage";
					newUserMessageDivBot.className = "messagediv";

					// then we append them to the necessary quarters to create the message structure we need.
					newSubDivBot.appendChild(botMessage);
					newUserMessageDivBot.appendChild(newSubDivBot);
					newUserMessageDivBot.appendChild(clearFloatDivBot);
					chatSpace.appendChild(newUserMessageDivBot);

					// Then we terminate the web worker and re initialize it as undefined.
					web_worker.terminate();
					web_worker = undefined;
				}
			};
		}

		// Then we reset the form field for new messages.
		form.reset();
	}
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