'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Map, { Source, Layer, NavigationControl, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { AlertTriangle, CheckCircle2, Info, Activity } from 'lucide-react'

// ─── Satellite Style ─────────────────────────────────────────────────────────
const SATELLITE_STYLE = {
  version: 8,
  name: 'GreenProof Satellite',
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Esri, Maxar',
    },
  },
  layers: [{ id: 'satellite-base', type: 'raster', source: 'esri-satellite' }],
} as any

const BASE_LAT = -1.9200   // Central Kalimantan — deep plantation concession, no settlements
const BASE_LNG = 113.6800

// ─── Drone Fleet Positions ────────────────────────────────────────────────────
const DRONES = [
  { id: 'GP-D01', lat: BASE_LAT + 0.003,  lng: BASE_LNG - 0.002, status: 'FLYING',   battery: 78, heading: 45  },
  { id: 'GP-D02', lat: BASE_LAT - 0.001,  lng: BASE_LNG + 0.003, status: 'FLYING',   battery: 45, heading: 120 },
  { id: 'GP-D03', lat: BASE_LAT + 0.005,  lng: BASE_LNG + 0.001, status: 'FLYING',   battery: 91, heading: 270 },
]

// ─── Anomaly Pins ─────────────────────────────────────────────────────────────
const ANOMALY_PINS = [
  { id: 'ANM-089', lat: BASE_LAT + 0.0015, lng: BASE_LNG - 0.001,  severity: 'critical', type: 'Ganoderma',       block: 'KB-C3' },
  { id: 'ANM-088', lat: BASE_LAT - 0.002,  lng: BASE_LNG - 0.0005, severity: 'high',     type: 'Drainase',         block: 'KT-B1' },
  { id: 'ANM-086', lat: BASE_LAT + 0.0005, lng: BASE_LNG - 0.0025, severity: 'critical', type: 'BSR Suspect',      block: 'KB-A1' },
  { id: 'ANM-085', lat: BASE_LAT - 0.004,  lng: BASE_LNG + 0.002,  severity: 'low',      type: 'Def. Boron',       block: 'MT-C2' },
  { id: 'ANM-087', lat: BASE_LAT - 0.001,  lng: BASE_LNG - 0.0015, severity: 'medium',   type: 'Crown Disease',    block: 'KB-D2' },
]

const SEV_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#6b7280',
}

// ─── Generate Estate Block Grid ───────────────────────────────────────────────
function generateBlocks(estateCode: string, centerLat: number, centerLng: number, rows: number, cols: number, blockDeg = 0.003) {
  const features = []
  const startLat = centerLat - (rows * blockDeg) / 2
  const startLng = centerLng - (cols * blockDeg) / 2

  const FLAGGED  = new Set(['KB-C3', 'KB-D2', 'KB-A1', 'KT-B1'])
  const ACTIVE   = new Set(['KB-C4', 'KB-F2', 'KT-A3', 'KT-G5', 'MT-B1'])
  const FINISHED = new Set(['KB-A2', 'KT-B2', 'MT-C1'])

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rowChar = String.fromCharCode(65 + r)
      const blockId = `${estateCode}-${rowChar}${c + 1}`
      const swLng = startLng + c * blockDeg
      const swLat = startLat + (rows - 1 - r) * blockDeg
      const neLng = swLng + blockDeg
      const neLat = swLat + blockDeg
      let taskStatus = 'safe'
      if (FLAGGED.has(blockId))  taskStatus = 'flagged'
      else if (ACTIVE.has(blockId))   taskStatus = 'active'
      else if (FINISHED.has(blockId)) taskStatus = 'finished'

      features.push({
        type: 'Feature' as const,
        properties: { blockId, estate: estateCode, taskStatus },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[swLng, swLat], [swLng, neLat], [neLng, neLat], [neLng, swLat], [swLng, swLat]]],
        },
      })
    }
  }
  return features
}

// ─── Block fill layer (task-status coded) ────────────────────────────────────
const blockFillLayer: any = {
  id: 'block-fill',
  type: 'fill',
  paint: {
    'fill-color': [
      'match', ['get', 'taskStatus'],
      'flagged',  'rgba(239,68,68,0.35)',
      'active',   'rgba(234,179,8,0.30)',
      'finished', 'rgba(99,102,241,0.30)',
      'rgba(16,185,129,0.15)',
    ],
    'fill-outline-color': 'rgba(255,255,255,0.5)',
  },
}

const blockLabelLayer: any = {
  id: 'block-labels',
  type: 'symbol',
  layout: {
    'text-field': ['get', 'blockId'],
    'text-font':  ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 10,
    'text-anchor': 'center',
  },
  paint: {
    'text-color':       'rgba(255,255,255,0.85)',
    'text-halo-color':  'rgba(0,0,0,0.7)',
    'text-halo-width':  1.5,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MapOverview() {
  const [mounted, setMounted] = useState(false)
  const [dronePos, setDronePos] = useState(DRONES)
  const frameRef = useRef<number | null>(null)
  const lastRef  = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate drones slowly
  useEffect(() => {
    const animate = (ts: number) => {
      if (ts - lastRef.current > 1500) {
        lastRef.current = ts
        setDronePos(prev => prev.map(d => ({
          ...d,
          lat: d.lat + (Math.random() - 0.5) * 0.0003,
          lng: d.lng + (Math.random() - 0.5) * 0.0003,
          heading: (d.heading + (Math.random() - 0.5) * 10 + 360) % 360,
        })))
      }
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [])

  const geoJSON = useMemo(() => {
    const kb = generateBlocks('KB', BASE_LAT + 0.003, BASE_LNG - 0.002, 6, 6)
    const kt = generateBlocks('KT', BASE_LAT + 0.008, BASE_LNG + 0.005, 7, 5)
    const mt = generateBlocks('MT', BASE_LAT - 0.005, BASE_LNG + 0.003, 5, 4)
    return { type: 'FeatureCollection' as const, features: [...kb, ...kt, ...mt] }
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: '#0a1628' }}>
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#4b5563' }}>Memuat peta satellite…</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative" style={{ background: '#0a1628' }}>
      <Map
        initialViewState={{
          longitude: BASE_LNG,
          latitude:  BASE_LAT + 0.004,
          zoom:      14,
          pitch:     60,
          bearing:   -20,
        }}
        mapStyle={SATELLITE_STYLE}
        interactive={true}
        dragPan={true}
        dragRotate={true}
        scrollZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Block NDVI / Task-Status overlay */}
        <Source id="estate-blocks" type="geojson" data={geoJSON}>
          <Layer {...blockFillLayer} />
          <Layer {...blockLabelLayer} />
        </Source>

        {/* Drone markers */}
        {dronePos.map(drone => (
          <Marker key={drone.id} longitude={drone.lng} latitude={drone.lat} anchor="center">
            <div className="flex flex-col items-center" style={{ transform: `rotate(${drone.heading}deg)` }}>
              {/* Drone SVG icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1"/>
                {/* Body */}
                <rect x="10" y="10" width="8" height="8" rx="2" fill="#10b981"/>
                {/* Arms */}
                <line x1="6" y1="6"   x2="10" y2="10" stroke="#10b981" strokeWidth="1.5"/>
                <line x1="22" y1="6"  x2="18" y2="10" stroke="#10b981" strokeWidth="1.5"/>
                <line x1="6" y1="22"  x2="10" y2="18" stroke="#10b981" strokeWidth="1.5"/>
                <line x1="22" y1="22" x2="18" y2="18" stroke="#10b981" strokeWidth="1.5"/>
                {/* Propellers */}
                <circle cx="6"  cy="6"  r="2.5" fill="#10b981" opacity="0.7"/>
                <circle cx="22" cy="6"  r="2.5" fill="#10b981" opacity="0.7"/>
                <circle cx="6"  cy="22" r="2.5" fill="#10b981" opacity="0.7"/>
                <circle cx="22" cy="22" r="2.5" fill="#10b981" opacity="0.7"/>
                {/* Direction indicator */}
                <polygon points="14,4 12,9 16,9" fill="white" opacity="0.9"/>
              </svg>
            </div>
          </Marker>
        ))}

        {/* Anomaly pins */}
        {ANOMALY_PINS.map(pin => {
          const color = SEV_COLOR[pin.severity]
          return (
            <Marker key={pin.id} longitude={pin.lng} latitude={pin.lat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div
                  className="rounded-lg px-2 py-1 shadow-lg"
                  style={{
                    background: 'rgba(15,23,42,0.90)',
                    border: `1px solid ${color}80`,
                    boxShadow: `0 0 12px ${color}40`,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 700, color, lineHeight: 1 }}>{pin.type}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{pin.block}</div>
                </div>
                {/* Anchor line */}
                <div className="w-0.5 h-4" style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }} />
                {/* Pulse dot */}
                <div className="relative w-3 h-3">
                  <div className="animate-ping absolute inset-0 rounded-full opacity-60" style={{ background: color }} />
                  <div className="absolute inset-0.5 rounded-full" style={{ background: color }} />
                </div>
              </div>
            </Marker>
          )
        })}

        <NavigationControl position="bottom-right" showCompass visualizePitch />
      </Map>

      {/* Block status legend */}
      <div className="absolute bottom-12 right-14 rounded-lg overflow-hidden" style={{ background: 'rgba(10,22,40,0.90)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
        <div className="px-3 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>STATUS BLOK</span>
        </div>
        <div className="px-3 py-2 flex flex-col gap-1">
          {[
            { color: 'rgba(16,185,129,0.7)',  label: 'Aman' },
            { color: 'rgba(234,179,8,0.7)',   label: 'Task Aktif' },
            { color: 'rgba(239,68,68,0.7)',   label: 'Flagged / Kritis' },
            { color: 'rgba(99,102,241,0.7)',  label: 'Selesai 24j' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: 'rgba(255,255,255,0.55)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
