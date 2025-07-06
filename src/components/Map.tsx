// src/components/Map.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// fix leaflet’s default icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:      require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:    require('leaflet/dist/images/marker-shadow.png'),
})

export default function Map() {
  // noop effect so this is purely client-side
  useEffect(() => {}, [])

  return (
    <MapContainer
      center={[51.5074, -0.1278]}
      zoom={12}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={[51.5074, -0.1278]}>
        <Popup>London</Popup>
      </Marker>
    </MapContainer>
  )
}