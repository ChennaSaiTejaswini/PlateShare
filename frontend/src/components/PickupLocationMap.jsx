import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PickupLocationMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default: India

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect({ lat: e.latlng.lat, lon: e.latlng.lng });
      },
    });

    return <Marker position={position} />;
  };

  return (
    <MapContainer center={position} zoom={5} className="leaflet-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default PickupLocationMap;
