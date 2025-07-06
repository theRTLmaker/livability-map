// src/hooks/useScores.ts
import { useMemo } from 'react'
import * as turf from '@turf/turf'

// London's approximate bounding box:
const LONDON_BBOX: turf.BBox = [
  -0.5631, // west
  51.2613, // south
  0.2800,  // east
  51.6860  // north
]

/**
 * Returns a FeatureCollection of square polygons,
 * each with a `score` property [0–1].
 */
export function useScores(
  tubeStops: turf.FeatureCollection<turf.Point>,
  weight: number  // just one category for now
) {
  return useMemo(() => {
    if (!tubeStops) return null

    // 1. Create a grid of 1km squares across the bbox
    const grid = turf.squareGrid(LONDON_BBOX, 1, { units: 'kilometers' })

    // 2. For each cell, compute distance to nearest stop
    grid.features = grid.features.map((cell) => {
      const center = turf.centerOfMass(cell)
      const nearest = turf.nearestPoint(center, tubeStops)
      const dist = turf.distance(center, nearest, { units: 'kilometers' })

      // 3. Convert to raw score: closer → higher score
      //    Let’s cap at 5km: anything beyond is zero.
      const capped = Math.min(dist, 5)
      const raw = 1 - capped / 5  // 1 at 0km, 0 at ≥5km

      // 4. Apply your weight (0–100 → 0–1)
      const score = raw * (weight / 100)

      // also store the actual distance (km) for styling
      return turf.feature(cell.geometry, {
        score,
        distance: dist
      })
    })

    return grid
  }, [tubeStops, weight])
}