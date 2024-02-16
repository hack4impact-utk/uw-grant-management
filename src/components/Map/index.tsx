'use client';
import React, { useRef, useEffect, useState } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { PathOptions } from 'leaflet';

import L, { LatLngTuple } from 'leaflet';
import { geoJSONData } from '../../utils/constants/geoData';
// import chroma from 'chroma-js';
// import { NextApiRequest, NextApiResponse } from 'next';

// Defining the Map component
function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);

  //I was unable to work-out issues with my API, so I wasn't able to get the query
  // part of my issue done
  const sampleZipCodeData: Record<string, number> = {
    '37919': 50,
    '37920': 20,
    '37921': 80,
    '37918': 45,
    '37917': 15,
    '37931': 51,
    '37914': 25,
    '37721': 75,
    '37938': 5,
    '37932': 13,
    '37922': 17,
    '37754': 63,
    '37924': 53,
    '37849': 13,
    '37912': 32,
    '37916': 12,
    '37915': 10,
    '37909': 24,
    '37934': 43,
    '37806': 10,
    '37923': 42,
  };

  const getColor = (clientsServed: number) => {
    const ratio = clientsServed / 100;
    return `rgba(${255 * (1 - ratio)}, ${255 * ratio}, 0, 0.7)`;
  };

  const [zipCodesData, setZipCodes] = useState<
    { zipCode: string; clientsServed: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/zipcodes/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array of zip codes and clients served
        const zipCodesInfo = data.data.map(
          (item: { zipCode: any; clientsServed: any }) =>
            `${item.zipCode}: ${item.clientsServed} clients`
        );
        setZipCodes(zipCodesInfo); // Set your state here
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data'); // Handle errors
      });
  }, []);

  // Function definitions related to Leaflet and styling
  const getStyle: L.StyleFunction = (feature: any): PathOptions => {
    const clientsServed = sampleZipCodeData[feature.properties.ZCTA5CE10] || 0;
    const fillColor = getColor(clientsServed);

    return {
      fillColor,
      color: '#444',
      weight: 2,
      fillOpacity: 0.5,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (layer instanceof L.Path) {
      const zipCode = feature.properties?.ZCTA5CE10;
      const clientsServed = sampleZipCodeData[zipCode];

      const fillColor = getColor(clientsServed);

      layer.setStyle({
        fillColor: fillColor,
        color: '#333',
        weight: 2,
        fillOpacity: 0.5,
      });

      const popupContent = `Zip Code: ${zipCode}, Clients Served: ${clientsServed || 'No data'}`;
      layer.bindPopup(popupContent);
    }
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
      {error && <p>Error: {error}</p>}
      <ul>
        {zipCodesData.map((item, index) => (
          <li key={index}>
            Zip Code: {item.zipCode}, Clients Served: {item.clientsServed}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Map;
