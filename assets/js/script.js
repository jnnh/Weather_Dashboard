var key = "690758022a8b43eb6569b4a8c5eddd31";
var formEl = document.querySelector("#city-search");
var inputEl = document.querySelector("#cityname");
var todaysWeatherEl = document.querySelector("#todaysWeather");
var todaysWeatherHeading = document.querySelector("#heading");
var forecastEl = document.querySelector("#forecast");
var searchHistory = document.querySelector("#savedCities");

var buttons=[];

var citySubmitHandler = function (event) {
    event.preventDefault();
    var cityname = inputEl.value.trim();
    if (cityname) {
        getCoordinates(cityname);
        inputEl.value = "";
    }
    else {
        alert("Please enter a city name");
    }
}

var getCoordinates = function (cityName) {
    var geocodingapiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + key;
    fetch(geocodingapiUrl).then(function (response) {
        console.log(response);
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                getWeather(data);
            });
        }
        else {
            alert("Error: City Not Found");
        }
    })
        .catch(function (error) {
            alert("Unable to connect");
        })
};

var getWeather = function (cityObject) {
    cityName = cityObject[0].name;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityObject[0].lat + "&lon=" + cityObject[0].lon + "&units=metric&exclude=minutely,hourly&appid=" + key;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data, cityName);
                displayForecast(data);
                saveCity(cityName);
            });
        }
        else {
            alert("Error: City Not Found");
        }
    })
        .catch(function (error) {
            alert("Unable to connect");
        })
};

var displayWeather = function (weatherObject, cityName) {
    //Clear Any Displayed Weather//
    todaysWeatherEl.textContent = "";
    todaysWeatherHeading.textContent = "";
    //Weather Data//
    var date = convertTimeStamp(weatherObject.current.dt);
    var icon = weatherObject.current.weather[0].icon;
    var temp = weatherObject.current.temp;
    var wind = weatherObject.current.wind_speed;
    var humidity = weatherObject.current.humidity;
    var uvindex = weatherObject.current.uvi;
    //Display Heading//
    var titleEl = document.createElement("h2");
    titleEl.textContent = cityName + " (" + date + ")";
    titleEl.className = "subtitle";
    var iconSymbol = document.createElement("img");
    iconSymbol.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
    iconSymbol.setAttribute("alt", weatherObject.current.weather[0].description);
    iconSymbol.className = "icon";
    todaysWeatherHeading.appendChild(titleEl);
    todaysWeatherHeading.appendChild(iconSymbol);
    todaysWeatherEl.appendChild(todaysWeatherHeading);
    //Display Content//
    var infoEl = document.createElement("div");
    infoEl.className = "infoList";
    infoEl.innerHTML = "<p>Temp: " + temp + " \xB0C</p><p>Wind: " + wind + " m/s<p>Humidity: " + humidity + " %</p><p>UV index: <span id='uv'>" + uvindex + "</span></p>";
    todaysWeatherEl.appendChild(infoEl);
    var uvBox=document.getElementById("uv");
    if (uvindex <= 2){
        uvBox.className = "low";
    }
    else if (uvindex > 2 && uvindex <= 5 ){
        uvBox.className = "moderate";
    }
    else if (uvindex > 5 && uvindex <= 7 ){
        uvBox.className = "high";
    }
    else if (uvindex > 7){
        uvBox.className = "severe";
    }
}
var displayForecast = function (weatherObject) {
    //Clear Forecast//
    forecastEl.textContent = "";
    //Display Forecast//
    for (var i = 0; i < 5; i++) {
        var dailyForecast = document.createElement("div");
        dailyForecast.className = "forecast-card";
        //Weather Data//
        var date = convertTimeStamp(weatherObject.daily[i].dt);
        var icon = weatherObject.daily[i].weather[0].icon;
        var temp = weatherObject.daily[i].temp.day;
        var wind = weatherObject.daily[i].wind_speed;
        var humidity = weatherObject.daily[i].humidity;
        //Display Data//
        var newDay = document.createElement("h4");
        newDay.className = "dateTitle";
        newDay.textContent = date;
        var iconSymbol = document.createElement("img");
        iconSymbol.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
        iconSymbol.setAttribute("alt", weatherObject.daily[i].weather[0].description);
        iconSymbol.className = "icon";
        var content = document.createElement("div")
        content.innerHTML = "<p>Temp: " + temp + " \xB0C</p><p>Wind: " + wind + " m/s<p>Humidity: " + humidity + " %</p>";
        dailyForecast.appendChild(newDay);
        dailyForecast.appendChild(iconSymbol);
        dailyForecast.appendChild(content);
        forecastEl.appendChild(dailyForecast);
    }
}
var saveCity = function (cityName) {
    var checkForDuplicate = document.getElementById(cityName);
    if (checkForDuplicate) {
       return;
    }
    else {
        var button = document.createElement("button");
        button.className = "btn";
        button.setAttribute("type", "submit");
        button.setAttribute("id", cityName);
        button.textContent = cityName;
        searchHistory.appendChild(button);
        //save to local storage//
        var buttonObj ={
            className: "btn",
            type: "submit",
            id: cityName,
            textContent: cityName 
        };
        buttons.push(buttonObj);
        saveButtons();
    }
};
var searchHistoryHandler = function (event) {
    var city = event.target.getAttribute("id");
    if (city) {
        getCoordinates(city);
    }
};


var convertTimeStamp = function (timeStamp) {
    var options = { day: "numeric", month: "numeric", year: "numeric" };
    var fullDate = new Date(timeStamp * 1000)
    var date = fullDate.toLocaleDateString("en-US", options);
    return date;
}

var saveButtons = function (){
    localStorage.setItem("buttons", JSON.stringify(buttons));
}
var loadButtons = function (){
    var savedButtons=localStorage.getItem("buttons");
    if (savedButtons === null){
        buttons = [];
        return false;
    }
    savedButtons =JSON.parse(savedButtons);
    for (var i=0; i<savedButtons.length;i++){
        saveCity(savedButtons[i].id);
    }
};

loadButtons();
formEl.addEventListener("submit", citySubmitHandler);
searchHistory.addEventListener("click", searchHistoryHandler);