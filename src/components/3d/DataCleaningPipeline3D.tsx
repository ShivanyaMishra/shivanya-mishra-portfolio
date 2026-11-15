import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

export const DataCleaningPipeline3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pipelinePhase, setPipelinePhase] = useState<'idle' | 'running' | 'completed'>('running');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Left Chamber: Messy Data (Irregular, scattered particles)
    const messyCount = 60;
    const messyGeo = new THREE.BufferGeometry();
    const messyPos = new Float32Array(messyCount * 3);
    const messyOriginal = new Float32Array(messyCount * 3);
    const messyTarget = new Float32Array(messyCount * 3);

    for (let i = 0; i < messyCount; i++) {
      // Left scattered coordinates
      const x = -2.2 + (Math.random() - 0.5) * 1.0;
      const y = (Math.random() - 0.5) * 1.2;
      const z = (Math.random() - 0.5) * 0.8;

      messyPos[i * 3] = x;
      messyPos[i * 3 + 1] = y;
      messyPos[i * 3 + 2] = z;

      messyOriginal[i * 3] = x;
      messyOriginal[i * 3 + 1] = y;
      messyOriginal[i * 3 + 2] = z;

      // Right organized grid coordinates (Standardized Dataset)
      const row = Math.floor(i / 10);
      const col = i % 10;
      messyTarget[i * 3] = 1.6 + (col - 5) * 0.18;
      messyTarget[i * 3 + 1] = (row - 3) * 0.18;
      messyTarget[i * 3 + 2] = 0;
    }

    messyGeo.setAttribute('position', new THREE.BufferAttribute(messyPos, 3));
    const messyMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const messyPoints = new THREE.Points(messyGeo, messyMat);
    group.add(messyPoints);

    // 2. Central Processing Core: Python Engine (Glowing octahedron with wireframe)
    const engineGeo = new THREE.OctahedronGeometry(0.7, 0);
    const engineWire = new THREE.WireframeGeometry(engineGeo);
    const engineMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.8,
    });
    const engineMesh = new THREE.LineSegments(engineWire, engineMat);
    engineMesh.position.set(0, 0, 0);
    group.add(engineMesh);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 3. Flow Conduit Rings (Conveyor lines)
    const conduitGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 32);
    const conduitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    const ringLeft = new THREE.Mesh(conduitGeo, conduitMat);
    ringLeft.rotation.y = Math.PI / 2;
    ringLeft.position.set(-1.1, 0, 0);
    group.add(ringLeft);

    const ringRight = new THREE.Mesh(conduitGeo, conduitMat);
    ringRight.rotation.y = Math.PI / 2;
    ringRight.position.set(1.1, 0, 0);
    group.add(ringRight);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

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
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate central Python engine
      engineMesh.rotation.y = elapsed * 1.2;
      engineMesh.rotation.x = elapsed * 0.8;
      coreMesh.rotation.y = -elapsed * 1.5;

      // Pulse conduit rings
      ringLeft.rotation.z = elapsed * 2;
      ringRight.rotation.z = -elapsed * 2;

      // Animate particles moving from messy left -> central python core -> clean right grid
      const positions = messyGeo.attributes.position.array as Float32Array;
      const cycle = (elapsed * 0.4) % 1; // 0 to 1 cycle

      for (let i = 0; i < messyCount; i++) {
        const offset = (i / messyCount) * 0.2;
        const progress = (cycle + offset) % 1;

        if (progress < 0.4) {
          // In messy state or moving toward center
          const t = progress / 0.4;
          positions[i * 3] = THREE.MathUtils.lerp(messyOriginal[i * 3], 0, t);
          positions[i * 3 + 1] = THREE.MathUtils.lerp(messyOriginal[i * 3 + 1], 0, t);
          positions[i * 3 + 2] = THREE.MathUtils.lerp(messyOriginal[i * 3 + 2], 0, t);
        } else {
          // Exiting center toward standardized grid
          const t = (progress - 0.4) / 0.6;
          positions[i * 3] = THREE.MathUtils.lerp(0, messyTarget[i * 3], t);
          positions[i * 3 + 1] = THREE.MathUtils.lerp(0, messyTarget[i * 3 + 1], t);
          positions[i * 3 + 2] = THREE.MathUtils.lerp(0, messyTarget[i * 3 + 2], t);
        }
      }

      messyGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      messyGeo.dispose();
      messyMat.dispose();
      engineGeo.dispose();
      engineWire.dispose();
      engineMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      conduitGeo.dispose();
      conduitMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl bg-[#070b15]/90 border border-slate-800 p-4 overflow-hidden">
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-48 sm:h-56" />

      {/* 4 Pipeline Stages Labels */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono">
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Stage 01</div>
          <div className="text-xs font-semibold text-rose-300">Messy Data</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Raw CSV/TXT</div>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-cyan-800/50">
          <div className="text-[10px] text-slate-400 uppercase">Stage 02</div>
          <div className="text-xs font-semibold text-cyan-300">Python Engine</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pandas &amp; NumPy</div>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Stage 03</div>
          <div className="text-xs font-semibold text-indigo-300">Cleaning</div>
          <div className="text-[10px] text-slate-400 mt-0.5">OpenPyXL Rules</div>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-emerald-800/50">
          <div className="text-[10px] text-slate-400 uppercase">Stage 04</div>
          <div className="text-xs font-semibold text-emerald-300">Standardized</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Clean Dataset</div>
        </div>
      </div>

      {/* Verified Achievement Badge */}
      <div className="mt-3 flex items-center justify-between px-3 py-1.5 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-xs font-mono">
        <span className="text-slate-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pipeline Metric:</span>
        </span>
        <span className="text-cyan-300 font-semibold">Reduced data preparation time by 70%</span>
      </div>
    </div>
  );
};
