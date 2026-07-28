import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import type { OrthographicCamera as OrthographicCameraImpl } from 'three'

/** Viewport-matched ortho camera — replaces @react-three/drei OrthographicCamera. */
export function SkyOrthoCamera() {
  const ref = useRef<OrthographicCameraImpl>(null)
  const set = useThree((s) => s.set)
  const size = useThree((s) => s.size)

  useLayoutEffect(() => {
    const cam = ref.current
    if (!cam) return
    cam.left = size.width / -2
    cam.right = size.width / 2
    cam.top = size.height / 2
    cam.bottom = size.height / -2
    cam.updateProjectionMatrix()
    set({ camera: cam })
  }, [set, size.height, size.width])

  return <orthographicCamera ref={ref} position={[0, 0, 10]} near={0.1} far={50} />
}
