'use client';
import './mapstyles.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { geoJSONData } from '../utils/constants/geoData';

function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207]; // Latitude and Longitude of Knoxville, TN
  const style = () => ({
    fillColor: 'blue',
    weight: 2,
    fillOpacity: 0.1,
  });

  return (
    <div
      style={{
        width: '100%',
        height: '50%',
      }}
    >
      <MapContainer
        center={knoxvillePosition}
        zoom={13}
        style={{
          maxWidth: '500px',
          maxHeight: '500px',
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoJSONData} style={style} />
      </MapContainer>
    </div>
  );
}

export default Map;
