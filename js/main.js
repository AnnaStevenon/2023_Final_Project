var map;

function createMap(){

    //create the map
    map = L.map('map', {
        center: [44.5, -89],
        zoom: 6.50
    
    });

    //add StadiaMaps base tilelayer
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    maxZoom: 20,
	    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    //call getData function
};



document.addEventListener('DOMContentLoaded',createMap);