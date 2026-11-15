import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildSkillVisual } from './CentralSkillVisuals';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  color: number;
  connections: string[];
}

interface SkillsConstellation3DProps {
  selectedSkill: string | null;
  onSelectSkill: (skill: string, category: string) => void;
  activeCategory: string;
}

export const SkillsConstellation3D: React.FC<SkillsConstellation3DProps> = ({
  selectedSkill,
  onSelectSkill,
  activeCategory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // References to keep state live without tearing down the 3D scene
  const selectedSkillRef = useRef<string | null>(selectedSkill);
  const activeCategoryRef = useRef<string>(activeCategory);
  const updateVisualFnRef = useRef<((newSkill: string) => void) | null>(null);
  const updateHighlightsFnRef = useRef<(() => void) | null>(null);

  selectedSkillRef.current = selectedSkill;
  activeCategoryRef.current = activeCategory;

  // Exact skills from the user request grouped by the 5 categories
  const skillNodes: SkillNode[] = [
    // 1. PROGRAMMING & ANALYSIS (Cluster around [-2.6, 1.4, 0])
    { id: 'python', name: 'Python', category: 'PROGRAMMING & ANALYSIS', position: [-2.8, 1.6, 0.4], color: 0x38bdf8, connections: ['pandas', 'numpy', 'matplotlib', 'sql', 'openpyxl', 'flask'] },
    { id: 'pandas', name: 'Pandas', category: 'PROGRAMMING & ANALYSIS', position: [-2.2, 2.0, -0.3], color: 0x0ea5e9, connections: ['python', 'numpy', 'data-cleaning'] },
    { id: 'numpy', name: 'NumPy', category: 'PROGRAMMING & ANALYSIS', position: [-1.6, 1.4, 0.5], color: 0x0284c7, connections: ['python', 'pandas'] },
    { id: 'matplotlib', name: 'Matplotlib', category: 'PROGRAMMING & ANALYSIS', position: [-3.2, 0.9, -0.4], color: 0x60a5fa, connections: ['python', 'data-visualization'] },
    { id: 'sql', name: 'SQL', category: 'PROGRAMMING & ANALYSIS', position: [-2.2, 0.6, 0.2], color: 0x3b82f6, connections: ['joins', 'aggregations', 'subqueries', 'mysql', 'python'] },
    { id: 'joins', name: 'Joins', category: 'PROGRAMMING & ANALYSIS', position: [-2.9, 0.2, 0.5], color: 0x2563eb, connections: ['sql', 'aggregations'] },
    { id: 'aggregations', name: 'Aggregations', category: 'PROGRAMMING & ANALYSIS', position: [-1.8, -0.1, -0.3], color: 0x1d4ed8, connections: ['sql', 'subqueries'] },
    { id: 'subqueries', name: 'Subqueries', category: 'PROGRAMMING & ANALYSIS', position: [-2.4, -0.4, 0.3], color: 0x3b82f6, connections: ['sql', 'joins'] },

    // 2. BI & TOOLS (Cluster around [2.5, 1.2, 0])
    { id: 'powerbi', name: 'Power BI', category: 'BI & TOOLS', position: [2.5, 1.6, 0.3], color: 0xf59e0b, connections: ['excel', 'dashboards', 'data-visualization', 'kpi-tracking'] },
    { id: 'excel', name: 'Microsoft Excel', category: 'BI & TOOLS', position: [2.0, 0.9, -0.3], color: 0x10b981, connections: ['powerbi', 'pivot-tables', 'vlookup', 'data-validation'] },
    { id: 'pivot-tables', name: 'Pivot Tables', category: 'BI & TOOLS', position: [2.9, 0.7, 0.5], color: 0x059669, connections: ['excel', 'vlookup'] },
    { id: 'vlookup', name: 'VLOOKUP', category: 'BI & TOOLS', position: [1.7, 0.2, 0.2], color: 0x047857, connections: ['excel', 'pivot-tables'] },
    { id: 'dashboards', name: 'Dashboards', category: 'BI & TOOLS', position: [3.1, 1.3, -0.4], color: 0xfbbf24, connections: ['powerbi', 'reporting', 'data-visualization'] },
    { id: 'data-validation', name: 'Data Validation', category: 'BI & TOOLS', position: [1.5, 1.8, 0.4], color: 0x34d399, connections: ['excel', 'data-cleaning'] },
    { id: 'data-visualization', name: 'Data Visualization', category: 'BI & TOOLS', position: [2.7, 2.1, -0.2], color: 0xf59e0b, connections: ['powerbi', 'dashboards', 'matplotlib'] },

    // 3. DATA CONCEPTS (Cluster around [0, 2.3, 0])
    { id: 'data-cleaning', name: 'Data Cleaning', category: 'DATA CONCEPTS', position: [-0.6, 2.3, 0.3], color: 0x06b6d4, connections: ['eda', 'data-validation', 'pandas'] },
    { id: 'eda', name: 'Exploratory Data Analysis', category: 'DATA CONCEPTS', position: [0.5, 2.5, -0.2], color: 0x22d3ee, connections: ['data-cleaning', 'statistical-analysis', 'reporting'] },
    { id: 'kpi-tracking', name: 'KPI Tracking', category: 'DATA CONCEPTS', position: [0.9, 1.8, 0.4], color: 0x38bdf8, connections: ['reporting', 'dashboards', 'powerbi'] },
    { id: 'reporting', name: 'Reporting', category: 'DATA CONCEPTS', position: [0.0, 1.7, -0.4], color: 0x67e8f9, connections: ['kpi-tracking', 'eda', 'dashboards'] },
    { id: 'statistical-analysis', name: 'Statistical Analysis', category: 'DATA CONCEPTS', position: [-0.8, 1.6, -0.2], color: 0x0891b2, connections: ['eda', 'regression'] },

    // 4. MACHINE LEARNING (Cluster around [-1.4, -1.8, 0])
    { id: 'regression', name: 'Regression', category: 'MACHINE LEARNING', position: [-1.5, -1.4, 0.4], color: 0xa855f7, connections: ['classification', 'model-evaluation', 'ml-fundamentals'] },
    { id: 'classification', name: 'Classification', category: 'MACHINE LEARNING', position: [-0.8, -1.9, -0.3], color: 0xc084fc, connections: ['regression', 'model-evaluation', 'ml-fundamentals'] },
    { id: 'model-evaluation', name: 'Model Evaluation', category: 'MACHINE LEARNING', position: [-1.9, -2.1, -0.2], color: 0x9333ea, connections: ['regression', 'classification'] },
    { id: 'ml-fundamentals', name: 'Machine Learning Fundamentals', category: 'MACHINE LEARNING', position: [-0.9, -2.5, 0.4], color: 0x7e22ce, connections: ['regression', 'classification'] },

    // 5. OTHER (Cluster around [1.8, -1.6, 0])
    { id: 'openpyxl', name: 'OpenPyXL', category: 'OTHER', position: [1.1, -1.3, 0.4], color: 0x818cf8, connections: ['python', 'excel'] },
    { id: 'flask', name: 'Flask', category: 'OTHER', position: [2.0, -1.1, -0.3], color: 0x6366f1, connections: ['python', 'javascript'] },
    { id: 'html', name: 'HTML', category: 'OTHER', position: [1.4, -1.9, 0.2], color: 0x4f46e5, connections: ['css', 'javascript', 'flask'] },
    { id: 'css', name: 'CSS', category: 'OTHER', position: [2.3, -1.8, 0.4], color: 0x4338ca, connections: ['html', 'javascript'] },
    { id: 'javascript', name: 'JavaScript', category: 'OTHER', position: [2.4, -2.3, -0.2], color: 0x6366f1, connections: ['html', 'css', 'flask'] },
    { id: 'mysql', name: 'MySQL', category: 'OTHER', position: [0.7, -2.2, -0.4], color: 0x3b82f6, connections: ['sql'] },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Global Constellation Group (rotates continuously and with user drags)
    const group = new THREE.Group();
    scene.add(group);

    // Subtle background spherical wireframe
    const bgWireGeo = new THREE.SphereGeometry(4.4, 16, 16);
    const bgWireMat = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.12,
    });
    const bgWire = new THREE.LineSegments(new THREE.WireframeGeometry(bgWireGeo), bgWireMat);
    group.add(bgWire);

    // Build Node Meshes
    const nodeMap = new Map<string, SkillNode>();
    const meshMap = new Map<string, THREE.Mesh>();
    const meshes: THREE.Mesh[] = [];

    const baseSphereGeo = new THREE.SphereGeometry(0.14, 16, 16);

    skillNodes.forEach((node) => {
      nodeMap.set(node.id, node);
      const isSelected = selectedSkillRef.current?.toLowerCase() === node.name.toLowerCase();
      const nodeMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: isSelected ? 0.95 : 0.35,
        roughness: 0.3,
        metalness: 0.4,
      });

      const mesh = new THREE.Mesh(baseSphereGeo, nodeMat);
      mesh.position.set(...node.position);
      mesh.userData = { id: node.id, name: node.name, category: node.category };

      group.add(mesh);
      meshMap.set(node.id, mesh);
      meshes.push(mesh);
    });

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.6);
    dir.position.set(4, 5, 7);
    scene.add(dir);

    const dir2 = new THREE.DirectionalLight(0x7c3aed, 1.0);
    dir2.position.set(-4, -3, -5);
    scene.add(dir2);

    // Build Connection Lines
    const linesGroup = new THREE.Group();
    group.add(linesGroup);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    });

    const addedPairs = new Set<string>();
    skillNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = nodeMap.get(targetId);
        if (!targetNode) return;
        const key = [node.id, targetId].sort().join('--');
        if (addedPairs.has(key)) return;
        addedPairs.add(key);

        const pts = [
          new THREE.Vector3(...node.position),
          new THREE.Vector3(...targetNode.position),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(lineGeo, lineMat);
        linesGroup.add(line);
      });
    });

    // ========================================================
    // CENTRAL 3D DYNAMIC SKILL VISUAL SYSTEM
    // ========================================================
    // Positioned at center (0, 0, 0), surrounded by constellation
    const centralPivot = new THREE.Group();
    group.add(centralPivot);

    let currentVisual: THREE.Group = buildSkillVisual(selectedSkillRef.current || 'Python');
    centralPivot.add(currentVisual);

    let outgoingVisual: THREE.Group | null = null;
    let transitionProgress = 1.0; // 0 to 1

    const transitionToSkillVisual = (newSkillName: string) => {
      // Clean up previous outgoing if still animating
      if (outgoingVisual) {
        centralPivot.remove(outgoingVisual);
      }
      outgoingVisual = currentVisual;
      currentVisual = buildSkillVisual(newSkillName);
      currentVisual.scale.setScalar(0.01);
      centralPivot.add(currentVisual);
      transitionProgress = 0;
    };

    updateVisualFnRef.current = transitionToSkillVisual;

    // Highlights update function
    const applyHighlights = () => {
      const curSelected = selectedSkillRef.current;
      const curCat = activeCategoryRef.current;

      meshes.forEach((mesh) => {
        const node = nodeMap.get(mesh.userData.id);
        if (!node) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;

        const isCategoryMatch = curCat === 'ALL' || node.category === curCat;
        const isSelected = curSelected?.toLowerCase() === node.name.toLowerCase();

        if (isSelected) {
          mesh.scale.setScalar(1.7);
          mat.emissiveIntensity = 1.0;
          mat.opacity = 1;
        } else if (isCategoryMatch) {
          mesh.scale.setScalar(1.15);
          mat.emissiveIntensity = 0.35;
          mat.opacity = 1;
        } else {
          mesh.scale.setScalar(0.75);
          mat.emissiveIntensity = 0.08;
          mat.opacity = 0.35;
        }
      });
    };

    updateHighlightsFnRef.current = applyHighlights;
    applyHighlights();

    // ========================================================
    // INTERACTION HANDLERS (Desktop Mouse & Mobile Touch Supported)
    // ========================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let pointerTravel = 0;
    let rotX = 0;
    let rotY = 0;

    const setPointerFromEvent = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      pointerTravel = 0;
      prevPointer = { x: e.clientX, y: e.clientY };
      setPointerFromEvent(e.clientX, e.clientY);
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      setPointerFromEvent(e.clientX, e.clientY);

      if (isDragging) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        pointerTravel += Math.hypot(dx, dy);

        rotY = dx * 0.005;
        rotX = dy * 0.005;
        group.rotation.y += rotY;
        group.rotation.x += rotX;
        prevPointer = { x: e.clientX, y: e.clientY };
      } else {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(meshes);
        if (hits.length > 0) {
          const hitMesh = hits[0].object as THREE.Mesh;
          container.style.cursor = 'pointer';
          setHoveredSkill(hitMesh.userData.name);
        } else {
          container.style.cursor = 'grab';
          setHoveredSkill(null);
        }
      }
    };

    const onPointerUp = () => {
      if (isDragging) {
        // If movement was small, treat as a clean click/tap on node
        if (pointerTravel < 10) {
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects(meshes);
          if (hits.length > 0) {
            const hit = hits[0].object as THREE.Mesh;
            onSelectSkill(hit.userData.name, hit.userData.category);
          }
        }
      }
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ========================================================
    // CONTINUOUS ANIMATION LOOP (Floating, 360° Rotation & Phase Morphing)
    // ========================================================
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Continuous 360-degree rotation of constellation
      if (!isDragging) {
        group.rotation.y += 0.0018;
        rotX *= 0.95;
        rotY *= 0.95;
        group.rotation.x += rotX;
        group.rotation.y += rotY;
      }

      // 2. Central visual continuous floating and continuous 360-degree rotation
      centralPivot.position.y = Math.sin(elapsedTime * 1.8) * 0.12;
      centralPivot.rotation.y += 0.006;

      // 3. Smooth Phase-Change / Morphing Transition between skills
      if (transitionProgress < 1.0) {
        transitionProgress = Math.min(1.0, transitionProgress + delta * 3.2);

        // Smooth cubic easing
        const t = transitionProgress;
        const easeOut = 1 - Math.pow(1 - t, 3);

        if (currentVisual) {
          currentVisual.scale.setScalar(Math.max(0.01, easeOut));
        }

        if (outgoingVisual) {
          outgoingVisual.scale.setScalar(Math.max(0.01, 1 - easeOut));

          if (transitionProgress >= 1.0) {
            centralPivot.remove(outgoingVisual);
            outgoingVisual = null;
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      meshes.forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
        else m.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update when selectedSkill or activeCategory changes without resetting the 360 scene
  const prevSkillRef = useRef<string | null>(selectedSkill);
  useEffect(() => {
    if (selectedSkill && selectedSkill !== prevSkillRef.current) {
      prevSkillRef.current = selectedSkill;
      if (updateVisualFnRef.current) {
        updateVisualFnRef.current(selectedSkill);
      }
    }
    if (updateHighlightsFnRef.current) {
      updateHighlightsFnRef.current();
    }
  }, [selectedSkill, activeCategory]);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] bg-[#080d19]/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        title="Interactive 3D Skill Network — Tap/Click to inspect"
      />

      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded text-[11px] font-mono text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>3D Skill Constellation</span>
      </div>

      {hoveredSkill && (
        <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1.5 bg-slate-950/95 border border-cyan-500/50 rounded-lg text-xs font-mono text-cyan-300 shadow-xl">
          Skill: <strong className="text-white">{hoveredSkill}</strong> (Click to view details)
        </div>
      )}

      <div className="absolute bottom-3 right-3 pointer-events-none text-right text-[11px] font-mono text-slate-400">
        Rotate · Click Node · Responsive Orbit
      </div>
    </div>
  );
};
