'use strict';

/**
 * Représente une classe Api pour interagir avec l'API OpenWeatherMap.
 * @class
 */
export class Api {

    /**
     * La clé API pour accéder à l'API OpenWeatherMap.
     * @type {string}
     */
    constructor() {
        this.api_key = "5b6078fb682d84a6d2f20873c2b1b9e1";
    }

    /**
     * Récupère des données à partir de l'URL spécifiée en utilisant le callback fourni.
     * @param {string} URL - L'URL pour récupérer des données.
     * @param {Function} callback - La fonction de rappel pour traiter les données récupérées.
     */
    fetchData(URL, callback) {
        fetch(`${URL}&appid=${this.api_key}`)
            .then(res => res.json())
            .then(data => callback(data));
    }

    /**
     * Génère l'URL pour récupérer les conditions météorologiques actuelles en fonction de la latitude et de la longitude.
     * @param {number} lat - La latitude.
     * @param {number} lon - La longitude.
     * @returns {string} L'URL générée pour les conditions météorologiques actuelles.
     */
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&lang=fr`;
    }

    /**
     * Génère l'URL pour récupérer les prévisions météorologiques en fonction de la latitude et de la longitude.
     * @param {number} lat - La latitude.
     * @param {number} lon - La longitude.
     * @returns {string} L'URL générée pour les prévisions météorologiques.
     */
    foreCast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    }

    /**
     * Génère l'URL pour récupérer les données de pollution de l'air en fonction de la latitude et de la longitude.
     * @param {number} lat - La latitude.
     * @param {number} lon - La longitude.
     * @returns {string} L'URL générée pour les données de pollution de l'air.
     */
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    }

    /**
     * Génère l'URL pour la géocodification inverse (obtenir des informations de localisation à partir des coordonnées).
     * @param {number} lat - La latitude.
     * @param {number} lon - La longitude.
     * @returns {string} L'URL générée pour la géocodification inverse.
     */
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=1`;
    }

    /**
     * Génère l'URL pour la géocodification (obtenir des coordonnées à partir du nom de l'emplacement).
     * @param {string} query - Le nom de l'emplacement.
     * @returns {string} L'URL générée pour la géocodification.
     */
    geocoding(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.api_key}`;
    }
}


const api = new Api();
