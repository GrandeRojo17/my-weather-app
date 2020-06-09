$(document).ready(function () {
  moment().format();
  if ("geolocation" in navigator) {
    console.log("geo location available");
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      time = moment().valueOf(navigator.geolocation.timestamp);
      console.log(moment(time));
    });
  } else {
    console.log("geolocation Unavailable");
  }

  $("#search-button").on("click", function () {
    let searchTerm = $("#search-term").val();
    console.log("We are searching for " + searchTerm);
    searchWeather(searchTerm);
  });

  $("#city-btn").on("click", function () {
    let searchTerm = $("#city-btn").text();
    console.log("Gathering Weather data for " + searchTerm);
    searchWeather(searchTerm);
  });

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
        $("#today").empty();

        var city = $("<h3>").addClass("card-title").text(res.name);
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

        //   $("#today").append();
        cardBody.append(city, temp, humidity, wind);
        card.append(cardBody);
        $("#today").append(card);

        getUVIndex(res.coord.lat, res.coord.lon);
      },
    });
  }
  // function displayLocation(lat,long)
  // var lat =

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      queryURL: `http://api.openweathermap.org/data/2.5/uvi?appid=4283d387c93df34e548fe4d99a04d307&lat=${lat}&lon=${lon}`,
      dataType: "json",
      success: function (res) {
        console.log(res);
        console.log("hit this point");
        // var card = $("<div>").addClass("card");
        // // var cardBody = $("<div>").addClass("card-body");
        // var uvIndexDisplay = $("<h5>").addClass("card-text").text("UV Index: ");

        // $("#today .card-body").append(uvIndexDisplay);
      },
    });

    //create second api call for uv index, need lat and long
  }
});
// http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}&cnt={cnt}
