'use client'
import React, { useState } from 'react'
import { Range } from 'react-range'

export default function SliderPanel() {
  const categories = ['Tube', 'Supermarkets', 'Shops'] as const
  const [weights, setWeights] = useState([50, 50, 50])

  return (
    <aside className="bg-white/75 backdrop-blur-sm rounded-xl p-6 shadow-xl ring-1 ring-gray-200 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Preferences</h2>

      {categories.map((cat, i) => (
        <div key={cat} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{cat}</span>
            <span className="text-sm text-gray-600">{weights[i]}%</span>
          </div>
          <Range
            step={1}
            min={0}
            max={100}
            values={[weights[i]]}
            onChange={(vals) => {
              const w = [...weights]
              w[i] = vals[0]
              setWeights(w)
            }}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-1 w-full bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                {children}
              </div>
            )}
            renderThumb={({ props: thumbProps }) => {
              const { key, ...rest } = thumbProps
              return (
                <div
                  {...rest}
                  key={key}
                  className="h-5 w-5 bg-blue-600 rounded-full shadow-md hover:scale-110 transition-transform"
                />
              )
            }}
          />
        </div>
      ))}
    </aside>
  )
}