var key= "690758022a8b43eb6569b4a8c5eddd31";
var formEl=document.querySelector("#city-search");
var inputEl=document.querySelector("#cityname");
var todaysWeatherEl=document.querySelector("#todaysWeather");
var forecastEl=document.querySelector("#forecast");

var  citySubmitHandler= function (event){
    event.preventDefault();
    var cityname=inputEl.value.trim();
    if (cityname){
        getCoordinates(cityname);
        inputEl.value="";
    }
    else{
        alert("Please enter a city name");
    }
}

var getCoordinates = function(cityName){
    var geocodingapiUrl="http://api.openweathermap.org/geo/1.0/direct?q="+ cityName + "&limit=1&appid=" + key;
    fetch(geocodingapiUrl).then(function(response){
        if(response.ok){
         response.json().then(function(data){
         getWeather(data);
         });
         }
        else{
            alert("Error: City Not Found");
        }
    })
    .catch(function(error){
        alert("Unable to connect");
    })
 };

var getWeather = function(cityObject) {
    cityName= cityObject[0].name;
    var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat="+ cityObject[0].lat +"&lon="+cityObject[0].lon +"&exclude=minutely,hourly&appid="+ key;
    fetch(apiUrl).then(function(response){
        if(response.ok){
         response.json().then(function(data){
         displayWeather(data, cityName);
         });
         }
        else{
            alert("Error: City Not Found");
        }
    })
    .catch(function(error){
        alert("Unable to connect");
    })
 };

 var displayWeather = function(weatherObject, cityName){
     var date =convertTimeStamp(weatherObject.current.dt);
     var currentCity=document.createElement("h2");
     currentCity.textContent= cityName + " ("+ date + ")";
     currentCity.className="subtitle";
     todaysWeatherEl.appendChild(currentCity);
 }

 var convertTimeStamp =function(timeStamp){
     var options= {day: "numeric", month: "numeric",year:"numeric"};
     var fullDate= new Date(timeStamp*1000)
     var date= fullDate.toLocaleDateString("en-US",options);
     return date;
 }

 formEl.addEventListener("submit", citySubmitHandler);