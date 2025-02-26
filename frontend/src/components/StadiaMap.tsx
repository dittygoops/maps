import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

// Ensure your API key is stored securely, for example in an environment variable (e.g., REACT_APP_STADIA_API_KEY)
const apiKey = '4898770a-131b-4189-8501-35036971faa9';

const StadiaMap: React.FC = () => {
  // Construct the tile URL by embedding your API key as a query parameter.
  const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${apiKey}`;

  return (
    <MapContainer 
      center={[59.444351, 24.750645]} 
      zoom={14}
      className="h-screen w-full"  // Tailwind classes for full-screen map
    >
      <TileLayer
        url={tileUrl}
        attribution='© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors'
      />
    </MapContainer>
  );
};

export default StadiaMap;
