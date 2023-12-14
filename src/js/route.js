'use strict';
import { App } from './app.js';


export class Route {
    constructor() {

        // Définissez la localisation par défaut
        this._defaultLocation = "#/weather?lat=43.65&lon=0.5833";

        // Définissez les routes avec les fonctions correspondantes
        this._routes = new Map([
            ["/current-location", () => this.currentLocation()],
            ["/weather", (query) => this.searchLocation(query)],
        ]);

        // Attachez les gestionnaires d'événements dans le constructeur
        window.addEventListener('hashchange', () => this.checkHash());
        window.addEventListener('load', () => {
            if (!window.location.hash) {
                window.location.hash = "#/current-location";
            } else {
                this.checkHash();
            }
        });
    }

    currentLocation() {
        const app = new App();
        window.navigator.geolocation.getCurrentPosition(
            res => {
                const { latitude, longitude } = res.coords;
                app.updateWeather(`lat=${latitude}`, `lon=${longitude}`);
            },
            err => {
                window.location.hash = this._defaultLocation;
            }
        );
    }


    searchLocation(query) {
        const app = new App();
        app.updateWeather(...query.split("&"));
    }

    checkHash() {
        const requestURL = window.location.hash.slice(1);
        const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

        // Vérifiez si la route existe dans la Map
        if (this._routes.has(route)) {
            this._routes.get(route)(query); // Appel de la fonction associée à la route
        } else {
            console.log("Page NON Trouvée");
        }
    }
}
const route = new Route();