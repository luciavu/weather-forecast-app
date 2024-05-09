const KILOMETERS = 1000;
const searchButton = document.querySelector('.search button');
const cityInput = document.querySelector('.search input');

const apiKey = YOUR_API_KEY; // Replace with your API key

function loadDefaultWeather() {
    const defaultCity = 'Tokyo'; 
    cityInput.value = defaultCity; 
    getWeather();
};

function getWeather() {
    const city = cityInput.value;
    // Check input not empty
    if (!city) {
        alert('Please enter a city');
        return;
    }
    // Request by city, metric system units
    const currWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(currWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displaySummary(data);
            displayWeather(data);
            displayConditions(data);
        })

        .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
        });
        
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });     
};

function displaySummary(data) {
    const countryInfo = document.querySelector('.country');
    // Get country name using region code
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const country = regionNames.of(data.sys.country);
    const minTemp = Math.round(data.main.temp_min);
    const maxTemp = Math.round(data.main.temp_max);

    // Display country, min and max temperature
    countryInfo.textContent = `${country} ${minTemp}°C | ${maxTemp}°C`;
};

function displayWeather(data) {
    const cityInfo = document.querySelector('.city');
    const tempInfo = document.querySelector('.temperature');
    const weatherCondDiv = document.querySelector('.condition');
    const weatherIcon = document.querySelector('.weather-icon');
    
    // Clear previous content
    weatherCondDiv.textContent = '';
    tempInfo.innerHTML = '';

    if (data.cod === '404') { // Catch error code
        weatherCondDiv.textContent = data.message;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        
        // Update weather info
         cityInfo.textContent = cityName;
         tempInfo.textContent = `${temperature}°C`;
         weatherCondDiv.textContent = description;
         weatherIcon.src = `./images/${iconCode}.png`;
         weatherIcon.alt = description;
    }
};

function displayConditions(data) {
    // Extra Weather info mapping
    const precipitation = document.querySelector('.precip-value');
    const humidity = document.querySelector('.humidity-value');
    const feelsLike = document.querySelector('.feels-like-value');
    const wind = document.querySelector('.wind-value');
    const visibility = document.querySelector('.visibility-value');
    const pressure = document.querySelector('.pressure-value');
    
    // Retrieve data and format for important fields
    const dataPrecipitation = (data.weather[0].main === 'Rain') ? data.rain['1h'] + 'mm' : `N${'/'}A`;
    const dataHumidity = data.main.humidity + '%';
    const dataFeelsLike = data.main.feels_like + '°C';
    const dataWindSpeed = data.wind.speed + `m${'/'}s`;
    const dataVisibility = data.visibility/KILOMETERS + ' km';
    const dataPressure = data.main.pressure + 'hPa';

    // Set values
    precipitation.textContent = dataPrecipitation;
    humidity.textContent = dataHumidity;
    feelsLike.textContent = dataFeelsLike;
    wind.textContent = `${dataWindSpeed}`;
    visibility.textContent = dataVisibility;
    pressure.textContent = dataPressure;
    
};

function displayHourlyForecast(hourlyData) { 
    const HourlyForecastDiv = document.querySelector('.hourly-forecast');
    HourlyForecastDiv.innerHTML = ''; // Clear previous content

    const next24Hours = hourlyData.slice(0, 6);
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const hourlyItemHTML = 
            `<div class="hourly-item flex">
                <span>${hour}:00</span>
                <img src="./images/${iconCode}.png" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>`;
            HourlyForecastDiv.innerHTML += hourlyItemHTML;
    });
};

// Add Event listeners
searchButton.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission behavior
        getWeather();
    }
});

loadDefaultWeather();
