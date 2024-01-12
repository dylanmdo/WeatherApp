'use strict';


export class Module{
     _weekDayNames = [
         "Dimanche",
         "Lundi",
         "Mardi",
         "Mercredi",
         "Jeudi",
         "Vendredi",
         "Samedi",
     ]

    _monthNames = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jui",
        "Juil",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    /**
     * Obtient une représentation lisible de la date à partir d'une timestamp Unix et d'un fuseau horaire.
     * @param {number} dateUnix - Timestamp Unix en secondes.
     * @param {string} timeZone - Fuseau horaire au format string (par exemple, "Europe/Paris").
     * @returns {string} - Représentation lisible de la date (jour de la semaine, jour du mois et mois).
     */
    getdate(dateUnix,timeZone){
        const date = new Date((dateUnix + timeZone) * 1000);
        const weekDayName = this._weekDayNames[date.getUTCDay()];
        const monthName = this._monthNames[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        return `${weekDayName} ${date.getUTCDate()}, ${monthName} ${year}`;
    }

    /**
     * Obtient une représentation lisible de l'heure à partir d'une timestamp Unix et d'un fuseau horaire.
     * @param {number} timeUnix - Timestamp Unix en secondes.
     * @param {string} timeZone - Fuseau horaire au format string (par exemple, "Europe/Paris").
     * @returns {string} - Représentation lisible de l'heure (format 12 heures).
     */
    getTime(timeUnix,timeZone){
        const date = new Date((timeUnix + timeZone)*1000);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        return `${hours%24 || 24}:${minutes}`
    }

    /**
     * Obtient une représentation lisible de l'heure à partir d'une timestamp Unix et d'un fuseau horaire.
     * @param {number} timeUnix - Timestamp Unix en secondes.
     * @param {string} timeZone - Fuseau horaire au format string (par exemple, "Europe/Paris").
     * @returns {string} - Représentation lisible de l'heure (format 12 heures).
     */
    getHours(timeUnix,timeZone){
        const date = new Date((timeUnix + timeZone)*1000);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        return `${hours%24 || 24}${"h"}`
    }

    /**
     * Convertit la vitesse de mètres par seconde (mps) en kilomètres par heure (km/h).
     * @param {number} mps - Vitesse en mètres par seconde.
     * @returns {number} - Vitesse convertie en kilomètres par heure.
     */
    convertMpsToKmh(mps){
        const kmh = mps*3600
        return kmh/1000;
    }

    aqiText = {
        1:{
            level: "Bon",
            message: "La qualité de l'air est considérée comme bonne, avec peu ou pas de risque de pollution."
        },

        2:{
            level:"Moyen",
            message: "La qualité de l'air est acceptable, bien que certains polluants puissent présenter un risque modéré pour la santé des personnes sensibles."
        },

        3:{
            level:"Modéré",
            message: "Les membres de groupes sensibles peuvent ressentir des effets sur leur santé, mais le grand public ne devrait pas être affecté."
        },

        4:{
            level:"Médiocre",
            message: "Tout le monde peut commencer à ressentir des effets sur la santé, tandis que les personnes sensibles peuvent éprouver des problèmes plus graves."
        },

        5:{
            level:"Très Médiocre",
            message: "Avertissement d'urgence sanitaire. Toute la population est susceptible d'être touchée."
        }
    }

}

const module = new Module();


