import { useMemo } from 'react'
import * as turf from '@turf/turf'

export function useScores(
  tubeStops: turf.FeatureCollection,
  weights: number[]
) {
  return useMemo(() => {
    // TODO: compute a score grid or per-point score:
    // 1. For each cell/point: distance to nearest tubeStops
    // 2. Map distance → score, multiply by weights[0]
    // 3. (Later) add other categories
    return []
  }, [tubeStops, weights])
}