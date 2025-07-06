'use client'
import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from 'react-leaflet'
import { useScores } from '../hooks/useScores'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// fix Leaflet’s default icon URLs
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:      require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:    require('leaflet/dist/images/marker-shadow.png'),
})

interface MapProps { weight: number }
export default function Map({ weight }: MapProps) {
  const [tubeStops, setTubeStops] = useState<any>(null)

  useEffect(() => {
    fetch('/data/tube-stops.geojson')
      .then(res => res.json())
      .then(setTubeStops)
      .catch(console.error)
  }, [])

  // compute our grid of scored cells
  const scoreGrid = useScores(tubeStops, weight)

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

      {/* Choropleth: color each cell by score */}
      {scoreGrid && (
        <GeoJSON
          data={scoreGrid as any}
          style={(feature: any) => {
            const s = feature.properties.score
            // 0 → red (0°), 1 → green (120°)
            const hue = Math.round(s * 120)
            return {
              fillColor: `hsl(${hue}, 100%, 50%)`,
              fillOpacity: 0.4,
              weight: 0,
            }
          }}
        />
      )}

      {tubeStops && (
        <GeoJSON
          data={tubeStops}
          pointToLayer={(_, latlng) =>
            L.circleMarker(latlng, { radius: 4 })
          }
          onEachFeature={(feature, layer) => {
            const name = (feature.properties as any)?.name
            if (name) layer.bindPopup(name)
          }}
        />
      )}
    </MapContainer>
  )
}