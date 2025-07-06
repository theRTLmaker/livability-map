'use client'
import React, { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import SliderPanel from '../components/SliderPanel'

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
})

export default function Home() {
  const [tubeWeight, setTubeWeight] = useState(50)
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex h-full">
      {/* Map container */}
      <div className="flex-1 m-4 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
        <Map weight={tubeWeight} />
      </div>

      {/* Slider panel */}
      <div className="w-80 m-4">
        <SliderPanel
          value={tubeWeight}
          onChange={(v) => startTransition(() => setTubeWeight(v))}
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