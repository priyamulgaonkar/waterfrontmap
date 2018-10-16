/*
Navigation script!
This controls: info box, data box, legend, WIP box
Contents:
- changeTab(tabName)
- make_layer_visible(clickedLayer)
- legend_info(clickedLayer)
- show_legend_info()
- reset_map_view(event)
- showinfobox(evt,boxname)
*/


// redefine "$" to return element ids
// var $ = function(id){return document.getElementById(id)};

// hide work in progress box
function hidewip(){
  document.getElementById('wipbox').style.display = 'none';
  document.getElementById('wipoverlay').style.display = 'none';
}

function hideaboutbox(){
  document.getElementById('aboutbox').style.display = 'none';
  document.getElementById('aboutoverlay').style.display = 'none';
  showinfobox([],"none")
}

// ----------------------------------------
// |  ** MENU / LAYER SWITCHING  ** |
// ----------------------------------
// update legend information to be default
//legend_info("Percent People of Color")

function clearmenu(){
  for (var key in toggleableLegendIds) {
    var link = document.getElementById('toggler-' + key)
    if (link != null){
      link.style.display='none'
    }
  }
}

function menuinit(layers){
  tablinks = document.getElementsByClassName("menu-button");
  for (j = 0; j < tablinks.length; j++) {
    tablinks[j].className += " active";
    var tabName = tablinks[j].id;
    for (var i = 0; i < toggleableLayerIds[tabName].length; i++) {
      var id = toggleableLayerIds[tabName][i];
      var link = document.createElement('a');
      link.style.cssText = 'float:left; width:112px;margin-left:9px;font-size:12px;';
      link.href = '#';
      link.textContent = id;
      link.id = 'toggler-' + id
      link.className = ''
      link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        if (this.className == 'active') {
          // if the class was already active make it inactive
          this.className = '';
          if (clickedLayer=="Bulk Storage Sites") {
            toggle_bulk("None")
            bulk_legend(false)
            if (nonbulk_active()==false){update_legend("None")}
          } else {
            make_layer_visible('None')
            if (document.getElementById("toggler-Bulk Storage Sites").className=='active'){
              update_legend('Bulk Storage Sites')
              bulk_legend(false)
            }
          }
        } else {
          // if this wasn't active make it active now
          this.className = 'active';
          if (clickedLayer=="Bulk Storage Sites") {
            toggle_bulk(['Bulk Storage Sites','MOSF','CBS','SUPERFUND2'])
            if (nonbulk_active()==false){update_legend("Bulk Storage Sites")}
            if (nonbulk_active()==true){bulk_legend(true)}
          } else {
            if (document.getElementById("toggler-Bulk Storage Sites").className=='active'){bulk_legend(true)}
            make_layer_visible(clickedLayer)
          }
        }
      };
      layers.appendChild(link);
    }
    tablinks[j].className.replace(' active','')
  }
}

function changeTab(tabName) {
  var killallboxes=0;
  var layers = document.getElementById('menu');
  var clickedTab = document.getElementById(tabName);

  // clear menu of previous togglers
  clearmenu()

  // check if clicked box was alread active, if so then kill all boxes
  if (clickedTab==null) {
  } else if (clickedTab.className.includes("active")) {
    killallboxes = 1;
  }

  // make all the buttons inactive and then set the clicked button to active
  tablinks = document.getElementsByClassName("menu-button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById('MenuSpacer').style.display='None';

  if (tabName.includes("None")) {return}

  if (killallboxes !=1){
    // build a toggling menu
    document.getElementById('MenuSpacer').style.display='block';

    // initialize menu
    if (document.getElementById('toggler-Percent People of Color')==null){
      menuinit(layers)
    }

    clickedTab.className += " active";
    for (var i = 0; i < toggleableLayerIds[tabName].length; i++) {
      var id = toggleableLayerIds[tabName][i];
      if (document.getElementById('toggler-'+id) == null){
        // moved to menuinit(layer)
      } else {
        document.getElementById('toggler-' + id).style.display='block';
      }
    };
  }
}

function nonbulk_active(){
  var flag=false;
  for (var key in toggleableLegendIds){
    if (document.getElementById('toggler-' + key).className=='active' && key!='Bulk Storage Sites'){
      flag=true;
    }
  }
  return flag
}

function toggle_bulk(layers) {
  var alllayers = ['Bulk Storage Sites','MOSF','CBS','SUPERFUND2'];
  for (i=0;i<alllayers.length;i++){
    layername = alllayers[i];
    map.setLayoutProperty(layername, 'visibility', 'none');
    if (document.getElementById(layername).className.includes("target")==false){
      document.getElementById(layername).className += ' target';
    }
    document.getElementById(layername).style.display="block";
  }

  if (layers!='None') {
    for (i=0;i<layers.length;i++){
      layername = layers[i];
      map.setLayoutProperty(layername, 'visibility', 'visible');
      document.getElementById(layername).className = document.getElementById(layername).className.replace(" target", "");
      document.getElementById(layername).style.display="none";
    }
  }
}

function bulk_indiv(divname){
  if (document.getElementById(divname).className.includes('target')){
    document.getElementById(divname).className = document.getElementById(divname).className.replace(" target", "");
    document.getElementById(divname).style.display="none";
    if (divname.includes("Bulk Storage Sites")){
      map.setLayoutProperty('Bulk Storage Sites', 'visibility', 'visible');
    } else if (divname.includes("MOSF")){
      map.setLayoutProperty('MOSF', 'visibility', 'visible');
    } else if (divname.includes("CBS")){
      map.setLayoutProperty('CBS', 'visibility', 'visible');
    } else if (divname.includes("SUPERFUND2")){
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'visible');
    }
  } else {
    if (document.getElementById(divname).className.includes("target")==false){
      document.getElementById(divname).className += ' target';
    }
    document.getElementById(divname).style.display="block";
    if (divname.includes("Bulk Storage Sites")){
      map.setLayoutProperty('Bulk Storage Sites', 'visibility', 'none');
    } else if (divname.includes("MOSF")){
      map.setLayoutProperty('MOSF', 'visibility', 'none');
    } else if (divname.includes("CBS")){
      map.setLayoutProperty('CBS', 'visibility', 'none');
    } else if (divname.includes("SUPERFUND2")){
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
    }
  }
}


function bulk_legend(value) {
  if (value==true){
    document.getElementById('legendHTML_bulk').style.display = 'block';
    if (nonbulk_active()==true){
      if (document.getElementById('legendinfo').style.display.includes("block")){
        document.getElementById('legendinfo').style.right='370px';
      }
    }
  } else {
    document.getElementById('legendinfo').style.right='190px';
    document.getElementById('legendHTML_bulk').style.display = 'none';
  }
}

function show_legend_info(){
  // show or hide legend info by clicking button
  if (document.getElementById('legendinfo').style.display.includes("block")){
    document.getElementById('legendinfo').style.display='none';
    document.getElementById('legendseam').style.display='none';
  } else {
    document.getElementById('legendinfo').style.display='block';
    document.getElementById('legendseam').style.display='block';
    if (document.getElementById("toggler-Bulk Storage Sites").className=='active' && nonbulk_active()==true){
      document.getElementById('legendinfo').style.right='350px';
    } else {
      document.getElementById('legendinfo').style.right='180px';
    }
  }
}



function make_layer_visible(clickedLayer) {

  for (var otherLayerName in toggleableLegendIds) {

    if (otherLayerName != clickedLayer) {
      var otherToggler = document.getElementById('toggler-' + otherLayerName)
      if (otherToggler != null && (otherLayerName !='Bulk Storage Sites')){
        otherToggler.className = '';
      }
      if (otherLayerName == 'Bulk Storage Sites') {
        // do nothing
      } else if (otherLayerName.includes("Percent") || otherLayerName.includes("Median Household Income") || otherLayerName.includes("Heat Vulnerability Index")) {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        map.setPaintProperty(otherLayerName + " Hatch", 'fill-opacity', 0);
        if (otherLayerName == "Percent Uninsured"){map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 0)}
      } else {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
      }
    }
  }
  if (clickedLayer=="None"||clickedLayer=="Highlight") {
    // show fill layer to highlight SMIAs
    //if (clickedLayer == "Highlight") {
    //smia_hover_toggle(true,false)
    map.setLayoutProperty("SMIAnumbers",'visibility','visible')
    map.setPaintProperty("SMIAfill", 'fill-opacity',.25)
    //}
    update_legend("None");
    document.getElementById('dataselector').innerHTML = ' Data: ';
  } else {
    // get rid of none stuff
    smia_hover_toggle(false,false)
    map.setPaintProperty("SMIAfill", 'fill-opacity',0)
    map.setLayoutProperty("SMIAnumbers", 'visibility',"none")

    // make active
    document.getElementById('toggler-' + clickedLayer).className = 'active';
    // update data tabselector
    document.getElementById('dataselector').innerHTML = 'Data: <small>'+ clickedLayer + '</small>';
    if (clickedLayer == 'Bulk Storage Sites') {
      //do nothing
    } else if (clickedLayer.includes("Percent") || clickedLayer.includes("Median Household Income") || clickedLayer.includes("Heat Vulnerability Index")) {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
      map.setPaintProperty(clickedLayer + " Hatch", 'fill-opacity', 1);
      if (clickedLayer == "Percent Uninsured"){map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 1)}
    } else {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
    }
    update_legend(clickedLayer)
  }
}




function update_legend(layername){
  //update legend info to match clicked layer
  document.getElementById('legendinfo').innerHTML ='<div style="margin-top:-10px;">'
  +'<p><h4>Description</h4><small>' + vlayer[layername]["text"] + '</br></br></small>'
  +'<h4>Source</h4><small>'+ vlayer[layername]["source"] +'</small></p>'
  +'</div>';

  // get legend entry and color
  var legendentry = legend_text[toggleableLegendIds[layername] + '_entry'];
  var legendcolor = legend_text[toggleableLegendIds[layername] + '_color'];

  // legend title
  document.getElementById('legend_placeholder').innerHTML = '<h4>' + layername + '</h4>';

  // bulk legend is special
  if (layername == 'Bulk Storage Sites'){
    document.getElementById('legend_placeholder').innerHTML = document.getElementById('legendHTML_bulk').innerHTML
  } else if (layername == "None") {
    //document.getElementById('legend_placeholder').innerHTML = '';
    document.getElementById('legend_placeholder').innerHTML = document.getElementById('legendHTML_Highlight').innerHTML
  } else {
    // build legend from entry text and colors
    for (i=0; i<legendentry.length; i++){
      var divtext = '<div style="text-align:right;"><div style="display:inline-block;line-height:100%">' + legendentry[i] + '</div>'
      + '<span style="vertical-align:middle;background-color: ' + legendcolor[i] + ';margin-left:10px;margin-bottom:5px;"></span></div>'

      document.getElementById('legend_placeholder').innerHTML = document.getElementById('legend_placeholder').innerHTML + divtext
    }
    // add image to uninsured legend
    if (layername == 'Percent Uninsured'){document.getElementById('legend_placeholder').innerHTML = document.getElementById('legend_placeholder').innerHTML + document.getElementById('legendHTML_uninsured').innerHTML}
  }
}


function reset_map_view(event){
  // set flying options and fly
  var flyopts = {
    zoom: 10,
    center: [-73.9978, 40.7209],
    bearing: 0,
    pitch:0,
    speed:.5,
    curve: 1,
  }
  map.easeTo(flyopts)

  // reset info box and SMIA highlight
  showinfobox(event,"none")
  toggle_bulk("None")
  bulk_legend(false)
  smia_hover_toggle(false,false)
  //map.setPaintProperty("SMIAfill", 'fill-opacity',0)
  //map.setLayoutProperty("SMIAnumbers",'visibility','none')
  make_layer_visible("None")
}



// ------------------------------------------
// |-------    I N F O    B O X     --------|
// ------------------------------------------
function showinfobox(evt,boxname){
  // control what's shown in the info box (STORY, EXPLORE, ABOUT)
  // sloppy way of showing and hiding infobox from https://www.w3schools.com/howto/howto_js_tabs.asp
  // declare variables
  var i, boxcontent, boxlinks, killallboxes;

  // hide everything named box-content
  boxcontent = document.getElementsByClassName("box-content");
  for (i=0; i<boxcontent.length; i++){
    boxcontent[i].style.display = "none";
  }

  // check if clicked box was alread active, if so then kill all boxes
  if (boxname.includes("none") || evt.currentTarget.className.includes("active")) {
    killallboxes = 1;
  }

  // deactivate anything named mode-button
  boxlinks= document.getElementsByClassName("mode-button");
  for (i=0; i<boxlinks.length; i++){
    boxlinks[i].className = boxlinks[i].className.replace(" active","");
  }

  // kill story button
  document.getElementById('nextbutton').style.display = 'none';
  document.getElementById('backbutton').style.display = 'none';

  // clear explore box
  var blankgeojson = {
    "type": "FeatureCollection",
    "features": []
  };
  map.getSource('single-point').setData(blankgeojson);
  document.getElementById('map-overlay-info').innerHTML = '';

  // turn off all listeners, SMIA layer popup
  map.off('click', query_point)
  smia_hover_toggle(false,false)

  if (killallboxes!=1) {
    // show the current box and make it active!
    document.getElementById(boxname).style.display = "block";
    evt.currentTarget.className += " active";

    // manage listeners
    if (evt.currentTarget.id.includes("story")) {
      // listeners are in story_display_page
      global_page = 0;
      story_display_page(global_page)
    } else if (evt.currentTarget.id.includes("explore")) {
      // turn on point querying listener
      map.on('click',query_point);
    } else if (evt.currentTarget.id.includes("about")) {
      // show overlay
      document.getElementById('aboutoverlay').style.display="block";
    }
  }
}
