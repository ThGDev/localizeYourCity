const url = 'https://places-dsn.algolia.net/1/places/query';    // URL API Algolia
const searchBox = document.querySelector('#searchBox'); // INPUT de recherche
const listeVilles = document.querySelector('#listeVilles'); // DIV contenant l'UL des villes
const ulResults = document.querySelector('#results');   // UL des villes

// Fonction qui va fetch l'API d'Algolia
const search = (event) => {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({query: event.currentTarget.value})    // je transforme les résultats en type 'string'
    })
    .then(response => response.json())  // je transforme les résultats en JSON
    .then((data) => {   // on commence la recherche
        //console.log(data);
        listeVilles.style.display = 'block';    // j'affiche la DIV contenant l'UL 
        ulResults.innerHTML = '';   // je vide d'éventuels résultats précédents
        data.hits.forEach(place => {    // je boucle sur le tableau des résultats
            // j'écris ces résultats dans mon UL en HTML
            ulResults.insertAdjacentHTML('beforeend', `
                <li data-long="${place._geoloc.lng}" data-lat="${place._geoloc.lat}" data-town="${place.locale_names.default}">${place.locale_names.default}</li>
            `);
        });
        const listElement = document.querySelectorAll('li');    // je cible tous les <li> et ça me renvoie un tableau
        
        for (i = 0; i < listElement.length; i++) {  // je boucle sur ce tableau
            //console.log(listElement[i].getAttribute('data-long'));
            listElement[i].addEventListener('click', (event) => {   // au clic, pour chaque <li>, je récupère des datas (dataset)
                const lgt = event.target.getAttribute('data-long');
                const lat = event.target.getAttribute('data-lat');
                const town = event.target.getAttribute('data-town'); 
                initMap(lat, lgt, town);  // et j'exécute ma fonction mapSearch en injectant les datas récup au-dessus en paramètres
                weatherCall(lat, lgt, town);
                listeVilles.style.display = 'none';
                searchBox.value = '';
            })
        }
        
    })
    .catch((error) => {     // un petit catch en cas d'erreur
        console.log(error);
    })
}
// exécute la fonction de recherche (ci-dessus) à la saisie dans le INPUT
searchBox.addEventListener('keyup', search);

// pour fermer la liste des villes dans le UL
const closeButton = document.querySelector('#closeButton');
closeButton.addEventListener('click', () => {
    console.log(listeVilles);
    listeVilles.style.display = 'none';
    searchBox.value = '';
})

/* -------------------------------- MAP --------------------------------*/

// Fonction d'initialisation de la carte
function initMap(lat, lon, ville) {
    const newMap = document.querySelector('#newMap');   // je stocke la DIV qui va contenir celle qui contiendra la map
    newMap.innerHTML = '<div id="map"></div>';  // je créé la DIV qui va contenir la map dans celle ci-dessus
    let macarte = null; // je déclare la variable qui va gérer la map
    let marker = null;  // je déclare la variable qui va gérer le marqueur 
    // Création de l'objet "macarte" et insertion dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView([lat, lon], 11);
    // Création du marqueur
    marker = L.marker([lat, lon]).addTo(macarte);
    // affectation du nom de la ville sélectionnée dans le popup quand on clic sur le marqueur
    marker.bindPopup(ville);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}
window.onload = initMap(43.6769, 4.6287, 'Arles');  // au chargement de la page, je charge la map ciblée sur Arles par défaut

/* -------------------------------- /MAP --------------------------------*/

/* -------------------------------- METEO --------------------------------*/

const weatherDiv = document.querySelector('#weatherDiv');

const weatherCall = (lat, lon, town) => {
    const urlWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&lang=fr&appid=39a119e15d4e7af2e13ccb87b4f2b2a4`;
    fetch(urlWeather)
    .then(response => response.json())
    .then((data) => {
        console.log(data.current.weather[0].description);
        weatherDiv.innerHTML = `<h3>${town}</h3>
                                <p>La température est de ${data.current.temp}°C</p>
                                <p>Le ciel est : <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" /> ${data.current.weather[0].description}</p>`;
    })
}
window.onload = weatherCall(43.6769, 4.6287, 'Arles');

/* -------------------------------- /METEO --------------------------------*/

/* -------------------------------- DATE --------------------------------*/
const dateDuJour = new Date();
const divDate = document.querySelector('#date');
const annee   = dateDuJour.getFullYear();
const mois    = ('0'+dateDuJour.getMonth()+1).slice(-2);
const jour    = ('0'+dateDuJour.getDate()).slice(-2);
divDate.innerHTML = `<strong>${jour}/${mois}/${annee}</strong>`;