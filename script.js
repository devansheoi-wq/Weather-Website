
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusText = document.getElementById("status");

const weatherCodes = {
  0: ["Clear Sky", "☀️"],
  1: ["Mainly Clear", "🌤️"],
  2: ["Partly Cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Foggy", "🌫️"],
  48: ["Rime Fog", "🌫️"],
  51: ["Light Drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy Drizzle", "🌧️"],
  61: ["Light Rain", "🌧️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy Rain", "🌧️"],
  71: ["Light Snow", "🌨️"],
  73: ["Snow", "❄️"],
  75: ["Heavy Snow", "❄️"],
  80: ["Rain Showers", "🌦️"],
  81: ["Rain Showers", "🌧️"],
  82: ["Heavy Showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with Hail", "⛈️"],
  99: ["Thunderstorm with Hail", "⛈️"]
};

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    statusText.textContent = "Please enter a city name.";
    return;
  }

  searchBtn.disabled = true;
  statusText.textContent = "Loading weather...";

  try {
    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) throw new Error("Unable to search city.");

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please check the spelling.");
    }

    const place = geoData.results[0];

    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) throw new Error("Unable to fetch weather.");

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    const [condition, icon] =
      weatherCodes[current.weather_code] || ["Unknown", "🌡️"];

    document.getElementById("city").textContent =
      `${place.name}, ${place.country}`;

    document.getElementById("temperature").textContent =
      `${Math.round(current.temperature_2m)}°C`;

    document.getElementById("weatherIcon").textContent =
      current.is_day ? icon : "🌙";

    document.getElementById("condition").textContent = condition;

    document.getElementById("humidity").textContent =
      `${current.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
      `${current.wind_speed_10m} km/h`;

    document.getElementById("feels").textContent =
      `${Math.round(current.apparent_temperature)}°C`;

    document.getElementById("date").textContent =
      `Updated: ${new Date().toLocaleTimeString()}`;

    statusText.textContent = "Weather updated successfully!";
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    searchBtn.disabled = false;
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") getWeather();
});
