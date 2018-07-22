mapboxgl.accessToken = 'pk.eyJ1IjoiYmlsbGJyb2QiLCJhIjoiY2o5N21wOWV5MDFlYjJ5bGd4aW9jZWwxNiJ9.LpT502DJ1ruuPRLp3AW_ow';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9?optimize=true',
  center: [-73.9978, 40.7209],
  zoom: 10,
  legendControl: {
    position: 'bottomright'
  },
  minZoom: 10,
  maxZoom: 13
});

var overlay = document.getElementById('map-overlay-info');

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-left');
map.on('load', function () {
  // add a source layer and default styling for a single point.
  map.addSource('single-point', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": []
    }
  });

  // display marker for geocoder, this is a symbol (marker-15)
  map.addLayer({
    "id": "point",
    "source": "single-point",
    "type": "symbol",
    "layout": {
      "icon-image": "marker-15",
      "icon-allow-overlap": true,
      "icon-size":1.5,
    }
  });


  map.moveLayer("water", "road-trunk")

  map.addSource('vector_data', {
    type: 'vector',
    url: 'mapbox://billbrod.7693fb16'
  })

  // from
  // https://github.com/mapbox/mapbox-gl-js/issues/5040#issuecomment-321688603;
  // apparently duplicating the source to have a separate
  // source for the hover effect improves performance. not
  // sure why that works, but whatever
  map.addSource('vector_data-hover', {
    type: 'vector',
    url: 'mapbox://billbrod.7693fb16'
  })

  // Code which adds a background pattern
  // - don't use this without a custom sprite sheet or it looks awkward
  // WIP- maija, need really tiny custom sprite (dashed lines - make with SVG!)
  // map.addLayer({
  //	"id": "BKG",
  //	"type": "background",
  //	"paint":{
  //	"background-pattern": "triangle-11"
  //	}
  //  },'water','Zoning')



  map.addLayer({
    "id": "Zoning",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": 'nyzd',
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': 'human_readable_zone',
        'type': 'categorical',
        "stops": [
          ['Residential', '#80b1d3'],
          ['New York City Parks', '#b3de69'],
          ['Manufacturing', '#fb8072'],
          ['Commercial', '#fdb462'],
          ['Mixed manufacturing and residential', '#bebada'],
          ['Battery Park City', '#ffffb3']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Hurricane Storm Surge Zones",
    "type": "fill",
    "source": "vector_data",
    "source-layer": 'storm_surge_min',
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': 'CATEGORY',
        'type': 'categorical',
        "stops": [
          [1, '#d7301f'],
          [2, '#fc8d59'],
          [3, '#fdcc8a'],
          [4, '#fef0d9']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Percent People of Color",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": "reduced_census",
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 1,
      "fill-color": {
        'property': 'Perc_POC_P003009',
        'type': 'interval',
        'stops': [
          [-10, 'rgba(0, 0, 0, 0)'],
          [0, '#feebe2'],
          [21, '#fbb4b9'],
          [41, '#f768a1'],
          [66, '#c51b8a'],
          [91, '#7a0177']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Median Household Income",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": "reduced_census",
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': 'Median Household Income',
        'type': 'interval',
        'stops': [
          [-10, 'rgba(0, 0, 0, 0)'],
          [0, '#006837'],
          [18001, '#31a354'],
          [39301, '#78c679'],
          [52301, '#addd8e'],
          [67601, '#d9f0a3'],
          [115301, '#ffffcc']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Percent of Families Below Poverty Line",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": "reduced_census",
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': '% of Families Below Poverty Level',
        'type': 'interval',
        'stops': [
          [-10, 'rgba(0, 0, 0, 0)'],
          [0, '#fee5d9'],
          [21, '#fcae91'],
          [36, '#fb6a4a'],
          [51, '#de2d26'],
          [66, '#a50f15']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Bulk Storage Sites",
    "type": "symbol",
    "source": "vector_data",
    "source-layer": 'TRI_converted',
    "layout": {
      "icon-image": "fuel-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      //"icon-size":10,
    }
  });

  map.addLayer({
    "id": "MOSF",
    "type": "symbol",
    "source": {
      type: 'geojson',
      data: './Data/MOSF_converted.json'
    },
    "layout": {
      "icon-image": "rocket-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      //"icon-size":10,
    }
  });

  map.addLayer({
    "id": "CBS",
    "type": "symbol",
    "source": {
      type: 'geojson',
      data: './Data/CBS_converted.json'
    },
    "layout": {
      "icon-image": "fire-station-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      //"icon-size":10,
    }
  });

  map.addLayer({
    "id": "SUPERFUND2",
    "type": "symbol",
    "source": {
      type: 'geojson',
      data: './Data/SUPERFUND2_converted.json'
    },
    "layout": {
      "icon-image": "volcano-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      //"icon-size":10,
    }
  });


  map.addLayer({
    "id": "SMIA",
    "type": "line",
    "source": "vector_data",
    "source-layer": 'smia',
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#000000",
      "line-width": 3
    }
  },'Bulk Storage Sites');

  map.addLayer({
    "id": "SMIA-buffer",
    "type": "line",
    "source": "vector_data",
    "source-layer": 'SMIA_halfmilebuffer_full',
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#000000",
      "line-width": 2,
      "line-dasharray": [1, 3]
    }
  },'Bulk Storage Sites');

  map.addLayer({
    "id": "SMIAfill",
    "type": "fill",
    "source": "vector_data",
    "source-layer": 'SMIA_halfmilebuffer_full',
    "paint": {
      "fill-color": "#000000",
      "fill-opacity": 0
    }
  },'Bulk Storage Sites');

  map.addLayer({
    "id": "SMIAhover",
    "type": "fill",
    "source": "vector_data-hover",
    "source-layer": 'SMIA_halfmilebuffer_full',
    "paint": {
      "fill-color": "#000000",
      "fill-opacity": .25,
    },
    "filter": ["==", "SMIA_Name", ""]
  },'Bulk Storage Sites');



});

// Layer names, numbers, and text
var toggleableLayerIds = ['Percent People of Color', 'Zoning', 'Percent of Families Below Poverty Line', 'Hurricane Storm Surge Zones',
'Median Household Income','Bulk Storage Sites'];
var toggleableLegendIds = {'Percent People of Color': 'race-legend',
'Zoning': 'zoning-legend',
'Percent of Families Below Poverty Line': 'poverty-legend',
'Hurricane Storm Surge Zones': 'surge-legend',
'Median Household Income': 'income-legend',
'Bulk Storage Sites': 'bulk-legend'};
var dataNames = {'human_readable_zone': 'Land use: ',
'Perc_POC_P003009': 'Percent people of color: ',
'% of Families Below Poverty Level': 'Percent below poverty level: ',
'CATEGORY': 'Hurricane zone: ',
'Median Household Income': 'Median household income: '};
// 'neighborhood':'NYC Neighborhood: '};
var smiaNumbers = {'Brooklyn Navy Yard':'1',
'Newtown Creek':'2',
'Staten Island West Shore':'3',
'Red Hook':'4',
'South Bronx':'5',
'Sunset Park':'6',
'Kill Van Kull':'7'};
var smiaTitle = ['SMIA # 1 : Brooklyn Navy Yard',
'SMIA # 2 : Newtown Creek',
'SMIA # 3 : Staten Island West Shore',
'SMIA # 4 : Red Hook',
'SMIA # 5 : South Bronx',
'SMIA # 6 : Sunset Park',
'SMIA # 7 : Kill Van Kull'];
var smiaText = {'Brooklyn Navy Yard':'The Brooklyn Navy Yard is a 227-acre publicly owned industrial park characterized by a diversity of small buisnesses. The Navy Yard has more than 2,000 permanent jobs on site, and provides an estimated 3,000 temporary jobs to crews of film and telivision shoots at Steiner Studios. The robust increase in buisness activity between 200 and 2008 is attributed to a dramatic redevlopment effort, harnessing more than $500 million in public and private investment.',
'Newtown Creek':'Newtown Creek, at over 780 acres the city’s largest SMIA, abuts portions of the Greenpoint, Williamsburg, Long Island City, and Maspeth industrial areas. The waterfront area is characterized by heavy industry and municipal facilities, many of which are water-dependent.',
'Staten Island West Shore':'No information about this SMIA yet.',
'Red Hook':'The Red Hook SMIA is approximately 120 acres and is more than 90 percent publicly owned. The SMIA is home to the Red Hook Container Terminal and Brooklyn Piers Port Authority Marine Terminal.',
'South Bronx':'The South Bronx SMIA is more than 850 acres in size, stretching from Port Morris on the Harlem River to Hunts Point on the East river. Wholesale trade is the dominant industry. The SMIA is home to the citys produce distribution center at Hunts Point, the Fulton Fish market, and other food distributors.',
'Sunset Park':'Nearly 600 acres, the Sunset Park SMIA extends from Erie Basin to Owls Head, an area characterized by water-dependent facilities, concentrations  of  industrial  activity,  well-buffered  manufacturing  districts,  and  vacant  sites  and  brownfields  of  significant  size.  A  small portion of the SMIA abuts the Gowanus Canal, a waterway that was designated a Superfund Site in 2010.',
'Kill Van Kull':'The Kill Van Kull SMIA stretches from Howland Hook to Snug harbor. It contains a concentration of maritime uses including a marine terminal and dry docks for ship repair. The SMIA is approximately 665 acres and zoned to permit a broad range of commercial and industrial uses. In 2008, there were more than 70 firms emplying more than 3,300 people in the SMIA. The overwhelming number of jobs - more than 70 percent - were in transportation and warehousing.'};

var smiaDescription = ['The Brooklyn Navy Yard is a 227-acre publicly owned industrial park characterized by a diversity of small buisnesses. The Navy Yard has more than 2,000 permanent jobs on site, and provides an estimated 3,000 temporary jobs to crews of film and telivision shoots at Steiner Studios. The robust increase in buisness activity between 200 and 2008 is attributed to a dramatic redevlopment effort, harnessing more than $500 million in public and private investment.',
'Newtown Creek, at over 780 acres the city’s largest SMIA, abuts portions of the Greenpoint, Williamsburg, Long Island City, and Maspeth industrial areas. The waterfront area is characterized by heavy industry and municipal facilities, many of which are water-dependent.',
'No information about this SMIA yet.',
'The Red Hook SMIA is approximately 120 acres and is more than 90 percent publicly owned. The SMIA is home to the Red Hook Container Terminal and Brooklyn Piers Port Authority Marine Terminal.',
'The South Bronx SMIA is more than 850 acres in size, stretching from Port Morris on the Harlem River to Hunts Point on the East river. Wholesale trade is the dominant industry. The SMIA is home to the citys produce distribution center at Hunts Point, the Fulton Fish market, and other food distributors.',
'Nearly 600 acres, the Sunset Park SMIA extends from Erie Basin to Owls Head, an area characterized by water-dependent facilities, concentrations  of  industrial  activity,  well-buffered  manufacturing  districts,  and  vacant  sites  and  brownfields  of  significant  size.  A  small portion of the SMIA abuts the Gowanus Canal, a waterway that was designated a Superfund Site in 2010.',
'The Kill Van Kull SMIA stretches from Howland Hook to Snug harbor. It contains a concentration of maritime uses including a marine terminal and dry docks for ship repair. The SMIA is approximately 665 acres and zoned to permit a broad range of commercial and industrial uses. In 2008, there were more than 70 firms emplying more than 3,300 people in the SMIA. The overwhelming number of jobs - more than 70 percent - were in transportation and warehousing.'];
  var smiaLat = [-73.97256593122793,-73.93480042828487,-74.23091192935536,
-74.00743616089453,-73.8939875925258,-74.01499944630518,-74.13713363755667];
var smiaLng = [40.70337539892057, 40.73043814252142, 40.5505517824447
, 40.68650785503232, 40.80730643781723, 40.658442081047724, 40.64057887695694];
var legendText = {'Percent People of Color': 'From the US census 2016. SMIAs tend to have higher proportions of people of color.',
'Zoning': 'NYC zoning districts are designated by NYC DOB (?). Though SMIAs are predominately in designated manufacturing zones, they are surrounded by largely residential areas.',
'Percent of Families Below Poverty Line': 'From the US census 2016. The population within and around SMIAs is frequently below poverty level, especially in #1, Brooklyn Navy Yard and #5, South Bronx',
'Hurricane Storm Surge Zones': 'Hurricane storm storm surge zones are determined by NYC Emergency Management (?). All SMIAs are in hurricane storm surge zones.',
'Median Household Income': 'From the US census 2016. The population within and around SMIAs has low household income, especially in #1, Brooklyn Navy Yard and #5, South Bronx',
'Bulk Storage Sites': 'Bulk storage sites from EPCRA (TRI) and DEC (MOSF, CBS, Superfund). Bulk storage sites are concentrated in SMIAs, especially #2, Newtown Park and #6, Sunset Park'};
var legendSource = {'Percent People of Color': 'US Census 2010, divided by census tract, downloaded from <a href="http://census.ire.org/data/bulkdata.html">CENSUS.IRE.ORG</a>',
'Zoning': 'NYC Zoning designations, last updated 2015(?), downloaded from <a href="http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson">data.Beta.NYC</a>',
'Percent of Families Below Poverty Line': 'US Census 2010, divided by census tract, downloaded from <a href="https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml">US Census Bureau</a>',
'Hurricane Storm Surge Zones': '(?) 2016 Hurricane evacuation Zones from the <a href="https://geo.nyu.edu/catalog/nyu_2451_34571">NYC-DEM</a>.',
'Median Household Income': '(?) US Census 2010, divided by census tract, downloaded from <a href="https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml">US Census Bureau</a>',
'Bulk Storage Sites': '2016 EPCRA TRI sites from <a href="https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2016">US EPA</a>. DEC active  MOSF, CBS and superfund class 2 sites (7/18/2018) from <a href="https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=4">NYS DEC</a> and <a href="https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=3">NYS DEC</a>'};
// ----------------------------------------
// |  ** MENU / LAYER SWITCHING  ** |
// ----------------------------------

// MH: this now happens with VISIBILITY instead of opacity (to support markers)
for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];
  var link = document.createElement('a');
  link.href = '#';
  link.textContent = id;
  if (id === 'Percent People of Color') {
    link.className = 'active';
    legend_info('Percent People of Color')
  } else {
    link.className = '';
  }
  link.id = 'toggler-' + id
  link.onclick = function(e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();
    for (var j = 0; j < toggleableLayerIds.length; j++) {
      var otherLayerName = toggleableLayerIds[j]
      if (otherLayerName != clickedLayer) {
        document.getElementById('toggler-' + otherLayerName).className = '';
        if (otherLayerName == 'Bulk Storage Sites') {
          map.setLayoutProperty(otherLayerName, 'visibility', 'none');
          map.setLayoutProperty('MOSF', 'visibility', 'none');
          map.setLayoutProperty('CBS', 'visibility', 'none');
          map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
        } else {
          map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        }
        document.getElementById(toggleableLegendIds[otherLayerName]).style.display = 'none';
      }
    }
    this.className = 'active';
    if (clickedLayer == 'Bulk Storage Sites') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      map.setLayoutProperty('MOSF', 'visibility', 'visible');
      map.setLayoutProperty('CBS', 'visibility', 'visible');
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'visible');
    } else {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
    }
    document.getElementById(toggleableLegendIds[clickedLayer]).style.display = 'block';
    legend_info(clickedLayer)
  };

  var layers = document.getElementById('menu');
  layers.appendChild(link);

};

function legend_info(clickedLayer){
  //for (var j = 0; j < toggleableLayerIds.length; j++) {
  //  var jlayer = 'toggler-' + toggleableLayerIds[j];
  //  if(document.getElementById(jlayer).className.includes("active")){
  //    var clickedLayer = toggleableLayerIds[j];
  //  }
  //}
  //document.getElementById('legendinfo').innerHTML = '<p><strong><big>' + clickedLayer + '</big></strong>' + '<small></br></br>' + legendText[clickedLayer] + '</small></p>';
  document.getElementById('legendinfo').innerHTML ='<div style="margin-top:-10px;">'
  +'<p><h4>Source</h4>'
  +'<small>'+legendSource[clickedLayer]+'</br></br></small>'
  +'<h4>Description</h4>'
  +'<small>' + legendText[clickedLayer] + '</small></p>'
  +'</div>';
}

function show_legend_info(){
  if (document.getElementById('legendinfo').style.display.includes("block")){
    document.getElementById('legendinfo').style.display='none';
    document.getElementById('legendseam').style.display='none';
  } else {
    document.getElementById('legendinfo').style.display='block';
    document.getElementById('legendseam').style.display='block';
  }
}

// reset map view
function reset_map_view(){
  var flyopts = {
    zoom: 10,
    center: [-73.9978, 40.7209]
  }
  map.flyTo(flyopts)
  showinfobox(event,"none")
}

// turn on / off explore and story listeners
// listeners 101: map.on makes it listen, map.off makes it stop
// map.on/off("event",("layer"),"Listerner function")

var global_current_SMIA = -1;

function manage_listeners(active_listener){

  var blankgeojson = {
    "type": "FeatureCollection",
    "features": []
  };
  // kill manage_listeners
  map.off('click', query_point)
  map.off('mousemove',which_smia);
  map.off('mouseenter',"SMIAfill",smia_hover_on);
  map.off('mouseleave',"SMIAfill",smia_hover_off);
  //remove marker and info
  map.getSource('single-point').setData(blankgeojson);
  overlay.innerHTML = '';
  // selectively activate listeners
  if (active_listener.includes("story")){
    map.on('mousemove',which_smia);
    map.on('mouseenter',"SMIAfill",smia_hover_on);
    map.on('mouseleave',"SMIAfill",smia_hover_off);
    map.on('click',smia_click)
    global_current_SMIA = -1;
    fly_to_smia()
  }
  if (active_listener.includes("explore")){
    map.on('click',query_point);
  }
  if (active_listener.includes("smiazoom")){
    map.on('mouseenter',"SMIAfill",smia_hover_on);
    map.on('mouseleave',"SMIAfill",smia_hover_off);
    map.on('click',smia_click)
  }
}

// ---------------------------
// |  ** EXPLORE  ** |
// ---------------------------
function query_point(e){
  // on click query point, display info, and draw marker
  map.getCanvas().style.cursor = 'pointer';
  var queried = map.queryRenderedFeatures(e.point)
  show_explore_info(queried)
  var coords = e.lngLat;
  queried[0].geometry.coordinates = [coords.lng, coords.lat];
  queried[0].geometry.type = "Point";
  console.log(queried[0].geometry)
  map.getSource('single-point').setData(queried[0].geometry);
}

function show_explore_info(queried){
  // show info from points queried by marker
  overlay.innerHTML = '';
  var shownData = [];
  for (var j = 0; j < queried.length; j++){
    var data = queried[j].properties
    for (var i = 0; i < Object.keys(dataNames).length; i++) {
      var dataKey = Object.keys(dataNames)[i];
      // if we haven't already found this data and it's not undefined
      var dataDisplay = document.createElement('div');
      if (shownData.indexOf(dataKey) == -1 && typeof(data[dataKey]) != 'undefined') {
        if (dataNames[dataKey].includes('Percent')){
          if (data[dataKey] > 0) {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + Math.round(data[dataKey]) + ' %';
          } else {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>'  + '<small>not enough data</small>';
          }
          shownData.push(dataKey)
        } else if (dataNames[dataKey].includes('income')){
          if (data[dataKey] > 0) {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + '$ ' + Math.round(data[dataKey]);
          } else {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>'  + '<small>not enough data</small>';
          }
          shownData.push(dataKey)
        } else {
          dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + data[dataKey];
          shownData.push(dataKey)
        }
        overlay.appendChild(dataDisplay);
      } else {
        if (shownData.indexOf(dataKey) == -1 && dataNames[dataKey].includes('Hurricane') && typeof(data[Object.keys(dataNames)[0]]) != 'undefined'){
          if (data[dataKey] > 0) {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + Math.round(data[dataKey]);
          } else {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>'  + 'none';
          }
          shownData.push(dataKey)
          overlay.appendChild(dataDisplay);
        }
      }
    }}
    overlay.style.display = 'block';
  }




  // ---------------------------
  // |  ** G E O C O D E R  ** |
  // ---------------------------

  // geocoder code! adds a geocoder and marker
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // geocoder zoom level
    zoom: 11,
    // bound geocoder results
    bbox: [-74.274300, 40.487423, -73.693891, 40.858796],
    // apply a client side filter to further limit results to those strictly within NYC
    filter: function (item) {
      // returns true if item contains New South Wales region
      return item.context.map(function (i) {
        // id is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
        // this example attempts to find the `region` named `New York`
        return (i.id.split('.').shift() === 'region' && i.text === 'New York');
      }).reduce(function (acc, cur) {
        return acc || cur;
      });
    }
  });

  //map.addControl(geocoder);
  // put geocoder into div ('geocoder')
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map))
  // Listen for the `geocoder.input` event that is triggered when a user
  // makes a selection and add a symbol that matches the result.
  geocoder.on('result', function(e) {
    // project geocoder result to "point"
    var point = map.project([e.result.center[0], e.result.center[1]]);
    // query rendered features at point
    var queried = map.queryRenderedFeatures(point);
    // show the point box
    show_explore_info(queried)
    // draw the marker
    map.getSource('single-point').setData(e.result.geometry);
  });


  //  map.on('mouseenter', 'Percent People of Color', function (e) {
  //    map.getCanvas().style.cursor = 'pointer';
  //  });

  //  map.on('mouseleave', 'Percent People of Color', function (e) {
  //    map.getCanvas().style.cursor = '';
  //  });

  // ---------------------------
  // |  ** SMIA FILL  ** |
  // ---------------------------

  // MH SMIA FILL CODE
  // -SMIA file uses OBJECTID / SMIA_Name but SMIA buffer file uses SMIA_Name only
  // -Currently all with SMIA_Name + manual ID numbers

  // When the user moves their mouse over the SMIA buffer layer, we'll update the filter in
  // the state-fills-hover layer to only show the matching state, thus making a hover effect.

  var smiaIntro = "As the threats of climate change increase, destructive storms like Superstorm Sandy, Hurricane Katrina, and Hurricane Harvey will expose the vulnerabilities of costal communities overburdened by industrial and chemical facilities. Of interest are NYC’s Significant Maritime and Industrial Areas (SMIAs), clusters of industry and polluting infrastructure along the waterfront. SMIAs are located in classic environmental justice communities- predominantly low-income communities of color - in the south Bronx, Brooklyn, Queens and Staten Island, which are also hurricane storm surge zones. The WJP is a research and advocacy campaign focusing on community resiliency that seeks to reduce potential toxic exposures and public health risks associated with climate change and storm surge in the City’s industrial waterfront.";

  function which_smia(e){
    var whichsmia = map.queryRenderedFeatures(e.point, {
      layers: ['SMIAfill']
    });
    if (whichsmia.length > 0) {
      document.getElementById('smiabox').innerHTML = '<p><strong><big>SMIA # ' + smiaNumbers[whichsmia[0].properties.SMIA_Name] + ' : ' + whichsmia[0].properties.SMIA_Name + '</big></strong>' + '<small></br></br>' + smiaText[whichsmia[0].properties.SMIA_Name] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
    } else {
      document.getElementById('smiabox').innerHTML = '<p><small> ' + smiaIntro + '</small><br/><br/>Click next to start learning about SMIAs, or click on any SMIA for more information. </p> ';
    }
  }

  function smia_hover_on(e) {
    map.setFilter("SMIAhover", ["==", "SMIA_Name", e.features[0].properties.SMIA_Name]);
  }

  // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
  function smia_hover_off(e) {
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
  }

  // -------------------------
  // | S T O R Y ------------
  // -------------------------

  function smia_click(e){
    // zoom into smia on click
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
    var whichsmia = map.queryRenderedFeatures(e.point, {
      layers: ['SMIAfill']
    });
    if (whichsmia.length > 0){
      // fly now!
      var smiaNum = smiaNumbers[whichsmia[0].properties.SMIA_Name]-1;
      global_current_SMIA = smiaNum;
      fly_to_smia()
    }
  }

  function fly_to_smia(){
    // fly to smia
    console.log(global_current_SMIA)
    var smiaNum = global_current_SMIA;
    global_current_SMIA = global_current_SMIA+1;
    if (global_current_SMIA>6){global_current_SMIA=-1}

    document.getElementById('nextbutton').style.display = "block";

    if (smiaNum<0){
      document.getElementById('smiabox').innerHTML = '<p><small> ' + smiaIntro + '</small><br/><br/>Click next to start learning about SMIAs, or click on any SMIA for more information. </p> ';
      var flyopts = {
        zoom: 10,
        center: [-73.9978, 40.7209]
      }
      map.flyTo(flyopts)
      map.on('mousemove',which_smia);
      return;
  }
    var flyopts = {
      zoom: 12,
      center: [smiaLat[smiaNum],smiaLng[smiaNum]]
    }

    map.flyTo(flyopts)
    manage_listeners("smiazoom")
    document.getElementById('smiabox').innerHTML = '<p><strong><big>' + smiaTitle[smiaNum] + '</big></strong>' + '<small></br></br>' + smiaDescription[smiaNum] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
    }

  // ------------------------------------------
  // |-------    I N F O    B O X     --------|
  // ------------------------------------------

  // MH: sloppy way of showing and hiding infobox
  //https://www.w3schools.com/howto/howto_js_tabs.asp
  function showinfobox(evt,boxname){
    //variables
    var i, boxcontent, boxlinks, killallboxes;

    // hide everything named box-content
    boxcontent = document.getElementsByClassName("box-content");
    for (i=0; i<boxcontent.length; i++){
      boxcontent[i].style.display = "none";
    }

    // check if clicked box was alread active, if so then kill all boxes
    if (evt.currentTarget.className.includes("active") || boxname.includes("none")) {
      killallboxes = 1;
    }

    // deactivate anything named mode-button
    boxlinks= document.getElementsByClassName("mode-button");
    for (i=0; i<boxlinks.length; i++){
      boxlinks[i].className = boxlinks[i].className.replace(" active","");
    }

    // kill story button
    document.getElementById('nextbutton').style.display = 'none';

    if (killallboxes!=1) {
      // show the current box and make it active!
      document.getElementById(boxname).style.display = "block";
      evt.currentTarget.className += " active";
      if (evt.currentTarget.id.includes("story")) {
        manage_listeners("story")
      } else if (evt.currentTarget.id.includes("explore")) {
        manage_listeners("explore")
      }
    } else {manage_listeners("none")}
  }
