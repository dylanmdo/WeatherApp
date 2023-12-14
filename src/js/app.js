'use strict';

import {Api} from './api.js';
import {Module} from './module.js';
import {Route} from './route.js';


export class App {

    constructor() {
        this.api = new Api(); // Stockez une référence à l'instance de Api
        const module = new Module();
        const route = new Route();
        this.searchView = document.querySelector("[data-search-view]");
        this.searchToggler = document.querySelectorAll("[data-search-toggler]");
        this.searchField = document.querySelector("[data-search-field]");
        this.searchResult = document.querySelector("[data-search-result]");
        this.searchloadIcon = document.querySelector("[data-search-load-icon]");
        this.container = document.querySelector("[data-container]");
        this.loading = document.querySelector("[data-loading]");
        this.currentLocationBtn = document.querySelector("[data-current-location-btn]");
        this.currentWeatherSection = document.querySelector("[data-current-weather]");
        this.highLightSection = document.querySelector("[data-highlight]");
        this.forecastHourly = document.querySelector("[data-forecast-hourly]");
        this.weatherForecast = document.querySelector("[data-weather-forecast]");

        this.addEventOnElements(this.searchToggler, 'click', this.toggleSearch.bind(this));
        this.searchCity(this.api);


    }

     updateWeather(lat, lon) {
        const module = new Module();

        this.currentWeatherSection.innerHTML = "";
        this.highLightSection.innerHTML = "";
        this.forecastHourly.innerHTML = "";
        this.weatherForecast.innerHTML = "";

        if (window.location.hash === "#/current-location") {
            this.currentLocationBtn.setAttribute("disabled", "");
        } else {
            this.currentLocationBtn.removeAttribute("disabled");
        }

         const card = document.createElement("div");

        /****
         *
         * CURRENT WEATHER
         */
        this.api.fetchData(this.api.currentWeather(lat, lon), (currentWeather) =>  {
            const  {
                weather,
                dt: dateUnix,
                sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
                main: { temp, feels_like, pressure, humidity },
                visibility,
                timezone
            } = currentWeather
            const [{ description, icon }] = weather;
            weather.forEach(item => console.log(item));

            card.innerHTML = `
                 <p class="text-xl">Maintenant</p>
                <div class="lg:w-60" >
                    <div class="py-2">
                        <div class="flex items-center justify-between py-2">
                            <p class="text-7xl  relative">${parseInt(temp)}°<span class="text-4xl absolute top-3">C</span></p>
                            <img src="src/assets/${icon}.png" class="w-20">
                        </div>
                        <p class="text-sm">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                    </div>
                    <hr>
                    <div class="py-2 grid gap-2">
                        <div class="flex items-center gap-2 ">
                            <img src="src/assets/calendar-blank.svg" class="w-6">
                            <p>${module.getdate(dateUnix, timezone)}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <img src="src/assets/map-pin.svg" class="w-6">
                            <p  data-location></p>
                        </div>
                    </div>
                </div>       
        `;

            this.api.fetchData(this.api.reverseGeo(lat, lon), function([{ name, country }]) {
                card.querySelector("[data-location]").innerHTML = `${name}, ${country}`

            });

        });

         this.currentWeatherSection.appendChild(card);
    }


    addEventOnElements(elements, eventType, callback) {
        for (const element of elements) {
            element.addEventListener(eventType, callback);
        }
    }

    toggleSearch() {
        this.searchView.classList.toggle("search-view");
        this.searchView.classList.toggle("search-hide");
        document.body.style.overflow = (document.body.style.overflow === 'hidden') ? 'auto' : 'hidden';
    }

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
                        this.searchResult.innerHTML = `
                            <ul data-search-list >
                                
                            </ul>
                        `;

                        const items = []
                        for (const {name, lat, lon, country, state} of locations) {
                            const searchItem = document.createElement("li");
                            searchItem.classList.add(
                                "flex",
                                "items-center",
                                "py-3",
                                "px-3",
                                "gap-3",
                                "hover:bg-neutral-900",
                                "transition-all",
                                "duration-400",
                                "cursor-pointer",
                                "relative",
                            );
                            searchItem.innerHTML = `
                            <img src="src/assets/map-pin.svg">
                            <div>
                                <p>${name}</p>
                                <p class="text-neutral-500">Ville de <span>${state || ""} ${country}</span></p>
                            </div>
                            <a href="/weather?lat=${lat}&lon=${lon}" aria-label="${name}" class="absolute right-0 left-0 w-full h-full" data-search-toggler></a>
                            
                                                     
                            `;

                            this.searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                            items.push(searchItem.querySelector("[data-search-toggler]"));


                        }


                    });
                }, searchTimeoutDuration);
            }

        });

    }


}

