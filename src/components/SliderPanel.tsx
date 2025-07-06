'use client'
import React from 'react'
import { Range } from 'react-range'

interface Weights {
  tube: number
  fav: number
  big: number
}

interface SliderPanelProps {
  weights: Weights
  onChange: (w: Weights) => void
}

export default function SliderPanel({ weights, onChange }: SliderPanelProps) {
  const cats: { key: keyof Weights; label: string }[] = [
    { key: 'tube', label: 'Tube Stops' },
    { key: 'fav',  label: 'Favourites' },
    { key: 'big',  label: 'Big Chains' },
  ]

  return (
    <aside className="bg-white/75 backdrop-blur-sm rounded-xl p-6 shadow-xl ring-1 ring-gray-200 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Preferences</h2>
      {cats.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-sm text-gray-600">
              {weights[key]}%
            </span>
          </div>
          <Range
            step={1}
            min={0}
            max={100}
            values={[weights[key]]}
            onChange={([v]) =>
              onChange({ ...weights, [key]: v } as Weights)
            }
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-1 w-full bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                {children}
              </div>
            )}
            renderThumb={({ props: thumbProps }) => {
              const { key: thumbKey, ...rest } = thumbProps
              return (
                <div
                  {...rest}
                  key={thumbKey}
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