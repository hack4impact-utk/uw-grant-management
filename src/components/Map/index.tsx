'use client';
import React, { useRef, useEffect, useState } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

import { Drawer } from '../Drawer';
import Box from '@mui/material/Box';
import L, { LatLngTuple, StyleFunction } from 'leaflet';
import { geoJSONData } from '../../utils/constants/geoData';
import { Feature, Geometry } from 'geojson';

// Defining the Map component
function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedZipCode, setSelectedZipCode] = React.useState('');

  const getColor = (clientsServed: number) => {
    const ratio = clientsServed / 100;
    return `rgba(${255 * (1 - ratio)}, ${255 * ratio}, 0, 0.7)`;
  };

  const [zipCodeData, setZipCodedata] = useState<Record<string, number>>({});

  const getZipCodeData = async () => {
    const response = await fetch('/api/zipcodes/');
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setZipCodedata(data.data);
  };

  useEffect(() => {
    getZipCodeData();
  }, []);

  // Function definitions related to Leaflet and styling
  const getStyle: StyleFunction = (feature) => {
    const clientsServed = zipCodeData[feature?.properties?.ZCTA5CE10] || 0;
    const fillColor = getColor(clientsServed);

    return {
      fillColor,
      color: '#444',
      weight: 2,
      fillOpacity: 0.5,
    };
  };

  const onEachFeature = (
    feature: Feature<Geometry, any>,
    layer: L.Layer
  ) => {
    if (layer instanceof L.Path) {
      const zipCode = feature.properties.ZCTA5CE10;
      const clientsServed = zipCodeData[zipCode];
      const fillColor = getColor(clientsServed);

      layer.setStyle({
        fillColor: fillColor,
        color: '#333',
        weight: 2,
        fillOpacity: 0.5,
      });

      const popupContent = `Zip Code: ${zipCode}, Clients Served: ${clientsServed || 'No data'}`;
      layer.bindPopup(popupContent);

      layer.on({
        click: () => handleLayerClick(zipCode),
      });
    }
  }

  const handleLayerClick = (zipCode: string) => {
    setSelectedZipCode(zipCode);
    setDrawerOpen(true);
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
          style={getStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <p>Zip Code: {selectedZipCode}</p>
        </Box>
      </Drawer>
    </div>
  );
}

export default Map;
