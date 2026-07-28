import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'

type PointLike = THREE.Vector3 | [number, number, number]

interface FatLineProps {
  points: PointLike[]
  color?: THREE.ColorRepresentation
  lineWidth?: number
  opacity?: number
  transparent?: boolean
  depthTest?: boolean
  depthWrite?: boolean
  renderOrder?: number
}

function toFlatArray(points: PointLike[]): number[] {
  const out: number[] = []
  for (const p of points) {
    if (Array.isArray(p)) {
      out.push(p[0], p[1], p[2])
    } else {
      out.push(p.x, p.y, p.z)
    }
  }
  return out
}

/**
 * Pixel-width line via three.js Line2 — local stand-in for @react-three/drei `Line`.
 */
export function FatLine({
  points,
  color = '#ffffff',
  lineWidth = 1,
  opacity = 1,
  transparent = false,
  depthTest = true,
  depthWrite = false,
  renderOrder = 0,
}: FatLineProps) {
  const { line, geometry, material } = useMemo(() => {
    const geometry = new LineGeometry()
    const material = new LineMaterial({
      color,
      linewidth: lineWidth,
      transparent: transparent || opacity < 1,
      opacity,
      depthTest,
      depthWrite,
      worldUnits: false,
    })
    const line = new Line2(geometry, material)
    return { line, geometry, material }
    // Instance is stable; visual props sync in layout/frame effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const size = useThree((s) => s.size)

  useLayoutEffect(() => {
    line.renderOrder = renderOrder
    material.color.set(color)
    material.linewidth = lineWidth
    material.opacity = opacity
    material.transparent = transparent || opacity < 1
    material.depthTest = depthTest
    material.depthWrite = depthWrite
    material.resolution.set(size.width, size.height)
  }, [
    line,
    material,
    color,
    lineWidth,
    opacity,
    transparent,
    depthTest,
    depthWrite,
    renderOrder,
    size.width,
    size.height,
  ])

  useFrame(() => {
    if (points.length < 2) return
    geometry.setPositions(toFlatArray(points))
    line.computeLineDistances()
  })

  return <primitive object={line} />
}
