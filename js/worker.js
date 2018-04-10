var data;
var userInput;
var negMessage;

self.onmessage = function (event) {
    var weatherBot = new XMLHttpRequest();

    userInput = event.data;
    weatherBot.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=metric&appid=2fb2106d364c54d3c6b6fe255b88a260", true);

    weatherBot.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(weatherBot.responseText);
            postMessage(data);
        }
        if (this.status == 404) {
            negMessage = JSON.parse(weatherBot.responseText);
            postMessage(negMessage);
        }
    };
    weatherBot.send();
};