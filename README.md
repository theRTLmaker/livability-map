# Livability Map

An interactive Next.js app to help you find the best places to live in London based on your personal preferences (proximity to Tube stations, supermarkets, shops, etc.).

## Features

- **Realtime choropleth**: Shade London by a weighted “livability” score.
- **Custom weights**: Adjust sliders for Tube access, groceries, coffee shops, etc.
- **Interactive map**: Built with React-Leaflet and OpenStreetMap tiles.
- **Modular data**: Add or remove GeoJSON layers as you like.

## Tech Stack

- **Next.js 13** (App Router)
- **TypeScript**, **Tailwind CSS**, **ESLint**, **Prettier**
- **React-Leaflet** for maps
- **Turf.js** (planned) for spatial scoring

## Getting Started

### Prerequisites

- [Node.js ≥ 18](https://nodejs.org/) (we pin via `.nvmrc`)
- [Yarn](https://yarnpkg.com/)

### Installation

```bash
# Clone & enter
git clone <your-repo-url> livability-map
cd livability-map

# Use the right Node version
nvm use

# Install deps
yarn
```

# Running locally
```bash
yarn dev
```

Open http://localhost:3000 to see the map.

# Project Structure

```bash
livability-map/
├─ public/data/       # GeoJSON dumps (Tube stops, shops…)
├─ src/
│  ├─ app/            # Next.js App Router files
│  └─ components/     # Map, SliderPanel, etc.
├─ .nvmrc             # Node version
├─ .gitignore
├─ README.md
└─ package.json
```