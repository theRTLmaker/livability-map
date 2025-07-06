// src/hooks/useScores.ts
import { useMemo } from 'react'
import * as turf from '@turf/turf'

type POIs = {
  tubeStops: turf.FeatureCollection<turf.Point> | null
  fav:       turf.FeatureCollection<turf.Point> | null
  big:       turf.FeatureCollection<turf.Point> | null
}
type Weights = {
  tube: number
  fav:  number
  big:  number
}

// Precompute this once at 500 m resolution (≈0.5 km)
const BASE_GRID = turf.squareGrid(
  [-0.5631, 51.2613, 0.2800, 51.6860],
  0.5,
  { units: 'kilometers' }
)

/**
 * Returns a scored FeatureCollection of the same geometry as BASE_GRID,
 * but with per-cell props: { score, distance: {…}, hasPOI: {…} }
 */
export function useScores(pois: POIs, w: Weights) {
  return useMemo(() => {
    const { tubeStops, fav, big } = pois
    if (!tubeStops || !fav || !big) return null

    // Clone & score the base grid
    const grid: turf.FeatureCollection<turf.Polygon> = {
      type: 'FeatureCollection',
      features: BASE_GRID.features.map((cell) => {
        const center = turf.centerOfMass(cell)

        function scoreCat(
          fc: turf.FeatureCollection<turf.Point>,
        ) {
          const inside = turf.pointsWithinPolygon(fc, cell).features.length > 0
          if (inside) return { raw: 1, dist: 0, has: true }

          const nearest = turf.nearestPoint(center, fc)
          const dist = turf.distance(center, nearest, { units: 'kilometers' })
          const raw  = 1 - Math.min(dist, 5) / 5
          return { raw, dist, has: false }
        }

        const t = scoreCat(tubeStops)
        const f = scoreCat(fav)
        const b = scoreCat(big)

        // Weighted average of the three categories
        const totalW = (w.tube + w.fav + w.big) / 100 || 1
        const combined =
          (t.raw * (w.tube / 100) +
           f.raw * (w.fav   / 100) +
           b.raw * (w.big   / 100)) /
          totalW

        return turf.feature(cell.geometry, {
          score:    combined,
          distance: { tube: t.dist, fav: f.dist, big: b.dist },
          hasPOI:   { tube: t.has,  fav: f.has,  big: b.has },
        })
      }),
    }

    return grid
  }, [pois, w])
}