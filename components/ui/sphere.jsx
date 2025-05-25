'use client'

import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { usePathname } from 'next/navigation';

export const VisualizationSphere = () => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  const animationFrameRef = useRef(undefined);

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
      const width = containerRef.current.clientWidth || 300;
      const height = containerRef.current.clientHeight || 300;
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create sphere particles
      const positions = [];
      const colors = [];
      const particleCount = 3000;

      // Função para criar cores com gradiente
      const createGradientColors = (count) => {
        const colorArray = [];
        
        // Cor primária - vermelho Apple
        const primaryColor = new THREE.Color('#ff2d55');
        // Cor secundária - branco suave
        const secondaryColor = new THREE.Color('#ffffff');
        
        for (let i = 0; i < count; i++) {
          const color = new THREE.Color();
          
          // Fator de mistura para criar gradiente
          const mixFactor = Math.random();
          
          // Misturar cores
          color.r = primaryColor.r * (1 - mixFactor) + secondaryColor.r * mixFactor * 0.5;
          color.g = primaryColor.g * (1 - mixFactor) + secondaryColor.g * mixFactor * 0.5;
          color.b = primaryColor.b * (1 - mixFactor) + secondaryColor.b * mixFactor * 0.5;
          
          // Adiciona variação de brilho para efeito metálico elegante
          const brightness = 0.9 + Math.random() * 0.2;
          color.multiplyScalar(brightness);
          
          colorArray.push(color.r, color.g, color.b);
        }
        
        return colorArray;
      };

      // Gerar cores
      const colorData = createGradientColors(particleCount);

      // Criar partículas em forma de esfera
      for (let i = 0; i < particleCount; i++) {
        const vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.normalize();
        vertex.multiplyScalar(1);
        positions.push(vertex.x, vertex.y, vertex.z);
      }

      // Criar geometria de pontos
      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorData, 3));

      // Material para partículas
      const pointsMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      // Criar esfera de partículas
      const sphere = new THREE.Points(pointGeometry, pointsMaterial);
      scene.add(sphere);
      sphereRef.current = sphere;

      // Variáveis para animação suave
      let time = 0;
      let rotationSpeed = 0.0002;

      // Animation loop
      const animate = () => {
        time += 0.005;
        animationFrameRef.current = requestAnimationFrame(animate);

        if (sphereRef.current) {
          // Rotação suave
          sphereRef.current.rotation.x += rotationSpeed;
          sphereRef.current.rotation.y += rotationSpeed * 1.2;

          // Efeito de respiração sutil
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

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      if (sphereRef.current && sceneRef.current) {
        sceneRef.current.remove(sphereRef.current);
        sphereRef.current.geometry.dispose();
        sphereRef.current.material.dispose();
      }

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      sphereRef.current = null;
    };

    initScene();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [pathname]);

  return <div ref={containerRef} className="w-[300px] h-[300px]" />;
};

export default VisualizationSphere;
