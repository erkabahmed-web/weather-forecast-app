# Weather Forecast

A responsive weather dashboard built with HTML5, CSS3, and vanilla JavaScript ES modules. It uses the free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) to find locations and the [Open-Meteo Forecast API](https://open-meteo.com/en/docs) for current conditions and a five-day forecast. No API key, backend, package manager, or build step is required.

## Run locally

1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Search for a city such as Addis Ababa. If more than one place matches, select the right location and choose **Show forecast**.

Opening the page through a local web server is recommended because browsers may restrict JavaScript modules opened directly from a `file://` URL. The app needs an internet connection to contact Open-Meteo.

## Project files

- `index.html` contains the accessible page structure, city search, location chooser, results area, attribution, and links to the stylesheet and JavaScript module.
- `assets/css/style.css` styles the dashboard, weather cards, loading and empty states, visible focus indicators, and responsive tablet/mobile layouts.
- `assets/js/app.js` validates search input, handles form submissions, coordinates geocoding and forecasts, and presents errors.
- `assets/js/weather.js` builds Open-Meteo requests, checks HTTP responses, and returns geocoding and forecast data.
- `assets/js/ui.js` creates safe DOM elements and renders matching locations, current conditions, metrics, and forecast cards.
- `assets/images/` is reserved for optional local images; the app currently uses no image assets.

## API details

City searches request up to five English-language matches. Forecast requests include the current temperature, relative humidity, apparent temperature, weather code, and wind speed, plus five days of daily weather codes, high/low temperatures, and maximum precipitation probability. The API response's local timezone is used to label forecast dates.

Weather condition descriptions and symbols are based on the [WMO weather interpretation codes](https://open-meteo.com/en/docs#weathervariables). Forecast data is provided by [Open-Meteo](https://open-meteo.com/) under its [terms](https://open-meteo.com/en/terms).

## Try these cases

- **Addis Ababa:** search for `Addis Ababa` to check a normal forecast.
- **Another city:** try `Tokyo` or `London`.
- **Multiple matches:** search for `Springfield`, then choose the intended location.
- **Unknown city:** enter a made-up name to see the no-results message.
- **Empty input:** submit without a city name to see input validation.
- **API/network failure:** disconnect from the internet or block an Open-Meteo request, then search to see the error state.
- **Five-day forecast:** verify that five daily cards appear when forecast data is available.
- **Mobile layout:** use browser responsive/device emulation at a narrow width, such as 375px; the layout stacks and forecast cards can scroll horizontally.
