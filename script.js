const fetchBtn = document.getElementById("btn");
const btnText = document.getElementById("btn-text");
const loadingSpinner = document.getElementById("loading-spinner");

const frontpage = document.getElementById("container");
const resultPage = document.getElementById("result");
const showLocation = document.getElementById("show_location");
const mapArea = document.getElementById("map_area");
const weatherArea = document.getElementById("weather_area");

let lat = null;
let lon = null;
let apiKey = "898b0d89ce8af9ab3e462a6034f11ef1";

fetchBtn.addEventListener("click", () => {
  fetchBtn.disabled = true;
  btnText.style.display = "none";
  loadingSpinner.style.display = "inline";

  try {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        frontpage.classList.add("disable");
        resultPage.classList.remove("disable");
        weatherArea.classList.remove("disable");
        lat = location.coords.latitude;
        lon = location.coords.longitude;
        addLocation(lat, lon);
        addmap(lat, lon);
        weather(lat, lon);
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("please enable location to get the details!");
        // Handle location error here
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
});

//===> for adding location into result
function addLocation(lat, lon) {
  const locationDetail1 = document.createElement("h3");
  const locationDetail2 = document.createElement("h3");
  locationDetail1.id = "location_detail";
  locationDetail2.id = "location_detail";
  locationDetail1.textContent = `Lat: ${lat}`;
  locationDetail2.textContent = `Long:${lon}`;
  showLocation.appendChild(locationDetail1);
  showLocation.appendChild(locationDetail2);
}

// for adding Map into the result

function addmap(lat, lon) {
  const mapArea = document.createElement("div");
  mapArea.id = "map_area";
  mapArea.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed" width="100%" height="350" frameborder="0" style="border:0"></iframe>`;
  resultPage.append(mapArea);
}

//for getting weather detail into the weather area

async function weather(lat, lon) {
  try {
    const heading = document.createElement("h1");
    heading.textContent = "Your Weather Data";
    weatherArea.appendChild(heading);
    //div for showing details
    const weatherDeatail = document.createElement("div");
    weatherDeatail.id = "weatherDeatils";

    //   fetching data from API
    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    //

    const name = create();
    name.textContent = `Location: ${data.name}`;
    weatherDeatail.appendChild(name);

    const windSpeed = create();
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} KMPH`;
    weatherDeatail.appendChild(windSpeed);

    const Humidity = create();
    Humidity.textContent = `Humidity: ${data.main.humidity}`;
    weatherDeatail.appendChild(Humidity);

    const timeZone = create();
    //   console.log(data.timezone);
    const gmt = secondsToTimezone(data.timezone);
    timeZone.textContent = `Time Zone: ${gmt} `;

    weatherDeatail.appendChild(timeZone);

    const pressure = create();
    pressure.textContent = `Pressure: ${
      data.main.pressure * (0.000987).toFixed(4)
    } atm`;
    weatherDeatail.appendChild(pressure);

    const windDirestion = create();
    const dire = findWindDirection(data.wind.deg);
    windDirestion.textContent = `Wind Direction: ${dire}`;
    weatherDeatail.appendChild(windDirestion);

    /* const UVindex = create();
  UVindex.textContent = `UV Index: ${data.wind.speed}`;
  weatherDeatail.appendChild(UVindex); */

    const feels = create();
    feels.textContent = `Feels Like: ${data.main.feels_like}`;
    weatherDeatail.appendChild(feels);

    weatherArea.appendChild(weatherDeatail);
  } catch (err) {
    console.log("error in getting the weather detail", err);
  }
}

function create() {
  return document.createElement("h3");
}

//find wind direction
function findWindDirection(data) {
  degrees = data;

  // Define array of directions
  directions = [
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];

  // Split into the 8 directions
  degrees = (degrees * 8) / 360;

  // round to nearest integer.
  degrees = Math.round(degrees, 0);

  // Ensure it's within 0-7
  degrees = (degrees + 8) % 8;

  return directions[degrees];
}

function secondsToTimezone(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sign = hours < 0 ? "-" : "+";

  const absHours = Math.abs(hours);
  const absMinutes = Math.abs(minutes);

  const timezoneStr = `GMT${sign} ${absHours
    .toString()
    .padStart(2, "0")}:${absMinutes.toString().padStart(2, "0")}`;

  return timezoneStr;
}
