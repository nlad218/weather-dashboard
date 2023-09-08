// 0210813d87f5e7c72760631806e4bd7d

const apiKey = "0210813d87f5e7c72760631806e4bd7d";
const apiUrl = "https://api.openweathermap.org/data/2.5/";

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeatherSection = document.getElementById("current-weather");
const forecastSection = document.getElementById("forecast");
const historyList = document.getElementById("history-list");

// Function to fetch current weather data
async function getCurrentWeather(city) {
  try {
    const response = await fetch(
      `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();

    // Update currentWeatherSection with the retrieved data
    currentWeatherSection.innerHTML = `
      <h2>Current Weather in ${data.name}</h2>
      <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    // Add city to search history
    addToHistory(city);

    // Fetch and display 5-day forecast
    getForecast(city);
  } catch (error) {
    currentWeatherSection.innerHTML = `<p>${error.message}</p>`;
  }
}

// Function to fetch 5-day forecast data
async function getForecast(city) {
  try {
    const response = await fetch(
      `${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Forecast data not available");
    }
    const data = await response.json();

    // Extract and display 5-day forecast data
    const forecastData = data.list.slice(0, 5); // Get the first 5 days
    forecastSection.innerHTML = "<h2>5-Day Forecast</h2>";
    forecastData.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const iconCode = forecast.weather[0].icon;
      const temp = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <p>Date: ${date}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;

      forecastSection.appendChild(forecastItem);
    });
  } catch (error) {
    forecastSection.innerHTML = `<p>${error.message}</p>`;
  }
}

// Function to add a city to the search history
function addToHistory(city) {
  const historyItem = document.createElement("li");
  historyItem.textContent = city;
  historyList.appendChild(historyItem);
}

// Function to handle search button click
searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getCurrentWeather(city);
  }
});

// Function to handle click on search history items
historyList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const city = event.target.textContent;
    cityInput.value = city;
    getCurrentWeather(city);
  }
});
