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
    var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat="+ cityObject[0].lat +"&lon="+cityObject[0].lon +"&units=metric&exclude=minutely,hourly&appid="+ key;
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
     //Display Current Weather//
     todaysWeatherEl.textContent="";
     var date =convertTimeStamp(weatherObject.current.dt);
     var icon = weatherObject.current.weather[0].icon;
     var temp = weatherObject.current.temp;
     var wind = weatherObject.current.wind_speed;
     var humidity= weatherObject.current.humidity;
     var uvindex= weatherObject.current.uvi;
     var titleEl=document.createElement("h2");
     var infoEl=document.createElement("div");
     titleEl.textContent= cityName + " ("+ date + ")";
     titleEl.className="subtitle";
     infoEl.className="infoList"
     infoEl.innerHTML="<p>Temp: "+ temp +" \xB0C</p><p>Wind: " +wind+ " m/s<p>Humidity: "+ humidity +" %</p><p>UV index: " + uvindex +"</p>";
     var iconSymbol=document.createElement("img");
     iconSymbol.setAttribute ("src","http://openweathermap.org/img/wn/"+icon+"@2x.png");
     iconSymbol.setAttribute ("alt", weatherObject.current.weather[0].description);
     iconSymbol.className= "icon";
     todaysWeatherEl.appendChild(titleEl);
     todaysWeatherEl.appendChild(iconSymbol);
     todaysWeatherEl.appendChild(infoEl);
     console.log(weatherObject);

     //Display Forecast//
    //  for (var i=0; i<5; i++){
    //     var dailyForecast=document.createElement("div");
    //     dailyForecast.className="forecast-card";
    //     var date =convertTimeStamp(weatherObject.daily[i].dt);
    //     var icon = weatherObject.daily[i].weather[0].icon;
    //     var temp = weatherObject.daily[i].temp.day;
    //     var wind = weatherObject.daily[i].wind_speed;
    //     var humidity= weatherObject.daily[i].humidity;
    //  var newDay=document.createElement("h4");
    //  newDay.className="dateTitle";
    //  newDay.textContent=date;
    //  var iconSymbol=document.createElement("img");
    //  iconSymbol.setAttribute ("src", "http://openweathermap.org/img/wn/"+icon+"@2x.png")
    //  iconSymbol.setAttribute ("alt", weatherObject.daily[i].weather[0].description);
    //  iconSymbol.className= "icon";
    //  dailyForecast.appendChild(newDay);
    //  dailyForecast.appendChild(iconSymbol);
    // // dailyForecast.innerHTML="<p>Temp: "+ temp +" \xB0C</p><p>Wind: " +wind+ " m/s<p>Humidity: "+ humidity +" %</p>";
    //     forecastEl.appendChild(dailyForecast);
    //  }
     

 }

 var convertTimeStamp =function(timeStamp){
     var options= {day: "numeric", month: "numeric",year:"numeric"};
     var fullDate= new Date(timeStamp*1000)
     var date= fullDate.toLocaleDateString("en-US",options);
     return date;
 }

 formEl.addEventListener("submit", citySubmitHandler);