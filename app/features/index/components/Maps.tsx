import { useEffect } from 'react'
import { MapContainer, useMapEvents } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import { useFormContext } from 'react-hook-form'
import type { FullFormType } from '~/global-validation/validation-step-schemas'


// Component untuk handle click pada map
function LocationMarker({ 
  position
}: { 
  position: [number, number] | null;
}) {
  const { setValue } = useFormContext<FullFormType>();
  const map = useMapEvents({
    click(e) {
      const newLat = e.latlng.lat.toString();
      const newLng = e.latlng.lng.toString();
      
      // Update form values
      setValue('latitude', newLat, { shouldValidate: true });
      setValue('longitude', newLng, { shouldValidate: true });
      
      // Update position in parent state
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component untuk fly to location
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

interface MapsProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  height?: string;
  zoom?: number;
}

export default function Maps({ 
  position, 
  setPosition, 
  height = "h-64",
  zoom = 13 
}: MapsProps) {
  const { setValue } = useFormContext<FullFormType>();
  
  // Update form values when position changes
  useEffect(() => {
    if (position) {
      setValue('latitude', position[0].toString(), { shouldValidate: true });
      setValue('longitude', position[1].toString(), { shouldValidate: true });
    }
  }, [position, setValue]);

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${height} relative`}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} />
        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
}