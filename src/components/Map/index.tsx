'use client';
import React, { useRef } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { LatLngTuple, Layer, LeafletMouseEvent } from 'leaflet';
import { geoJSONData } from '../../utils/constants/geoData';

function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);

  const style = () => ({
    fillColor: 'blue',
    weight: 2,
    fillOpacity: 0.1,
  });

  const highlightFeature = (e: LeafletMouseEvent) => {
    const layer = e.target as L.Path;
    layer.setStyle({
      fillOpacity: 0.5,
    });
  };

  const resetHighlight = (e: LeafletMouseEvent) => {
    const layer = e.target as L.Path;
    layer.setStyle({
      fillOpacity: 0.1,
    });
    layer.closePopup();
  };

  const handleLayerMouseover = (e: LeafletMouseEvent, layer: Layer) => {
    highlightFeature(e);
    layer.openPopup(e.target.getBounds().getCenter());
  };

  const handleLayerMouseout = (e: LeafletMouseEvent, layer: Layer) => {
    resetHighlight(e);
    layer.closePopup();
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const zipCode = feature.properties?.ZCTA5CE10 as string;
    layer.on({
      mouseover: (e) => handleLayerMouseover(e, layer),
      mouseout: (e) => handleLayerMouseout(e, layer),
      click: () => alert(`Zip code: ${zipCode}`),
    });

    layer.bindPopup(zipCode);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={knoxvillePosition}
        zoom={10}
        style={{ height: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geoJSONData}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}

export default Map;
