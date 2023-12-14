'use strict';
export class Api{

    constructor() {
        this.api_key = "5b6078fb682d84a6d2f20873c2b1b9e1";
    }

    fetchData(URL, callback) {
        fetch(`${URL}&appid=${this.api_key}`)
            .then(res => res.json())
            .then(data => callback(data));
    }
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&lang=fr`;
    }

    foreCast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    }

    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    }

    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
    }

    geocoding(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.api_key}`;
    }
}


const api = new Api();
