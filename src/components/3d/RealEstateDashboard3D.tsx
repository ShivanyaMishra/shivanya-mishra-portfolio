import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BarChart3, TrendingUp, MapPin, Layers } from 'lucide-react';

export const RealEstateDashboard3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState<'city' | 'yoy' | 'trend'>('city');

  const cities = ['City 1', 'City 2', 'City 3', 'City 4', 'City 5'];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.2);

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

    // 3D Chart Base Grid Floor
    const gridHelper = new THREE.GridHelper(5, 10, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = -0.8;
    group.add(gridHelper);

    // 5 3D City Bars
    const barGeo = new THREE.BoxGeometry(0.42, 1, 0.42);
    const bars: THREE.Mesh[] = [];
    const heights = [1.2, 1.9, 1.5, 2.3, 1.7];

    cities.forEach((_, i) => {
      const barMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x0ea5e9 : 0x818cf8,
        emissive: i % 2 === 0 ? 0x0284c7 : 0x4f46e5,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.4,
      });

      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((i - 2) * 0.85, heights[i] / 2 - 0.8, 0);
      bar.scale.set(1, heights[i], 1);
      group.add(bar);
      bars.push(bar);
    });

    // 3D Spline Line (Trend curve across the 5 cities)
    const points = bars.map(
      (b, i) => new THREE.Vector3((i - 2) * 0.85, heights[i] - 0.75, 0.3)
    );
    const curve = new THREE.CatmullRomCurve3(points);
    const curveGeo = new THREE.TubeGeometry(curve, 32, 0.035, 8, false);
    const curveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
    });
    const curveMesh = new THREE.Mesh(curveGeo, curveMat);
    group.add(curveMesh);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dir.position.set(3, 5, 4);
    scene.add(dir);

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

      // Subtle dynamic rotation
      group.rotation.y = Math.sin(elapsed * 0.4) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      barGeo.dispose();
      curveGeo.dispose();
      curveMat.dispose();
      gridHelper.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl bg-[#070b15]/90 border border-slate-800 p-4 overflow-hidden">
      {/* 3D Visualizer Viewport */}
      <div ref={mountRef} className="w-full h-48 sm:h-56" />

      {/* KPI Cards (Truthful, non-fabricated metrics) */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono">
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Scope</div>
          <div className="text-xs font-semibold text-white">5 Cities</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Multi-Market</div>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-cyan-800/50">
          <div className="text-[10px] text-slate-400 uppercase">Analysis</div>
          <div className="text-xs font-semibold text-cyan-300">YoY Growth</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Price Trends</div>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Engine</div>
          <div className="text-xs font-semibold text-indigo-300">Power BI</div>
          <div className="text-[10px] text-slate-400 mt-0.5">&amp; MS Excel</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Interactive Dimensions:</span>
        </span>
        <span className="text-slate-400">YoY Growth · Comparative City Metrics</span>
      </div>
    </div>
  );
};
