import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ShaderBackground = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const uniformsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      0.1,
      1000
    );
    camera.position.z = 1;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Vertex Shader - Organic wave effects
    const vertexShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vWave;

      // Simplex noise function
      vec3 permute(vec3 x) {
        return mod((x*34.0+1.0)*x, 289.0);
      }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
          -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vUv = uv;
        
        // Create flowing wave effect
        float wave1 = snoise(vec2(uv.x * 3.0 + uTime * 0.3, uv.y * 3.0 + uTime * 0.2)) * 0.5;
        float wave2 = snoise(vec2(uv.x * 2.0 - uTime * 0.25, uv.y * 2.0 + uTime * 0.35)) * 0.3;
        float wave3 = snoise(vec2(uv.x * 4.0 + uTime * 0.15, uv.y * 4.0 - uTime * 0.4)) * 0.2;
        
        vWave = wave1 + wave2 + wave3;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment Shader - Organic color and effect
    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vWave;

      // Color palette for organic feel
      vec3 palette(float t) {
        vec3 a = vec3(0.1, 0.2, 0.35);
        vec3 b = vec3(0.45, 0.55, 0.75);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = vUv;
        
        // Create flowing patterns
        float t = uTime * 0.1;
        
        // Radial distortion from mouse
        vec2 centerDist = uv - 0.5;
        float distance = length(centerDist);
        float distortion = sin(distance * 10.0 - t) * 0.1;
        
        // Combine wave effect with color
        float pattern = vWave * 0.5 + distance * 0.5;
        pattern += sin(distance * 20.0 - t) * 0.2;
        pattern += sin(uv.x * 5.0 + t) * sin(uv.y * 5.0 - t) * 0.1;
        
        // Color mapping
        vec3 col = palette(pattern + t);
        
        // Add glow effect
        float glow = exp(-distance * 2.0) * 0.5;
        col += glow * vec3(0.2, 0.5, 1.0);
        
        // Strength based on wave
        float alpha = 0.3 + vWave * 0.3;
        
        gl_FragColor = vec4(col, alpha);
      }
    `;

    // Create shader material
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      wireframe: false
    });

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight,
      64,
      64
    );

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Mouse tracking
    const onMouseMove = (event) => {
      if (uniformsRef.current) {
        uniformsRef.current.uMouse.value.x = event.clientX / window.innerWidth;
        uniformsRef.current.uMouse.value.y = 1 - event.clientY / window.innerHeight;
      }
    };

    // Handle window resize
    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      if (meshRef.current && meshRef.current.geometry) {
        meshRef.current.geometry.dispose();
        meshRef.current.geometry = new THREE.PlaneGeometry(width, height, 64, 64);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value += 0.016; // ~60fps
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ShaderBackground;
