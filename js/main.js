var map;

function createMap(){

    //create the map
    map = L.map('map', {
        center: [44.5, -89],
        zoom: 6.50,
        attributionControl: false
    
    });

    //add StadiaMaps base tilelayer
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    maxZoom: 20,
	    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    //call getBirdData function
    getBirdData(map);
    //call creatSequenceControls function
    createSequenceControls();


    //map.attributionControl.setPrefix(false)

};

//Create new sequence controls
function createSequenceControls(){   
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
            
            //add season buttons
            container.insertAdjacentHTML('beforeend', '<button class="season" id="breeding" title="Breeding"></button>'); 
            container.insertAdjacentHTML('beforeend', '<button class="season" id="onbreeding" title="Nonbreeding"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="season" id="rebreeding" title="Prebreeding Migration"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="season" id="postbreeding" title="Postbreeding Migration"></button>');


            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    map.addControl(new SequenceControl());  



    document.querySelectorAll('.season').forEach(function(season){
        season.addEventListener("click", function(){
            
        })
    })

};

    // add bird ranges to the map
var birdRanges = new L.featureGroup();

function getBirdData(map){
    fetch('data/ebird_ranges.geojson')
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        L.geoJson(json, {
            style: styleBirdRanges
        }).addTo(map);
    })

    console.log(birdRanges)
};


// Style polygons based on time period
function styleBirdRanges(feature) {
    return {
        fillColor: fillSeason(feature.properties.season),
        fillOpacity: 0.2,
        weight: 2,
        color: '#fff',
        opacity: 1,
    };
};

// function to change color by season, note that colors are temporary/random for now
function fillSeason(season) {
    if(season=="breeding"){
        return "green"
    } else if (season == "nonbreeding") {
        return "red"
    } else if (season === "prebreeding_migration") {
        return "blue"
    } else if (season == "postbreeding_migration") {
        return "orange"
    }   
};




document.addEventListener('DOMContentLoaded',createMap);