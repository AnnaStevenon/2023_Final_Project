# Ice Age Trail Bird Map

### Team Members
1. Anna Stevenson
2. Nolan Niedermeyer
3. Noah Sticha

### Final Proposal
1. Persona/Scenario
    1. Persona

        The user considers themselves as a birder, they love to hike with a pair of binoculars, a camera, and watch for birds. They recently moved to Wisconsin and have heard from some new friends that the Ice Age Trail weaves through Wisconsin and provides hikes of different lengths and with various views as the ecosystems fluctuate across the state. They decided that hiking segments of the trail would be a great way to spend weekends and explore the bird species of their new home state. Their **goals** are to find and photograph birds along the segments of trail. They would like a single interface which shows them which areas to hike based on the bird distribution **patterns** along the trail and across WI both spatially and temporally. They would like to **identify** segments of the trail that overlap with predicted seasonal bird range for bird species they are interested in. 

    2. Scenario

        Upon arriving at the interactive map the user is met with a popup that introduces the user to the Ice Age Trail’s Bird map. There is a short description introducing the map and a link to learn more about the Ice Age Trail and each unique segment. They exit the popup to enter the map and see an overview map of Wisconsin with the Ice Age Trail. On the left hand side they see a search bar and menu that allows them to search for a specific bird species and to see what birds are included on the map. They select tundra swan and and several polygons showing the range of the tundra swan appear. They see that each polygon layer corresponds to a different seasonal range (i.e., breeding, non-breeding, migration, etc.). They can use the legend to **compare** the range **patterns** of the swan during different times of the year. They can also use the legend to **filter** a specific time period. They see that a certain segment has a Tundra swan migration range around it so they zoom in to **identify** it. They click the segment and a popup opens with the segment name and the length of the segment. They click a box on the legend to overlay a layer of parking and camping locations. They return to the overview and look for the next species they are interested in. They use this iterative process to find segments with **clusters** of birds they are interested in and this helps them plan future hiking trips.

2. Requirements Document

    1. Representation

        | Layer | Description of source and proposed symbolization |
        | --------- | ---------- |
        | Base Map| Leaflet tiles, outline of Wisconsin with terrain/satellite. |
        | Ice Age Trail | Offical layer from ArcOnline, lines showing all segments - not including connected routes. |
        | Parking | ArcOnline, P symbols - can overlay from legend but intially turned off. |
        | Camp sites | ArcOnline, little tent symbols - can overlay from legend but intially turned off. |
        | eBird ranges | Cornell eBird range prediction polygons (aiming for 20 species), each species has 1 to 4 polygons based on temporal distribution, color coded by temporal category, semi opaque. |


    2. Interactions

        | Title of function | Coding by operator and operand and description of proposed interaction behavior and UI design|
        | ------------------ | --------------------------------------- |
        | Introduction window | Retrieve: map description and instructions, link to official site, button to enter map.|
        | Search / menu panel | Search: bird species, smart search and accordian menu to show options.|
        | Apply bird selection | Overlay and retrieve: bird range and bio. Left panel opens with photos and information on the bird, ranges are shown as polygons on the map with updated legend for temporal ranges.|
        | Slider legend | Filter: temporal filter to look at temporal categories for each bird species. |
        | Legend | Overlay: parking, bird species temporal layers. Turn off and on parking and species layer for time periods. |
        | Hike segments | Identify and retrieve: segment name and details. Popup for name, length and pictures for some notable segments. |
        | Zoom and pan | Zoom and pan : across map and allow users to investivated detials of segments of interest using basemap terrain. |
        | Return to overview | Overlay : return to full map of WI with just trail layer shown. |


3. Wireframes
    1. ![Wireframe 1](/img/WireFrame_1.png)
    2. ![Wireframe 2](/img/WireFrame_2.png)
    3. ![Wireframe 3](/img/WireFrame_3.png)
    4. ![Wireframe 4](/img/WireFrame_4.png)
 
