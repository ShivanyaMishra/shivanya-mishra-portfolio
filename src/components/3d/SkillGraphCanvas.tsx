import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: string;
  position: [number, number, number];
  color: number;
}

interface SkillGraphCanvasProps {
  activeCategory: string;
  onSelectSkill: (skillName: string, category: string) => void;
  selectedSkill: string | null;
}

export const SkillGraphCanvas: React.FC<SkillGraphCanvasProps> = ({
  activeCategory,
  onSelectSkill,
  selectedSkill,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Skill nodes definition with 3D cluster positions
  const nodes: SkillNode[] = [
    // Programming (Cluster center: [-2.6, 1.4, 0])
    { id: 'python', name: 'Python', category: 'programming', level: 'Core', position: [-2.8, 1.8, 0.4], color: 0x38bdf8 },
    { id: 'sql', name: 'SQL', category: 'programming', level: 'Core', position: [-2.2, 1.0, -0.4], color: 0x0284c7 },

    // Data Analysis (Cluster center: [0, 2.2, -0.5])
    { id: 'pandas', name: 'Pandas', category: 'data-analysis', level: 'Core', position: [-0.6, 2.4, 0.2], color: 0x06b6d4 },
    { id: 'numpy', name: 'NumPy', category: 'data-analysis', level: 'Core', position: [0.7, 2.6, -0.4], color: 0x0ea5e9 },
    { id: 'excel', name: 'Excel', category: 'data-analysis', level: 'Core', position: [-0.2, 1.6, 0.7], color: 0x10b981 },
    { id: 'data-cleaning', name: 'Data Cleaning', category: 'data-analysis', level: 'Core', position: [0.8, 1.7, 0.2], color: 0x14b8a6 },
    { id: 'eda', name: 'Exploratory Data Analysis', category: 'data-analysis', level: 'Core', position: [0.1, 2.9, -0.2], color: 0x38bdf8 },

    // Visualization (Cluster center: [2.5, 0.6, 0])
    { id: 'powerbi', name: 'Power BI', category: 'visualization', level: 'Core', position: [2.6, 1.2, 0.3], color: 0xf59e0b },
    { id: 'matplotlib', name: 'Matplotlib', category: 'visualization', level: 'Proficient', position: [2.2, -0.1, -0.5], color: 0x0284c7 },
    { id: 'seaborn', name: 'Seaborn', category: 'visualization', level: 'Proficient', position: [2.9, 0.2, 0.6], color: 0x06b6d4 },

    // Machine Learning (Cluster center: [-1.2, -1.8, 0.2])
    { id: 'scikit-learn', name: 'Scikit-learn', category: 'machine-learning', level: 'Proficient', position: [-1.6, -1.4, 0.5], color: 0x818cf8 },
    { id: 'regression', name: 'Regression', category: 'machine-learning', level: 'Proficient', position: [-0.6, -1.9, -0.2], color: 0xa855f7 },
    { id: 'classification', name: 'Classification', category: 'machine-learning', level: 'Proficient', position: [-1.9, -2.2, -0.3], color: 0xc084fc },
    { id: 'model-evaluation', name: 'Model Evaluation', category: 'machine-learning', level: 'Proficient', position: [-0.9, -2.5, 0.4], color: 0x6366f1 },

    // Other & Tools (Cluster center: [1.6, -1.8, -0.2])
    { id: 'git', name: 'Git', category: 'other', level: 'Core', position: [1.2, -1.6, 0.5], color: 0x64748b },
    { id: 'github', name: 'GitHub', category: 'other', level: 'Core', position: [1.9, -1.3, -0.4], color: 0x94a3b8 },
    { id: 'flask', name: 'Flask', category: 'other', level: 'Familiar', position: [2.3, -2.2, 0.3], color: 0x38bdf8 },
    { id: 'mysql', name: 'MySQL', category: 'other', level: 'Core', position: [0.8, -2.3, -0.5], color: 0x0284c7 },
  ];

  // Inter-skill relational edges
  const links: [string, string][] = [
    ['python', 'pandas'],
    ['python', 'numpy'],
    ['python', 'scikit-learn'],
    ['python', 'flask'],
    ['sql', 'mysql'],
    ['sql', 'pandas'],
    ['pandas', 'numpy'],
    ['pandas', 'data-cleaning'],
    ['pandas', 'eda'],
    ['numpy', 'scikit-learn'],
    ['data-cleaning', 'eda'],
    ['eda', 'matplotlib'],
    ['eda', 'seaborn'],
    ['matplotlib', 'seaborn'],
    ['powerbi', 'excel'],
    ['scikit-learn', 'regression'],
    ['scikit-learn', 'classification'],
    ['scikit-learn', 'model-evaluation'],
    ['git', 'github'],
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Subtle background wireframe boundary
    const sphereGeo = new THREE.SphereGeometry(4.2, 16, 16);
    const sphereWire = new THREE.WireframeGeometry(sphereGeo);
    const sphereMat = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.15,
    });
    const sphereLines = new THREE.LineSegments(sphereWire, sphereMat);
    graphGroup.add(sphereLines);

    // Map of nodes for quick coordinate lookup
    const nodeMap = new Map<string, THREE.Mesh>();
    const nodeDataMap = new Map<string, SkillNode>();
    const meshes: THREE.Mesh[] = [];

    // Create 3D Nodes
    const baseSphereGeo = new THREE.SphereGeometry(0.18, 16, 16);

    nodes.forEach((node) => {
      nodeDataMap.set(node.id, node);
      const isCore = node.level === 'Core';
      const nodeMat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.3,
        metalness: 0.2,
        emissive: node.color,
        emissiveIntensity: 0.25,
      });

      const mesh = new THREE.Mesh(baseSphereGeo, nodeMat);
      mesh.position.set(...node.position);
      mesh.scale.setScalar(isCore ? 1.15 : 0.95);
      mesh.userData = { id: node.id, name: node.name, category: node.category };

      graphGroup.add(mesh);
      meshes.push(mesh);
      nodeMap.set(node.id, mesh);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(5, 5, 7);
    scene.add(dirLight);

    // Create Relational Edges
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
    });

    links.forEach(([sourceId, targetId]) => {
      const srcNode = nodeDataMap.get(sourceId);
      const tgtNode = nodeDataMap.get(targetId);
      if (srcNode && tgtNode) {
        const points = [
          new THREE.Vector3(...srcNode.position),
          new THREE.Vector3(...tgtNode.position),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        graphGroup.add(line);
      }
    });

    // Raycasting for interactive hover and click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotSpeedX = 0;
    let rotSpeedY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const dx = e.clientX - prevMousePos.x;
        const dy = e.clientY - prevMousePos.y;
        rotSpeedY = dx * 0.005;
        rotSpeedX = dy * 0.005;
        graphGroup.rotation.y += rotSpeedY;
        graphGroup.rotation.x += rotSpeedX;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          const hovered = intersects[0].object as THREE.Mesh;
          container.style.cursor = 'pointer';
          setHoveredNode(hovered.userData.name);
        } else {
          container.style.cursor = 'grab';
          setHoveredNode(null);
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        // If minimal movement, register as click
        const dx = Math.abs(e.clientX - prevMousePos.x);
        const dy = Math.abs(e.clientY - prevMousePos.y);
        if (dx < 3 && dy < 3) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(meshes);
          if (intersects.length > 0) {
            const hit = intersects[0].object as THREE.Mesh;
            onSelectSkill(hit.userData.name, hit.userData.category);
          }
        }
      }
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Dynamic Highlighting based on activeCategory
    meshes.forEach((mesh) => {
      const data = nodeDataMap.get(mesh.userData.id);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!data) return;

      const isMatch = activeCategory === 'all' || data.category === activeCategory;
      const isSelected = selectedSkill === data.name;

      if (isSelected) {
        mesh.scale.setScalar(1.6);
        mat.emissiveIntensity = 0.9;
        mat.opacity = 1;
      } else if (isMatch) {
        mesh.scale.setScalar(data.level === 'Core' ? 1.2 : 1.0);
        mat.emissiveIntensity = 0.35;
        mat.opacity = 1;
      } else {
        mesh.scale.setScalar(0.7);
        mat.emissiveIntensity = 0.05;
        mat.opacity = 0.3;
      }
    });

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        graphGroup.rotation.y += 0.002;
        // Friction on inertia
        rotSpeedX *= 0.95;
        rotSpeedY *= 0.95;
        graphGroup.rotation.x += rotSpeedX;
        graphGroup.rotation.y += rotSpeedY;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);

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
  }, [activeCategory, selectedSkill]);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] bg-[#070b13]/60 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Skill Graph — Click nodes or drag to rotate"
      />

      {/* Floating Status & Interaction Hint */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded text-[11px] font-mono text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>3D Graph Visualizer</span>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded shadow-lg text-xs font-mono text-cyan-300">
          Selected Node: <strong className="text-white">{hoveredNode}</strong> (Click to view)
        </div>
      )}

      <div className="absolute bottom-3 right-3 pointer-events-none text-right text-[11px] font-mono text-slate-500">
        Rotate · Click Nodes · Zoomable
      </div>
    </div>
  );
};
