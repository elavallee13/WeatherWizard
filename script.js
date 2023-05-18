document.getElementById('city').addEventListener('keypress', function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
      getForecast();
  }
});


document.getElementById('searchButton').addEventListener('click', function(event) {
  event.preventDefault();
  getForecast();
});

async function getForecast() {
  const city = document.getElementById('city').value;
  const apiKey = '9b7067287fd472ca5894070e27769a84';

  // Get city coordinates
  const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
  const geoData = await geoResponse.json();
  const { lat, lon } = geoData[0];

  // Get forecast
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
  const forecastData = await forecastResponse.json();

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

  return weatherConditions[condition] || '❓';
}
