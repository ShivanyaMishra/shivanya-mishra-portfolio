import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Linkedin, Github, Mail, FileText, ExternalLink } from 'lucide-react';

interface ContactNetwork3DProps {
  onOpenResume: () => void;
  email: string;
  linkedin: string;
  github: string;
}

export const ContactNetwork3D: React.FC<ContactNetwork3DProps> = ({
  onOpenResume,
  email,
  linkedin,
  github,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

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

    // Central Node: SHIVANYA
    const centerGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.5,
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.userData = { id: 'center', name: 'SHIVANYA' };
    group.add(centerMesh);

    // Halo wireframe for center
    const haloGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const haloMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.4,
    });
    const halo = new THREE.LineSegments(new THREE.WireframeGeometry(haloGeo), haloMat);
    group.add(halo);

    // Satellite Nodes: LinkedIn, GitHub, Email, Resume
    const satellites = [
      { id: 'linkedin', name: 'LinkedIn', pos: [-2.1, 1.3, 0], color: 0x0ea5e9, url: linkedin },
      { id: 'github', name: 'GitHub', pos: [2.1, 1.3, 0], color: 0x818cf8, url: github },
      { id: 'email', name: 'Email', pos: [-2.1, -1.3, 0], color: 0x06b6d4, url: `mailto:${email}` },
      { id: 'resume', name: 'Resume', pos: [2.1, -1.3, 0], color: 0xa855f7, action: 'resume' },
    ];

    const satMeshes: THREE.Mesh[] = [];
    const satGeo = new THREE.SphereGeometry(0.3, 16, 16);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });

    satellites.forEach((sat) => {
      const mat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.4,
      });
      const mesh = new THREE.Mesh(satGeo, mat);
      mesh.position.set(sat.pos[0], sat.pos[1], sat.pos[2]);
      mesh.userData = sat;
      group.add(mesh);
      satMeshes.push(mesh);

      // Branch Line connecting SHIVANYA to Satellite
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(sat.pos[0], sat.pos[1], sat.pos[2]),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
    });

    // Ambient floating ring
    const ringGeo = new THREE.RingGeometry(2.45, 2.48, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dir.position.set(2, 4, 6);
    scene.add(dir);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects([...satMeshes, centerMesh]);
      if (hits.length > 0) {
        container.style.cursor = 'pointer';
        setHoveredNode(hits[0].object.userData.name);
      } else {
        container.style.cursor = 'default';
        setHoveredNode(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(satMeshes);
      if (hits.length > 0) {
        const item = hits[0].object.userData;
        if (item.action === 'resume') {
          onOpenResume();
        } else if (item.url) {
          window.open(item.url, '_blank');
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

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

      // Subtle wobble & orbit
      group.rotation.y = Math.sin(elapsed * 0.4) * 0.12;
      group.rotation.x = Math.cos(elapsed * 0.3) * 0.08;

      halo.rotation.y = elapsed * 0.8;
      halo.rotation.z = elapsed * 0.4;

      satMeshes.forEach((mesh, i) => {
        mesh.position.z = Math.sin(elapsed * 1.5 + i * 1.2) * 0.25;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);

      centerGeo.dispose();
      centerMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      satGeo.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [email, linkedin, github, onOpenResume]);

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-[#080d19]/90 border border-slate-800 p-4 overflow-hidden backdrop-blur-md">
      <div ref={mountRef} className="w-full h-full" />

      {/* Hover Node indicator */}
      {hoveredNode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900/95 border border-cyan-500/60 rounded-full text-xs font-mono text-cyan-300 shadow-xl pointer-events-none">
          Click to connect: <strong className="text-white">{hoveredNode}</strong>
        </div>
      )}

      {/* Legend / Direct Action Buttons underneath */}
      <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded flex items-center gap-1.5 transition-colors"
        >
          <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
          <span>LinkedIn</span>
        </a>

        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded flex items-center gap-1.5 transition-colors"
        >
          <Github className="w-3.5 h-3.5 text-indigo-400" />
          <span>GitHub</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded flex items-center gap-1.5 transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Email</span>
        </a>

        <button
          onClick={onOpenResume}
          className="px-3 py-1 bg-cyan-950/90 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-700/60 rounded flex items-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume</span>
        </button>
      </div>
    </div>
  );
};
