import { getForecast, searchLocations } from "./weather.js";
import {
  getCityLabel,
  renderForecast,
  renderLocationOptions,
  setLoading,
  showEmpty,
  showMessage
} from "./ui.js";

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const searchButton = searchForm.querySelector("button");
const locationForm = document.querySelector("#location-form");
const locationSelect = document.querySelector("#location-select");
const results = document.querySelector("#results");

let matchingLocations = [];

function setSearchDisabled(disabled) {
  searchButton.disabled = disabled;
}

function hideLocationPicker() {
  locationForm.hidden = true;
  locationSelect.replaceChildren();
}

async function loadLocationForecast(location) {
  hideLocationPicker();
  setSearchDisabled(true);
  setLoading(results, `Loading the forecast for ${getCityLabel(location)}…`);

  try {
    const forecast = await getForecast(location.latitude, location.longitude);
    renderForecast(results, location, forecast);
  } catch (error) {
    showMessage(
      results,
      "We couldn’t load this forecast.",
      error instanceof Error ? error.message : "Please check your connection and try again.",
      true
    );
  } finally {
    setSearchDisabled(false);
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  if (!cityName) {
    hideLocationPicker();
    showMessage(results, "Enter a city to get started.", "The city name can’t be empty.");
    cityInput.focus();
    return;
  }

  hideLocationPicker();
  setSearchDisabled(true);
  setLoading(results, `Searching for ${cityName}…`);

  try {
    matchingLocations = await searchLocations(cityName);
    if (matchingLocations.length === 0) {
      showMessage(results, "We couldn’t find that city.", "Check the spelling or try a nearby city.");
      return;
    }

    if (matchingLocations.length === 1) {
      await loadLocationForecast(matchingLocations[0]);
      return;
    }

    renderLocationOptions(locationSelect, matchingLocations);
    locationForm.hidden = false;
    showMessage(results, "Choose the right place.", "Select a city above to see its forecast.");
    locationSelect.focus();
  } catch (error) {
    showMessage(
      results,
      "Search isn’t available right now.",
      error instanceof Error ? error.message : "Please check your connection and try again.",
      true
    );
  } finally {
    setSearchDisabled(false);
  }
});

locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const selectedLocation = matchingLocations[Number(locationSelect.value)];
  if (!selectedLocation) {
    showMessage(results, "Choose a location first.", "Select one of the matching places above.");
    locationSelect.focus();
    return;
  }
  await loadLocationForecast(selectedLocation);
});

showEmpty(results);
