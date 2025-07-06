'use client'
import React, { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import SliderPanel from '../components/SliderPanel'

// client-only map
const Map = dynamic(() => import('../components/Map'), { ssr: false })

// weight object type
interface Weights {
  tube: number
  fav: number
  big: number
}

export default function Home() {
  const [weights, setWeights] = useState<Weights>({
    tube: 50,
    fav: 50,
    big: 50
  })
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex h-full">
      {/* Map container */}
      <div className="flex-1 m-4 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
        <Map weights={weights} />
      </div>
      <div className="w-80 m-4">
        <SliderPanel
          weights={weights}
          onChange={(newWeights) =>
            startTransition(() => setWeights(newWeights))
          }
        />
        {isPending && (
          <div className="text-sm text-center text-gray-500 mt-2">
            Updating…
          </div>
        )}
      </div>
    </div>
  )
}