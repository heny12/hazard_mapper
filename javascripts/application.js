  // ------------------------------------------------------------------------
  // Create the google map
  // ------------------------------------------------------------------------
   
    var MAX_ZOOM = 10;
    var MIN_ZOOM = 3;
    var INITIAL_ZOOM = 5;
    var MIN_YEAR_ERUPTIONS = d3.min(eruptions, function(d) { return +d.Year;});
    var MAX_YEAR_ERUPTIONS = d3.max(eruptions, function(d) { return +d.Year;});
    var MIN_YEAR_EARTHQUAKES = d3.min(earthquakes, function(d) { return +d.YEAR;});
    var MAX_YEAR_EARTHQUAKES = d3.max(earthquakes, function(d) { return +d.YEAR;});
    var ERUPTION_COLOR = '#FF0000';
    var EARTHQUAKE_COLOR = '#FF9900';
    var EARTHQUAKES = [];
    var ERUPTIONS = [];

    var map = new google.maps.Map(d3.select("#map").node(), {
      zoom: INITIAL_ZOOM,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    $.get("http://ipinfo.io", function(response) {
        if(response.loc){
          coord = response.loc.split(",");
          center = new google.maps.LatLng(coord[0],coord[1]);
          map.panTo(center);
        }else{ // if it doesnt work, pan to seattle of course
          map.panTo(new google.maps.LatLng(47.6097, -122.3331));
        }
    }, "jsonp");

     // Limit the zoom level
     google.maps.event.addListener(map, 'zoom_changed', function() {
       if (map.getZoom() < MIN_ZOOM) map.setZoom(MIN_ZOOM);
       if (map.getZoom() > MAX_ZOOM) map.setZoom(MAX_ZOOM);
     });

    // Add our KML boundaries
    var kmzLayer = new google.maps.KmlLayer({
      url: 'http://earthquake.usgs.gov/learn/plate-boundaries.kmz',
      map: map,
      preserveViewport: true
    });

  // ------------------------------------------------------------------------
  // Scales
  // ------------------------------------------------------------------------
    
    var eruption_sizes = [3,4,6,8,12,23,45,80];
    var earthquake_sizes = [3,3.2,3.5,3.9,4.4,4.9,5.5,6.2,7,8,10,30,65,100];

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
      return eruption_sizes[i] * zoomSize(map.getZoom()) * 5000;
    }

    function earthquake_size(i){
      return earthquake_sizes[i]* zoomSize(map.getZoom()) * 3000;
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
            .domain([MIN_YEAR_ERUPTIONS,new Date().getFullYear()+1])
            .range([0,600]);

  // ------------------------------------------------------------------------
  // Handles zoom on the map
  // ------------------------------------------------------------------------      

  map.addListener('zoom_changed', function() {
    var zoomLevel = map.getZoom();

    // TODO - need to find a way of semantically zooming on these markers

    console.log(EARTHQUAKES);
    // for (var earthquake in EARTHQUAKES) {
    //   var eq = EARTHQUAKES[earthquake];
    //     eq.setOptions({});
    // //   // eq.strokeOpacity = marker_border_opacity();
    // //   // eq.fillOpacity = marker_opacity();
    // //   // eq.radius = earthquake_size(EARTHQUAKES[earthquake].INTENSITY);
    // }

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
      radius: eruption_size(eruptions[eruption].VEI)
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
      strokeOpacity: marker_border_opacity,
      strokeWeight: 2,
      fillColor: EARTHQUAKE_COLOR,
      fillOpacity: marker_opacity(),
      map: map,
      center: coordinates,
      radius: earthquake_size(earthquakes[earthquake].INTENSITY)
    });
    EARTHQUAKES.push(earthquakeCircle);
  }

  // ------------------------------------------------------------------------
  // Items for tooltip
  // ------------------------------------------------------------------------

    var tip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    function eruptionHtml(d) {
      var box = "<p>Name: " + d.Name + "</p><p>Type: " + d.Type + 
      "</p><p>Erupted on " + d.Month + "/" + d.Day + "/" + d.Year + 
      "</p><p>VEI: " + d.VEI + "</p>"
      return box;
    }

    function earthquakeHtml(d) {
      var box = "<p>Location: " + d.LOCATION_NAME + "</p><p>Focal Depth: " + d.FOCAL_DEPTH + 
      "</p><p>Occured on " + d.MONTH + "/" + d.DAY + "/" + d.YEAR + 
      "</p><p>Magnitude: " + d.INTENSITY + "</p>"
      return box;
    }

  // ------------------------------------------------------------------------
  // Items for timeline
  // ------------------------------------------------------------------------

    $(function() {
      $( "#slider" ).slider({
        range: true,
        min: MIN_YEAR_ERUPTIONS,
        max: new Date().getFullYear()+1,
        values: [ MIN_YEAR_ERUPTIONS, new Date().getFullYear()+1 ],
        slide: function( event, ui ) {
          var lo = ui.values[ 0 ];
          var hi = ui.values[ 1 ];
          $( "#amount" ).val(lo+" - "+hi);
          // var eruptions = changeData(lo,hi);
          // $('#eruption_count').html(eruptions);
        }
      });
      $( "#slider-range").css('width', 600)
      $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 )+" - "+$( "#slider-range" ).slider( "values", 1 ) );
    });

    var scaleSvg = d3.select("#slide").append("svg")
                     .attr("width", '600')
                     .attr("height", '20');
    var axis = d3.svg.axis()
                 .scale(axisScale)
                 .tickFormat(d3.format("d"))
                 .ticks(10);
    var axisGroup = scaleSvg.append("g")
                            .call(axis);

    // $('#eruption_count').html(dataset.length);

    // function changeData(lo, hi) {
    //   //console.log(lo+' - '+hi);
    //   hide = $('.volcano').filter(function(){
    //     return  ($(this).attr("year") < lo || $(this).attr("year") > hi);
    //   })
    //   show = $('.volcano').filter(function(){
    //     return  ($(this).attr("year") >= lo && $(this).attr("year") <= hi);
    //   })
    //   console.log("show:" + show.length + "   hide:" + hide.length);
    //   $(show).show();
    //   $(hide).hide();
    //   return show.length;
    // }




// var xScale = d3.time.scale()
//     .range([0, width]),

//     xScale2 = d3.time.scale()
//     .range([0, width]); // Duplicate xScale for brushing ref later

// var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient("bottom"),

//     xAxis2 = d3.svg.axis() // xAxis for brush slider
//     .scale(xScale2)
//     .orient("bottom");    


//   var timelinesvg = d3.select("#timeline").append("svg")
//       .attr('width', 600)
//       .attr('height', 40)
//     .append("g")
//       .attr("transform","translate(0,0)");

//   var context = timelinesvg.append("g") // Brushing context box containter
//       .attr('transform','translate(0,0)')
//       .attr('class','context');

//   //append clip path for lines plotted, hiding those part out of bounds
//   timelinesvg.append("defs")
//     .append("clipPath") 
//       .attr("id", "clip")
//       .append("rect")
//       .attr("width", width)
//       .attr("height", height); 

//  var brush = d3.svg.brush() //for slider bar at the bottom
//     .x(xScale2) 
//     .on("brush", brushed);

//   context.append("g") // Create brushing xAxis
//       .attr("class", "x axis1")
//       .attr("transform", "translate(0,0)")
//       .call(xAxis2);

//   var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
//     .interpolate("monotone")
//     .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
//     .y0(40) // Bottom line begins at height2 (area chart not inverted) 
//     .y1(0); // Top line of area, 0 (area chart not inverted)

//   //plot the rect as the bar at the bottom
//   context.append("path") // Path is created using svg.area details
//     .attr("class", "area")
//     .attr("d", contextArea(40)) // pass first categories data .values to area path generator 
//     .attr("fill", "#F1F1F2");
    
//   //append the brush for the selection of subsection  
//   context.append("g")
//     .attr("class", "x brush")
//     .call(brush)
//     .selectAll("rect")
//     .attr("height", 40) // Make brush rects same height 
//       .attr("fill", "#E6E7E8");  



//   //for brusher of the slider bar at the bottom
//   function brushed() {

//     xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent 

//     timelinesvg.select(".x.axis") // replot xAxis with transition when brush used
//           .transition()
//           .call(xAxis);
    
//   }; 
