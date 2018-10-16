/*
STORY MODE SCRIPT!
Contains:
- story_next_page
- story_prev_page
- story_display_page
- smia_click (jump to SMIA on click)
- which_smia (display SMIA info on hover)
*/

// first load in the story text file
var storyrequestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/story_text.json';
var storyrequest = new XMLHttpRequest();
storyrequest.open('GET', storyrequestURL);
storyrequest.responseType = 'json';
storyrequest.send();

// after loading do some processing
var storyvars, pageSMIAIdx, global_max_page;
storyrequest.onload = function() {
  var requested_text = storyrequest.response;
  storyvars = requested_text["data"];
  pageSMIAIdx = requested_text["SMIA_first_page"];
  global_max_page = requested_text["global_max_page"]-1;
}

// next page function
function story_next_page(){
  global_page = global_page+1;
  if (global_page>global_max_page){global_page=0;}
  story_display_page(global_page)
}

// prev page function
function story_prev_page(){
  global_page = global_page-1;
  if (global_page<0){global_page=global_max_page;}
  story_display_page(global_page)
}

// display page function
function story_display_page(storypage){
  //specify flying options and fly
  var flyopts = {
    zoom: storyvars[storypage]["pageZoom"],
    pitch:0,
    bearing:0,
    center: [storyvars[storypage]["pageLat"],storyvars[storypage]["pageLng"]],
    speed:.5,
    curve: 1,
  }
  map.flyTo(flyopts)

  // show the next and back buttons
  document.getElementById('nextbutton').style.display = "block";
  document.getElementById('backbutton').style.display = "block";


  // allow users to jump to a SMIA by clicking on it (if pageIdx is zero)
  var jumptext = "";
  if (storyvars[storypage]["pageIdx"]!=0) {
    smia_hover_toggle(false,false)
  } else {
    smia_hover_toggle(true,true)
    jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
  }

  // switch to layer, turn off all tabs selected for cleanliness
  changeTab("None")
  // add bulkLayers
  // var bulks = storyvars[storypage]['bulkLayers'].split(",")
  var bulkstring = storyvars[storypage]["bulkLayers"].split(",");
  if (storyvars[storypage]["pageLayer"]=="Bulk Storage Sites"){
    bulkstring = ['Bulk Storage Sites','MOSF','CBS','SUPERFUND2'];
  }
  toggle_bulk(bulkstring)
  if (bulkstring!="None" && storyvars[storypage]["pageLayer"]!="Bulk Storage Sites"){
    bulk_legend(false)
    bulk_legend(true)
  } else {
    bulk_legend(false)
  }
  document.getElementById('toggler-Bulk Storage Sites').className = '';
  make_layer_visible(storyvars[storypage]["pageLayer"])

  // display information about SMIA
  document.getElementById('storybox').innerHTML = '<p><big><strong>' + storyvars[storypage]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[storypage]["pageText"] + jumptext + '</small></p>';
}


function smia_hover_toggle(hover,click){
  // turn of listeners and remove info
  map.off('click',smia_click)
  map.off('mousemove',which_smia)
  map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
  document.getElementById('smiainfoboxempty').style.visibility = 'hidden';

  // toggle hover listener
  if (hover==true){
    map.on('mousemove',which_smia);
  } else {
    map.off('mousemove',which_smia);
  }

  // toggle click listener
  if (click==true){
    map.on('click',smia_click);
  } else {
    map.off('click',smia_click);
  }
}







function smia_click(e){
  // zoom into smia on click

  // check which SMIA the mouse is on
  var whichsmia = map.queryRenderedFeatures(e.point, {layers: ['SMIAfill']});

  // if the mouse has clicked on a SMIA then get its number and jump to it
  if (whichsmia.length > 0){
    // Get the number of the clicked SMIA
    var smiaNum = vsmia[whichsmia[0].properties.SMIA_Name]["number"]-1;

    // Remember to turn off listeners and highlight effect after you zoom
    smia_hover_toggle(false,false)

    // Go to the first page on which this SMIA appears
    var jumppage = pageSMIAIdx[smiaNum]+1;
    if (jumppage !=0){
      global_page = jumppage;
      story_display_page(global_page);
    }
  }
}


function which_smia(e){
  // Display SMIA info on hover
  // When the user moves their mouse over the SMIA buffer layer, we'll update the filter in
  // the state-fills-hover layer to only show the matching state, thus making a hover effect.

  // Get the number of the clicked SMIA
  var whichsmia = map.queryRenderedFeatures(e.point, {layers: ['SMIAfill']});
  // if the mouse moves over a smia show some info or don't
  if (whichsmia.length > 0) {
    // turn filter on
    var thissmia = whichsmia[0].properties.SMIA_Name;
    map.setFilter("SMIAhover", ["==", "SMIA_Name", thissmia]);
    // show some SMIA info
    smia_info(thissmia,e.point)
    //document.getElementById('storybox').innerHTML = '<p><strong><big>SMIA # ' + vsmia[thissmia]["number"] + ' : ' + thissmia + '</big></strong>' + '<small></br></br>' +vsmia[thissmia]["description"] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
    var jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
    document.getElementById('storybox').innerHTML = '<p><strong><big>' + storyvars[global_page]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[global_page]["pageText"] + jumptext + '</small></p>';
  } else {
    document.getElementById('smiainfoboxempty').style.visibility = 'hidden';
    // turn filter off
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
    // show the story page text
    var jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
    document.getElementById('storybox').innerHTML = '<p><strong><big>' + storyvars[global_page]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[global_page]["pageText"] + jumptext + '</small></p>';
  }
}

function smia_info(thissmia,e){
  // info (name only or full)
  //document.getElementById('smiainfoboxempty').innerHTML = '<p><strong><big>SMIA # ' + vsmia[thissmia]["number"] + ' : ' + thissmia + '</big></strong>'
  document.getElementById('smiainfoboxempty').innerHTML = '<p><strong><big>SMIA ' + vsmia[thissmia]["number"] + ':  ' + thissmia + '</big></strong>' + '<small></br></br>' +vsmia[thissmia]["description"]  + '</small></p>';

  // set box coordinates and make visible
  var xcord = e["x"] - 20;
  document.getElementById('smiainfoboxempty').style.left = xcord+'px';
  var ycord = e["y"] - document.getElementById('smiainfoboxempty').offsetHeight -20;
  document.getElementById('smiainfoboxempty').style.top = ycord + 'px';
  document.getElementById('smiainfoboxempty').style.visibility = 'visible';
}
