$(document).ready(function () {
  console.log("RESULTS FOR MY-WEATHER APP: ");
  var today = moment().format("MM/DD/YYYY");
  console.log(today);

  if ("geolocation" in navigator) {
    console.log("Geo location Enabled");
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Your current location is " + JSON.stringify(position));
      // time = moment().valueOf(navigator.geolocation.timestamp);
      // console.log(moment(time));
    });
  } else {
    console.log("geolocation Unenabled");
  }

  $("#search-button").on("click", function () {
    var searchTerm = $("#search-term").val();
    console.log("We are searching for " + searchTerm);
    $("search-term").val("");
    searchWeather(searchTerm);
  });
  $(".history").on("click", "li", function () {
    searchWeather($(this).text());
  });
  function makeRow(text) {
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(text);
    $(".history").append(li);
  }
  $("#city-btn").on("click", function () {
    let searchTerm = $("#city-btn").text();
    // console.log("Gathering Weather data for" + searchTerm);
    searchWeather(searchTerm);
  });

  function searchWeather(searchTerm) {
    //this is my current key

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchTerm +
      "&appid=4283d387c93df34e548fe4d99a04d307&units=imperial";
    // AJAX
    //on launch it should automatically call once using the location of user.
    $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "json",
      success: function (res) {
        // console.log("The res for searchWeather is:" + JSON.stringify(res));
        $("#today").empty();

        let title = $("<h2>")
          .addClass("card-title")
          .text(res.name + " (" + new Date().toLocaleDateString() + ")");

        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");

        var temp = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + Math.round(res.main.temp) + "°F");
        var humidity = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + res.main.humidity + "%");
        var wind = $("<p>")
          .addClass("card-text")
          .text("Wind: " + Math.round(res.wind.speed) + "MPH");
        var img = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" + res.weather[0].icon + ".png"
        );
        // Merge everything to the page
        title.append(img);

        cardBody.append(title, temp, humidity, wind);
        card.append(cardBody);
        $("#today").append(card);

        fiveDayForecast(searchTerm);
        getUVIndex(res.coord.lat, res.coord.lon);
      },
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/uvi?appid=4283d387c93df34e548fe4d99a04d307&lat=${lat}&lon=${lon}`,
      type: "GET",
      dataType: "json",
      success: function (res) {
        // console.log("The res for getUVIndex is:" + JSON.stringify(res));

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

function fiveDayForecast(searchTerm) {
  var APIKey = "4283d387c93df34e548fe4d99a04d307";
  // var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  var queryURL2 = `http://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${APIKey}&units=imperial`;
  $.ajax({
    type: "GET",
    url: queryURL2,

    dataType: "json",
    success: function (res) {
      $("#fiveDay")
        .html('<h4 class="mt-3">5-Day Forecast:</h4>')
        .append('<div class="row">');
      for (var i = 0; i < res.list.length; i++) {
        // only look at forecasts around 3:00pm
        if (res.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          // create html elements for a bootstrap card
          var col = $("<div>").addClass("col-md-2");
          var card = $("<div>").addClass("card bg-primary text-white");
          var body = $("<div>").addClass("card-body p-2");

          var title = $("<h5>")
            .addClass("card-title")
            .text(new Date(res.list[i].dt_txt).toLocaleDateString());

          var img = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/w/" +
              res.list[i].weather[0].icon +
              ".png"
          );

          var p1 = $("<p>")
            .addClass("card-text")
            .text("Temp: " + res.list[i].main.temp_max + " °F");
          var p2 = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + res.list[i].main.humidity + "%");

          // merge together and put on page
          col.append(card.append(body.append(title, img, p1, p2)));
          $("#fiveDay .row").append(col);
        }
      }
      // } //END OF FOR LOOP
    },
  });
}
