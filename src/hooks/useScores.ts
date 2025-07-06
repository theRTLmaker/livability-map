// src/hooks/useScores.ts
import { useMemo } from 'react'
import * as turf from '@turf/turf'

// London's bounding box
const LONDON_BBOX: turf.BBox = [
  -0.5631, // west
  51.2613, // south
  0.2800,  // east
  51.6860, // north
]

/**
 * Returns a squareGrid (1 km cells) where each feature has:
 * { score: 0–1, distance: km, hasPOI: boolean }
 */
export function useScores(
  tubeStops: turf.FeatureCollection<turf.Point> | null,
  weight: number
) {
  return useMemo(() => {
    if (!tubeStops) return null

    // 1. 100 m squares
    const grid = turf.squareGrid(LONDON_BBOX, 1, { units: 'kilometers' })

    // 2. Tag & score each cell
    grid.features = grid.features.map((cell) => {
      const center = turf.centerOfMass(cell)
      const nearest = turf.nearestPoint(center, tubeStops)
      const dist = turf.distance(center, nearest, { units: 'kilometers' })

      // any station inside this cell?
      const ptsInside = turf.pointsWithinPolygon(tubeStops, cell)
      const hasPOI = ptsInside.features.length > 0

      // raw score: cap at 5 km
      const capped = Math.min(dist, 5)
      const raw = 1 - capped / 5      // 1 @ 0 km, 0 @ ≥5 km
      const score = raw * (weight / 100)

      return turf.feature(cell.geometry, {
        score,
        distance: dist,
        hasPOI,
      })
    })

    return grid
  }, [tubeStops, weight])
}