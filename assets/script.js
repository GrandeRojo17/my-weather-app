$(document).ready(function () {
  console.log("RESULTS FOR MY-WEATHER APP: ");
  var today = moment().format("MM/DD/YYYY");
  console.log(today);
  if ("geolocation" in navigator) {
    console.log("Geo location Enabled");
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log( "Your current location is " + position);
      // time = moment().valueOf(navigator.geolocation.timestamp);
      // console.log(moment(time));
    });
  } else {
    console.log("geolocation Unenabled");
  }

  $("#search-button").on("click", function () {
    let searchTerm = $("#search-term").val();
    console.log("We are searching for " + searchTerm);
    searchWeather(searchTerm);

  });

  $("#city-btn").on("click", function () {
    let searchTerm = $("#city-btn").text();
    console.log("Gathering Weather data for" + searchTerm);
    searchWeather(searchTerm);

  });


  function fiveDayForecast(lat, lon) {

    $("#five-day-forecast").empty();
    var APIKey = "4283d387c93df34e548fe4d99a04d307";
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    $.ajax({
      url: queryURL,
      type: "GET",
      success: function (res) {
        console.log("The res for fivedayForecastOneCall is:" + JSON.stringify(res));

        for (var i = 0; i <= 6; i++) { //i = each request You start off with 0, run up till 4 and add once at a time.
          var nextDay = today + 1;
          var cityIcon = res.list[i].weather[i].icon;
          var iconForecastURL = "http://openweathermap.org/img/wn/" + cityIcon + "@2x.png";
          //--- FC = forecast ---
          var cityTemperatureFC = Math.round(res.list[i].main.temp);
          var cityHumidityFC = res.list[i].main.humidity;

          let forecastCard = $("#five-day-forecast");
          let card = $("<div>").addClass("card");
          let forecastInfo = $("<img src=" + iconForecastURL + ">").attr("height", "45px").attr("width", "45px");

          forecastCard.append(
            $("<div>")
              .addClass("card text-white text-center bg-success float-left")
              .attr("id", "forecast-card")
              .attr("style", "max-width: 12rem; margin-left: 20px")
              .append($("<p>").html(nextDay))
              .append(forecastInfo)
              .append(
                $("<p>").html("Temperature: " + cityTemperatureFC + "° F")
              )
              .append($("<p>").html("Humidity: " + cityHumidityFC + " %")).append("</div>")
          );
          $("#five-day-forecast").append(

          );

          $("#five-day-forecast").append(card);

        }//END OF FOR LOOP



      },
    });
  }
  function searchWeather(searchTerm) {
    //this is my current key
    var APIKey = "4283d387c93df34e548fe4d99a04d307";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchTerm +
      "&appid=" +
      APIKey +
      "&units=imperial";
    // AJAX
    //on launch it should automatically call once using the location of user.
    $.ajax({
      url: queryURL,
      method: "GET",
      success: function (res) {
        console.log("The res for searchWeather is:" + JSON.stringify(res));
        $("#today").empty();
        var city = $("<h2>").addClass("card-title").text(res.name);
        var temp = $("<h5>")
          .addClass("card-text")
          .text("Temperature: " + Math.round(res.main.temp));
        var humidity = $("<h5>")
          .addClass("card-text")
          .text("Humidity: " + res.main.humidity);
        var wind = $("<h5>")
          .addClass("card-text")
          .text("Wind: " + Math.round(res.wind.speed));
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        getUVIndex(res.coord.lat, res.coord.lon);

        cardBody.append(city, temp, humidity, wind);
        card.append(cardBody);
        $("#today").append(card);
        fiveDayForecast(res.coord.lat, res.coord.lon);
      },
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/uvi?appid=4283d387c93df34e548fe4d99a04d307&lat=${lat}&lon=${lon}`,
      type: "GET",
      dataType: "json",
      success: function (res) {
        console.log("The res for getUVIndex is:" + JSON.stringify(res));

        // var card = $("<div>").addClass("card");
        // var cardBody = $("<div>").addClass("card-body");

        var uvIndexDisplay = $("<h5>")
          .addClass("card-text")
          .text("UV Index: " + res.value);

        $("#today .card-body").append(uvIndexDisplay);
      },
    });

    //create second api call for uv index, need lat and long
  }
});
// http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}&cnt={cnt}
