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
    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    opacity:0.8
}).addTo(map);

var CartoDB_PositronOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);



    //L.easyButton('<img src="img/iat.jpeg">', function(){
       // $('tooltip').tooltip('show');
    //},'info window',{ position: 'topright' }).addTo(map);
    search_birds();

    //call getBirdData function
    getBirdData(map);

    //call creatSequenceControls function
    createSequenceControls();

    //call getTrailData function
     getTrailData(map);

    //map.attributionControl.setPrefix(false)

    // call info button
    createInfoButton();

    // call tool tip
    createTooltip();

    //update trail widths upon zooming
    setWeight();

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
            container.insertAdjacentHTML('beforeend', '<button class="season" id="prebreeding" title="Prebreeding Migration">Prebreeding migration</button>');
            container.insertAdjacentHTML('beforeend', '<button class="season" id="breeding" title="Breeding">Breeding</button>'); 
            container.insertAdjacentHTML('beforeend', '<button class="season" id="postbreeding" title="Postbreeding Migration">Postbreeding migration</button>');
            container.insertAdjacentHTML('beforeend', '<button class="season" id="nonbreeding" title="Nonbreeding">Nonbreeding</button>');


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
            return "yellow";
        }else { 
            return "white";
        }
    }
};

function filterTrail(feature) {

    return {
        color: "white"
    };
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
            style: styleBirdRanges,
            interactive:false
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
      }
      else {
          x[i].style.display="none";   
       
    }
};
}
document.getElementById("searchbar").addEventListener("change", function selectBird() {
    // code to trigger GeoJSON data based on selection
    document.querySelector(".sequence-control-container").style.display = "block";  // makes it so the buttons are hidden until a search is conducted // this needs to be updated now that the seach bar is different

  birdLayer.addTo(map)
  selectedBird = document.getElementById("searchbar").value;
if (selectedBird === "Horned Grebe") {
    createGrebePopup();
    birdLayer.setStyle(filterSpecies)
    trailLayer.setStyle(filterTrail)
    
} else if (selectedBird === "Peregrine Falcon") {
    createPeregrinePopup();
    birdLayer.setStyle(filterSpecies)
    trailLayer.setStyle(filterTrail)

} else if (selectedBird === "Snow Goose") {
    createSnowGoosePopup();
    birdLayer.setStyle(filterSpecies)
    trailLayer.setStyle(filterTrail)

 
} else if (selectedBird === "Wood Duck") {
    createWoodDuckPopup();
    birdLayer.setStyle(filterSpecies)
    trailLayer.setStyle(filterTrail)

} 
 else if (selectedBird === "Yellow-bellied Sapsucker") {
    createSapSuckerPopup();
    birdLayer.setStyle(filterSpecies)
    trailLayer.setStyle(filterTrail)

 
} else if (selectedBird === "Common Goldeneye") {
    createGoldeneyePopup();
    birdLayer.setStyle(filterSpecies)
    trailLayer.setStyle(filterTrail)

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
            pane:"shadowPane",
            style: styleTrail(),
            onEachFeature: function(feature, layer) { //add a popup for each segment with the name
                layer.bindPopup("Segment: " + feature.properties.SEGMENT_NA)
            }
        }).addTo(map);
    })

};

// Style Ice Age Trail
function styleTrail(feature) {
    return {
        color: "white",
        opacity: 1,
        weight: 3
    };
};

//function to change the weight of the trail line based on the zoom level
function setWeight() {
    map.on('zoomend', function () {
    currentZoom = map.getZoom();
    if (currentZoom >= 5 && currentZoom <= 10) {
        trailLayer.setStyle({weight: 10});
    } if (currentZoom >= 10) {
        trailLayer.setStyle({weight: 10});
    }
    else {
        trailLayer.setStyle({weight: 5});
    }
    });
};


function createTooltip() { //intitally was a tooltip but now is a popup

    // Define the content of the tooltip
    var tooltipContent = "<div class='tooltip'>" + "<br></br>" +
    "<h2>Welcome to the Ice Age Trail Birding Map!</h2>" +
    "<h3>Select a bird, filter by season, and select a trail segment!</h3>" +
    '<img src="img/iat.jpeg" height= 150px; width= 200px>' +"<br></br>" +
    "<h4> These maps show predicted bird ranges for 2021 using data from eBird at Cornell University. <br> For more information see the<a href='https://ebird.org/home'> eBird homepage.</a> </h4>" +
    "<br> <h4>For more information on the Ice Age Trail Alliance <a href='https://www.iceagetrail.org/'> click here.</a> </h4>"
    "</div>";

    // Create a new tooltip object
    var tooltip = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true

    }).setContent(tooltipContent);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    tooltip.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat + 1.5,lon:center.lng}));
    // Add the tooltip to the map
    tooltip.addTo(map);

};

function createGrebePopup() { 

    // Define the content of the popup
    var GrebePopup = "<div class='tooltip'>" + "<br></br>" +
    "<h2>Horned Grebe</h2>" +
    "<p>The Horned Grebe is a small waterbird with a short neck, blocky head, and straight narrow bill. They can be found in freshwater ponds with cattails, sedges, willows, and other emergent vegetation, and in lakes and rivers during migration. The bird's plumage changes from gray and white as a non-breeding adult to brown and black with a golden stripe on the head during breeding.</p>"  +
    '<img src="img/Horned_Grebe.jpeg" height= 200px; width= 275px>' +
    "<p> Range data is predicted for the following time periods: <br> Prebreeding migration: 2/15 - 5/31,  Breeding: 6/7 - 7/27, Postbreeding migration: 8/3 - 12/14,  Nonbreeding: 12/21 - 2/8 </p>"
    "</div>";

    // Create a new popup object
    var grebe = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,
        className: "birdPopup",
        autoPan:false,
        maxWidth:310
    }).setContent(GrebePopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    grebe.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat + 0.6,lon:center.lng}));
    // Add the tooltip to the map
    grebe.addTo(map);
};

function createPeregrinePopup() { 

    // Define the content of the popup
    var peregrinePopup = `<div class='tooltip'><br></br><h2>Peregrine Falcon</h2><p>The Peregrine Falcon is a large falcon with a wingspan of 100-110 cm. Adults are blue-gray with white barred under parts and dark and rounded heads with a black ‘mustache’. The wings are pointed, and the tail is relatively short. These birds prefer perching or nesting in tall structures as they watch for medium sized birds to hunt. Look for them on rock ledges, on telephone poles and tall buildings in urban areas. The Peregrine Falcon is listed as endangered in Wisconsin, primarily due to pesticide contamination (DDT), habitat loss, and human disturbance</p><img src="img/Peregrine Falcon.jpeg" height= 200px; width= 175px><p> Range data is predicted for the following time periods: <br> Prebreeding migration: 2/22 - 5/31, Breeding: 6/7 - 7/20, Postbreeding migration: 7/27 - 11/23, Nonbreeding: 11/30 - 2/15</p>`
    "</div>";

    // Create a new popup object
    var peregrine = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,
        className: "birdPopup",
        autoPan:false,
        maxWidth:310
    }).setContent(peregrinePopup);

    // get the center of the map
    var center = map.getCenter();
    console.log(center)
    // set the coordinates for the tooltip
    peregrine.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat +0.5,lon:center.lng}));
    // Add the tooltip to the map
    peregrine.addTo(map);
};

function createSnowGoosePopup() { 

    // Define the content of the popup
    var snowGoosePopup = `<div class='tooltip'><br></br><h2>Snow Goose</h2><p>Adult Snow Geese may appear mostly white with black wings, considered a white morph, whereas others, termed blue morphs, have a darker body with gray-blue hues across the body, black wings, and a white head. Originally the two morphs were considered as two species, but in 1972 they were combined into one species with a single gene controlling the color difference. They may be found in large flocks and are often seen in or near water or foraging on agricultural fields.</p><img src="img/Snow_Goose.jpeg" height= 200px; width= 275px><p> Range data is predicted for the following time periods: <br> Prebreeding migration: 1/18 - 5/31, Breeding: 6/7 - 8/3, Postbreeding migration: 8/17 - 12/21, Nonbreeding: 12/28 - 1/8</p>`
    "</div>";

    // Create a new popup object
    var snowGoose = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,
        className: "birdPopup",
        autoPan:false,
        maxWidth:310
    }).setContent(snowGoosePopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    snowGoose.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat + 0.6,lon:center.lng}));
    // Add the tooltip to the map
    snowGoose.addTo(map);
};

function createWoodDuckPopup() { 

    // Define the content of the popup
    var woodDuckPopup = `<div class='tooltip'><br></br><h2>Wood Duck</h2><p>The Wood Duck is a medium-sized waterfowl inhabiting most of Wisconsin. These birds display beautiful multicolored heads and bodies in males, while females are mostly a speckled brown color with a bit of blue under the wings. They can be found in shallow inland lakes, ponds, slow-moving rivers, and swamplands of deciduous and mixed forest regions. During the breeding season, male Wood Ducks perform courtship fanning, showing off their colorful plumage.</p><img src="img/Wood_duck.jpg" height= 200px; width= 275px><p> Range data is predicted for the following time periods: <br> Prebreeding migration: 1/18 - 5/31, Breeding: 6/7 - 8/3, Postbreeding migration: 8/17 - 12/21, Nonbreeding: 12/28 - 1/8</p>`
    "</div>";

    // Create a new popup object
    var woodDuck = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,
        className: "birdPopup",
        autoPan:false,
        maxWidth:310
    }).setContent(woodDuckPopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    woodDuck.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat + 0.5,lon:center.lng}));
    // Add the tooltip to the map
    woodDuck.addTo(map);
};

function createSapSuckerPopup() { 

    // Define the content of the popup
    var sapSuckerPopup = `<div class='tooltip'><br></br><h2>Yellow-bellied Sapsucker</h2><p>The Yellow-bellied Sapsucker is a small woodpecker common throughout Wisconsin. They prefer to reside in mixed forests with aspen trees, drilling into them in search of insects, grubs, or as the name suggests tree sap. They often drill holes into multiple trees at once, flying from tree to tree to collect sap as it slowly oozes out. They can be identified by their faint yellow bellies and red head/chin in males, whereas females are mostly brown with a little red on the top of their heads. .</p><img src="img/Yellow_bellied_Sapsucker.jpg" height= 200px; width= 275px><p> Range data is predicted for the following time periods: <br> Prebreeding migration: 1/18 - 5/31, Breeding: 6/7 - 8/3, Postbreeding migration: 8/17 - 12/21, Nonbreeding: 12/28 - 1/8</p>`
    "</div>";

    // Create a new popup object
    var sapSucker = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,
        className: "birdPopup",
        autoPan:false,
        maxWidth:310
    }).setContent(sapSuckerPopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    sapSucker.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat + 0.6,lon:center.lng}));
    // Add the tooltip to the map
    sapSucker.addTo(map);
}; 

function createGoldeneyePopup() { 

    // Define the content of the popup
    var goldeneyePopup = `<div class='tooltip'><br></br><h2>Common Goldeneye</h2><p>The Common Goldeneye is a small waterfowl that spends most of its time on forested lakes and rivers with clear water. They are identified by their characteristic gold eye that appears in both males and females, though males have a bright green head whereas females have a brown head. During their courtship exercises, the male throws his head as far back as possible, exhibiting a shrill call to impress females.</p><img src="img/goldeneye.webp" height= 200px; width= 275px><p> Range data is predicted for the following time periods: <br> Prebreeding migration: 1/18 - 5/31, Breeding: 6/7 - 8/3, Postbreeding migration: 8/17 - 12/21, Nonbreeding: 12/28 - 1/8</p>`
    "</div>";

    // Create a new popup object
    var commonGoldeneye = L.popup({
        direction: 'center',
        permanent: false,
        opacity: 1,
        interactive: true,
        sticky: true,
        className: "birdPopup",
        autoPan:false,
        maxWidth:310
    }).setContent(goldeneyePopup);

    // get the center of the map
    var center = map.getCenter();
    // set the coordinates for the tooltip
    commonGoldeneye.setLatLng(L.latLng({lat:map.getBounds()._southWest.lat + 0.6,lon:center.lng}));
    // Add the tooltip to the map
    commonGoldeneye.addTo(map);
};


//Create info button
function createInfoButton(){   
    var infoButton = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function () {
            // create the control container div
            var container = L.DomUtil.create('div', 'infoButton');
            
            //add info button
            container.insertAdjacentHTML('beforeend', '<button class="infoButton" id="info" title="Info">?</button>');

            L.DomEvent.disableClickPropagation(container); 

            return container;
        }
    });

    map.addControl(new infoButton());  

    document.getElementById("info").addEventListener("click", function openInfo(){
        console.log("hello")
        createTooltip(); 
    });
};

document.addEventListener('DOMContentLoaded',createMap);