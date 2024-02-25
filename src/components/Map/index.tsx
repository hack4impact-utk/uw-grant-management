'use client';
import React, { useRef, useEffect, useState } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

import { Drawer } from '../Drawer';
import Box from '@mui/material/Box';
import L, { LatLngTuple, StyleFunction } from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { geoJSONData } from '../../utils/constants/geoData';
import { NumberValue, scaleQuantile } from 'd3-scale';
import CircularProgress from '@mui/material/CircularProgress';

// Defining the Map component
export default function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedZipCode, setSelectedZipCode] = React.useState('');
  const [zipCodeData, setZipCodedata] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const getZipCodeData = async () => {
    setIsLoading(true);
    const response = await fetch('/api/zipcodes/');
    if (!response.ok) {
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    setZipCodedata(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getZipCodeData();
  }, []);

  // This groups each zipcode based on their clients served and assigns
  // the zipcode to a color
  const clientsServedArray = Object.values(zipCodeData).map(Number);

  const quantileScale = scaleQuantile()
    .domain(clientsServedArray)
    .range([0, 1, 2, 3, 4, 5]);

  const colors = [
    'rgba(255, 0, 0, 0.9)',
    'rgba(245, 80, 0, 0.8)',
    'rgba(235, 162, 0, 0.8)',
    'rgba(208, 224, 0, 0.8)',
    'rgba(150, 222, 57, 0.8)',
    'rgba(35, 222, 67, 0.9)',
  ];

  const getColor = (clientsServed: NumberValue) => {
    const index = quantileScale(clientsServed);
    return colors[index];
  };

  const getStyle: StyleFunction<any> = (feature) => {
    const clientServed = zipCodeData[feature?.properties.ZCTA5CE10] || 0;
    const fillColor = getColor(clientServed);

    return {
      fillColor,
      color: '#444',
      weight: 2,
      fillOpacity: 0.5,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, any>, layer: L.Layer) => {
    const zipCode = feature.properties.ZCTA5CE10;

    layer.bindPopup('Loading...');
    layer.on(
      'popupopen',
      async (e: { popup: { setContent: (arg0: string) => void } }) => {
        const clientsServed = zipCodeData[zipCode];
        const popupContent = `Zip Code: ${zipCode}, Clients Served: ${clientsServed || 'No data'}`;
        e.popup.setContent(popupContent);
      }
    );

    layer.on({
      click: () => handleLayerClick(zipCode),
    });
  };

  const handleLayerClick = (zipCode: string) => {
    setSelectedZipCode(zipCode);
    setDrawerOpen(true);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <CircularProgress size="4rem" />
        </Box>
      ) : (
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
      )}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <p>Zip Code: {selectedZipCode}</p>
        </Box>
      </Drawer>
    </div>
  );
}
