import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, TrendingUp, PiggyBank, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const AetherFinance3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

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

    // 1. Isometric Financial Flow Matrix Floor
    const gridHelper = new THREE.GridHelper(14, 20, 0x06b6d4, 0x0f172a);
    gridHelper.position.y = -2.2;
    gridHelper.rotation.x = Math.PI / 8;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    mainGroup.add(gridHelper);

    // 2. Dynamic 3D Cash Flow Stream Particles:
    // INCOME (Emerald, moving from left to center)
    // EXPENSES (Rose/Amber, moving center to bottom-right)
    // SAVINGS (Cyan, moving center to top-right)

    const incomeCount = 60;
    const incomeGeo = new THREE.BufferGeometry();
    const incomePositions = new Float32Array(incomeCount * 3);
    const incomeProgress = new Float32Array(incomeCount);

    for (let i = 0; i < incomeCount; i++) {
      incomeProgress[i] = Math.random();
    }
    incomeGeo.setAttribute('position', new THREE.BufferAttribute(incomePositions, 3));
    const incomeMat = new THREE.PointsMaterial({
      color: 0x10b981, // Emerald
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const incomeParticles = new THREE.Points(incomeGeo, incomeMat);
    mainGroup.add(incomeParticles);

    // EXPENSES stream particles
    const expenseCount = 50;
    const expenseGeo = new THREE.BufferGeometry();
    const expensePositions = new Float32Array(expenseCount * 3);
    const expenseProgress = new Float32Array(expenseCount);

    for (let i = 0; i < expenseCount; i++) {
      expenseProgress[i] = Math.random();
    }
    expenseGeo.setAttribute('position', new THREE.BufferAttribute(expensePositions, 3));
    const expenseMat = new THREE.PointsMaterial({
      color: 0xf43f5e, // Rose / amber expense
      size: 0.075,
      transparent: true,
      opacity: 0.8,
    });
    const expenseParticles = new THREE.Points(expenseGeo, expenseMat);
    mainGroup.add(expenseParticles);

    // SAVINGS stream particles
    const savingsCount = 50;
    const savingsGeo = new THREE.BufferGeometry();
    const savingsPositions = new Float32Array(savingsCount * 3);
    const savingsProgress = new Float32Array(savingsCount);

    for (let i = 0; i < savingsCount; i++) {
      savingsProgress[i] = Math.random();
    }
    savingsGeo.setAttribute('position', new THREE.BufferAttribute(savingsPositions, 3));
    const savingsMat = new THREE.PointsMaterial({
      color: 0x06b6d4, // Cyan savings
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const savingsParticles = new THREE.Points(savingsGeo, savingsMat);
    mainGroup.add(savingsParticles);

    // 3. Curved Flow Guides (Fine lines indicating cashflow vector tunnels)
    const createStreamLine = (start: THREE.Vector3, mid: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
      });
      return new THREE.Line(lineGeo, lineMat);
    };

    const incomeLine = createStreamLine(
      new THREE.Vector3(-4.5, -0.6, -1),
      new THREE.Vector3(-2.0, 0.4, 0),
      new THREE.Vector3(0, 0, 0.5),
      0x10b981
    );
    const expenseLine = createStreamLine(
      new THREE.Vector3(0, 0, 0.5),
      new THREE.Vector3(2.2, -0.8, 0),
      new THREE.Vector3(4.5, -1.8, -1),
      0xf43f5e
    );
    const savingsLine = createStreamLine(
      new THREE.Vector3(0, 0, 0.5),
      new THREE.Vector3(2.0, 1.0, 0),
      new THREE.Vector3(4.5, 1.6, -1),
      0x06b6d4
    );

    mainGroup.add(incomeLine);
    mainGroup.add(expenseLine);
    mainGroup.add(savingsLine);

    // Parallax mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx * 0.25;
      mouseRef.current.targetY = ny * 0.2;
    };

    const hostEl = containerRef.current;
    if (hostEl) {
      hostEl.addEventListener('mousemove', handleMouseMove);
    }

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
      const delta = clock.getDelta();

      // Smooth parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      mainGroup.rotation.y = mouseRef.current.x;
      mainGroup.rotation.x = mouseRef.current.y;

      // Update Income particles along curve: (-4.5, -0.6) to (0, 0)
      const incomePosAttr = incomeGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < incomeCount; i++) {
        incomeProgress[i] = (incomeProgress[i] + delta * 0.35) % 1;
        const t = incomeProgress[i];
        // Quadratic bezier formula
        const p0 = { x: -4.5, y: -0.6, z: -1 };
        const p1 = { x: -2.0, y: 0.4, z: 0 };
        const p2 = { x: 0, y: 0, z: 0.5 };
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y + Math.sin(t * Math.PI) * 0.15;
        const z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
        incomePosAttr.setXYZ(i, x, y, z);
      }
      incomePosAttr.needsUpdate = true;

      // Update Expense particles: (0, 0) to (4.5, -1.8)
      const expensePosAttr = expenseGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < expenseCount; i++) {
        expenseProgress[i] = (expenseProgress[i] + delta * 0.4) % 1;
        const t = expenseProgress[i];
        const p0 = { x: 0, y: 0, z: 0.5 };
        const p1 = { x: 2.2, y: -0.8, z: 0 };
        const p2 = { x: 4.5, y: -1.8, z: -1 };
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        const z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
        expensePosAttr.setXYZ(i, x, y, z);
      }
      expensePosAttr.needsUpdate = true;

      // Update Savings particles: (0, 0) to (4.5, 1.6)
      const savingsPosAttr = savingsGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < savingsCount; i++) {
        savingsProgress[i] = (savingsProgress[i] + delta * 0.3) % 1;
        const t = savingsProgress[i];
        const p0 = { x: 0, y: 0, z: 0.5 };
        const p1 = { x: 2.0, y: 1.0, z: 0 };
        const p2 = { x: 4.5, y: 1.6, z: -1 };
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        const z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
        savingsPosAttr.setXYZ(i, x, y, z);
      }
      savingsPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (hostEl) {
        hostEl.removeEventListener('mousemove', handleMouseMove);
      }
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();
      incomeGeo.dispose();
      incomeMat.dispose();
      expenseGeo.dispose();
      expenseMat.dispose();
      savingsGeo.dispose();
      savingsMat.dispose();
      incomeLine.geometry.dispose();
      (incomeLine.material as THREE.Material).dispose();
      expenseLine.geometry.dispose();
      (expenseLine.material as THREE.Material).dispose();
      savingsLine.geometry.dispose();
      (savingsLine.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-[#060c18]/95 border border-emerald-900/40 p-4 sm:p-5 overflow-hidden shadow-2xl shadow-emerald-950/20 backdrop-blur-md"
    >
      {/* 3D WebGL Background: Real-time Cash Flow Streams & Particles */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none opacity-45 sm:opacity-55" />

      {/* 1. Header Bar: Command Center & Real-time Flow Vectors */}
      <div className="relative z-10 flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-400 uppercase">
            AI FINANCIAL INTELLIGENCE COMMAND CENTER
          </span>
        </div>

        {/* Cash Flow Vector Route: INCOME → EXPENSES → SAVINGS */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[10px]">
          <span className="text-emerald-400 font-semibold">INCOME</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-rose-400 font-semibold">EXPENSES</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-cyan-400 font-semibold">SAVINGS</span>
        </div>
      </div>

      {/* 2. Middle Grid: Spending Analytics, Central Health Gauge, Budget & Savings */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3.5 my-3.5 items-stretch">
        {/* SPENDING ANALYTICS (Mini bar charts) */}
        <div className="md:col-span-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Spending Analytics
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Breakdown</span>
            </div>

            <div className="space-y-2 font-mono">
              {/* Food & Dining — 32% */}
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-300">Food &amp; Dining</span>
                  <span className="text-rose-400 font-semibold">32%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '32%' }} />
                </div>
              </div>

              {/* Shopping — 21% */}
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-300">Shopping</span>
                  <span className="text-purple-400 font-semibold">21%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '21%' }} />
                </div>
              </div>

              {/* Bills — 18% */}
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-300">Bills</span>
                  <span className="text-cyan-400 font-semibold">18%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              {/* Transport — 12% */}
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-300">Transport</span>
                  <span className="text-emerald-400 font-semibold">12%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Discretionary: Low</span>
            <span className="text-emerald-400">Stable</span>
          </div>
        </div>

        {/* CENTRAL ELEMENT: Circular "Financial Health" Gauge */}
        <div className="md:col-span-4 p-3 rounded-xl bg-slate-950/85 border border-emerald-900/50 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-inner shadow-emerald-950/30">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Financial Health
          </span>

          {/* Radial Circular Progress Gauge */}
          <div className="relative w-28 h-28 my-1 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0f172a"
                strokeWidth="8"
              />
              {/* Active gauge arc (82% filled) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - 0.82)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))',
                }}
              />
            </svg>

            {/* Gauge Core Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-display text-white tracking-tight">
                82
              </span>
              <span className="text-[10px] font-mono text-slate-400 -mt-1">
                / 100
              </span>
            </div>
          </div>

          {/* Healthy Status Badge */}
          <div className="mt-1 px-3 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Healthy</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Budget Status & Savings Goal */}
        <div className="md:col-span-4 flex flex-col justify-between gap-2.5">
          {/* BUDGET STATUS */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                MONTHLY BUDGET
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-400">
                74% Used
              </span>
            </div>
            <div className="text-xs font-mono font-semibold text-white mb-1.5">
              ₹18,500 <span className="text-slate-500 font-normal">/ ₹25,000</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                style={{ width: '74%' }}
              />
            </div>
          </div>

          {/* SAVINGS GOAL */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                SAVINGS GOAL
              </span>
              <span className="text-[11px] font-mono font-bold text-cyan-400">
                70% Complete
              </span>
            </div>
            <div className="text-xs font-mono font-semibold text-white mb-1.5">
              ₹42,000 <span className="text-slate-500 font-normal">/ ₹60,000</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: '70%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI FINANCIAL INSIGHT PANEL */}
      <div className="relative z-10 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-950/90 to-cyan-950/40 border border-purple-500/40 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-purple-950/30">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-900/60 border border-purple-500/50 text-purple-300 mt-0.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
              <span>AI FINANCIAL INSIGHT</span>
              <span className="w-1 h-1 rounded-full bg-purple-400 animate-ping" />
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-sans font-medium mt-0.5">
              &ldquo;Food spending is above your monthly average.&rdquo;
            </p>
          </div>
        </div>

        {/* Potential saving badge */}
        <div className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 font-mono text-xs flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-slate-400 text-[11px]">Potential saving:</span>
          <span className="text-emerald-400 font-bold">₹2,450</span>
        </div>
      </div>
    </div>
  );
};
