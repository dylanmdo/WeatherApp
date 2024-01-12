'use strict';

import { App } from './app.js';

/**
 * Représente une classe Route pour gérer la navigation de l'application en fonction des routes définies.
 * @class
 */
export class Route {
    /**
     * Initialise une nouvelle instance de la classe Route.
     * @constructor
     */
    constructor() {
        /**
         * La localisation par défaut en cas de route non définie.
         * @type {string}
         * @private
         */
        this._defaultLocation = "#/weather?lat=43.65&lon=0.5833";

        /**
         * Instance unique de l'application associée à cette route.
         * @type {App}
         * @private
         */
        this._app = new App();

        /**
         * Map des routes associées aux fonctions de gestion correspondantes.
         * @type {Map}
         * @private
         */
        this._routes = new Map([
            ["/current-location", () => this.currentLocation()],
            ["/weather", (query) => this.searchLocation(query)],
        ]);

        // Attacher les gestionnaires d'événements dans le constructeur
        window.addEventListener('hashchange', () => this.checkHash());
        window.addEventListener('load', () => {
            if (!window.location.hash) {
                window.location.hash = "#/current-location";
            } else {
                this.checkHash();
            }
        });
    }

    /**
     * Met à jour la météo en fonction de la localisation actuelle de l'utilisateur.
     */
    currentLocation() {
        window.navigator.geolocation.getCurrentPosition(
            (res) => {
                const { latitude, longitude } = res.coords;
                this._app.updateWeather(`lat=${latitude}`, `lon=${longitude}`);
            },
            (err) => {
                window.location.hash = this._defaultLocation;
            }
        );
    }

    /**
     * Met à jour la météo en fonction de la localisation spécifiée dans la requête.
     * @param {string} query - La chaîne de requête contenant les paramètres de localisation.
     */
    searchLocation(query) {
        this._app.updateWeather(...query.split("&"));
    }

    /**
     * Vérifie la route actuelle à partir du hash de l'URL et exécute la fonction associée.
     */
    checkHash() {
        const requestURL = window.location.hash.slice(1);
        const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

        // Vérifier si la route existe dans la Map
        if (this._routes.has(route)) {
            this._routes.get(route)(query); // Appeler la fonction associée à la route
        } else {
            this._app.errorContent.classList.add("flex");
            this._app.errorContent.classList.remove("hidden");
        }
    }
}
const route = new Route();
