const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchLocations(cityName) {
  const url = new URL(GEOCODING_URL);
  url.search = new URLSearchParams({
    name: cityName,
    count: "5",
    language: "en",
    format: "json"
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("We couldn’t search for that city. Please try again.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

export async function getForecast(latitude, longitude) {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max"
    ].join(","),
    timezone: "auto",
    forecast_days: "5"
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("We couldn’t load the forecast. Please try again.");
  }

  return response.json();
}
