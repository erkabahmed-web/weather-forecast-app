const WEATHER_CODES = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Drizzle", icon: "🌦️" },
  55: { description: "Heavy drizzle", icon: "🌧️" },
  56: { description: "Light freezing drizzle", icon: "🌧️" },
  57: { description: "Freezing drizzle", icon: "🌧️" },
  61: { description: "Light rain", icon: "🌦️" },
  63: { description: "Rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  66: { description: "Light freezing rain", icon: "🌧️" },
  67: { description: "Freezing rain", icon: "🌧️" },
  71: { description: "Light snow", icon: "🌨️" },
  73: { description: "Snow", icon: "🌨️" },
  75: { description: "Heavy snow", icon: "❄️" },
  77: { description: "Snow grains", icon: "❄️" },
  80: { description: "Light rain showers", icon: "🌦️" },
  81: { description: "Rain showers", icon: "🌧️" },
  82: { description: "Heavy rain showers", icon: "🌧️" },
  85: { description: "Light snow showers", icon: "🌨️" },
  86: { description: "Snow showers", icon: "❄️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with light hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" }
};

const WEATHER_FALLBACK = { description: "Conditions unavailable", icon: "🌡️" };

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatNumber(value, suffix = "") {
  return Number.isFinite(value) ? `${Math.round(value)}${suffix}` : "—";
}

function getWeather(code) {
  return WEATHER_CODES[code] || WEATHER_FALLBACK;
}

function getCityLabel(location) {
  return [location.name, location.admin1, location.country]
    .filter((part, index, parts) => part && parts.indexOf(part) === index)
    .join(", ");
}

export function setLoading(resultsElement, message = "Finding your forecast…") {
  resultsElement.replaceChildren();
  resultsElement.setAttribute("aria-busy", "true");

  const state = createElement("div", "status-state loading-state");
  const spinner = createElement("span", "spinner");
  spinner.setAttribute("aria-hidden", "true");
  const text = createElement("p", "", message);
  state.append(spinner, text);
  resultsElement.append(state);
}

export function showEmpty(resultsElement) {
  resultsElement.setAttribute("aria-busy", "false");
  resultsElement.replaceChildren();
  const state = createElement("div", "empty-state");
  const icon = createElement("span", "empty-icon", "☼");
  icon.setAttribute("aria-hidden", "true");
  state.append(
    icon,
    createElement("p", "", "Your forecast is just around the corner."),
    createElement("span", "", "Search for a city to get started.")
  );
  resultsElement.append(state);
}

export function showMessage(resultsElement, title, detail, isError = false) {
  resultsElement.setAttribute("aria-busy", "false");
  resultsElement.replaceChildren();
  const state = createElement("div", `status-state${isError ? " error-state" : ""}`);
  state.setAttribute("role", isError ? "alert" : "status");
  state.append(createElement("p", "status-title", title));
  if (detail) state.append(createElement("span", "", detail));
  resultsElement.append(state);
}

export function renderLocationOptions(selectElement, locations) {
  selectElement.replaceChildren();
  locations.forEach((location, index) => {
    const option = createElement("option", "", getCityLabel(location));
    option.value = String(index);
    selectElement.append(option);
  });
}

function createMetric(label, value, unit, icon) {
  const card = createElement("article", "metric-card");
  const heading = createElement("div", "metric-heading");
  const iconElement = createElement("span", "metric-icon", icon);
  iconElement.setAttribute("aria-hidden", "true");
  heading.append(iconElement, createElement("h3", "", label));
  card.append(heading);

  const reading = createElement("p", "metric-value", value);
  if (unit) reading.append(createElement("span", "metric-unit", unit));
  card.append(reading);
  return card;
}

function createForecastCard(day, index) {
  const card = createElement("article", "forecast-card");
  const date = new Date(`${day.date}T12:00:00`);
  const dayName = index === 0
    ? "Today"
    : new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
  const condition = getWeather(day.code);

  card.append(createElement("p", "forecast-day", dayName));
  const icon = createElement("span", "forecast-icon", condition.icon);
  icon.setAttribute("aria-hidden", "true");
  card.append(icon);
  card.append(createElement("p", "forecast-condition", condition.description));

  const temperatures = createElement("p", "forecast-temperatures");
  temperatures.append(
    createElement("span", "forecast-high", formatNumber(day.high, "°")),
    createElement("span", "forecast-low", formatNumber(day.low, "°"))
  );
  card.append(temperatures);

  if (Number.isFinite(day.precipitation)) {
    const rain = createElement("p", "forecast-rain", `☂ ${Math.round(day.precipitation)}%`);
    rain.setAttribute("aria-label", `Precipitation chance ${Math.round(day.precipitation)} percent`);
    card.append(rain);
  }
  return card;
}

export function renderForecast(resultsElement, location, data) {
  const current = data.current;
  const daily = data.daily;
  if (!current || !daily || !Array.isArray(daily.time)) {
    throw new Error("The forecast data is incomplete. Please try another city.");
  }

  const weather = getWeather(current.weather_code);
  const dashboard = createElement("div", "dashboard");
  const heading = createElement("div", "location-heading");
  heading.append(
    createElement("div", "location-pin", "⌖"),
    createElement("div", "", getCityLabel(location))
  );

  if (data.timezone) {
    heading.append(createElement("span", "timezone-label", data.timezone.replaceAll("_", " ")));
  }
  dashboard.append(heading);

  const hero = createElement("section", "current-card");
  hero.setAttribute("aria-label", "Current weather");
  const heroCopy = createElement("div", "current-copy");
  heroCopy.append(
    createElement("p", "current-label", "CURRENT WEATHER"),
    createElement("p", "current-condition", weather.description)
  );
  const temperature = createElement("p", "current-temperature", formatNumber(current.temperature_2m));
  temperature.append(createElement("span", "temperature-unit", "°"));
  heroCopy.append(temperature);
  heroCopy.append(createElement("p", "current-caption", "Right now in " + location.name));
  const heroIcon = createElement("span", "current-icon", weather.icon);
  heroIcon.setAttribute("aria-hidden", "true");
  hero.append(heroCopy, heroIcon);
  dashboard.append(hero);

  const metrics = createElement("div", "metrics-grid");
  metrics.append(
    createMetric("Feels like", formatNumber(current.apparent_temperature), "°", "◉"),
    createMetric("Humidity", formatNumber(current.relative_humidity_2m), "%", "◌"),
    createMetric("Wind speed", formatNumber(current.wind_speed_10m), "km/h", "↝")
  );
  dashboard.append(metrics);

  const sectionHeading = createElement("div", "forecast-heading");
  sectionHeading.append(
    createElement("div", "", "The next few days"),
    createElement("span", "", "5-DAY FORECAST")
  );
  dashboard.append(sectionHeading);

  const forecastGrid = createElement("div", "forecast-grid");
  const days = daily.time.slice(0, 5).map((date, index) => ({
    date,
    code: daily.weather_code?.[index],
    high: daily.temperature_2m_max?.[index],
    low: daily.temperature_2m_min?.[index],
    precipitation: daily.precipitation_probability_max?.[index]
  }));
  days.forEach((day, index) => forecastGrid.append(createForecastCard(day, index)));
  dashboard.append(forecastGrid);

  resultsElement.setAttribute("aria-busy", "false");
  resultsElement.replaceChildren(dashboard);
}

export { getCityLabel };
