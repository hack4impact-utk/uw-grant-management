"use client"
import React, { useRef, useState } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { LatLngTuple, Layer, LeafletMouseEvent } from 'leaflet';
import { geoJSONData } from '../../utils/constants/geoData';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

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
    setHoveredRegion(null);
  };

  const handleLayerMouseover = (e: LeafletMouseEvent, layer: Layer) => {
    highlightFeature(e);
    const zipCode = (e.target as any).feature.properties?.ZCTA5CE10 as string;
    setHoveredRegion(zipCode);
  };

  const handleLayerMouseout = (e: LeafletMouseEvent, layer: Layer) => {
    resetHighlight(e);
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
          onEachFeature={(feature, layer) => {
            layer.on({
              mouseover: (e: LeafletMouseEvent) => handleLayerMouseover(e, layer),
              mouseout: (e: LeafletMouseEvent) => handleLayerMouseout(e, layer),
            });
          }}
        />
      </MapContainer>
      {hoveredRegion && (
        <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
          <CardContent>
            <h2>{hoveredRegion}</h2>
            {/* Add additional content as needed */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Map;
