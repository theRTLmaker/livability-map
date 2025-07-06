'use client'
import Map from '../components/Map'
import SliderPanel from '../components/SliderPanel'

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <Map />
      </div>
      <div className="flex-none">
        <SliderPanel />
      </div>
    </div>
  )
}