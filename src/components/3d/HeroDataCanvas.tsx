import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroDataCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState<string>('Correlation Lattice');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all rotating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Analytical Core: Wireframe Icosahedron / Geodesic Data Sphere
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const wireframeGeo = new THREE.WireframeGeometry(coreGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9, // precision cyan/sky
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    mainGroup.add(wireframe);

    // Inner translucent core
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0369a1,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Data Nodes on Vertices
    const posAttribute = coreGeo.attributes.position;
    const nodeCount = posAttribute.count;
    const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });

    const nodesGroup = new THREE.Group();
    for (let i = 0; i < nodeCount; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = posAttribute.getZ(i);
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, y, z);
      nodesGroup.add(node);
    }
    mainGroup.add(nodesGroup);

    // 3. Orbital Coordinate Ring (Data Dimension Axis)
    const ringGeo = new THREE.RingGeometry(3.1, 3.14, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.8;
    ring.rotation.y = Math.PI / 6;
    mainGroup.add(ring);

    // Secondary subtle ring
    const ringGeo2 = new THREE.RingGeometry(3.45, 3.48, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 4;
    mainGroup.add(ring2);

    // 4. Ambient Floating Data Particles (Signal scatter)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle cyan to indigo
      particleColors[i * 3] = 0.05 + Math.random() * 0.2;
      particleColors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
      particleColors[i * 3 + 2] = 0.9;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // Mouse Tracking with smooth lerp
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.6;
      targetY = y * 0.4;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        mainGroup.rotation.y += deltaX * 0.008;
        mainGroup.rotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle Rotation
      if (!isDragging) {
        mainGroup.rotation.y += 0.0035;
        mainGroup.rotation.x += 0.0015;
      }

      // Smooth mouse follow interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX * 1.5;
      camera.position.y = currentY * 1.5;
      camera.lookAt(0, 0, 0);

      // Pulse ring and particle system subtly
      ring.rotation.z = elapsedTime * 0.08;
      ring2.rotation.z = -elapsedTime * 0.06;
      particleSystem.rotation.y = -elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      // Clean memory
      coreGeo.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-center select-none">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Data Lattice — Drag to inspect"
      />

      {/* Floating Precision Micro-HUD Overlay (Non-obstructive) */}
      <div className="absolute top-4 right-4 pointer-events-none flex flex-col gap-1.5 text-right font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 justify-end">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">Analytical Topology</span>
        </div>
        <span className="text-slate-500 tabular-nums">Active Nodes: 42 · Vector Dim: 3D</span>
      </div>

      {/* Floating Bottom State Pill */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-[#0b101b]/80 border border-slate-800/80 rounded-md backdrop-blur-md text-[11px] font-mono text-slate-400">
        <span className="text-cyan-400 font-medium">Interactive Model:</span>
        <span>Drag to rotate · Follows cursor</span>
      </div>
    </div>
  );
};
