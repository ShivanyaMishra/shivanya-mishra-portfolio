import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroAnalytics3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'3d' | 'metrics'>('3d');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Analytical Wireframe Globe / Core (representing global location intelligence & network)
    const globeGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const globeWire = new THREE.WireframeGeometry(globeGeo);
    const globeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const globe = new THREE.LineSegments(globeWire, globeMat);
    mainGroup.add(globe);

    // Inner glowing sphere (purple/blue)
    const innerGeo = new THREE.SphereGeometry(1.1, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerSphere);

    // 2. 3D Floating Analytical Bar Chart Columns
    const barGroup = new THREE.Group();
    const barHeights = [0.9, 1.4, 1.8, 1.2, 2.1];
    const barGeo = new THREE.BoxGeometry(0.18, 1, 0.18);
    const barMeshes: THREE.Mesh[] = [];

    barHeights.forEach((h, idx) => {
      const barMat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0x0ea5e9 : 0x818cf8,
        emissive: idx % 2 === 0 ? 0x0284c7 : 0x4f46e5,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.5,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.scale.set(1, h, 1);
      bar.position.set((idx - 2) * 0.42, h / 2 - 1.2, 1.8);
      barGroup.add(bar);
      barMeshes.push(bar);
    });
    mainGroup.add(barGroup);

    // 3. Orbital Coordinate Rings (Latitude / Longitude Data Rings)
    const ring1Geo = new THREE.RingGeometry(2.35, 2.38, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.5;
    ring1.rotation.y = Math.PI / 8;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(2.7, 2.73, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    mainGroup.add(ring2);

    // 4. Ambient Data Nodes (Pulsing particles)
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      // Cyan to Indigo/Purple
      particleColors[i * 3] = 0.1 + Math.random() * 0.4;
      particleColors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      particleColors[i * 3 + 2] = 0.95;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight1.position.set(4, 5, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-4, -3, 4);
    scene.add(dirLight2);

    // Mouse Tracking with smooth lerp
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.5;
      targetY = y * 0.35;

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        mainGroup.rotation.y += dx * 0.008;
        mainGroup.rotation.x += dy * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        mainGroup.rotation.y += 0.003;
      }

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      camera.position.x = currentX * 1.5;
      camera.position.y = 1.2 + currentY * 1.2;
      camera.lookAt(0, 0, 0);

      // Subtle dynamic animations
      ring1.rotation.z = elapsed * 0.1;
      ring2.rotation.z = -elapsed * 0.08;
      particles.rotation.y = -elapsed * 0.02;

      // Animate bar columns gently like an active live data feed
      barMeshes.forEach((mesh, idx) => {
        const wave = Math.sin(elapsed * 2 + idx * 0.7) * 0.15;
        const baseH = barHeights[idx];
        const newH = Math.max(0.4, baseH + wave);
        mesh.scale.set(1, newH, 1);
        mesh.position.y = newH / 2 - 1.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);

      globeGeo.dispose();
      globeWire.dispose();
      globeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      barGeo.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center select-none">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Analytics Command View — Drag to inspect"
      />

      {/* Floating HUD Overlays (Non-obstructive, high contrast) */}
      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 text-right font-mono text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5 justify-end">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white font-medium">3D Data Command Matrix</span>
        </div>
        <span className="text-slate-400">Python · SQL · Power BI · Excel</span>
      </div>

      <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-[#090d19]/80 border border-slate-800 rounded-md backdrop-blur-md text-[11px] font-mono text-slate-300">
        <span className="text-cyan-400 font-semibold">Live 3D Viewport:</span>
        <span className="text-slate-400">Drag to rotate · Interactive node orbit</span>
      </div>
    </div>
  );
};
