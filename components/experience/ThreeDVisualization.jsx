"use client"
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Sphere,
  Points,
  PointMaterial,
  MeshDistortMaterial
} from '@react-three/drei'
import * as THREE from 'three'

// Componente para a esfera que reage ao áudio como se estivesse falando
const SpeakingSphere = ({ isPlaying, color = '#ff0000' }) => {
  const sphereRef = useRef()
  const [time, setTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [lastPulse, setLastPulse] = useState(0)

  // Simular níveis de áudio para a animação de fala
  useEffect(() => {
    if (!isPlaying) {
      setAudioLevel(0)
      return
    }

    // Simular níveis de áudio variáveis para parecer que está falando
    const interval = setInterval(() => {
      // Gerar um nível de áudio aleatório com padrão mais natural
      // Ocasionalmente gera picos mais altos para simular ênfase na fala
      const emphasis = Math.random() > 0.8 ? 0.9 : 0.6
      const newLevel = 0.2 + Math.random() * emphasis
      setAudioLevel(newLevel)
    }, 120) // Atualizar a cada 120ms para simular o ritmo da fala

    return () => clearInterval(interval)
  }, [isPlaying])

  // Animação da esfera
  useFrame((state, delta) => {
    if (sphereRef.current) {
      // Incrementar o tempo
      setTime(prev => prev + delta)

      // Rotação suave
      sphereRef.current.rotation.y += delta * 0.2

      // Calcular a pulsação baseada no nível de áudio
      const basePulse = 1.0
      const maxPulse = 0.15 // Amplitude máxima da pulsação

      // Suavizar a transição entre os níveis de áudio
      const smoothedLevel = lastPulse + (audioLevel - lastPulse) * 0.3
      setLastPulse(smoothedLevel)

      // Aplicar a pulsação à escala da esfera
      const pulse = basePulse + smoothedLevel * maxPulse
      sphereRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.8}
        distort={0.4} // Nível de distorção da esfera aumentado
        speed={4} // Velocidade da animação de distorção aumentada
      />
    </Sphere>
  )
}

// Componente para partículas ao redor da esfera
const SphereParticles = ({ count = 2000, color = '#ff0000', isPlaying }) => {
  const pointsRef = useRef()
  const [positions, setPositions] = useState([])
  const [sizes, setSizes] = useState([])
  const [audioLevel, setAudioLevel] = useState(0)

  // Gerar posições iniciais das partículas
  useEffect(() => {
    const pos = []
    const particleSizes = []

    for (let i = 0; i < count; i++) {
      // Distribuição esférica com variação de raio
      const radius = 1.1 + Math.random() * 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      pos.push(x, y, z)

      // Tamanhos variados para as partículas
      particleSizes.push(Math.random() * 0.5 + 0.5)
    }

    setPositions(pos)
    setSizes(particleSizes)
  }, [count])

  // Simular níveis de áudio para a animação
  useEffect(() => {
    if (!isPlaying) {
      setAudioLevel(0)
      return
    }

    // Simular níveis de áudio variáveis com padrão mais suave
    const interval = setInterval(() => {
      // Usar um padrão diferente da esfera para criar efeito visual interessante
      const newLevel = 0.15 + Math.random() * 0.7
      setAudioLevel(newLevel)
    }, 180) // Tempo diferente da esfera para evitar sincronização

    return () => clearInterval(interval)
  }, [isPlaying])

  // Animar as partículas
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Rotação suave em múltiplos eixos
      pointsRef.current.rotation.y += delta * 0.1
      pointsRef.current.rotation.x += delta * 0.05

      // Movimento de respiração suave
      const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02

      // Pulsar baseado no nível de áudio
      const audioScale = 1 + audioLevel * 0.15

      // Combinar os efeitos
      const finalScale = breathingScale * audioScale
      pointsRef.current.scale.set(finalScale, finalScale, finalScale)
    }
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={new Float32Array(sizes)}
          itemSize={1}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.03}
        sizeAttenuation
        color={color}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={new THREE.TextureLoader().load('/particle-glow.svg')}
      />
    </Points>
  )
}

// Componente principal de visualização 3D
const ThreeDVisualization = ({ isPlaying, primaryColor = '#ff0000' }) => {
  // Converter a cor primária para um objeto de cor Three.js
  const color = new THREE.Color(primaryColor)

  // Criar uma cor secundária complementar
  const secondaryColor = useMemo(() => {
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)

    // Cor complementar
    const newHsl = {
      h: (hsl.h + 0.5) % 1.0,
      s: Math.min(hsl.s * 0.9, 0.8),
      l: Math.min(hsl.l * 1.2, 0.6)
    }

    const newColor = new THREE.Color().setHSL(newHsl.h, newHsl.s, newHsl.l)
    return newColor.getHexString()
  }, [color])

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        {/* Iluminação */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color={primaryColor} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} color={`#${secondaryColor}`} />
        <pointLight position={[0, 0, 2]} intensity={0.6} color={primaryColor} distance={5} />

        {/* Esfera que "fala" */}
        <SpeakingSphere isPlaying={isPlaying} color={primaryColor} />

        {/* Partículas ao redor */}
        <SphereParticles count={1500} color={primaryColor} isPlaying={isPlaying} />

        {/* Controles de câmera */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

export default ThreeDVisualization
