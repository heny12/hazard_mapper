// ------------------------------------------------------------------------
// Global variables
// ------------------------------------------------------------------------

    var MAX_ZOOM = 10;
    var MIN_ZOOM = 3;
    var INITIAL_ZOOM = 5;

    var MIN_YEAR_ERUPTIONS = d3.min(eruptions, function(d) { return +d.Year;});
    var MAX_YEAR_ERUPTIONS = d3.max(eruptions, function(d) { return +d.Year;});
    var MIN_YEAR_EARTHQUAKES = d3.min(earthquakes, function(d) { return +d.YEAR;});
    var MAX_YEAR_EARTHQUAKES = d3.max(earthquakes, function(d) { return +d.YEAR;});
    var NEXT_YEAR = new Date().getFullYear()+1;

    var TIMELINE_HI = NEXT_YEAR;
    var TIMELINE_LO = MIN_YEAR_ERUPTIONS;
    var SHOW_ERUPTIONS = true;
    var SHOW_EARTHQUAKES = true;
    var ERUPTION_COUNT = 0;
    var EARTHQUAKE_COUNT = 0;
    var TIMER;

    var ERUPTION_COLOR = '#FF0000';
    var EARTHQUAKE_COLOR = '#FF9900';

    var EARTHQUAKES = [];
    var ERUPTIONS = [];
    var INFO_WINDOW = '';


// ------------------------------------------------------------------------
// Create the google map
// ------------------------------------------------------------------------

    var map = new google.maps.Map(d3.select("#map").node(), {
      zoom: INITIAL_ZOOM,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true
    });

    function centerMap(){
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

     // Limit the zoom level
     google.maps.event.addListener(map, 'zoom_changed', function() {
       if (map.getZoom() < MIN_ZOOM) map.setZoom(MIN_ZOOM);
       if (map.getZoom() > MAX_ZOOM) map.setZoom(MAX_ZOOM);
     });

    // Add our KML boundaries
    var kmzLayer = new google.maps.KmlLayer({
      url: 'http://earthquake.usgs.gov/learn/plate-boundaries.kmz',
      map: map,
      preserveViewport: true,
      suppressInfoWindows: false
    });

// ------------------------------------------------------------------------
// Scales
// ------------------------------------------------------------------------
  
    var eruption_sizes = [2.5,3,4,6,10,20,50,120];
    var earthquake_sizes = [3,3.2,3.4,3.6,4,6,7,9,11,15,25,50,90,150];

    var zoomSize = d3.scale.pow()
            .domain([3,10])
            .range([1,6]);
    var zoomOpacity = d3.scale.linear()
            .domain([3,10])
            .range([0.25,0.4]);
    var zoomBorderOpacity = d3.scale.linear()
            .domain([3,10])
            .range([0.15,0.05]);


    function eruption_size(i){
      return eruption_sizes[i] * zoomSize(map.getZoom()) * 4000;
    }

    function earthquake_size(i){
      return earthquake_sizes[i]* zoomSize(map.getZoom()) * 2000;
    }

    function marker_opacity(){
      return zoomOpacity[map.getZoom()];
    }

    function marker_border_opacity(){
      return zoomBorderOpacity[map.getZoom()];
    }

    var width = 960,
        height = 500;

    var axisScale = d3.scale.linear()
            .domain([MIN_YEAR_ERUPTIONS,NEXT_YEAR])
            .range([0,900]);

// ------------------------------------------------------------------------
// Handles zoom on the map
// ------------------------------------------------------------------------      

    map.addListener('zoom_changed', function() {
      var zoomLevel = map.getZoom();

      // TODO - need to find a way of semantically zooming on these markers

      for (var i in EARTHQUAKES) {
        var earthquake = EARTHQUAKES[i];
        console.log(earthquake);
        earthquake.setOptions({radius:100});
      //   // eq.strokeOpacity = marker_border_opacity();
      //   // eq.fillOpacity = marker_opacity();
      //   // eq.radius = earthquake_size(EARTHQUAKES[earthquake].INTENSITY);
      }

      // for (var eruption in ERUPTIONS) {
      //   var er = ERUPTIONS[eruption];
      //   er.strokeOpacity = marker_border_opacity();
      //   er.fillOpacity = marker_opacity();
      //   er.radius = eruption_size(ERUPTIONS[eruption].VEI);
      // }

    });


// ------------------------------------------------------------------------
// Overlay for eruptions
// ------------------------------------------------------------------------

    for (var eruption in eruptions) {
      addEruption(eruption);
    }

    function addEruption(eruption) {
      var coordinates = new google.maps.LatLng(eruptions[eruption].Latitude, eruptions[eruption].Longitude);
      var eruptionCircle = new google.maps.Circle({
        class: 'marker eruption',
        strokeColor: ERUPTION_COLOR,
        strokeOpacity: marker_border_opacity(),
        strokeWeight: 2,
        fillColor: ERUPTION_COLOR,
        fillOpacity: marker_opacity(),
        map: map,
        center: coordinates,
        radius: eruption_size(eruptions[eruption].VEI),
        data: eruptions[eruption],
        html: eruptionHtml(eruptions[eruption])
      });

      eruptionCircle.addListener('click', function(event) {
        infowindow.setContent(this.html);
        infowindow.setPosition(event.latLng);
        infowindow.open(map, this);
      });

      eruptionCircle.addListener('mouseover', function(event) {
        this.setOptions({fillOpacity: 0.9});
      }); 

      eruptionCircle.addListener('mouseout', function(event) {
        this.setOptions({fillOpacity: marker_opacity()});
      });

      ERUPTIONS.push(eruptionCircle);  
    }

// ------------------------------------------------------------------------
// Overlay for earthquakes
// ------------------------------------------------------------------------

    for (var earthquake in earthquakes) {
      var coordinates = new google.maps.LatLng(earthquakes[earthquake].LATITUDE, earthquakes[earthquake].LONGITUDE);
      var earthquakeCircle = new google.maps.Circle({
        class: 'marker earthquake',
        strokeColor: EARTHQUAKE_COLOR,
        strokeOpacity: marker_border_opacity(),
        strokeWeight: 2,
        fillColor: EARTHQUAKE_COLOR,
        fillOpacity: marker_opacity(),
        map: map,
        center: coordinates,
        radius: earthquake_size(earthquakes[earthquake].INTENSITY),
        show: true,
        data: earthquakes[earthquake],
        html: earthquakeHtml(earthquakes[earthquake])
      });

      earthquakeCircle.addListener('click', function(event) {
        infowindow.setContent(this.html);
        infowindow.setPosition(event.latLng);
        infowindow.open(map, this);
      });   

      earthquakeCircle.addListener('mouseover', function(event) {
        this.setOptions({fillOpacity: 0.9});
      }); 

      earthquakeCircle.addListener('mouseout', function(event) {
        this.setOptions({fillOpacity: marker_opacity()});
      });          

      EARTHQUAKES.push(earthquakeCircle);
    }

// ------------------------------------------------------------------------
// Items for tooltip
// ------------------------------------------------------------------------

    var infowindow = new google.maps.InfoWindow({
      content: INFO_WINDOW
    });

    function eruptionHtml(d) {
      var box = "<h2>Eruption</h2>" +
      "<p>Name: " + d.Name + "</p><p>Type: " + d.Type + 
      "</p><p>Erupted on " + d.Month + "/" + d.Day + "/" + d.Year + 
      "</p><p>VEI: " + d.VEI + "</p>"
      return box;
    }

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

    $(function() {
        $( "#slider-range" ).slider({
          range: true,
          min: MIN_YEAR_ERUPTIONS,
          max: NEXT_YEAR,
          values: [ MIN_YEAR_ERUPTIONS, NEXT_YEAR ],
          slide: function( event, ui ) {
            TIMELINE_LO = ui.values[ 0 ];
            TIMELINE_HI = ui.values[ 1 ];
            clearTimeout(TIMER);
            var loading = $('body').append('<img src="icons/loader.gif" id="loading" class="centered"></img>');
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

  function updateSubtitle(){
    $('#eruption-count').text(ERUPTION_COUNT);
    $('#earthquake-count').text(EARTHQUAKE_COUNT);
    $('#year-lo').text(TIMELINE_LO);
    $('#year-hi').text(TIMELINE_HI);
  };
  
