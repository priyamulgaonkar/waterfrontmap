rm ../Data/data.mbtiles

tippecanoe -o ../Data/data.mbtiles -Z 10 -z 13 --drop-densest-as-needed -r1 ../Data/reduced_census.geojson ../Data/SMIA_halfmilebuffer_full.geojson ../Data/nyzd.geojson ../Data/storm_surge_min.json ../Data/Neighborhood_Map.geojson ../Data/TRI_converted.json ../Data/smia.json ../Data/MOSF_converted.json ../Data/CBS_converted.json ../Data/SUPERFUND2_converted.json ../Data/Hurricane-Evacuation-Zones.json ../Data/smia_coordinates.geojson ../Data/CDdata_converted.geojson
