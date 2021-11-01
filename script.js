// on load
window.addEventListener('load', () => {
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
    // longitude and latitude
    let lon, lat;

    // fetch data function
    async function jsonFetch(url) {
        return fetch(url).then((res) => res.json());
    }
    //fetch image function
    async function imgFetch(url) {
        const res = await fetch(url);
        iconHtml.innerHTML = `<img src=${res.url} alt="image" width=\"200px\" />`;
    }

    // fetch geolocation/weather
    jsonFetch(`https://api.ipdata.co?api-key=${ipdataKey}`).then((responce) => {
        lon = responce.longitude;
        lat = responce.latitude;

        // geolocation function
        async function geolocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    lat = position.coords.latitude;
                    lon = position.coords.longitude;
                    weatherReq();
                });
            }
        }

        geolocation().then(weatherReq()).catch(alert('Please enable geolocation for more accurate data'));
        // weather function
        function weatherReq() {
            const continent = responce.continent_name;
            const country = responce.country_name;
            const city = responce.city;
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweathermapKey}`;
            /* const proxy = 'https://cors-anywhere.herokuapp.com/'; const api = `${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweathermapKey}`; */

            // getting different data for the API request depending on the user's choice
            console.log(api);

            // thml text content
            cityHtml.textContent = city;
            countryHtml.textContent = country;
            continentHtml.textContent = continent;

            // fetch weather data
            jsonFetch(api).then((res) => {
                const data = res.main;
                const { humidity, pressure } = data;
                const description = res.weather[0].description;
                const icon = res.weather[0].icon;
                const celc = +(data.temp - 273.15).toFixed(1);
                const feels_like = +(data.feels_like - 273.15).toFixed(1);
                const iconApi = `https://openweathermap.org/img/wn/${icon}@2x.png`;

                // fetch image
                imgFetch(iconApi);

                // thml text content
                degreeHtml.textContent = celc;
                descriptionHtml.textContent = description;
                hiddenHtml.innerHTML =
                    `<div class= 'hiddenHtml'>Feels like: ${feels_like} ℃</div>` +
                    `<div class= 'hiddenHtml'>Humidity: ${humidity} %</div>` +
                    `<div class= 'hiddenHtml'>Pressure: ${pressure} hPa</div>`;
                // });
            });
        }
    });
});
