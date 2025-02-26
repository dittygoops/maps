import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerImg from '../assets/map-pin.svg';

// Create a custom grayscale marker icon.
const customGrayscaleIcon = L.icon({
  iconUrl: markerImg,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [60, 60], // size of the icon
  iconAnchor: [30, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [30, 30], // point from which the popup should open relative to the iconAnchor
  shadowSize: [60, 60], // size of the shadow
});

// Component that listens to map move events and updates the center state.
const CenterUpdater: React.FC<{ setCenter: React.Dispatch<React.SetStateAction<[number, number]>> }> = ({ setCenter }) => {
  useMapEvents({
    move: (event) => {
      const newCenter = event.target.getCenter();
      setCenter([newCenter.lat, newCenter.lng]);
    },
  });
  return null;
};

// RecenterMap component that updates the map view when center changes.
const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const StadiaMap: React.FC = () => {
  const defaultCenter: [number, number] = [59.444351, 24.750645];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [radius, setRadius] = useState<number>(402); // in meters

  // Use the Geolocation API once when the component mounts.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Error obtaining geolocation", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  }, []);

  // Construct the tile URL using your API key.
  const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAP_API_KEY}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <MapContainer center={center} zoom={16} className="h-screen w-full">
        <TileLayer
          url={tileUrl}
          attribution="© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors"
        />
        <Circle center={center} radius={radius} pathOptions={{ color: 'blue' }} />
        <Marker position={center} icon={customGrayscaleIcon}>
          <Popup>The map center</Popup>
        </Marker>
        {/* Update center state when the map is panned */}
        <CenterUpdater setCenter={setCenter} />
        {/* Recenter the map whenever the center state changes */}
        <RecenterMap center={center} />
      </MapContainer>
      
      <div className="p-4">
        <label htmlFor="radiusSlider" className="block mb-2 text-center">
          Adjust Search Radius: {(radius / 1609.34).toFixed(2)} miles
        </label>
        <input
          id="radiusSlider"
          type="range"
          min="0.25"
          max="5"
          step="0.25"
          value={(radius / 1609.34).toFixed(2)}
          onChange={(e) => setRadius(Number(e.target.value) * 1609.34)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StadiaMap;
