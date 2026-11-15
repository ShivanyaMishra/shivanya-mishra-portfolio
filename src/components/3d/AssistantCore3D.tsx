import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Mic, Terminal, Globe, Cpu, FolderKanban, Search, Languages } from 'lucide-react';

export const AssistantCore3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

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

    // 1. Central Voice Core (Sphere with wireframe pulses)
    const sphereGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const sphereWire = new THREE.WireframeGeometry(sphereGeo);
    const sphereMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const sphere = new THREE.LineSegments(sphereWire, sphereMat);
    mainGroup.add(sphere);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(inner);

    // 2. Orbiting Voice Waveform Rings
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.0, 0.02, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3.2;
    mainGroup.add(ring2);

    // 3. Audio frequency response particles
    const particleCount = 50;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      particlePos[i * 3] = Math.cos(angle) * 1.65;
      particlePos[i * 3 + 1] = Math.sin(angle) * 1.65;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 4. Backend System Automation Nodes & Connector Lines
    // Nodes representing: Voice Recognition, Python NLP Engine, System Ops, Web/Search Dispatch
    const nodeGroup = new THREE.Group();
    mainGroup.add(nodeGroup);

    const nodePositions = [
      new THREE.Vector3(2.0, 0.8, 0.2), // Voice Recognition
      new THREE.Vector3(-1.9, 0.9, -0.3), // Python NLP
      new THREE.Vector3(-1.8, -1.0, 0.4), // System / File Automation
      new THREE.Vector3(1.9, -0.9, -0.2), // Web Search / Translate
    ];

    const nodeColors = [0x38bdf8, 0x818cf8, 0x34d399, 0xc084fc];
    const nodeGeos: THREE.BufferGeometry[] = [];
    const nodeMats: THREE.Material[] = [];

    nodePositions.forEach((pos, idx) => {
      // Node mesh
      const nGeo = new THREE.OctahedronGeometry(0.18, 0);
      const nMat = new THREE.MeshBasicMaterial({
        color: nodeColors[idx],
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const nodeMesh = new THREE.Mesh(nGeo, nMat);
      nodeMesh.position.copy(pos);
      nodeGroup.add(nodeMesh);
      nodeGeos.push(nGeo);
      nodeMats.push(nMat);

      // Connecting pipeline beam to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        pos,
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeColors[idx],
        transparent: true,
        opacity: 0.25,
      });
      const connLine = new THREE.Line(lineGeo, lineMat);
      nodeGroup.add(connLine);
      nodeGeos.push(lineGeo);
      nodeMats.push(lineMat);
    });

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

      // Rotation & pulses
      sphere.rotation.y = elapsed * 0.55;
      sphere.rotation.x = elapsed * 0.35;
      inner.rotation.y = -elapsed * 0.75;

      ring1.rotation.z = elapsed * 0.45;
      ring2.rotation.z = -elapsed * 0.35;

      nodeGroup.rotation.y = elapsed * 0.2;
      nodeGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.1;

      // Pulse voice waveform effect
      const scale = 1 + Math.sin(elapsed * 2.8) * 0.07;
      sphere.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      sphereGeo.dispose();
      sphereWire.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      nodeGeos.forEach((g) => g.dispose());
      nodeMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl bg-[#070b15]/95 border border-slate-800 p-4 overflow-hidden">
      {/* Top Telemetry / Backend Status Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-cyan-300 font-semibold uppercase tracking-wider">
            PYTHON BACKEND ENGINE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[10px] uppercase">Service:</span>
          <span className="text-emerald-400 font-medium">Local Voice Daemon</span>
        </div>
      </div>

      {/* 3D Viewport with Voice Waveform & Automation Nodes */}
      <div className="relative">
        <div ref={mountRef} className="w-full h-48 sm:h-56" />

        {/* Backend Pipeline Badges Floating Over Viewport */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-cyan-300 backdrop-blur-sm">
            <Mic className="w-3 h-3 text-cyan-400" />
            <span>Voice Audio Stream</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-indigo-300 backdrop-blur-sm">
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span>OS &amp; Shell Automation</span>
          </div>
        </div>

        <div className="absolute bottom-2 left-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-emerald-300 backdrop-blur-sm">
            <FolderKanban className="w-3 h-3 text-emerald-400" />
            <span>File &amp; Folder Management</span>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-purple-300 backdrop-blur-sm">
            <Search className="w-3 h-3 text-purple-400" />
            <Languages className="w-3 h-3 text-purple-400" />
            <span>Web Search &amp; Translate</span>
          </div>
        </div>
      </div>

      {/* Feature capabilities grid matching exact user specification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono">
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <span className="text-xs mb-1">🎙</span>
          <span className="text-[11px] font-semibold text-white">Voice Input</span>
          <span className="text-[10px] text-slate-400">Speech Recognition</span>
        </div>

        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <span className="text-xs mb-1">⚙</span>
          <span className="text-[11px] font-semibold text-white">Command Processing</span>
          <span className="text-[10px] text-slate-400">Python + NLP</span>
        </div>

        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <span className="text-xs mb-1">🖥</span>
          <span className="text-[11px] font-semibold text-white">Desktop Automation</span>
          <span className="text-[10px] text-slate-400">Python Automation</span>
        </div>

        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <span className="text-xs mb-1">🌐</span>
          <span className="text-[11px] font-semibold text-white">Web Queries</span>
          <span className="text-[10px] text-slate-400">Information Retrieval</span>
        </div>
      </div>
    </div>
  );
};
