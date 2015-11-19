// ------------------------------------------------------------------------
// Global variables
// ------------------------------------------------------------------------

    var MAX_ZOOM = 10;    // maximum zoom level on google map
    var MIN_ZOOM = 3;     // minimum zoom level on google map
    var INITIAL_ZOOM = 5; // initial zoom level on google map when page is loaded

    var MIN_YEAR_ERUPTIONS = d3.min(eruptions, function(d) { return +d.Year;});     // earliest year in which there was an eruption
    var MAX_YEAR_ERUPTIONS = d3.max(eruptions, function(d) { return +d.Year;});     // last year in which there was an eruption, presumably the current year
    var MIN_YEAR_EARTHQUAKES = d3.min(earthquakes, function(d) { return +d.YEAR;}); // earliest year in which there was an earthquake
    var MAX_YEAR_EARTHQUAKES = d3.max(earthquakes, function(d) { return +d.YEAR;}); // last year in which there was an earthquake, presumably the current year
    var NEXT_YEAR = new Date().getFullYear()+1;  // year after the current year

    var TIMELINE_HI = NEXT_YEAR;                 // current high value on the timeline selector
    var TIMELINE_LO = MIN_YEAR_ERUPTIONS;        // current low value on the timeline selector
    var SHOW_ERUPTIONS = true;                   // whether we wish to show eruptions on the map or not
    var SHOW_EARTHQUAKES = true;                 // whether we wish to show earthquakes on the map or not
    var ERUPTION_COUNT = eruptions.length;       // count of eruptions plotted on the map
    var EARTHQUAKE_COUNT = earthquakes.length;   // count of earthquakes plotted on the map
    var TIMER;                                   // timer used for delaying queries until the user is done sliding the timeline

    var ERUPTION_COLOR = '#b30000';    // color for the eruption markers on the map
    var EARTHQUAKE_COLOR = '#cca300';  // color for the earthquake markers on the map

    var EARTHQUAKES = [];   // array to store earthquake marker references
    var ERUPTIONS = [];     // array to store eruption marker references
    var INFO_WINDOW = '';   // text do display in the info window


// ------------------------------------------------------------------------
// Create the google map
// ------------------------------------------------------------------------


    // initializes google map into map container
    var map = new google.maps.Map(d3.select("#map").node(), {
      zoom: INITIAL_ZOOM,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,  // dont display the google map ui things, they just get in the way
      // scrollwheel: false
    });


    // when called this function will center the map on the location of the users ip address,
    function centerMap(){
      // gets location from this address TODO - maybe find a better way to get location
      $.get("http://ipinfo.io", function(response) {
          if(response.loc){
            coord = response.loc.split(",");
            center = new google.maps.LatLng(coord[0],coord[1]);
            map.panTo(center);
          }else{ // if it doesnt work, pan to seattle of course
            map.panTo(new google.maps.LatLng(47.6097, -122.3331));
          }
      }, "jsonp");
    };
    centerMap();


     // Limits the zoom level of the map
     google.maps.event.addListener(map, 'zoom_changed', function() {
       if (map.getZoom() < MIN_ZOOM) map.setZoom(MIN_ZOOM);
       if (map.getZoom() > MAX_ZOOM) map.setZoom(MAX_ZOOM);
     });


    // Add our KML boundaries
    var kmzLayer = new google.maps.KmlLayer({
      // this layer is probably meant for google earth and displays wierd horizontal bars, TODO - fix or find better layer
      url: 'http://earthquake.usgs.gov/learn/plate-boundaries.kmz',
      map: map,
      preserveViewport: true,
      suppressInfoWindows: false
    });

// ------------------------------------------------------------------------
// Scales
// ------------------------------------------------------------------------
  
    var eruption_sizes = [2.5,3,4,6,10,20,50,120];  // relative radii sizes for veis 0-8
    var earthquake_sizes = [3,3.2,3.4,3.6,4,6,7,9,11,15,25,50,90,150]; // relative radii sizes for magnitudes 0-12

    // scale used to change marker sizes at different levels of zoom
    var zoomSize = d3.scale.pow()
            .domain([3,10])
            .range([1,6]);
    // scale used to change marker opacities at different levels of zoom
    var zoomOpacity = d3.scale.linear()
            .domain([3,10])
            .range([0.25,0.4]);
    // scale used to change marker border opacities at different levels of zoom        
    var zoomBorderOpacity = d3.scale.linear()
            .domain([3,10])
            .range([0.15,0.05]);


    // calculates radius of eruption marker
    function eruption_size(i){
      return eruption_sizes[i] * zoomSize(map.getZoom()) * 4000;
    }


    // calculates radius of earthquake marker
    function earthquake_size(i){
      return earthquake_sizes[i]* zoomSize(map.getZoom()) * 2000;
    }


    // calculates opacity of marker
    function marker_opacity(){
      return zoomOpacity[map.getZoom()];
    }


    // calculates opacity of marker border
    function marker_border_opacity(){
      return zoomBorderOpacity[map.getZoom()];
    }

    // forget why i have these
    var width = 960,
        height = 500;

    // scale used for timeline
    var axisScale = d3.scale.linear()
            .domain([MIN_YEAR_ERUPTIONS,NEXT_YEAR])
            .range([0,900]);

// ------------------------------------------------------------------------
// Handles zoom on the map
// ------------------------------------------------------------------------      

    // // makes changes to markers when zoomed in or out on map
    // map.addListener('zoom_changed', function() {
    //   var zoomLevel = map.getZoom();

    //   // TODO - need to find a way of semantically zooming on these markers

    //   for (var i in EARTHQUAKES) {
    //     var earthquake = EARTHQUAKES[i];
    //     console.log(earthquake);
    //     earthquake.setRadius(1000);
    //   //   // eq.strokeOpacity = marker_border_opacity();
    //   //   // eq.fillOpacity = marker_opacity();
    //   //   // eq.radius = earthquake_size(EARTHQUAKES[earthquake].INTENSITY);
    //   }

    //   // for (var eruption in ERUPTIONS) {
    //   //   var er = ERUPTIONS[eruption];
    //   //   er.strokeOpacity = marker_border_opacity();
    //   //   er.fillOpacity = marker_opacity();
    //   //   er.radius = eruption_size(ERUPTIONS[eruption].VEI);
    //   // }

    // });


// ------------------------------------------------------------------------
// Overlay for eruptions
// ------------------------------------------------------------------------

    
    // For each eruption record that we have, lets create a marker on the map
    for (var eruption in eruptions) {
      addEruption(eruption);
    }


    // Adds a circle marker to the google map with attributes based on its data
    function addEruption(eruption) {
      var eruptionCircle = new google.maps.Circle({
        class: 'marker eruption',
        strokeColor: ERUPTION_COLOR,
        strokeOpacity: marker_border_opacity(),
        strokeWeight: 1,
        fillColor: ERUPTION_COLOR,
        fillOpacity: marker_opacity(),
        map: map,
        center: new google.maps.LatLng(eruptions[eruption].Latitude, eruptions[eruption].Longitude),
        radius: eruption_size(eruptions[eruption].VEI),
        data: eruptions[eruption],
        html: eruptionHtml(eruptions[eruption])
      });


      // Adds a listener that will show an info window for the marker when clicked
      eruptionCircle.addListener('click', function(event) {
        infowindow.setContent(this.html);
        infowindow.setPosition(event.latLng);
        infowindow.open(map, this);
      });


      // When we hover over a marker, lets make it more opaque 
      eruptionCircle.addListener('mouseover', function(event) {
        this.setOptions({fillOpacity: 0.9});
      }); 


      // return the marker to normal opacity when we are no longer hovering over it
      eruptionCircle.addListener('mouseout', function(event) {
        this.setOptions({fillOpacity: marker_opacity()});
      });


      // Add reference to each marker ot an array for later use
      ERUPTIONS.push(eruptionCircle);  
    }

// ------------------------------------------------------------------------
// Overlay for earthquakes
// ------------------------------------------------------------------------

    
    // For each earthquake record that we have, lets create a marker on the map
    for (var earthquake in earthquakes) {
      addEarthquake(earthquake);
    }


    // Adds a circle marker to the google map with attributes based on its data
    function addEarthquake(earthquake) {
      var earthquakeCircle = new google.maps.Circle({
        class: 'marker earthquake',
        strokeColor: EARTHQUAKE_COLOR,
        strokeOpacity: marker_border_opacity(),
        strokeWeight: 1,
        fillColor: EARTHQUAKE_COLOR,
        fillOpacity: marker_opacity(),
        map: map,
        center: new google.maps.LatLng(earthquakes[earthquake].LATITUDE, earthquakes[earthquake].LONGITUDE),
        radius: earthquake_size(earthquakes[earthquake].INTENSITY),
        show: true,
        data: earthquakes[earthquake],
        html: earthquakeHtml(earthquakes[earthquake])
      });


      // Adds a listener that will show an info window for the marker when clicked
      earthquakeCircle.addListener('click', function(event) {
        infowindow.setContent(this.html);
        infowindow.setPosition(event.latLng);
        infowindow.open(map, this);
      });   


      // When we hover over a marker, lets make it more opaque 
      earthquakeCircle.addListener('mouseover', function(event) {
        this.setOptions({fillOpacity: 0.9});
      }); 


      // return the marker to normal opacity when we are no longer hovering over it
      earthquakeCircle.addListener('mouseout', function(event) {
        this.setOptions({fillOpacity: marker_opacity()});
      });          


      // Add reference to each marker ot an array for later use
      EARTHQUAKES.push(earthquakeCircle);
    }

// ------------------------------------------------------------------------
// Items for tooltip
// ------------------------------------------------------------------------

    // Google info window that take html from our global variable
    var infowindow = new google.maps.InfoWindow({
      content: INFO_WINDOW
    });


    // generates html for info window for an eruption marker
    // TODO gather more data to show user
    function eruptionHtml(d) {
      var box = "<h2>Eruption</h2>" +
      "<p>Name: " + d.Name + "</p><p>Type: " + d.Type + 
      "</p><p>Erupted on " + d.Month + "/" + d.Day + "/" + d.Year + 
      "</p><p>VEI: " + d.VEI + "</p>"
      return box;
    }

    // generates html for info windo for an earthquake marker
    // TODO gather more data to show user
    function earthquakeHtml(d) {
      var box = "<h2>Earthquake</h2>" +
      "<p>Location: " + d.LOCATION_NAME + "</p><p>Focal Depth: " + d.FOCAL_DEPTH + 
      " km</p><p>Occured on " + d.MONTH + "/" + d.DAY + "/" + d.YEAR + 
      "</p><p>Magnitude: " + d.INTENSITY + "</p>"
      return box;
    }

// ------------------------------------------------------------------------
// Items for timeline
// ------------------------------------------------------------------------


    // Jquery ui slider that ranges from our lowest year to next year
    $(function() {
        $( "#slider-range" ).slider({
          range: true,
          min: MIN_YEAR_ERUPTIONS,
          max: NEXT_YEAR,
          values: [ MIN_YEAR_ERUPTIONS, NEXT_YEAR ],
          slide: function( event, ui ) {
            TIMELINE_LO = ui.values[ 0 ]; // sets the current low year
            TIMELINE_HI = ui.values[ 1 ]; // sets the current high year
            clearTimeout(TIMER);
            var loading = $('body').append('<img src="icons/loader.gif" id="loading" class="centered"></img>'); // show loading icon while we wait
            // we want to use a timer here because otherwise the adjust_visible function would be call a bunch
            // of times while the slider is being slid. This waits for .3 seconds of inactivity of the slider
            // assuming that the user is done adjusting the date
            TIMER = setTimeout(function(){ adjust_visible(); }, 300);
          }
        });
        $( "#slider-range").css('width', '900');
      });

      var scaleSvg = d3.select("#slide").append("svg")
                       .attr("width", "900")
                       .attr("height", "20")
                       .attr("overflow", "visible");
      var axis = d3.svg.axis()
                   .scale(axisScale)
                   .tickFormat(d3.format("d"))
                   .ticks(20);
      var axisGroup = scaleSvg.append("g")
                              .attr("class","tick")
                              .call(axis);


// ------------------------------------------------------------------------
// Controls Items
// ------------------------------------------------------------------------

  $('#find-me').on('click',function(){
    centerMap();
  })


  $("#eruption-checkbox").on('click',function(){
    var loading = $('body').append('<img src="icons/loader.gif" id="loading" class="centered"></img>');
    SHOW_ERUPTIONS = $("#eruption-checkbox").is(':checked')
    adjust_visible();
  })

  $("#earthquake-checkbox").on('click',function(){
    var loading = $('body').append('<img src="icons/loader.gif" id="loading" class="centered"></img>');
    SHOW_EARTHQUAKES = $("#earthquake-checkbox").is(':checked')
    adjust_visible();
  })  

// ------------------------------------------------------------------------
// Function to adjust the visible markers on the map
// ------------------------------------------------------------------------

  // TODO - if we show/hide with jquery rather than set the google map visibility that may improve performance
  function adjust_visible() {
    ERUPTION_COUNT = ERUPTIONS.length;
    EARTHQUAKE_COUNT = EARTHQUAKES.length;

    for(i in ERUPTIONS){
      eruption = ERUPTIONS[i];

      if(!SHOW_ERUPTIONS || eruption.data.Year < TIMELINE_LO || TIMELINE_HI < eruption.data.Year){
        eruption.setVisible(false);
        ERUPTION_COUNT--;
      }else{
        eruption.setVisible(true)
      }
    }

    for(i in EARTHQUAKES){
      earthquake = EARTHQUAKES[i];

      if(!SHOW_EARTHQUAKES || earthquake.data.YEAR < TIMELINE_LO || TIMELINE_HI < earthquake.data.YEAR){
        earthquake.setVisible(false);
        EARTHQUAKE_COUNT--;
      }else{
        earthquake.setVisible(true)
      }
    }

    updateSubtitle();
    $('body').find('.centered').remove();
  }

// ------------------------------------------------------------------------
// Miscilaneous helpers
// ------------------------------------------------------------------------

  // used to update the subtitle of the page with information about what data is being shown
  function updateSubtitle(){
    $('#eruption-count').text(ERUPTION_COUNT);
    $('#earthquake-count').text(EARTHQUAKE_COUNT);
    $('#year-lo').text(TIMELINE_LO);
    $('#year-hi').text(TIMELINE_HI);
  };
  updateSubtitle();
  
