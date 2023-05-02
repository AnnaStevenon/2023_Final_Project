var map
var birdLayer;
var trailLayer;
var selectedBird;
var selectedSeason;
var intersections;

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

    //L.easyButton('<img src="img/iat.jpeg">', function(){
       // $('tooltip').tooltip('show');
    //},'info window',{ position: 'topright' }).addTo(map);
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

            if (season.id == "prebreeding"){
                selectedSeason = "prebreeding_migration";
            } else if(season.id == "breeding"){
                selectedSeason = "breeding";
            } else if(season.id == "postbreeding"){
                selectedSeason = "postbreeding_migration";
            } else if(season.id == "nonbreeding"){
                selectedSeason = "nonbreeding";
            }

            birdLayer.setStyle(filterBirdSeason);

            //get trail intersections


            trailLayer.setStyle(filterTrailSeason);
            console.log(selectedSeason)
        })
    })

};

function filterTrailSeason(feature) {

    return {
        color: filterOpacity(feature.properties.Segment_ID)
    };

    //birdLayer.properties.season

    function filterOpacity(ID){
        if (intersections.includes(ID.toString())){
            return "black";
        }else { 
            return "red";
        }
    }
};

function getSegments(text){
    var segments = text.split(',');
    intersections = segments;
}

function filterBirdSeason(feature) {
    
    

    return {
        fillOpacity: filterOpacity(feature.properties.season, feature.properties.common_nam),
        opacity: filterOpacity(feature.properties.season, feature.properties.common_nam)
    };

    function filterOpacity(season, bird){
        if (season == selectedSeason && bird == selectedBird){
            segments = feature.properties.Segment;
            getSegments(segments);
            return 0.5;
        }else { 
            return 0;
        }
    }
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
        });
    })

};

function search_birds() {
  let input = document.getElementById('searchbar').value
  input=input.toLowerCase();
  console.log(input)
  let x = document.getElementsByClassName('common_nam');
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
document.getElementById("searchbar").addEventListener("change", function selectBird() {
    // code to trigger GeoJSON data based on selection
  birdLayer.addTo(map)
  selectedBird = document.getElementById("searchbar").value;
if (selectedBird === "Horned Grebe") {
    createGrebePopup();
    birdLayer.setStyle(filterSpecies)
    
} else if (selectedBird === "Peregrine Falcon") {
    createPeregrinePopup();
    birdLayer.setStyle(filterSpecies)

} else if (selectedBird === "Snow Goose") {
    createSnowGoosePopup();
    birdLayer.setStyle(filterSpecies)

} else {
}
});

// Style polygons based on time period
function filterSpecies(feature) {

    return {
        fillOpacity: filterOpacity(feature.properties.common_nam),
        opacity: filterOpacity(feature.properties.common_nam)
    };

    function filterOpacity(species){
       
        if (species == selectedBird)
            return 0.5;
        else    
            return 0;
    }
};

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
    "<h3>Select a bird, filter by season, and select a trail segment!</h3>" +
    '<img src="img/iat.jpeg" height= 200px; width= 250px>'
    "</div>";

    // Create a new tooltip object
    var tooltip = L.popup({
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
    
    //L.easyButton('<img src="img/iat.jpeg">', function(){
        //$('tooltip').tooltip('show');
  //},'info window',{ position: 'topright' }).addTo(map);
    
    closeTooltip.addEventListener('click-closeTooltip', function() {
        tooltip.closeTooltip();
        });

};

function createGrebePopup() { 

    // Define the content of the popup
    var GrebePopup = "<div class='tooltip'>" + "<button class='close-tooltip'>&times;</button>" + "<br></br>" +
    "<h2>Horned Grebe</h2>" +
    "<h3>The Horned Grebe is a small waterbird with a short neck, blocky head, and straight narrow bill. They can be found in freshwater ponds with cattails, sedges, willows, and other emergent vegetation, and in lakes and rivers during migration. The bird's plumage changes from gray and white as a non-breeding adult to brown and black with a golden stripe on the head during breeding.</h3>" +
    '<img src="img/Horned_Grebe.jpeg" height= 200px; width= 275px>'
    "</div>";

    // Create a new popup object
    var grebe = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,

    }).setContent(GrebePopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    grebe.setLatLng(center);
    // Add the tooltip to the map
    grebe.addTo(map);
}

function createPeregrinePopup() { 

    // Define the content of the popup
    var peregrinePopup = `<div class='tooltip'><button class='close-tooltip'>&times;</button><br></br><h2>Peregrine Falcon</h2><h3>The Peregrine Falcon is a large falcon with a wingspan of 100-110 cm. Adults are blue-gray with white barred under parts and dark and rounded heads with a black ‘mustache’. The wings are pointed, and the tail is relatively short. These birds prefer perching or nesting in tall structures as they watch for medium sized birds to hunt. Look for them on rock ledges, on telephone poles and tall buildings in urban areas. The Peregrine Falcon is listed as endangered in Wisconsin, primarily due to pesticide contamination (DDT), habitat loss, and human disturbance</h3><img src="img/Peregrine Falcon.jpeg" height= 200px; width= 275px>`
    "</div>";

    // Create a new popup object
    var peregrine = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,

    }).setContent(peregrinePopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    peregrine.setLatLng(center);
    // Add the tooltip to the map
    peregrine.addTo(map);
}
function createSnowGoosePopup() { 

    // Define the content of the popup
    var snowGoosePopup = `<div class='tooltip'><button class='close-tooltip'>&times;</button><br></br><h2>Snow Goose</h2><h3>"Adult Snow Geese may appear mostly white with black wings, considered a white morph, whereas others, termed blue morphs, have a darker body with gray-blue hues across the body, black wings, and a white head. Originally the two morphs were considered as two species, but in 1972 they were combined into one species with a single gene controlling the color difference. They may be found in large flocks and are often seen in or near water or foraging on agricultural fields."</h3><img src="img/Snow_Goose.jpeg" height= 200px; width= 275px>`
    "</div>";

    // Create a new popup object
    var snowGoose = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,

    }).setContent(snowGoosePopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    snowGoose.setLatLng(center);
    // Add the tooltip to the map
    snowGoose.addTo(map);
}

document.addEventListener('DOMContentLoaded',createMap);