document.getElementById('city').addEventListener('keypress', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    getForecast();
  }
});

// Restore the city from localStorage when the page is reloaded
document.addEventListener('DOMContentLoaded', function() {
  const city = localStorage.getItem('city');
  if (city !== null) {
    document.getElementById('city').value = city;
    getForecast();
  }
});

async function getForecast() {
  const city = document.getElementById('city').value;

  // Store the city in localStorage
  localStorage.setItem('city', city);

  const apiKey = '9b7067287fd472ca5894070e27769a84';

  // Get city coordinates
  const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
  const geoData = await geoResponse.json();
  const { lat, lon } = geoData[0];

  // Get forecast
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
  const forecastData = await forecastResponse.json();

  // Get current weather
  const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
  const currentData = await currentResponse.json();

  // Display forecast
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';
  for (let i = 0; i < forecastData.list.length; i += 8) { // 8 updates per day
    const forecast = forecastData.list[i];

    const date = new Date(forecast.dt_txt).toLocaleDateString();
    const weatherIcon = getWeatherIcon(forecast.weather[0].main);
    const temperature = Math.round(forecast.main.temp);
    const humidity = forecast.main.humidity;
    const windSpeed = forecast.wind.speed;

    forecastDiv.innerHTML += `
        <div class="forecast-item">
            <h2>${date}</h2>
            <div class="weather-icon">${weatherIcon}</div>
            <p>Temperature: ${temperature}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind speed: ${windSpeed} m/s</p>
        </div>
    `;
  }

  // Display current weather
  const currentWeatherDiv = document.getElementById('currentWeather');
  const currentTemperature = Math.round(currentData.main.temp);
  const currentHumidity = currentData.main.humidity;
  const currentWindSpeed = currentData.wind.speed;
  const currentWeatherIcon = getWeatherIcon(currentData.weather[0].main);

  if (city.trim() !== '') {
    currentWeatherDiv.innerHTML = `
      <h2>Current Weather in ${city}</h2>
      <div class="weather-icon">${currentWeatherIcon}</div>
      <p>Temperature: ${currentTemperature}°F</p>
      <p>Humidity: ${currentHumidity}%</p>
      <p>Wind speed: ${currentWindSpeed} m/s</p>
    `;
  } else {
    currentWeatherDiv.innerHTML = '';
  }

  // Update search history
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = 'Search history:';
  if (city.trim() !== '') {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    searchHistory.forEach((item) => {
      const historyItem = document.createElement('button');
      historyItem.classList.add('history-button');
      historyItem.textContent = item;
      historyItem.addEventListener('click', function() {
        document.getElementById('city').value = item;
        getForecast();
      });

      historyList.appendChild(historyItem);
    });
  }
}

function getWeatherIcon(condition) {
  const weatherConditions = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Snow: '❄️',
    Mist: '🌫️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
  };

  return weatherConditions[condition] || '';
}
