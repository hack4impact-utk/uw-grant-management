'use client';
import './mapstyles.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple, Icon } from 'leaflet';

function Map() {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207]; // Latitude and Longitude of Knoxville, TN

  const redMarker = new Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
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
        <Marker position={knoxvillePosition} icon={redMarker}>
          <Popup>Knoxville, 37920</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
