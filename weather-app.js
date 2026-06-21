"use strict";
// Key for LocalStorage API Key storage
const API_KEY_STORAGE_KEY = "openweathermap_api_key";
// DOM Elements
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");
const mockModeToggle = document.getElementById("mockModeToggle");
// Modal Elements
const settingsModal = document.getElementById("settingsModal");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const apiKeyInput = document.getElementById("apiKeyInput");
// Initialize API Key from localStorage
let savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
}
// Modal Event Listeners
openSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("active");
});
closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active");
});
settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove("active");
    }
});
saveApiKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    savedApiKey = key;
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    settingsModal.classList.remove("active");
    // If user has saved a key, automatically turn off mock mode to try the live API
    if (key) {
        mockModeToggle.checked = false;
    }
});
// Input triggering search on Enter keypress
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        triggerSearch();
    }
});
searchBtn.addEventListener("click", () => {
    triggerSearch();
});
// Bridge to user-facing signature function
function triggerSearch() {
    const city = cityInput.value;
    getWeather(city);
}
// Interactive custom SVG weather icons
function getWeatherIconSvg(mainCondition) {
    const condition = mainCondition.toLowerCase();
    if (condition.includes("clear") || condition.includes("sunny")) {
        // Sunny icon
        return `
      <svg class="weather-icon-svg" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="1"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.2"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="30" fill="url(#sunGlow)" />
        <circle cx="50" cy="50" r="20" fill="#fbbf24" />
        <g stroke="#fbbf24" stroke-width="6" stroke-linecap="round">
          <line x1="50" y1="10" x2="50" y2="2" />
          <line x1="50" y1="90" x2="50" y2="98" />
          <line x1="10" y1="50" x2="2" y2="50" />
          <line x1="90" y1="50" x2="98" y2="50" />
          <line x1="21.7" y1="21.7" x2="16" y2="16" />
          <line x1="78.3" y1="78.3" x2="84" y2="84" />
          <line x1="21.7" y1="78.3" x2="16" y2="84" />
          <line x1="78.3" y1="21.7" x2="84" y2="16" />
        </g>
      </svg>
    `;
    }
    else if (condition.includes("cloud")) {
        // Cloudy icon
        return `
      <svg class="weather-icon-svg" viewBox="0 0 100 100">
        <path d="M25,60 a16,16 0 0,1 18,-15 a22,22 0 0,1 34,-5 a18,18 0 0,1 0,36 l-52,0 a16,16 0 0,1 0,-16 z" fill="#cbd5e1" />
        <path d="M40,68 a12,12 0 0,1 14,-11 a16,16 0 0,1 25,-4 a14,14 0 0,1 0,28 l-39,0 a12,12 0 0,1 0,-13 z" fill="#94a3b8" opacity="0.8" transform="translate(-10, -5)" />
      </svg>
    `;
    }
    else if (condition.includes("rain") || condition.includes("drizzle")) {
        // Rainy icon
        return `
      <svg class="weather-icon-svg" viewBox="0 0 100 100">
        <path d="M30,50 a12,12 0 0,1 14,-11 a18,18 0 0,1 28,-4 a14,14 0 0,1 0,28 l-42,0 a12,12 0 0,1 0,-13 z" fill="#64748b" />
        <g stroke="#38bdf8" stroke-width="4" stroke-linecap="round">
          <line x1="38" y1="72" x2="34" y2="82" />
          <line x1="50" y1="75" x2="46" y2="85" />
          <line x1="62" y1="72" x2="58" y2="82" />
        </g>
      </svg>
    `;
    }
    else if (condition.includes("snow")) {
        // Snowy icon
        return `
      <svg class="weather-icon-svg" viewBox="0 0 100 100">
        <path d="M30,50 a12,12 0 0,1 14,-11 a18,18 0 0,1 28,-4 a14,14 0 0,1 0,28 l-42,0 a12,12 0 0,1 0,-13 z" fill="#e2e8f0" />
        <g stroke="#bae6fd" stroke-width="3" stroke-linecap="round">
          <!-- Snowflakes -->
          <line x1="36" y1="72" x2="36" y2="78" /><line x1="33" y1="75" x2="39" y2="75" />
          <line x1="50" y1="74" x2="50" y2="80" /><line x1="47" y1="77" x2="53" y2="77" />
          <line x1="64" y1="72" x2="64" y2="78" /><line x1="61" y1="75" x2="67" y2="75" />
        </g>
      </svg>
    `;
    }
    else if (condition.includes("thunder") || condition.includes("storm")) {
        // Stormy icon
        return `
      <svg class="weather-icon-svg" viewBox="0 0 100 100">
        <path d="M30,50 a12,12 0 0,1 14,-11 a18,18 0 0,1 28,-4 a14,14 0 0,1 0,28 l-42,0 a12,12 0 0,1 0,-13 z" fill="#475569" />
        <polygon points="48,68 38,82 48,82 44,95 58,78 48,78" fill="#eab308" />
      </svg>
    `;
    }
    else {
        // Atmosphere / Mist / Fog / Default icon
        return `
      <svg class="weather-icon-svg" viewBox="0 0 100 100">
        <path d="M30,45 a12,12 0 0,1 14,-11 a18,18 0 0,1 28,-4 a14,14 0 0,1 0,28 l-42,0 a12,12 0 0,1 0,-13 z" fill="#94a3b8" opacity="0.6" />
        <g stroke="#cbd5e1" stroke-width="4" stroke-linecap="round">
          <line x1="25" y1="68" x2="75" y2="68" />
          <line x1="30" y1="76" x2="70" y2="76" />
          <line x1="40" y1="84" x2="60" y2="84" />
        </g>
      </svg>
    `;
    }
}
// Update the dynamic page background class based on weather state
function updateBackgroundTheme(condition) {
    document.body.classList.remove("sunny", "cloudy", "rainy", "snowy", "stormy");
    const cond = condition.toLowerCase();
    if (cond.includes("clear") || cond.includes("sunny")) {
        document.body.classList.add("sunny");
    }
    else if (cond.includes("cloud")) {
        document.body.classList.add("cloudy");
    }
    else if (cond.includes("rain") || cond.includes("drizzle")) {
        document.body.classList.add("rainy");
    }
    else if (cond.includes("snow")) {
        document.body.classList.add("snowy");
    }
    else if (cond.includes("thunder") || cond.includes("storm")) {
        document.body.classList.add("stormy");
    }
}
// Realistic simulation of weather for offline/demonstration testing
function getMockWeatherData(cityName) {
    const normalized = cityName.toLowerCase().trim();
    // Specific famous cities mock configurations
    if (normalized.includes("london")) {
        return {
            name: "London",
            main: { temp: 15.4, pressure: 1012, humidity: 82 },
            weather: [{ id: 500, main: "Rain", description: "light shower rain" }],
            wind: { speed: 5.4 }
        };
    }
    else if (normalized.includes("tokyo")) {
        return {
            name: "Tokyo",
            main: { temp: 22.8, pressure: 1018, humidity: 60 },
            weather: [{ id: 800, main: "Clear", description: "clear sky" }],
            wind: { speed: 2.1 }
        };
    }
    else if (normalized.includes("new york")) {
        return {
            name: "New York",
            main: { temp: 28.5, pressure: 1009, humidity: 55 },
            weather: [{ id: 802, main: "Clouds", description: "scattered clouds" }],
            wind: { speed: 4.6 }
        };
    }
    else if (normalized.includes("paris")) {
        return {
            name: "Paris",
            main: { temp: 18.2, pressure: 1015, humidity: 70 },
            weather: [{ id: 801, main: "Clouds", description: "few clouds" }],
            wind: { speed: 3.1 }
        };
    }
    else if (normalized.includes("sydney")) {
        return {
            name: "Sydney",
            main: { temp: 16.0, pressure: 1024, humidity: 50 },
            weather: [{ id: 800, main: "Clear", description: "sunny clear sky" }],
            wind: { speed: 6.2 }
        };
    }
    else if (normalized.includes("cairo")) {
        return {
            name: "Cairo",
            main: { temp: 36.5, pressure: 1008, humidity: 28 },
            weather: [{ id: 800, main: "Clear", description: "hot and sunny" }],
            wind: { speed: 3.6 }
        };
    }
    else if (normalized.includes("moscow")) {
        return {
            name: "Moscow",
            main: { temp: -2.4, pressure: 1005, humidity: 90 },
            weather: [{ id: 600, main: "Snow", description: "light snow fall" }],
            wind: { speed: 5.1 }
        };
    }
    else if (normalized.includes("mumbai")) {
        return {
            name: "Mumbai",
            main: { temp: 29.8, pressure: 1004, humidity: 88 },
            weather: [{ id: 211, main: "Thunderstorm", description: "thunderstorm with heavy rain" }],
            wind: { speed: 8.7 }
        };
    }
    // Generic deterministic calculation depending on word length/char codes
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
        hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    const temps = [5.2, 12.8, 19.5, 26.3, 31.0, -4.5];
    const conditions = ["Clear", "Clouds", "Rain", "Snow", "Thunderstorm", "Mist"];
    const descriptions = ["clear sky", "broken clouds", "moderate rain", "powdery snow", "thunderstorm", "foggy mist"];
    const index = hash % conditions.length;
    const temp = temps[hash % temps.length];
    const pressure = 1000 + (hash % 30);
    const humidity = 30 + (hash % 65);
    const speed = 1.5 + (hash % 10);
    // Capitalize city name
    const formattedName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    return {
        name: formattedName,
        main: { temp, pressure, humidity },
        weather: [{ id: 800 + index, main: conditions[index], description: descriptions[index] }],
        wind: { speed }
    };
}
// 2. Add types to all variables and functions (Signature matches guide, triggers HTML render)
async function getWeather(city) {
    const weatherDiv = document.getElementById("weather");
    if (!city || city.trim() === "") {
        weatherDiv.innerHTML = `
      <div class="error-message">
        <span class="error-title">❌ Input Required</span>
        <span class="error-desc">Please enter a city name!</span>
      </div>
    `;
        return;
    }
    // Show loading
    weatherDiv.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Fetching current weather for ${city}...</div>
  `;
    // Capture Toggle value at call time
    const isMockMode = mockModeToggle.checked;
    try {
        let data;
        if (isMockMode) {
            // Simulate delay for realistic network experience
            await new Promise((resolve) => setTimeout(resolve, 800));
            data = getMockWeatherData(city);
        }
        else {
            // Live API Call
            if (!savedApiKey) {
                throw new Error("API Key is missing. Click the gear icon at the top right to configure your API key, or toggle 'Mock Data Mode'.");
            }
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${savedApiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(`HTTP 401: Invalid API Key. Please verify the key in settings.`);
                }
                throw new Error(`HTTP ${response.status}: City not found. Check spelling or connection.`);
            }
            data = await response.json();
        }
        // Update gradient styling based on condition
        updateBackgroundTheme(data.weather[0].main);
        // Display weather with premium styles and inline SVGs
        weatherDiv.innerHTML = `
      <div class="weather-card">
        <div class="weather-header">
          <h2 class="weather-location">📍 ${data.name}</h2>
          <div class="weather-condition">${data.weather[0].description}</div>
        </div>
        
        <div class="weather-visual">
          ${getWeatherIconSvg(data.weather[0].main)}
          <div class="weather-temp-container">
            <span class="weather-temp">${Math.round(data.main.temp)}</span>
            <span class="weather-unit">°C</span>
          </div>
        </div>

        <div class="weather-details-grid">
          <div class="detail-item">
            <span class="detail-icon">🌡️</span>
            <div class="detail-info">
              <span class="detail-label">Condition</span>
              <span class="detail-value">${data.weather[0].main}</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">💨</span>
            <div class="detail-info">
              <span class="detail-label">Wind Speed</span>
              <span class="detail-value">${data.wind.speed.toFixed(1)} m/s</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">💧</span>
            <div class="detail-info">
              <span class="detail-label">Humidity</span>
              <span class="detail-value">${data.main.humidity}%</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">⏲️</span>
            <div class="detail-info">
              <span class="detail-label">Pressure</span>
              <span class="detail-value">${data.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    catch (error) {
        // Reset background on error to prevent layout looking weird
        document.body.classList.remove("sunny", "cloudy", "rainy", "snowy", "stormy");
        // Type-safe error handling
        const message = error instanceof Error ? error.message : "Unknown error";
        weatherDiv.innerHTML = `
      <div class="error-message">
        <span class="error-title">❌ Error Occurred</span>
        <span class="error-desc">${message}</span>
      </div>
    `;
    }
}
//# sourceMappingURL=weather-app.js.map