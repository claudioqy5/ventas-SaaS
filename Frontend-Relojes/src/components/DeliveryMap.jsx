import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon for Next.js/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function LocationMarker({ position, setPosition, setAddressData }) {
  const map = useMap();
  
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      map.flyTo(e.latlng, map.getZoom());
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
          headers: { 'Accept-Language': 'es' }
        });
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          setAddressData(prev => ({
            ...prev,
            departamento: addr.state || addr.region || prev.departamento || '',
            provincia: addr.city || addr.county || prev.provincia || '',
            distrito: addr.suburb || addr.town || addr.village || addr.city_district || prev.distrito || '',
            direccion: `${addr.road || ''} ${addr.house_number || ''}`.trim() || prev.direccion || ''
          }));
        }
      } catch (err) {
        console.error("Error reverse geocoding:", err);
      }
    }
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function DeliveryMap({ mapPosition, setMapPosition, setDeliveryAddress }) {
  return (
    <MapContainer center={[mapPosition.lat, mapPosition.lng]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={mapPosition} setPosition={setMapPosition} setAddressData={setDeliveryAddress} />
    </MapContainer>
  );
}
