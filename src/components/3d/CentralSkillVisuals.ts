import * as THREE from 'three';

// Shared materials for premium futuristic holographic aesthetic
const cyanNeon = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  emissive: 0x06b6d4,
  emissiveIntensity: 1.8,
  roughness: 0.2,
  metalness: 0.8,
});

const blueNeon = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  emissive: 0x1d4ed8,
  emissiveIntensity: 1.6,
  roughness: 0.25,
  metalness: 0.7,
});

const emeraldNeon = new THREE.MeshStandardMaterial({
  color: 0x10b981,
  emissive: 0x059669,
  emissiveIntensity: 1.6,
  roughness: 0.2,
  metalness: 0.6,
});

const amberNeon = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  emissive: 0xd97706,
  emissiveIntensity: 1.8,
  roughness: 0.25,
  metalness: 0.6,
});

const purpleNeon = new THREE.MeshStandardMaterial({
  color: 0xa855f7,
  emissive: 0x7e22ce,
  emissiveIntensity: 1.8,
  roughness: 0.2,
  metalness: 0.7,
});

const darkMetal = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.3,
  metalness: 0.85,
});

const glassTranslucent = new THREE.MeshPhysicalMaterial({
  color: 0x0284c7,
  transparent: true,
  opacity: 0.45,
  roughness: 0.1,
  metalness: 0.1,
  transmission: 0.6,
});

const wireCyan = new THREE.LineBasicMaterial({
  color: 0x38bdf8,
  transparent: true,
  opacity: 0.75,
});

const wireEmerald = new THREE.LineBasicMaterial({
  color: 0x34d399,
  transparent: true,
  opacity: 0.8,
});

/**
 * Creates the bespoke 3D Holographic Central Visual for any skill in the portfolio.
 */
export function buildSkillVisual(skillName: string): THREE.Group {
  const root = new THREE.Group();
  const norm = (skillName || '').toLowerCase().trim();

  // Subtle floating base aura ring
  const auraGeo = new THREE.RingGeometry(1.2, 1.25, 36);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.25,
  });
  const aura = new THREE.Mesh(auraGeo, auraMat);
  aura.rotation.x = Math.PI / 2;
  aura.position.y = -0.9;
  root.add(aura);

  // ========================================================
  // 1. PYTHON / CODING VISUAL
  // ========================================================
  if (norm.includes('python')) {
    // Holographic Python emblem: Two interlocking styled arcs (Cyan and Blue)
    const upperArcGeo = new THREE.TorusGeometry(0.55, 0.12, 16, 32, Math.PI * 1.15);
    const upperArc = new THREE.Mesh(upperArcGeo, cyanNeon);
    upperArc.position.set(-0.15, 0.2, 0);
    upperArc.rotation.z = Math.PI * 0.2;
    root.add(upperArc);

    const lowerArcGeo = new THREE.TorusGeometry(0.55, 0.12, 16, 32, Math.PI * 1.15);
    const lowerArc = new THREE.Mesh(lowerArcGeo, blueNeon);
    lowerArc.position.set(0.15, -0.2, 0);
    lowerArc.rotation.z = Math.PI * 1.2;
    root.add(lowerArc);

    // Glowing eye diodes
    const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const eye1 = new THREE.Mesh(eyeGeo, amberNeon);
    eye1.position.set(-0.35, 0.6, 0.1);
    root.add(eye1);

    const eye2 = new THREE.Mesh(eyeGeo, cyanNeon);
    eye2.position.set(0.35, -0.6, 0.1);
    root.add(eye2);

    // Floating Code Lines (indentation blocks)
    const lineLengths = [0.8, 0.5, 0.9, 0.4];
    lineLengths.forEach((len, idx) => {
      const barGeo = new THREE.BoxGeometry(len, 0.04, 0.04);
      const bar = new THREE.Mesh(barGeo, cyanNeon);
      bar.position.set(0.2, 0.35 - idx * 0.22, 0.4);
      root.add(bar);
    });

    // Code Brackets { } floating on left and right
    const bracketGeo = new THREE.TorusGeometry(0.4, 0.03, 12, 24, Math.PI * 0.7);
    const leftBracket = new THREE.Mesh(bracketGeo, cyanNeon);
    leftBracket.position.set(-0.85, 0, 0);
    leftBracket.rotation.z = Math.PI * 0.65;
    root.add(leftBracket);

    const rightBracket = new THREE.Mesh(bracketGeo, cyanNeon);
    rightBracket.position.set(0.85, 0, 0);
    rightBracket.rotation.z = -Math.PI * 0.35;
    root.add(rightBracket);

    return root;
  }

  // ========================================================
  // 2. SQL / MYSQL / DATABASE & DATA TABLE
  // ========================================================
  if (norm.includes('sql') || norm.includes('mysql') || norm.includes('subqueries')) {
    // 3 Stacked Cylindrical Storage Platters
    const diskGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.2, 32);
    const platterRingGeo = new THREE.TorusGeometry(0.76, 0.02, 16, 36);

    [-0.45, 0, 0.45].forEach((yPos) => {
      const disk = new THREE.Mesh(diskGeo, darkMetal);
      disk.position.y = yPos;
      root.add(disk);

      const ring = new THREE.Mesh(platterRingGeo, cyanNeon);
      ring.position.y = yPos;
      ring.rotation.x = Math.PI / 2;
      root.add(ring);

      // Status indicator light on disk perimeter
      const ledGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const led = new THREE.Mesh(ledGeo, amberNeon);
      led.position.set(0.72, yPos, 0.15);
      root.add(led);
    });

    // Floating Translucent Relational Data Table Grid
    const tablePlateGeo = new THREE.PlaneGeometry(1.2, 0.8);
    const tablePlate = new THREE.Mesh(tablePlateGeo, glassTranslucent);
    tablePlate.position.set(0.65, 0.1, 0.45);
    tablePlate.rotation.y = -0.4;
    root.add(tablePlate);

    // Grid row and column lines
    const gridEdges = new THREE.EdgesGeometry(tablePlateGeo);
    const gridLine = new THREE.LineSegments(gridEdges, wireCyan);
    gridLine.position.copy(tablePlate.position);
    gridLine.rotation.copy(tablePlate.rotation);
    root.add(gridLine);

    // Inner table divider lines
    for (let i = -0.2; i <= 0.2; i += 0.2) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.55, i, 0.01),
        new THREE.Vector3(0.55, i, 0.01),
      ]);
      const l = new THREE.Line(lineGeo, wireCyan);
      l.position.copy(tablePlate.position);
      l.rotation.copy(tablePlate.rotation);
      root.add(l);
    }

    return root;
  }

  // ========================================================
  // 3. JOINS / VENN DIAGRAM INTERSECTION
  // ========================================================
  if (norm.includes('join')) {
    // Left Venn Table Ring
    const ringGeo = new THREE.TorusGeometry(0.65, 0.06, 16, 36);
    const leftRing = new THREE.Mesh(ringGeo, cyanNeon);
    leftRing.position.set(-0.35, 0, 0);
    root.add(leftRing);

    // Right Venn Table Ring
    const rightRing = new THREE.Mesh(ringGeo, blueNeon);
    rightRing.position.set(0.35, 0, 0);
    root.add(rightRing);

    // Glowing Intersection Overlap Core
    const coreGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 24);
    const core = new THREE.Mesh(coreGeo, emeraldNeon);
    core.position.set(0, 0, 0);
    core.rotation.x = Math.PI / 2;
    root.add(core);

    // Key Link Connector Bar
    const barGeo = new THREE.BoxGeometry(0.9, 0.04, 0.04);
    const bar = new THREE.Mesh(barGeo, amberNeon);
    bar.position.set(0, -0.4, 0);
    root.add(bar);

    return root;
  }

  // ========================================================
  // 4. POWER BI / DASHBOARDS / KPI TRACKING
  // ========================================================
  if (norm.includes('power bi') || norm.includes('dashboard') || norm.includes('kpi')) {
    // Floating Dashboard Backing Frame
    const frameGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const frame = new THREE.Mesh(frameGeo, glassTranslucent);
    frame.position.set(0, 0, -0.2);
    root.add(frame);

    const frameEdge = new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), wireCyan);
    frameEdge.position.copy(frame.position);
    root.add(frameEdge);

    // 4 Vertical 3D Bar Chart Columns of stepped heights
    const barHeights = [0.45, 0.85, 0.6, 1.05];
    const barMats = [cyanNeon, amberNeon, blueNeon, emeraldNeon];
    const barWidth = 0.16;

    barHeights.forEach((h, i) => {
      const barGeo = new THREE.BoxGeometry(barWidth, h, barWidth);
      const bar = new THREE.Mesh(barGeo, barMats[i]);
      bar.position.set(-0.55 + i * 0.36, -0.5 + h / 2, 0);
      root.add(bar);
    });

    // Ascending 3D Trend Spline Line with Key Metric Points
    const curvePoints = [
      new THREE.Vector3(-0.6, -0.3, 0.18),
      new THREE.Vector3(-0.2, 0.15, 0.2),
      new THREE.Vector3(0.15, 0.05, 0.22),
      new THREE.Vector3(0.55, 0.55, 0.25),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const curveGeo = new THREE.TubeGeometry(curve, 24, 0.022, 8, false);
    const trendMesh = new THREE.Mesh(curveGeo, amberNeon);
    root.add(trendMesh);

    // Data points along curve
    curvePoints.forEach((pt) => {
      const dotGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const dot = new THREE.Mesh(dotGeo, cyanNeon);
      dot.position.copy(pt);
      root.add(dot);
    });

    // KPI Target Radial Arc (Gauge)
    const gaugeGeo = new THREE.TorusGeometry(0.35, 0.035, 16, 28, Math.PI * 1.35);
    const gauge = new THREE.Mesh(gaugeGeo, emeraldNeon);
    gauge.position.set(0.48, 0.35, 0.05);
    gauge.rotation.z = Math.PI * 0.8;
    root.add(gauge);

    return root;
  }

  // ========================================================
  // 5. MICROSOFT EXCEL / PIVOT TABLES / VLOOKUP
  // ========================================================
  if (norm.includes('excel') || norm.includes('pivot') || norm.includes('vlookup')) {
    // 3D Emerald Spreadsheet Matrix Grid
    const sheetFrameGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const sheetMesh = new THREE.Mesh(sheetFrameGeo, glassTranslucent);
    root.add(sheetMesh);

    // Outer Emerald Border
    const sheetEdge = new THREE.LineSegments(new THREE.EdgesGeometry(sheetFrameGeo), wireEmerald);
    root.add(sheetEdge);

    // Prominent Emerald Header Bar
    const headerGeo = new THREE.BoxGeometry(1.6, 0.2, 0.06);
    const header = new THREE.Mesh(headerGeo, emeraldNeon);
    header.position.set(0, 0.5, 0.02);
    root.add(header);

    // Grid Cell Lines (4 columns x 4 rows)
    for (let c = -0.4; c <= 0.4; c += 0.4) {
      const colLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c, 0.4, 0.02),
        new THREE.Vector3(c, -0.6, 0.02),
      ]);
      root.add(new THREE.Line(colLineGeo, wireEmerald));
    }
    for (let r = 0.15; r >= -0.45; r -= 0.25) {
      const rowLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.8, r, 0.02),
        new THREE.Vector3(0.8, r, 0.02),
      ]);
      root.add(new THREE.Line(rowLineGeo, wireEmerald));
    }

    // Active Highlighted Cell with Corner Box
    const activeBoxGeo = new THREE.BoxGeometry(0.38, 0.23, 0.08);
    const activeBox = new THREE.Mesh(activeBoxGeo, cyanNeon);
    activeBox.position.set(-0.2, -0.1, 0.05);
    root.add(activeBox);

    // VLOOKUP Scanner Arrow
    if (norm.includes('vlookup')) {
      const arrowGeo = new THREE.ConeGeometry(0.08, 0.2, 16);
      const arrow = new THREE.Mesh(arrowGeo, amberNeon);
      arrow.position.set(0.1, -0.1, 0.15);
      arrow.rotation.z = -Math.PI / 2;
      root.add(arrow);
    }

    return root;
  }

  // ========================================================
  // 6. PANDAS / DATAFRAME
  // ========================================================
  if (norm.includes('pandas')) {
    // 3D DataFrame Structure
    const dfBackingGeo = new THREE.PlaneGeometry(1.5, 1.1);
    const dfBacking = new THREE.Mesh(dfBackingGeo, glassTranslucent);
    root.add(dfBacking);

    // Light-Blue Header Ribbon
    const dfHeaderGeo = new THREE.BoxGeometry(1.5, 0.18, 0.05);
    const dfHeader = new THREE.Mesh(dfHeaderGeo, blueNeon);
    dfHeader.position.set(0, 0.46, 0.02);
    root.add(dfHeader);

    // Left Index Column (Series Index)
    const indexColGeo = new THREE.BoxGeometry(0.24, 0.9, 0.04);
    const indexCol = new THREE.Mesh(indexColGeo, darkMetal);
    indexCol.position.set(-0.63, -0.1, 0.02);
    root.add(indexCol);

    // 3 Data Series Columns with glowing colored cells
    const colColors = [cyanNeon, emeraldNeon, purpleNeon];
    for (let c = 0; c < 3; c++) {
      const x = -0.22 + c * 0.42;
      for (let r = 0; r < 3; r++) {
        const y = 0.2 - r * 0.28;
        const cellGeo = new THREE.BoxGeometry(0.34, 0.18, 0.05);
        const cell = new THREE.Mesh(cellGeo, colColors[c]);
        cell.position.set(x, y, 0.03);
        root.add(cell);
      }
    }

    // Outer Edge Frame
    const dfEdge = new THREE.LineSegments(new THREE.EdgesGeometry(dfBackingGeo), wireCyan);
    root.add(dfEdge);

    return root;
  }

  // ========================================================
  // 7. NUMPY / NUMERICAL MATRIX TENSOR
  // ========================================================
  if (norm.includes('numpy')) {
    // 3x3x3 Isometric Cube Matrix (Numerical Tensor)
    const voxelGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const spacing = 0.38;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Highlight diagonal elements in cyan, rest in blue/graphite
          const isDiag = x === y && y === z;
          const mat = isDiag ? cyanNeon : (x + y + z) % 2 === 0 ? blueNeon : darkMetal;
          const voxel = new THREE.Mesh(voxelGeo, mat);
          voxel.position.set(x * spacing, y * spacing, z * spacing);
          root.add(voxel);
        }
      }
    }

    // Outer Bounding Lattice Cage
    const cageGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(cageGeo), wireCyan);
    root.add(cage);

    // 3 Coordinate Axis Arrows (X, Y, Z)
    const axisMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
    const pts = [
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.9, 0, 0)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.9, 0)],
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0.9)],
    ];
    pts.forEach((p) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(p);
      root.add(new THREE.Line(lineGeo, axisMat));
    });

    return root;
  }

  // ========================================================
  // 8. MACHINE LEARNING / ML FUNDAMENTALS
  // ========================================================
  if (norm.includes('machine learning') || norm.includes('ml')) {
    // 3-Layer Neural Network Architecture
    // Input: 3 nodes, Hidden: 4 nodes, Output: 2 nodes
    const layers = [
      { x: -0.65, count: 3, mat: cyanNeon },
      { x: 0, count: 4, mat: purpleNeon },
      { x: 0.65, count: 2, mat: emeraldNeon },
    ];

    const nodePositions: THREE.Vector3[][] = [];

    layers.forEach((l, lIdx) => {
      const positions: THREE.Vector3[] = [];
      const step = 0.42;
      const startY = ((l.count - 1) * step) / 2;

      for (let i = 0; i < l.count; i++) {
        const y = startY - i * step;
        const pos = new THREE.Vector3(l.x, y, 0);
        positions.push(pos);

        const nodeGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const node = new THREE.Mesh(nodeGeo, l.mat);
        node.position.copy(pos);
        root.add(node);
      }
      nodePositions.push(positions);
    });

    // Synaptic Connection Lines between layers
    const synapseMat = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.45,
    });

    for (let l = 0; l < nodePositions.length - 1; l++) {
      const fromLayer = nodePositions[l];
      const toLayer = nodePositions[l + 1];

      fromLayer.forEach((p1) => {
        toLayer.forEach((p2) => {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          root.add(new THREE.Line(lineGeo, synapseMat));
        });
      });
    }

    return root;
  }

  // ========================================================
  // 9. REGRESSION & CLASSIFICATION
  // ========================================================
  if (norm.includes('regression') || norm.includes('classification') || norm.includes('model evaluation')) {
    // 3D Scatter Points Cluster
    const dotGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const cluster1 = [
      new THREE.Vector3(-0.6, -0.4, 0.1),
      new THREE.Vector3(-0.4, -0.2, -0.1),
      new THREE.Vector3(-0.5, -0.1, 0.2),
      new THREE.Vector3(-0.3, 0.1, 0.0),
    ];
    const cluster2 = [
      new THREE.Vector3(0.3, 0.1, -0.1),
      new THREE.Vector3(0.5, 0.3, 0.2),
      new THREE.Vector3(0.4, 0.4, -0.2),
      new THREE.Vector3(0.6, 0.5, 0.1),
    ];

    cluster1.forEach((pt) => {
      const m = new THREE.Mesh(dotGeo, cyanNeon);
      m.position.copy(pt);
      root.add(m);
    });
    cluster2.forEach((pt) => {
      const m = new THREE.Mesh(dotGeo, purpleNeon);
      m.position.copy(pt);
      root.add(m);
    });

    // Best-fit Linear Regression Vector / Decision Plane
    const lineCurve = new THREE.LineCurve3(
      new THREE.Vector3(-0.8, -0.6, 0),
      new THREE.Vector3(0.8, 0.7, 0)
    );
    const lineGeo = new THREE.TubeGeometry(lineCurve, 12, 0.025, 8, false);
    const regressionMesh = new THREE.Mesh(lineGeo, amberNeon);
    root.add(regressionMesh);

    // Translucent Separating Hyperplane
    const planeGeo = new THREE.PlaneGeometry(1.4, 1.2);
    const plane = new THREE.Mesh(planeGeo, glassTranslucent);
    plane.rotation.z = -0.55;
    root.add(plane);

    return root;
  }

  // ========================================================
  // 10. STATISTICS / STATISTICAL ANALYSIS / PROBABILITY
  // ========================================================
  if (norm.includes('statistic')) {
    // 3D Gaussian Bell Curve Ribbon: y = exp(-x^2 / 2)
    const curvePoints: THREE.Vector3[] = [];
    for (let x = -1.2; x <= 1.2; x += 0.1) {
      const y = Math.exp(-(x * x) * 2.2) * 1.1 - 0.55;
      curvePoints.push(new THREE.Vector3(x, y, 0));
    }
    const bellSpline = new THREE.CatmullRomCurve3(curvePoints);
    const bellTube = new THREE.TubeGeometry(bellSpline, 36, 0.03, 8, false);
    const bellMesh = new THREE.Mesh(bellTube, cyanNeon);
    root.add(bellMesh);

    // Probability Density Histogram (5 bars under curve)
    const histHeights = [0.25, 0.65, 1.05, 0.65, 0.25];
    histHeights.forEach((h, i) => {
      const barGeo = new THREE.BoxGeometry(0.24, h, 0.14);
      const bar = new THREE.Mesh(barGeo, blueNeon);
      bar.position.set(-0.6 + i * 0.3, -0.55 + h / 2, -0.08);
      root.add(bar);
    });

    // Standard deviation boundaries (-1σ, +1σ)
    [-0.45, 0.45].forEach((x) => {
      const sigmaGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -0.55, 0.05),
        new THREE.Vector3(x, 0.5, 0.05),
      ]);
      root.add(new THREE.Line(sigmaGeo, wireCyan));
    });

    return root;
  }

  // ========================================================
  // 11. DATA VISUALIZATION / MATPLOTLIB
  // ========================================================
  if (norm.includes('visualization') || norm.includes('matplotlib')) {
    // 3D Chart Coordinate Frame
    const axisFrame = new THREE.AxesHelper(0.85);
    root.add(axisFrame);

    // Floating Multi-colored Donut Chart Segment
    const donutGeo = new THREE.TorusGeometry(0.5, 0.12, 16, 32, Math.PI * 1.4);
    const donut = new THREE.Mesh(donutGeo, amberNeon);
    donut.position.set(0.2, 0.2, 0);
    donut.rotation.z = Math.PI * 0.3;
    root.add(donut);

    const donut2Geo = new THREE.TorusGeometry(0.5, 0.12, 16, 32, Math.PI * 0.5);
    const donut2 = new THREE.Mesh(donut2Geo, cyanNeon);
    donut2.position.set(0.2, 0.2, 0);
    donut2.rotation.z = Math.PI * 1.75;
    root.add(donut2);

    // Flowing Sine Wave Ribbon in Background
    const wavePoints: THREE.Vector3[] = [];
    for (let x = -0.9; x <= 0.9; x += 0.1) {
      const y = Math.sin(x * 4) * 0.25 - 0.35;
      wavePoints.push(new THREE.Vector3(x, y, 0.2));
    }
    const waveSpline = new THREE.CatmullRomCurve3(wavePoints);
    const waveMesh = new THREE.Mesh(new THREE.TubeGeometry(waveSpline, 24, 0.02, 8, false), emeraldNeon);
    root.add(waveMesh);

    return root;
  }

  // ========================================================
  // 12. DATA CLEANING & VALIDATION (Pipeline Funnel)
  // ========================================================
  if (norm.includes('cleaning') || norm.includes('validation')) {
    // Funnel Rings (Filters raw dirty data into clean structured blocks)
    const topRingGeo = new THREE.TorusGeometry(0.65, 0.04, 16, 32);
    const topRing = new THREE.Mesh(topRingGeo, amberNeon);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 0.5;
    root.add(topRing);

    const bottomRingGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 32);
    const bottomRing = new THREE.Mesh(bottomRingGeo, cyanNeon);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = -0.1;
    root.add(bottomRing);

    // Raw scattered data particles at top
    for (let i = 0; i < 6; i++) {
      const pGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const p = new THREE.Mesh(pGeo, amberNeon);
      p.position.set((Math.random() - 0.5) * 0.8, 0.55 + Math.random() * 0.3, (Math.random() - 0.5) * 0.8);
      root.add(p);
    }

    // Pristine, perfectly aligned crystalline data cubes emerging at bottom
    [-0.2, 0.2].forEach((x, idx) => {
      const cGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const c = new THREE.Mesh(cGeo, idx === 0 ? cyanNeon : emeraldNeon);
      c.position.set(x, -0.45, 0);
      root.add(c);
    });

    return root;
  }

  // ========================================================
  // 13. EXPLORATORY DATA ANALYSIS (EDA) & REPORTING
  // ========================================================
  if (norm.includes('eda') || norm.includes('exploratory') || norm.includes('reporting')) {
    // 3 Angled Holographic Report Panels
    const panelGeo = new THREE.PlaneGeometry(0.7, 0.9);

    const pLeft = new THREE.Mesh(panelGeo, glassTranslucent);
    pLeft.position.set(-0.45, 0, 0);
    pLeft.rotation.y = 0.35;
    root.add(pLeft);

    const pRight = new THREE.Mesh(panelGeo, glassTranslucent);
    pRight.position.set(0.45, 0, 0);
    pRight.rotation.y = -0.35;
    root.add(pRight);

    const pCenter = new THREE.Mesh(panelGeo, glassTranslucent);
    pCenter.position.set(0, 0.1, 0.15);
    root.add(pCenter);

    // Miniature summary metric bars on center panel
    [-0.1, 0.05, 0.2].forEach((y, i) => {
      const bGeo = new THREE.BoxGeometry(0.45 - i * 0.08, 0.035, 0.02);
      const b = new THREE.Mesh(bGeo, i === 0 ? cyanNeon : i === 1 ? amberNeon : emeraldNeon);
      b.position.set(0, y, 0.18);
      root.add(b);
    });

    return root;
  }

  // ========================================================
  // 14. DEFAULT / OTHER (FLASK, HTML, CSS, JAVASCRIPT, OPENPYXL)
  // ========================================================
  // High-tech Gateway Cube with orbiting tech rings
  const coreCubeGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  const coreCube = new THREE.Mesh(coreCubeGeo, cyanNeon);
  root.add(coreCube);

  const orbit1Geo = new THREE.TorusGeometry(0.85, 0.03, 16, 40);
  const orbit1 = new THREE.Mesh(orbit1Geo, blueNeon);
  orbit1.rotation.x = Math.PI / 3;
  root.add(orbit1);

  const orbit2 = new THREE.Mesh(orbit1Geo, purpleNeon);
  orbit2.rotation.y = Math.PI / 3;
  root.add(orbit2);

  return root;
}
