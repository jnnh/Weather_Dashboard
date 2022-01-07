var key= "690758022a8b43eb6569b4a8c5eddd31";
var formEl=document.querySelector("#city-search")
var inputEl=document.querySelector("#cityname")

var  citySubmitHandler= function (event){
    event.preventDefault();
    var cityname=inputEl.value.trim();
    if (cityname){
        getWeather(cityname);
        inputEl.value="";
    }
    else{
        alert("Please enter a city name");
    }
}

var getWeather = function(cityname) {
    var apiUrl ="http://api.openweathermap.org/data/2.5/forecast?q="+ cityname + "&appid="+ key;
    fetch(apiUrl).then(function(response){
        if(response.ok){
         response.json().then(function(data){
         console.log(data, cityname);
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

 formEl.addEventListener("submit", citySubmitHandler);