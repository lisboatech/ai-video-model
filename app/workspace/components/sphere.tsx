'use client'

import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { usePathname } from 'next/navigation';

export const VisualizationSphere = ({ size = 350 }: { size?: number } = {}) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Points | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const initScene = () => {
      if (!containerRef.current) return;

      // Cleanup existing scene if any
      if (rendererRef.current || sceneRef.current) {
        cleanup();
      }

      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 2;
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      const width = containerRef.current.clientWidth || size;
      const height = containerRef.current.clientHeight || size;
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create sphere particles
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const positions = [];

      // Cores premium para a esfera - estilo Apple com gradiente vermelho elegante
      const createGradientColors = (numPoints: number) => {
        const colorArray = [];
        const primaryColor = new THREE.Color('#FF2D55');    // Vermelho Apple principal
        const secondaryColor = new THREE.Color('#FF5277');  // Vermelho claro complementar
        const accentColor = new THREE.Color('#D91F45');     // Vermelho escuro sutil

        // Cria um gradiente de cores para os pontos
        for (let i = 0; i < numPoints; i++) {
          // Determina qual par de cores usar para o gradiente
          const useAccent = Math.random() > 0.85; // 15% de chance de usar o acento

          // Cria uma mistura entre as cores baseada na posição
          const mixFactor = Math.random() * 0.5; // Menos variação para efeito mais sutil

          let color;
          if (useAccent) {
            // Mistura entre vermelho Apple principal e vermelho escuro para alguns pontos
            color = new THREE.Color().lerpColors(primaryColor, accentColor, mixFactor);
          } else {
            // Mistura entre vermelho Apple principal e vermelho claro para a maioria dos pontos
            color = new THREE.Color().lerpColors(primaryColor, secondaryColor, mixFactor);
          }

          // Adiciona variação de brilho para efeito metálico elegante
          const brightness = 0.9 + Math.random() * 0.2; // Variação sutil para efeito refinado
          color.multiplyScalar(brightness);

          colorArray.push(color.r, color.g, color.b);
        }

        return colorArray;
      };

      const colors = createGradientColors(3000);

      // Convert sphere geometry to points
      for (let i = 0; i < 3000; i++) {
        const vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.normalize();
        vertex.multiplyScalar(1);
        positions.push(vertex.x, vertex.y, vertex.z);
        // Cores já definidas pelo gradiente
      }

      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const pointsMaterial = new THREE.PointsMaterial({
        size: 0.01, // Pontos menores para um visual mais refinado
        vertexColors: true,
        transparent: true,
        opacity: 0.8, // Transparência equilibrada para elegância
        sizeAttenuation: true,
      });

      const sphere = new THREE.Points(pointGeometry, pointsMaterial);
      scene.add(sphere);
      sphereRef.current = sphere;

      // Variáveis para animação suave estilo Glória de Salomão
      let time = 0;
      let rotationSpeed = 0.0002; // Rotação ainda mais lenta e majestosa

      // Animation loop
      const animate = () => {
        time += 0.005; // Movimento mais lento
        animationFrameRef.current = requestAnimationFrame(animate);

        if (sphereRef.current) {
          // Rotação suave
          sphereRef.current.rotation.x += rotationSpeed;
          sphereRef.current.rotation.y += rotationSpeed * 1.2;

          // Efeito de respiração sutil - estilo majestoso
          const breatheFactor = 1 + Math.sin(time * 0.25) * 0.008;
          sphereRef.current.scale.set(breatheFactor, breatheFactor, breatheFactor);
        }
        renderer.render(scene, camera);
      };
      animate();
    };

    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
      if (sphereRef.current) {
        sphereRef.current.geometry.dispose();
        if (sphereRef.current.material instanceof THREE.Material) {
          sphereRef.current.material.dispose();
        }
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };

    initScene();
    return cleanup;
  }, [pathname]); // Adiciona pathname como dependência

  return <div ref={containerRef} style={{ width: size, height: size }} key={pathname} />;
};

export default VisualizationSphere;
