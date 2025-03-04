import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerImg from './../assets/map-pin.svg';
import InputSlider from './Slider';

// Create a custom grayscale marker icon.
const customGrayscaleIcon = L.icon({
  iconUrl: markerImg,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [60, 60], // size of the icon
  iconAnchor: [30, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [30, 30], // point from which the popup should open relative to the iconAnchor
  shadowSize: [60, 60], // size of the shadow
  shadowAnchor: [20, 30] // the same for the shadow
});

// RecenterMap component that updates the map view when center changes.
const RecenterMap: React.FC<{ center: [number, number], setCenter: React.Dispatch<React.SetStateAction<[number, number]>>, setCircleCenter: React.Dispatch<React.SetStateAction<[number, number]>> }> = ({ center, setCenter, setCircleCenter }) => {
  const map = useMap();

  // Update the map view when the center changes.
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  useMapEvents({
    // Update the circle and marker center when the map is dragged.
    move: (event) => {
      const newCenter = event.target.getCenter();
      setCircleCenter([newCenter.lat, newCenter.lng]);
    },

    // Update the center when the map is dragged.
    drag: (event) => {
      const newCenter = event.target.getCenter();
      setCenter([newCenter.lat, newCenter.lng]);
    },
    
    // Fly to the clicked location and update the center.
    click: (event) => {
      event.target.flyTo(event.latlng, event.target.getZoom(), {
        animate: true,
        duration: 2.5, // duration in seconds
      });

      setCenter([event.latlng.lat, event.latlng.lng]);
    }
  });
  return null;
};

interface StadiaMapProps {
  center: [number, number];
  setCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
}

const StadiaMap: React.FC<StadiaMapProps> = ({ center, setCenter, radius, setRadius }) => {
  const [circleCenter, setCircleCenter] = useState<[number, number]>(center);

  // Get the user's current location and set the map center.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setCircleCenter([latitude, longitude]);
        },
        (error: GeolocationPositionError) => {
          console.error("Error obtaining geolocation", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  }, []);

  // Stadia Maps tile URL with API key.
  const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAP_API_KEY}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <MapContainer center={center} zoom={16} className="h-screen w-full">
        <TileLayer
          url={tileUrl}
          attribution="© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors"
        />
        <Circle center={circleCenter} radius={radius * 1609.34} pathOptions={{ color: 'blue' }} />
        <Marker position={circleCenter} icon={customGrayscaleIcon}></Marker>
        <RecenterMap center={center} setCenter={setCenter} setCircleCenter={setCircleCenter} />
      </MapContainer>
      <InputSlider value={radius} onChange={setRadius} />
    </div>
  );
};

export default StadiaMap;
