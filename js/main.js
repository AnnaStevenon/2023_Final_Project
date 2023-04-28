var map
var birdLayer;
var trailLayer;

function createMap(){

    //create the map
    map = L.map('map', {
        center: [44.9, -89.75],
        zoom: 6.50,
        minZoom: 6, //prevent zooming father out than WI
        attributionControl: false,
        zoomSnap: 0.25,  
        zoomDelta: 0.25, // makes zoom steps finer,
    });


    //add StadiaMaps base tilelayer
    var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    search_birds()

    //call getBirdData function
    getBirdData(map);
    //call getTrailData function
    getTrailData(map);
    //call creatSequenceControls function
    createSequenceControls();
    //
    search_birds()

    //map.attributionControl.setPrefix(false)

    // call tool tip
    createTooltip()

    //update trail widths upon zooming
    setWeight()
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
            container.insertAdjacentHTML('beforeend', '<button class="season" id="prebreeding" title="Prebreeding Migration"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="season" id="breeding" title="Breeding"></button>'); 
            container.insertAdjacentHTML('beforeend', '<button class="season" id="postbreeding" title="Postbreeding Migration"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="season" id="nonbreeding" title="Nonbreeding"></button>');


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
//var birdRanges = new L.featureGroup();

function getBirdData(map){
    fetch('data/ebird_ranges.geojson')
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        birdLayer = L.geoJson(json, {
            style: styleBirdRanges
        }).addTo(map);
    })

};

function search_birds() {
  let input = document.getElementById('searchbar').value
  input=input.toLowerCase();
  console.log(input)
  let x = document.getElementsByClassName('common-nam');
    console.log(x)
  for (i = 0; i < x.length; i++) { 
      if (x[i].innerHTML.toLowerCase().includes(input) && input) {
        x[i].style.display="list-item";   
        var result = x[i].innerHTML;
        //https://leafletjs.com/reference.html#geojson-setstyle
        document.querySelector(".sequence-control-container").style.display = "block";  // makes it so the buttons are hidden until a search is conducted // this needs to be updated now that the seach bar is different
      }
      else {
          x[i].style.display="none";   
       
    }
};
}

// Style polygons based on time period
function styleBirdRanges(feature) {
    return {
        fillColor: fillSeason(feature.properties.season),
        fillOpacity: 0.4,
        weight: 1,
        color: '#fff',
        opacity: 1,
    };
};

// function to change color by season, note that colors are from color brewer
function fillSeason(season) {
    if(season=="breeding"){
        return "#66c2a5"
    } else if (season == "nonbreeding") {
        return "#fc8d62"
    } else if (season === "prebreeding_migration") {
        return "#8da0cb"
    } else if (season == "postbreeding_migration") {
        return "#e78ac3"
    }   
};

// add Ice Age Trail data
//var trail = new L.featureGroup();

function getTrailData(map){
    fetch('data/Ice_Age_Trail_simple.geojson')
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        trailLayer = L.geoJson(json, {
            style: styleTrail,
            onEachFeature: function(feature, layer) { //add a popup for each segment with the name
                layer.bindPopup("Segment: " + feature.properties.SEGMENT_NA)
            }
        }).addTo(map);
    })

};

// Style Ice Age Trail
function styleTrail(feature) {
    return {
        color: "red",
        opacity: 1,
        weight: 3
    };
};

//function to change the weight of the trail line based on the zoom level
function setWeight() {
    map.on('zoomend', function () {
    currentZoom = map.getZoom();
    if (currentZoom >= 7) {
        trailLayer.setStyle({weight: 4});
    } if (currentZoom >= 12) {
        trailLayer.setStyle({weight: 7});
    }
    else {
        trailLayer.setStyle({weight: 3});
    }
    });
};


function createTooltip() { //not sure if this is the best way to create the inital pop-up, but I can't find another way for now

    // Define the content of the tooltip
    var tooltipContent = "<div class='tooltip'>" + "<button class='close-tooltip'>&times;</button>" + "<br></br>" +
    "<h2>Welcome to the Ice Age Trail Birding Map!</h2>" +
    "<h3>Select a bird, filter by season, and select a trail segment!</h3>"
    "</div>";

    // Create a new tooltip object
    var tooltip = L.tooltip({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,

    }).setContent(tooltipContent);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    tooltip.setLatLng(center);
    // Add the tooltip to the map
    tooltip.addTo(map);

    // Bind an event listener to the X button to close the tooltip // this isn't working because anywhere you click it closes
    var closeTooltip = tooltip.getElement().getElementsByClassName('close-tooltip')[0];

    console.log(closeTooltip) // above line is selecting the button
    
    closeTooltip.addEventListener('click-closeTooltip', function() {
        tooltip.closeTooltip();
        });

};


document.addEventListener('DOMContentLoaded',createMap);