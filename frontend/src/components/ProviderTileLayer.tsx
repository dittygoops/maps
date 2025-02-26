// ProviderTileLayer.tsx
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-providers';

interface ProviderTileLayerProps {
  provider: string;
  options?: L.TileLayerOptions;
}

const ProviderTileLayer: React.FC<ProviderTileLayerProps> = ({ provider, options }) => {
  const map = useMap();

  useEffect(() => {
    // Create the tile layer using the provider string (for example, "Stamen.TonerLite" for a grayscale look)
    const tileLayer = (L.tileLayer as any).provider(provider, options);
    tileLayer.addTo(map);
    return () => {
      // Remove the layer when the component unmounts
      map.removeLayer(tileLayer);
    };
  }, []);

  return null;
};

export default ProviderTileLayer;
