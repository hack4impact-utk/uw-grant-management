'use client';
import React, { useRef, useEffect, useState } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { StyleFunction } from 'leaflet';
import L, { LatLngTuple } from 'leaflet';
import { geoJSONData } from '../../utils/constants/geoData';
import { Feature as GeoJSONFeature, Geometry } from 'geojson';
//import { scaleQuantile } from 'd3-scale';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Defining the Map component
function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);
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

  // this function broke last minute

  // const clientsServedArray = Object.values(zipCodeData);
  // const quantileScale = scaleQuantile()
  //   .domain(clientsServedArray)
  //   .range([
  //     "rgba(205, 21, 21, 0.8)",
  //     "rgba(205, 92, 92, 0.8)",
  //     "rgba(196, 229, 33, 0.53)",
  //     "rgba(103, 187, 47, 0.6)",
  //     "rgba(150, 222, 57, 0.5)",
  //     "rgba(35, 222, 67, 0.9)",
  //   ]);
  // const getColor = (clientsServed) => {
  //   return quantileScale(clientsServed);
  // };

  const getColor = (clientsServed: number) => {
    const ratio = clientsServed / 100;
    return `rgba(${255 * (1 - ratio)}, ${255 * ratio}, 0, 0.7)`;
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

  const onEachFeature = (
    feature: GeoJSONFeature<Geometry, any>,
    layer: L.Layer
  ) => {
    layer.bindPopup('Loading...');
    layer.on(
      'popupopen',
      async (e: { popup: { setContent: (arg0: string) => void } }) => {
        const zipCode = feature.properties?.ZCTA5CE10;
        const clientsServed = zipCodeData[zipCode];
        const popupContent = `Zip Code: ${zipCode}, Clients Served: ${clientsServed || 'No data'}`;
        e.popup.setContent(popupContent);
      }
    );
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
    </div>
  );
}

export default Map;
