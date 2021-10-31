// key
const ipdataKey = 'dc2c970d0f4f6209edcc4d0c20b78a12efa9dab89e104fa0fc3fe9ad';
const openweathermapKey = 'df50c9acd48f3c87323cdea67cac8918';
// querySelector
const cityHtml = document.querySelector('.container__location-title--city');
const countryHtml = document.querySelector('.container__location-title--country');
const continentHtml = document.querySelector('.container__location-title--continent');
const iconHtml = document.querySelector('.container__location-icon');
const degreeHtml = document.querySelector('.container__data-degree--header');
const descriptionHtml = document.querySelector('.container__data-description');
const hiddenHtml = document.querySelector('.container__data-description--hidden');

// on load
window.addEventListener('load', () => {
    async function jsonFetch(url) {
        return fetch(url).then((res) => res.json());
    }

    // fetch geolocation data
    jsonFetch(`https://api.ipdata.co?api-key=${ipdataKey}`).then((responce) => {
        const lon = responce.longitude;
        const lat = responce.latitude;
        const continent = responce.continent_name;
        const country = responce.country_name;
        const city = responce.city;

        (async () => {
            cityHtml.textContent = await city;
            countryHtml.textContent = await country;
            continentHtml.textContent = await continent;
        })();

        //const proxy = 'https://cors-anywhere.herokuapp.com/';
        //const api = `${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweathermapKey}`;
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweathermapKey}`;

        // fetch weather data
        jsonFetch(api).then((res) => {
            const data = res.main;
            const { humidity, pressure } = data;
            const description = res.weather[0].description;
            const celc = +(data.temp - 273.15).toFixed(1);
            const feels_like = +(data.feels_like - 273.15).toFixed(1);
            let iconApi;

            (async () => {
                const icon = res.weather[0].icon;
                iconApi = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            })();

            // fetch icon data + description section
            (async () =>
                await fetch(iconApi).then((res) => {
                    iconHtml.innerHTML = `<img src=${res.url} alt="image" width=\"200px\" />`;
                    degreeHtml.textContent = celc;
                    descriptionHtml.textContent = description;
                    hiddenHtml.innerHTML =
                        `Feels like: ${feels_like}` +
                        '<br/>' +
                        `Humidity: ${humidity}%` +
                        '<br/>' +
                        `Pressure: ${pressure}hPa`;
                }))();
        });
    });
});
