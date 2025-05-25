'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// Shader personalizado para aberração cromática
const chromaticAberrationShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "resolution": { value: new THREE.Vector2(1, 1) },
    "aberration": { value: 0.01 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float aberration;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Efeito de aberração cromática
      vec2 direction = normalize(vec2(0.5) - uv);
      vec2 distortion = direction * aberration;

      vec4 r = texture2D(tDiffuse, uv + distortion);
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, uv - distortion);

      gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
    }
  `
}

// Shader para partículas reativas
const reactiveParticleVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float velocity;

  uniform float time;
  uniform float audioIntensity;
  uniform float complexity;

  varying vec3 vColor;
  varying float vDistance;

  void main() {
    vColor = customColor;

    // Posição base
    vec3 pos = position;

    // Movimento baseado em tempo e áudio
    float noise = sin(position.x * complexity * 10.0 + time) *
                  cos(position.y * complexity * 8.0 + time) *
                  sin(position.z * complexity * 6.0 + time);

    // Aplicar movimento baseado em áudio
    float displacement = noise * audioIntensity * velocity;
    pos += normalize(position) * displacement;

    // Calcular posição final
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistance = length(mvPosition.xyz);

    // Tamanho baseado em áudio e distância
    float sizeFactor = size * (1.0 + audioIntensity * 2.0 * velocity);
    gl_PointSize = sizeFactor * (300.0 / length(mvPosition.xyz));

    gl_Position = projectionMatrix * mvPosition;
  }
`

const reactiveParticleFragmentShader = `
  uniform sampler2D pointTexture;
  uniform float time;
  uniform float audioIntensity;

  varying vec3 vColor;
  varying float vDistance;

  void main() {
    // Cálculo de distância do centro do ponto
    float distance = length(gl_PointCoord - vec2(0.5, 0.5));
    if (distance > 0.5) discard; // Descarta pixels fora do círculo

    // Cria um efeito de glow suave
    float opacity = 1.0 - smoothstep(0.3, 0.5, distance);

    // Pulsar baseado em áudio
    float pulse = 1.0 + audioIntensity * 0.5 * sin(time * 10.0);
    opacity *= pulse;

    // Aplica um efeito de profundidade
    float depthFade = 1.0 - vDistance * 0.1;

    gl_FragColor = vec4(vColor, opacity * depthFade);
  }
`

// Mapeamento de tons emocionais para cores
const emotionColors = {
  love: {
    primary: new THREE.Color('#FF2D55'),    // Vermelho Apple
    secondary: new THREE.Color('#FF5277'),  // Vermelho claro
    accent: new THREE.Color('#D91F45')      // Vermelho escuro
  },
  gratitude: {
    primary: new THREE.Color('#AF52DE'),    // Roxo
    secondary: new THREE.Color('#C77DFF'),  // Roxo claro
    accent: new THREE.Color('#8A2BE2')      // Roxo escuro
  },
  admiration: {
    primary: new THREE.Color('#007AFF'),    // Azul Apple
    secondary: new THREE.Color('#5AC8FA'),  // Azul claro
    accent: new THREE.Color('#0055B3')      // Azul escuro
  },
  joy: {
    primary: new THREE.Color('#FFCC00'),    // Amarelo
    secondary: new THREE.Color('#FFD60A'),  // Amarelo claro
    accent: new THREE.Color('#E6B800')      // Amarelo escuro
  }
}

const SinesthesiaVisualizer = ({
  isPlaying = true,
  emotionalTone = 'love',
  intensity = 1.0,
  complexity = 0.8
}) => {
  // Refs para Three.js
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const composerRef = useRef(null)
  const particlesRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timeRef = useRef(0)
  const audioIntensityRef = useRef(0)

  // Simular níveis de áudio para a animação
  useEffect(() => {
    if (!isPlaying) {
      audioIntensityRef.current = 0;
      return;
    }

    // Simular níveis de áudio variáveis com transições mais suaves
    const interval = setInterval(() => {
      // Gerar um nível de áudio aleatório com padrão mais natural (valores reduzidos para efeito mais suave)
      const emphasis = Math.random() > 0.9 ? 0.6 : 0.3;
      const newLevel = 0.15 + Math.random() * emphasis;

      // Suavizar a transição entre valores para evitar mudanças bruscas
      audioIntensityRef.current = audioIntensityRef.current * 0.7 + newLevel * 0.3;
    }, 150); // Atualizar a cada 150ms para um ritmo mais suave

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Efeito para inicializar a cena 3D
  useEffect(() => {
    if (!containerRef.current) return;

    const initScene = () => {
      // Limpar cena existente se houver
      if (rendererRef.current || sceneRef.current) {
        cleanup();
      }

      // Configuração da cena com fog para profundidade
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.15);
      sceneRef.current = scene;

      // Configuração da câmera com perspectiva melhorada
      // Usar proporção 9:16 para corresponder à resolução do vídeo (1080x1920)
      const camera = new THREE.PerspectiveCamera(50, 9/16, 0.1, 1000);
      camera.position.z = 4.5; // Aumentar a distância para diminuir o tamanho aparente da esfera
      cameraRef.current = camera;

      // Configuração do renderer com alta qualidade
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      });

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      // Usar pixel ratio mais alto para resolução 1080x1920
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Criar sistema de partículas
      createParticleSystem();

      // Configurar pós-processamento
      setupPostProcessing(renderer, scene, camera, width, height);

      // Adicionar luzes
      addLights(scene);

      // Iniciar loop de animação
      animate();
    };

    // Criar sistema de partículas reativo
    const createParticleSystem = () => {
      if (!sceneRef.current) return;

      const particleCount = 12000; // Aumentado para resolução maior
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount);

      // Obter cores baseadas no tom emocional
      const { primary, secondary, accent } = emotionColors[emotionalTone];

      // Distribuição de partículas em forma de esfera com variação
      for (let i = 0; i < particleCount; i++) {
        // Distribuição esférica com variação
        const radius = 1 + (Math.random() * 0.5 - 0.25);
        const phi = Math.acos(-1 + (2 * Math.random()));
        const theta = Math.random() * Math.PI * 2;

        // Converter coordenadas esféricas para cartesianas
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Determinar cor com gradiente premium
        const useAccent = Math.random() > 0.9; // 10% de chance para cor de acento
        const mixFactor = Math.random() * 0.6; // Fator de mistura para gradiente

        let color;
        if (useAccent) {
          color = new THREE.Color().lerpColors(primary, accent, mixFactor);
        } else {
          color = new THREE.Color().lerpColors(primary, secondary, mixFactor);
        }

        // Adicionar variação de brilho para efeito premium
        const brightness = 0.85 + Math.random() * 0.3;
        color.multiplyScalar(brightness);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Tamanho variável para profundidade (ajustado para resolução maior)
        sizes[i] = 0.015 + Math.random() * 0.06;

        // Velocidade de reação ao áudio
        velocities[i] = Math.random();
      }

      // Criar geometria e material com shaders personalizados
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: {
            value: new THREE.TextureLoader().load('/particle-glow.svg',
              undefined,
              undefined,
              (error) => {
                console.warn('Erro ao carregar textura de partícula:', error);
                // Tentar carregar PNG como fallback
                return new THREE.TextureLoader().load('/particle.png');
              }
            )
          },
          time: { value: 0 },
          audioIntensity: { value: 0 },
          complexity: { value: complexity }
        },
        vertexShader: reactiveParticleVertexShader,
        fragmentShader: reactiveParticleFragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
      });

      // Criar sistema de partículas
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      sceneRef.current.add(particles);
      particlesRef.current = particles;
    };

    // Configurar pós-processamento
    const setupPostProcessing = (
      renderer,
      scene,
      camera,
      width,
      height
    ) => {
      const composer = new EffectComposer(renderer);
      composerRef.current = composer;

      // Passe de renderização básica
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // Passe de bloom para glow (valores mais suaves)
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.5,    // strength (reduzido para efeito mais suave)
        0.6,    // radius (aumentado para efeito mais difuso)
        0.9     // threshold (aumentado para reduzir o brilho excessivo)
      );
      composer.addPass(bloomPass);

      // Passe de aberração cromática (valor reduzido para efeito mais sutil)
      const chromaticAberrationPass = new ShaderPass(chromaticAberrationShader);
      chromaticAberrationPass.uniforms.resolution.value = new THREE.Vector2(width, height);
      chromaticAberrationPass.uniforms.aberration.value = 0.002; // Reduzido para efeito mais sutil
      composer.addPass(chromaticAberrationPass);
    };

    // Adicionar luzes à cena
    const addLights = (scene) => {
      // Luz ambiente
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      // Luz pontual principal
      const mainColor = emotionColors[emotionalTone].primary;
      const pointLight = new THREE.PointLight(mainColor, 1, 10);
      pointLight.position.set(2, 1, 2);
      scene.add(pointLight);

      // Luz pontual secundária
      const secondaryColor = emotionColors[emotionalTone].secondary;
      const pointLight2 = new THREE.PointLight(secondaryColor, 0.5, 10);
      pointLight2.position.set(-2, -1, 2);
      scene.add(pointLight2);
    };

    // Loop de animação
    const animate = () => {
      timeRef.current += 0.003;
      animationFrameRef.current = requestAnimationFrame(animate);

      // Atualizar partículas
      if (particlesRef.current) {
        const material = particlesRef.current.material;

        // Atualizar uniforms do shader
        material.uniforms.time.value = timeRef.current;
        material.uniforms.audioIntensity.value = audioIntensityRef.current * intensity;

        // Rotação muito suave
        particlesRef.current.rotation.y += 0.0003;
        particlesRef.current.rotation.x += 0.0001;
      }

      // Atualizar pós-processamento
      if (composerRef.current) {
        // Ajustar aberração cromática baseada em áudio (valores reduzidos para efeito mais sutil)
        const chromaticPass = composerRef.current.passes[2];
        if (chromaticPass.uniforms.aberration) {
          chromaticPass.uniforms.aberration.value = 0.001 + audioIntensityRef.current * intensity * 0.005;
        }

        // Ajustar bloom baseado em áudio (valores reduzidos para efeito mais sutil)
        const bloomPass = composerRef.current.passes[1];
        bloomPass.strength = 0.4 + audioIntensityRef.current * intensity * 0.3;

        // Renderizar com pós-processamento
        composerRef.current.render();
      }
    };

    // Função de limpeza
    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (composerRef.current) {
        composerRef.current = null;
      }

      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        if (particlesRef.current.material) {
          particlesRef.current.material.dispose();
        }
      }

      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };

    // Inicializar cena
    initScene();

    // Função de limpeza ao desmontar
    return () => {
      cleanup();
    };
  }, [emotionalTone, complexity, intensity]);

  // Efeito para redimensionar o renderer quando a janela muda de tamanho
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current || !composerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Atualizar câmera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      // Atualizar renderer
      rendererRef.current.setSize(width, height);

      // Atualizar composer
      composerRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative rounded-xl overflow-hidden"
    />
  );
};

export default SinesthesiaVisualizer;
