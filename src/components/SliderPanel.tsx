'use client'
import React, { useState } from 'react'
import { Range } from 'react-range'

interface SliderPanelProps {
  value: number
  onChange: (v: number) => void
}

export default function SliderPanel({ value, onChange }: SliderPanelProps) {
  const label = 'Tube'

  return (
    <aside className="bg-white/75 backdrop-blur-sm rounded-xl p-6 shadow-xl ring-1 ring-gray-200 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Preferences</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
        <Range
          step={1}
          min={0}
          max={100}
          values={[value]}
          onChange={([v]) => onChange(v)}
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
    </aside>
  )
}