const url = 'https://places-dsn.algolia.net/1/places/query';
const searchBox = document.querySelector('#searchBox');
const listeVilles = document.querySelector('#listeVilles');
const ulResults = document.querySelector('#results');

const search = (event) => {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({query: event.currentTarget.value})
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        listeVilles.style.display = 'block';
        ulResults.innerHTML = '';
        data.hits.forEach(place => {
            ulResults.insertAdjacentHTML('beforeend', `
                <li data-long="${place._geoloc.lng}" data-lat="${place._geoloc.lat}" data-town="${place.locale_names.default}">${place.locale_names.default}</li>
            `);
            /* -----------------------------
            Ce que je veux : récupérer la latitude et la longitude de chaque élément puis les utiliser dans la carte ci-dessous (leaflet)
            ----------------------------- */
        });
        const listElement = document.querySelectorAll('li');
        
        for (i = 0; i < listElement.length; i++) {
            //console.log(listElement[i].getAttribute('data-long'));
            listElement[i].addEventListener('click', (event) => {
                const lgt = event.target.getAttribute('data-long');
                const lat = event.target.getAttribute('data-lat');
                const town = event.target.getAttribute('data-town'); 
                mapSearch(lat, lgt, town); 
            })
        }
        
    })
    .catch((error) => {
        console.log(error);
    })
}
// exécute la fonction de recherche à la saisie dans le INPUT
searchBox.addEventListener('keyup', search);

// pour fermer la liste des villes dans le UL
const closeButton = document.querySelector('#closeButton');
closeButton.addEventListener('click', () => {
    console.log(listeVilles);
    listeVilles.style.display = 'none';
    searchBox.value = '';
})

/* -------------------------------- MAP --------------------------------*/
function mapSearch(lat, lon, ville) {
    // Fonction d'initialisation de la carte
    initMap(lat, lon, ville);
}

function initMap(lat, lon, ville) {
    const newMap = document.querySelector('#newMap');
    newMap.innerHTML = '<div id="map"></div>'
    let macarte = null;
    let marker = null;
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView([lat, lon], 11);
    marker = L.marker([lat, lon]).addTo(macarte);
    marker.bindPopup(ville);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}
window.onload = mapSearch(43.6769, 4.6287, 'Arles'); 