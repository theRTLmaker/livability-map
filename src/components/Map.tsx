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

// fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
})

interface MapProps {
  weights: { tube: number; fav: number; big: number }
}

export default function Map({ weights }: MapProps) {
  const [tubeStops, setTubeStops] = useState<any>(null)
  const [favSupers, setFavSupers] = useState<any>(null)
  const [bigSupers, setBigSupers] = useState<any>(null)

  useEffect(() => {
    type Setter = (data: any) => void

    const sources: { url: string; setter: Setter }[] = [
      { url: '/data/tube-stops.geojson',       setter: setTubeStops },
      { url: '/data/fav-supermarkets.geojson', setter: setFavSupers },
      { url: '/data/big-chains.geojson',       setter: setBigSupers },
    ]

    const EMPTY_FC = { type: 'FeatureCollection', features: [] }

    sources.forEach(({ url, setter }) => {
      fetch(url)
        .then(res => {
          if (!res.ok) {
            console.warn(`⚠️  ${url} returned ${res.status}, using empty GeoJSON`)
            return EMPTY_FC
          }
          return res.json().catch(() => {
            console.warn(`⚠️  Failed parsing JSON from ${url}, using empty GeoJSON`)
            return EMPTY_FC
          })
        })
        .then(setter)
        .catch(err => {
          console.error(`❌  Error fetching ${url}:`, err)
          setter(EMPTY_FC)
        })
    })
  }, [])

  const scoreGrid = useScores(
    { tubeStops, fav: favSupers, big: bigSupers },
    weights
  )

  return (
    <MapContainer
      center={[51.5074, -0.1278]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Choropleth: color each cell by score */}
      {scoreGrid && (
        <GeoJSON
          data={scoreGrid as any}
          style={(feat: any) => {
            const s = feat.properties.score
            const hue = Math.round(s * 120) // 0=red →120=green
            return {
              fillColor: `hsl(${hue},100%,50%)`,
              fillOpacity: 0.4,
              weight: 0,
            }
          }}
        />
      )}

      {/* raw POI dots */}
      {tubeStops && (
        <GeoJSON
          data={tubeStops}
          pointToLayer={(_, latlng) =>
            L.circleMarker(latlng, { radius: 4, color: '#0066cc' })
          }
        />
      )}
      {favSupers && (
        <GeoJSON
          data={favSupers}
          pointToLayer={(_, latlng) =>
            L.circleMarker(latlng, { radius: 4, color: '#22c55e' })
          }
        />
      )}
      {bigSupers && (
        <GeoJSON
          data={bigSupers}
          pointToLayer={(_, latlng) =>
            L.circleMarker(latlng, { radius: 4, color: '#f59e0b' })
          }
        />
      )}
    </MapContainer>
  )
}