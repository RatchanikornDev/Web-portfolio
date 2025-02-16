'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Color } from 'three'
import ThreeGlobe from 'three-globe'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import countries from '@/data/globe.json'

declare module '@react-three/fiber' {
  interface ThreeElements {
    threeGlobe: typeof ThreeGlobe
  }
}

extend({ ThreeGlobe })

const RING_PROPAGATION_SPEED = 3

type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

export type GlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: {
    lat: number
    lng: number
  }
  autoRotate?: boolean
  autoRotateSpeed?: number
}

interface WorldProps {
  globeConfig: GlobeConfig
  data: Position[]
}

let numbersOfRings = [0]

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number
        order: number
        color: (t: number) => string
        lat: number
        lng: number
      }[]
    | null
  >(null)

  const globeRef = useRef<ThreeGlobe | null>(null)

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: 'rgba(255,255,255,0.7)',
    globeColor: '#1d072e',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  }

  const _buildMaterial = useCallback(() => {
    if (!globeRef.current) return

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color
      emissive: Color
      emissiveIntensity: number
      shininess: number
    }
    globeMaterial.color = new Color(globeConfig.globeColor)
    globeMaterial.emissive = new Color(globeConfig.emissive)
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1
    globeMaterial.shininess = globeConfig.shininess || 0.9
  }, [
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ])

  const _buildData = useCallback(() => {
    const arcs = data
    const points = []
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i]
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number }
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      })
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      })
    }

    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ['lat', 'lng'].every(
            (k) => v2[k as 'lat' | 'lng'] === v[k as 'lat' | 'lng']
          )
        ) === i
    )

    setGlobeData(filteredPoints)
  }, [data, defaultProps.pointSize])

  const startAnimation = useCallback(() => {
    if (!globeRef.current || !globeData) return

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
      .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
      .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
      .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
      .arcColor((e: number) => data[e].color)
      .arcAltitude((e) => {
        return (e as { arcAlt: number }).arcAlt * 1
      })
      .arcStroke(() => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)]
      })
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime)

    globeRef.current
      .pointsData(data)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2)

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      )
  }, [
    data,
    globeData,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.maxRings,
    defaultProps.polygonColor,
    defaultProps.rings,
  ])

  useEffect(() => {
    if (globeRef.current) {
      _buildData()
      _buildMaterial()
    }
  }, [globeConfig, data, _buildData, _buildMaterial])

  useEffect(() => {
    if (globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => {
          return defaultProps.polygonColor
        })
      startAnimation()
    }
  }, [
    globeData,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    startAnimation,
  ])

  useEffect(() => {
    if (!globeRef.current || !globeData) return

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return
      numbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5)
      )

      globeRef.current.ringsData(
        globeData.filter((d, i) => numbersOfRings.includes(i))
      )
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [data, globeData])

  return (
    <Canvas>
      <OrbitControls />
      <primitive object={new ThreeGlobe()} ref={globeRef} />
    </Canvas>
  )
}

// ฟังก์ชันที่ขาดไป
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex)
  if (!result) return null
  let r: number, g: number, b: number
  if (result[1].length === 4) {
    r = parseInt(result[1][1] + result[1][1], 16)
    g = parseInt(result[1][2] + result[1][2], 16)
    b = parseInt(result[1][3] + result[1][3], 16)
  } else {
    r = parseInt(result[1].substr(0, 2), 16)
    g = parseInt(result[1].substr(2, 2), 16)
    b = parseInt(result[1].substr(4, 2), 16)
  }
  return { r, g, b }
}

function genRandomNumbers(min: number, max: number, count: number): number[] {
  const numbers: number[] = [] // กำหนดประเภทให้ชัดเจน
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers
}
