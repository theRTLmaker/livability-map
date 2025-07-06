'use client'
import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { Range } from 'react-range'

export default function SliderPanel() {
  const categories = ['Tube', 'Supermarkets', 'Shops'] as const
  const [weights, setWeights] = useState([50, 50, 50])  // init equal

  return (
    <aside className="w-64 bg-white p-4 space-y-6 shadow-lg">
      <h2 className="text-lg font-bold">Preferences</h2>
      {categories.map((cat, i) => (
        <div key={cat}>
          <label className="block mb-1 font-medium">{cat}</label>
          <Range
            step={1}
            min={0}
            max={100}
            values={[weights[i]]}
            onChange={vals => {
              const w = [...weights]; w[i] = vals[0]; setWeights(w)
            }}
            renderTrack={({ props, children }) => (
              <div {...props} className="h-1 bg-gray-200 rounded">
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div {...props} className="h-4 w-4 bg-blue-500 rounded-full" />
            )}
          />
          <div className="text-sm mt-1">{weights[i]}%</div>
        </div>
      ))}
    </aside>
  )
}