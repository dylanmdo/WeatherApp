'use strict';

import {Api} from './api.js';
import {Module} from './module.js';

/**
 * @class
 * @classdesc Représente l'application météo.
 */
export class App {

    /**
     * Constructeur de la classe App.
     */
    constructor() {

        /**
         * Instance de l'API utilisée pour récupérer les données météo.
         * @type {Api}
         */
        this.api = new Api(); // Stockez une référence à l'instance de Api

        // Initialisation des éléments du DOM
        this.searchView = document.querySelector("[data-search-view]");
        this.searchToggler = document.querySelectorAll("[data-search-toggler]");
        this.searchField = document.querySelector("[data-search-field]");
        this.searchResult = document.querySelector("[data-search-result]");
        this.searchloadIcon = document.querySelector("[data-search-load-icon]");
        this.currentWeatherSection = document.querySelector("[data-current-weather]");
        this.highLightSection = document.querySelector("[data-highlight]");
        this.forecastHourly = document.querySelector("[data-forecast-hourly]");
        this.weatherForecast = document.querySelector("[data-weather-forecast]");
        //this.container = document.querySelector("[data-container]");
        this.loading = document.querySelector("[data-loading]");
        const currentLocationBtn = document.querySelectorAll("[data-current-location-btn]");
        this.errorContent = document.querySelector("[data-error-content]");


        this.addEventOnElements(this.searchToggler, 'click', this.toggleSearch.bind(this));
        this.searchCity(this.api);



        currentLocationBtn.forEach(element => {
            if (element) {
                if (window.location.hash === "#/current-location") {
                    element.setAttribute("disabled", "");
                    element.classList.add("bg-neutral-800")
                    element.classList.remove("bg-[#b6a1e5]")
                } else {
                    element.addEventListener("click", () => {
                        currentLocationBtn.forEach(btn => btn.setAttribute("disabled", ""));
                        element.classList.remove("bg-neutral-800")
                        element.classList.add("bg-[#b6a1e5]")
                        this.getCurrentLocation();
                        location.reload();
                    });
                }
            }
        });


    }


    /**
     * Met à jour les données météo en fonction de la latitude et de la longitude.
     * @param {number} lat - Latitude.
     * @param {number} lon - Longitude.
     */
    updateWeather(lat, lon) {


        this.errorContent.classList.add("hidden");
        this.errorContent.classList.remove("flex");

        const module = new Module();

        this.loading.style.display = "none";

        this.currentWeatherSection.innerHTML = "";
        this.highLightSection.innerHTML = "";
        this.forecastHourly.innerHTML = "";
        this.weatherForecast.innerHTML = "";

        const card = document.createElement("div");

        // Appel à la méthode fetchData de l'API pour obtenir les données météo actuelles
        this.api.fetchData(this.api.currentWeather(lat, lon), (currentWeather) => {
            const {
                weather,
                dt: dateUnix,
                sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
                main: {temp, feels_like, pressure, humidity},
                visibility,
                timezone
            } = currentWeather;

            const [{description, icon}] = weather;

            card.innerHTML = `
            <p class="text-xl">Maintenant</p>
            <div class="lg:w-60">
                <div class="py-2">
                    <div class="flex items-center justify-between py-2">
                        <p class="text-7xl  relative">${parseInt(temp)}°<span class="text-4xl absolute top-3">C</span></p>
                        <img src="/assets/${icon}.png" class="w-20">
                    </div>
                    <p class="text-sm">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                </div>
                <hr>
                <div class="py-2 grid gap-2">
                    <div class="flex items-center gap-2">
                        <img src="/assets/calendar-blank.svg" class="w-6">
                        <p>${module.getdate(dateUnix, timezone)}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <img src="/assets/map-pin.svg" class="w-6">
                        <p data-location></p>
                    </div>
                </div>
            </div>       
        `;

            // Appel à la méthode fetchData de l'API pour obtenir les données de géolocalisation inversée (reverse geocoding)
            this.api.fetchData(this.api.reverseGeo(lat, lon), ([{name, country, state}]) => {
                card.querySelector("[data-location]").innerHTML = `${name}, ${state ? state + ' ' : ''}(${country})`;
            });
            this.currentWeatherSection.appendChild(card);

            // Appel à la méthode fetchData de l'API pour obtenir les données sur la qualité de l'air
            this.api.fetchData(this.api.airPollution(lat, lon), (airPollution) => {

                const [{
                    main: {aqi},
                    components: {no2, o3, so2, pm2_5},

                }] = airPollution.list;


                const card = document.createElement("div");
                card.classList.add("p-5", "md:p-8", "bg-[#1d1c1f]", "rounded-2xl");
                card.innerHTML = `
            <p class="text-xl pb-5">Faits marquants du jour</p>
                <div class="grid lg:grid-cols-2 gap-5 " data-highlight>
                    <div class="grid gap-5">
                        <div class="bg-[#1a191c]  p-5 rounded-2xl h-52  ">
                            <div class=" flex items-center justify-between pb-10">
                                <p>Indice de Qualité de l'Air</p>
                                <span class="inline-flex items-center justify-center rounded-full aqi-${aqi} px-2.5 py-0.5 " title="${module.aqiText[aqi].message}"><p
                                        class="whitespace-nowrap text-sm ">${module.aqiText[aqi].level}</p></span>
                            </div>
                            <div class="flex  items-center gap-2">
                                <img src="/assets/wind-thin.svg" class="w-8">
                                <div class="grid grid-cols-2 gap-2 md:grid-cols-4 w-full justify-items-center">
                                    <div>
                                        <p class="text-xl">${pm2_5.toPrecision(3)}</p>
                                        <p>PM</p>
                                    </div>
                                    <div>
                                        <p class="text-xl">${so2.toPrecision(3)}</p>
                                        <p>SO<span class="text-sm">2</span></p>
                                    </div>
                                    <div>
                                        <p class="text-xl">${no2.toPrecision(3)}</p>
                                        <p>NO<span class="text-sm">2</span></p>
                                    </div>
                                    <div>
                                        <p class="text-xl">${o3.toPrecision(3)}</p>
                                        <p>O<span class="text-sm">3</span></p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-5">
                            <div class="p-5   bg-[#1a191c] rounded-2xl">
                                <p class="py-2">Humidité</p>
                                <img src="/assets/drop-thin.svg" class="w-8">
                                <p class="text-4xl font-light">${humidity}<span class="text-lg">%</span></p>
                            </div>

                            <div class="p-5   bg-[#1a191c] rounded-2xl">
                                <p class="py-2">Pression</p>
                                <img src="/assets/50n.png" class="w-8">
                                <p class="text-4xl font-light">${pressure}<span class="text-lg">hpa</span></p>
                            </div>
                        </div>
                    </div>
                    <!-------------------------->
                    <div class="grid gap-5">
                        <div class="bg-[#1a191c]  p-5 rounded-2xl h-52  ">
                            <p class="pb-10">Lever et Coucher du soleil</p>
                            <div class="grid grid-cols-2 items-center gap-2">
                                <div>
                                    <img src="/assets/sun-light.svg" class="w-8">
                                    <p class="text-sm">Lever</p>
                                    <p class="text-2xl">${module.getTime(sunriseUnixUTC, timezone)}</p>
                                </div>
                                <div>
                                    <img src="/assets/moon-light.svg" class="w-8">
                                    <p class="text-sm">Coucher</p>
                                    <p class="text-2xl">${module.getTime(sunsetUnixUTC, timezone)}</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-5">
                            <div class="p-5   bg-[#1a191c] rounded-2xl">
                                <p class="py-2">Visibilité</p>
                                <img src="/assets/eye-thin.svg" class="w-8">
                                <p class="text-4xl font-light">${visibility / 1000}<span class="text-lg">Km</span></p>
                            </div>

                            <div class="p-5   bg-[#1a191c] rounded-2xl">
                                <p class="py-2">Ressenti</p>
                                <img src="/assets/thermometer-hot-thin.svg" class="w-8">
                                <p class="text-4xl font-light relative">${parseInt(feels_like)}°<span class="text-lg absolute top-1">C</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `
                this.highLightSection.appendChild(card);
            })


        });

        // Appel à la méthode fetchData de l'API pour obtenir les prévisions météorologiques
        this.api.fetchData(this.api.foreCast(lat, lon), (foreCast) => {

            const {
                list: forecastList,
                city: {timezone}
            } = foreCast;

            this.forecastHourly.innerHTML = `
                    <p class="text-xl">Aujourd'hui</p>
                    <div class="overflow-x-scroll scrollbar-hide">
                        <ul class="grid grid-cols-8 gap-x-28 lg:grid-cols-6 xl:grid-cols-8 gap-y-5 lg:gap-x-5">
            
                        </ul>
                    </div>
                `;

            const ulElement = this.forecastHourly.querySelector("ul");

            // Boucle à travers les prévisions horaires
            for (const [index, data] of forecastList.entries()) {

                if (index > 7) break;
                const {
                    dt: dateTimeUnix,
                    main: {temp},
                    weather,
                } = data
                const [{icon, description}] = weather

                const tempLi = document.createElement("li");
                tempLi.classList.add("grid", "gap-y-3", "justify-items-center", "py-3", "w-24", "bg-[#1d1c1f]", "rounded-2xl");
                tempLi.innerHTML = `
            <p>${module.getHours(dateTimeUnix, timezone)}</p>
            <img src="/assets/${icon}.png" class="w-10">
            <p>${parseInt(temp)}°</p>
        `;

                ulElement.appendChild(tempLi);
            }


            this.weatherForecast.innerHTML = `
                <p class="text-xl pb-3   ">5 Prochains Jours</p>
                    <ul class="lg:w-60  " data-weather-forecast-list>
                        
                    </ul>
                
            `;

            // Boucle à travers les prévisions des 5 prochains jours
            for (let i = 7, len = forecastList.length; i < len; i += 8) {

                const {
                    main: {temp_max},
                    weather,
                    dt_txt
                } = forecastList[i];
                const [{icon, description}] = weather
                const date = new Date(dt_txt);

                const li = document.createElement("li");
                li.classList.add("grid", "grid-cols-4", "items-center", "w-full", "md:justify-items-start");
                li.innerHTML = `
                        <img src="/assets/${icon}.png" class="w-10">
                           
                            <p>${parseInt(temp_max)}°C</p>
                            <p>${date.getDate()} ${module._monthNames[date.getUTCMonth()]}</p>
                            <p>${module._weekDayNames[date.getUTCDay()]}</p>
                            
                    `;

                this.weatherForecast.querySelector("[data-weather-forecast-list]").appendChild(li);

            }


        });

    }


    /**
     * Ajoute des écouteurs d'événements à une liste d'éléments DOM.
     * @param {NodeListOf<Element>} elements - Liste d'éléments DOM.
     * @param {string} eventType - Type d'événement.
     * @param {Function} callback - Fonction de rappel à exécuter lors de l'événement.
     */
    addEventOnElements(elements, eventType, callback) {
        for (const element of elements) {
            element.addEventListener(eventType, callback);
        }
    }

    /**
     * Bascule l'affichage du champ de recherche.
     */
    toggleSearch() {
        this.searchView.classList.toggle("max-md:search-view");
        this.searchView.classList.toggle("max-md:search-hide");
    }


    /**
     * Effectue une recherche de ville en fonction de la saisie dans le champ de recherche.
     * @param {Api} api - Instance de l'API utilisée pour effectuer la recherche de géocodage.
     */
    searchCity(api) {
        let searchTimeout = null;
        const searchTimeoutDuration = 500;

        this.searchField.addEventListener('input', () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            if (!this.searchField.value) {
                this.searchResult.innerHTML = "";
                this.searchloadIcon.classList.add("invisible");
            } else {
                this.searchloadIcon.classList.remove("invisible");
            }

            if (this.searchField.value) {
                searchTimeout = setTimeout(() => {

                    api.fetchData(api.geocoding(this.searchField.value), (locations) => {
                        this.searchField.classList.remove("hidden");
                        this.searchloadIcon.classList.add("invisible");
                        this.searchResult.classList.remove("hidden");
                        this.searchResult.innerHTML = `<ul data-search-list></ul>`;

                        const items = [];

                        for (const {name, lat, lon, country, state} of locations) {

                            const searchItem = document.createElement("li");
                            searchItem.classList.add(
                                "flex",
                                "items-center",
                                "my-3",
                                "mx-2",
                                "rounded-lg",
                                "py-3",
                                "px-3",
                                "gap-3",
                                "hover:bg-neutral-900",
                                "duration-400",
                                "cursor-pointer",
                                "relative"
                            );
                            searchItem.innerHTML = `
                             
                            <img  src="/assets/map-pin.svg">
                            <div >
                                <p>${name}</p>
                                <p class="text-neutral-500">Ville de <span>${state || ""} ${country}</span></p>
                            </div>
                            <a href="#/weather?lat=${lat}&lon=${lon}"  class="absolute right-0 left-0 w-full h-full " data-search-toggler></a>
                            
                        `;

                            this.searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                            items.push(searchItem.querySelector("[data-search-toggler]"));
                        }


                        this.addEventOnElements(items, "click", () => {
                            this.searchResult.classList.add("hidden");
                            this.searchField.value = "";
                            this.searchView.classList.add("max-md:search-hide");
                            this.searchView.classList.remove("max-md:search-view");
                        });


                    });
                }, searchTimeoutDuration);
            }
        });
    }


    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                this.updateWeather(`lat=${latitude}`, `lon=${longitude}`);
            },
        );
    }
}

