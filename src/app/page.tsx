'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import SliderPanel from '../components/SliderPanel'

// Lazy-load the Map component so it never runs on the server
const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})

export default function Home() {
  return (
    <div className="flex h-full">
      {/* Map container as a card */}
      <div className="flex-1 m-4 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
        <Map />
      </div>

      {/* Slider panel as a translucent card */}
      <div className="w-80 m-4">
        <SliderPanel />
      </div>
    </div>
  )
}