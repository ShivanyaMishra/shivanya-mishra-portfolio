import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const WavingRobot3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showHelloBubble, setShowHelloBubble] = useState(false);
  const [isBubbleFading, setIsBubbleFading] = useState(false);

  const bubbleTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const lastWaveTimeRef = useRef<number>(0);
  const triggerWaveFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene & Camera Setup (Adjusted to frame robot & hover platform perfectly)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, -0.3, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.3);
    scene.add(ambientLight);

    // Key Light (White metallic highlight from top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Soft Cyan Rim Light (from left-rear)
    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 2.0);
    cyanRimLight.position.set(-4, 3, -3);
    scene.add(cyanRimLight);

    // Subtle Violet Rim Light (gives gentle color depth)
    const violetRimLight = new THREE.DirectionalLight(0x7c3aed, 1.2);
    violetRimLight.position.set(3, -2, -3);
    scene.add(violetRimLight);

    // Platform Surface Glow Point Light
    const platformLight = new THREE.PointLight(0x00f0ff, 2.0, 3.5);
    platformLight.position.set(0, -1.9, 0.4);
    scene.add(platformLight);

    // Chest Core Point Light
    const corePointLight = new THREE.PointLight(0x06b6d4, 1.6, 2.5);
    corePointLight.position.set(0, -0.55, 0.9);
    scene.add(corePointLight);

    // 3. Materials
    // Pearl White / Silver Metallic (Main Body)
    const pearlSilverMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      roughness: 0.16,
      metalness: 0.32,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
    });

    // Dark Graphite Metallic (Secondary Surfaces & Joints)
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.32,
      metalness: 0.68,
    });

    // Dark Smoked Glass Visor
    const smokedGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x060914,
      roughness: 0.04,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98,
    });

    // Clean Glossy Deep-Black Eyes (Black eyes per specification, no glow)
    const blackEyeMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.08,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });

    // Soft White Glow for Smile
    const smileLightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    // Primary Accent: Cyan / Turquoise Glowing Optical Element
    const cyanCoreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.6,
      roughness: 0.15,
    });

    // Secondary Accent: Subtle Violet Inlay
    const violetAccentMat = new THREE.MeshStandardMaterial({
      color: 0x6d28d9,
      roughness: 0.25,
      metalness: 0.45,
    });

    // 4. Transform Hierarchy
    // Floating group (robot bobs vertically above stationary platform)
    const floatGroup = new THREE.Group();
    scene.add(floatGroup);

    // 360° Drag rotation group (rotates robot when user drags)
    const rotationGroup = new THREE.Group();
    floatGroup.add(rotationGroup);

    // ==========================================
    // A. SLEEK AERODYNAMIC HEAD
    // ==========================================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.48, 0);
    rotationGroup.add(headGroup);

    // Main Pearl-Silver Helmet
    const helmetGeo = new THREE.SphereGeometry(0.88, 36, 36);
    helmetGeo.scale(1.04, 0.96, 0.94);
    const helmetMesh = new THREE.Mesh(helmetGeo, pearlSilverMat);
    headGroup.add(helmetMesh);

    // Graphite rear neck bevel
    const rearBevelGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.2, 24);
    const rearBevel = new THREE.Mesh(rearBevelGeo, graphiteMat);
    rearBevel.position.set(0, -0.42, -0.05);
    headGroup.add(rearBevel);

    // Smoked Glass Faceplate Visor
    const visorGeo = new THREE.SphereGeometry(0.74, 36, 36);
    visorGeo.scale(0.98, 0.88, 0.72);
    const visorMesh = new THREE.Mesh(visorGeo, smokedGlassMat);
    visorMesh.position.set(0, 0, 0.24);
    headGroup.add(visorMesh);

    // Graphite Visor Rim Trim
    const visorTrimGeo = new THREE.TorusGeometry(0.74, 0.022, 16, 40);
    visorTrimGeo.scale(0.98, 0.88, 0.2);
    const visorTrim = new THREE.Mesh(visorTrimGeo, graphiteMat);
    visorTrim.position.set(0, 0, 0.24);
    headGroup.add(visorTrim);

    // Side Sensor Pods / Ear Cups (Graphite with cyan optical ring)
    const earPodGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.14, 24);

    const leftEarPod = new THREE.Mesh(earPodGeo, graphiteMat);
    leftEarPod.position.set(-0.91, 0, 0.05);
    leftEarPod.rotation.z = Math.PI / 2;
    headGroup.add(leftEarPod);

    const rightEarPod = new THREE.Mesh(earPodGeo, graphiteMat);
    rightEarPod.position.set(0.91, 0, 0.05);
    rightEarPod.rotation.z = -Math.PI / 2;
    headGroup.add(rightEarPod);

    // Cyan Light Rings on Ear Pods
    const earRingGeo = new THREE.TorusGeometry(0.12, 0.016, 16, 24);

    const leftEarRing = new THREE.Mesh(earRingGeo, cyanCoreMat);
    leftEarRing.position.set(-0.98, 0, 0.05);
    leftEarRing.rotation.y = Math.PI / 2;
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, cyanCoreMat);
    rightEarRing.position.set(0.98, 0, 0.05);
    rightEarRing.rotation.y = -Math.PI / 2;
    headGroup.add(rightEarRing);

    // ==========================================
    // B. EYE TRACKING GROUP (Cursor Tracking with BLACK EYES)
    // ==========================================
    const eyesAndSmileGroup = new THREE.Group();
    eyesAndSmileGroup.position.set(0, 0, 0.84);
    headGroup.add(eyesAndSmileGroup);

    // Clean, glossy deep-black eyes (No cyan/white glow, distinct glossy black)
    const eyeArcGeo = new THREE.TorusGeometry(0.09, 0.024, 16, 28, Math.PI * 0.85);

    // Left Black Eye
    const leftEye = new THREE.Mesh(eyeArcGeo, blackEyeMat);
    leftEye.position.set(-0.26, 0.12, 0.02);
    leftEye.rotation.x = -0.16;
    leftEye.rotation.z = 0.08;
    eyesAndSmileGroup.add(leftEye);

    // Right Black Eye
    const rightEye = new THREE.Mesh(eyeArcGeo, blackEyeMat);
    rightEye.position.set(0.26, 0.12, 0.02);
    rightEye.rotation.x = -0.16;
    rightEye.rotation.z = -0.08;
    eyesAndSmileGroup.add(rightEye);

    // Smooth glowing smile curve (◡)
    const smileGeo = new THREE.TorusGeometry(0.16, 0.018, 16, 32, Math.PI * 0.65);
    const smile = new THREE.Mesh(smileGeo, smileLightMat);
    smile.position.set(0, -0.09, 0);
    smile.rotation.x = 0.2;
    smile.rotation.z = Math.PI * 1.17;
    eyesAndSmileGroup.add(smile);

    // ==========================================
    // C. TORSO & PRECISION CYAN AI CORE
    // ==========================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.92, 0);
    rotationGroup.add(torsoGroup);

    // Pearl white torso shell
    const torsoGeo = new THREE.SphereGeometry(0.72, 36, 36);
    torsoGeo.scale(0.88, 1.08, 0.78);
    const torsoMesh = new THREE.Mesh(torsoGeo, pearlSilverMat);
    torsoGroup.add(torsoMesh);

    // Dark graphite spinal column and side vents
    const spineGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.9, 20);
    const spineMesh = new THREE.Mesh(spineGeo, graphiteMat);
    spineMesh.position.set(0, -0.05, -0.25);
    torsoGroup.add(spineMesh);

    // Waist separator ring in graphite with subtle violet inlay
    const waistBezelGeo = new THREE.TorusGeometry(0.55, 0.024, 16, 36);
    const waistBezel = new THREE.Mesh(waistBezelGeo, graphiteMat);
    waistBezel.position.set(0, -0.42, 0);
    waistBezel.rotation.x = Math.PI / 2;
    torsoGroup.add(waistBezel);

    const waistInlayGeo = new THREE.TorusGeometry(0.53, 0.012, 16, 36);
    const waistInlay = new THREE.Mesh(waistInlayGeo, violetAccentMat);
    waistInlay.position.set(0, -0.42, 0);
    waistInlay.rotation.x = Math.PI / 2;
    torsoGroup.add(waistInlay);

    // Precision Circular Cyan AI Core on Chest
    const coreHousingGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.05, 32);
    const coreHousing = new THREE.Mesh(coreHousingGeo, graphiteMat);
    coreHousing.position.set(0, 0.16, 0.52);
    coreHousing.rotation.x = Math.PI / 2 - 0.2;
    torsoGroup.add(coreHousing);

    // Glowing Optical Ring
    const cyanRingGeo = new THREE.TorusGeometry(0.18, 0.028, 20, 36);
    const cyanRing = new THREE.Mesh(cyanRingGeo, cyanCoreMat);
    cyanRing.position.set(0, 0.16, 0.55);
    cyanRing.rotation.x = -0.2;
    torsoGroup.add(cyanRing);

    // Inner graphite AI micro-core
    const innerCoreGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.03, 24);
    const innerCore = new THREE.Mesh(innerCoreGeo, graphiteMat);
    innerCore.position.set(0, 0.16, 0.55);
    innerCore.rotation.x = Math.PI / 2 - 0.2;
    torsoGroup.add(innerCore);

    // Center core light diode
    const diodeGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const diode = new THREE.Mesh(diodeGeo, cyanCoreMat);
    diode.position.set(0, 0.16, 0.57);
    torsoGroup.add(diode);

    // ==========================================
    // D. ARTICULATED ARMS (Rigged for High Hand Wave)
    // ==========================================
    // Left Arm Root (Viewer's Left / Robot's Right - CLICK TO WAVE)
    const leftArmRoot = new THREE.Group();
    leftArmRoot.position.set(-0.68, -0.68, 0.02);
    rotationGroup.add(leftArmRoot);

    // Shoulder sphere
    const shoulderGeo = new THREE.SphereGeometry(0.19, 24, 24);
    const leftShoulder = new THREE.Mesh(shoulderGeo, pearlSilverMat);
    leftArmRoot.add(leftShoulder);

    // Upper arm
    const upperArmGeo = new THREE.CapsuleGeometry(0.1, 0.28, 16, 20);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, pearlSilverMat);
    leftUpperArm.position.set(0, -0.16, 0);
    leftArmRoot.add(leftUpperArm);

    // Forearm & Hand Pivot (Elbow joint)
    const wavePivot = new THREE.Group();
    wavePivot.position.set(0, -0.34, 0);
    leftArmRoot.add(wavePivot);

    const elbowGeo = new THREE.SphereGeometry(0.11, 20, 20);
    const leftElbow = new THREE.Mesh(elbowGeo, graphiteMat);
    wavePivot.add(leftElbow);

    const forearmGeo = new THREE.CapsuleGeometry(0.09, 0.28, 16, 20);
    const leftForearm = new THREE.Mesh(forearmGeo, pearlSilverMat);
    leftForearm.position.set(0, -0.16, 0);
    wavePivot.add(leftForearm);

    // Cyan wrist ring
    const wristRingGeo = new THREE.TorusGeometry(0.08, 0.012, 16, 24);
    const leftWristRing = new THREE.Mesh(wristRingGeo, cyanCoreMat);
    leftWristRing.position.set(0, -0.3, 0);
    leftWristRing.rotation.x = Math.PI / 2;
    wavePivot.add(leftWristRing);

    // Ergonomic minimal robotic hand
    const handGeo = new THREE.BoxGeometry(0.12, 0.14, 0.07);
    const leftHand = new THREE.Mesh(handGeo, graphiteMat);
    leftHand.position.set(0, -0.4, 0);
    wavePivot.add(leftHand);

    // Default resting idle pose for left arm (Natural & calm at side)
    leftArmRoot.rotation.set(0, 0, 0.25);
    wavePivot.rotation.set(0.1, 0, -0.15);

    // Right Arm (Viewer's Right / Robot's Left - Resting posture)
    const rightArmRoot = new THREE.Group();
    rightArmRoot.position.set(0.68, -0.68, 0.02);
    rotationGroup.add(rightArmRoot);

    const rightShoulder = new THREE.Mesh(shoulderGeo, pearlSilverMat);
    rightArmRoot.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, pearlSilverMat);
    rightUpperArm.position.set(0, -0.16, 0);
    rightArmRoot.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -0.34, 0);
    rightArmRoot.add(rightForearmGroup);

    const rightElbow = new THREE.Mesh(elbowGeo, graphiteMat);
    rightForearmGroup.add(rightElbow);

    const rightForearm = new THREE.Mesh(forearmGeo, pearlSilverMat);
    rightForearm.position.set(0, -0.16, 0);
    rightForearmGroup.add(rightForearm);

    const rightWristRing = new THREE.Mesh(wristRingGeo, cyanCoreMat);
    rightWristRing.position.set(0, -0.3, 0);
    rightWristRing.rotation.x = Math.PI / 2;
    rightForearmGroup.add(rightWristRing);

    const rightHand = new THREE.Mesh(handGeo, graphiteMat);
    rightHand.position.set(0, -0.4, 0);
    rightForearmGroup.add(rightHand);

    rightArmRoot.rotation.set(0, 0, -0.25);
    rightForearmGroup.rotation.set(0.1, 0, 0.15);

    // ==========================================
    // E. SLEEK FLOATING THRUSTER LEGS
    // ==========================================
    const legsGroup = new THREE.Group();
    legsGroup.position.set(0, -1.6, 0);
    rotationGroup.add(legsGroup);

    const hubGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.22, 24);
    const pelvicHub = new THREE.Mesh(hubGeo, graphiteMat);
    pelvicHub.position.set(0, 0.08, 0);
    legsGroup.add(pelvicHub);

    const legGeo = new THREE.CapsuleGeometry(0.11, 0.26, 16, 20);

    const leftLeg = new THREE.Mesh(legGeo, pearlSilverMat);
    leftLeg.position.set(-0.24, -0.14, 0);
    leftLeg.rotation.z = 0.06;
    legsGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pearlSilverMat);
    rightLeg.position.set(0.24, -0.14, 0);
    rightLeg.rotation.z = -0.06;
    legsGroup.add(rightLeg);

    // Cyan thruster emitter rings
    const thrusterGeo = new THREE.TorusGeometry(0.08, 0.016, 16, 24);

    const leftThruster = new THREE.Mesh(thrusterGeo, cyanCoreMat);
    leftThruster.position.set(-0.24, -0.32, 0);
    leftThruster.rotation.x = Math.PI / 2;
    legsGroup.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeo, cyanCoreMat);
    rightThruster.position.set(0.24, -0.32, 0);
    rightThruster.rotation.x = Math.PI / 2;
    legsGroup.add(rightThruster);

    // ==========================================
    // F. FUTURISTIC SCI-FI HOVER PLATFORM (Stationary, under robot)
    // ==========================================
    // Platform stays stationary on the ground while robot floats above it
    const platformGroup = new THREE.Group();
    platformGroup.position.set(0, -2.18, 0);
    scene.add(platformGroup);

    // Metallic Base Chassis (Circular chamfered graphite plate)
    const platBaseGeo = new THREE.CylinderGeometry(1.36, 1.48, 0.12, 36);
    const platBaseMesh = new THREE.Mesh(platBaseGeo, graphiteMat);
    platformGroup.add(platBaseMesh);

    // Upper Inset Deck Plate (Dark Titanium)
    const platDeckGeo = new THREE.CylinderGeometry(1.24, 1.28, 0.03, 36);
    const platDeckMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.28,
      metalness: 0.8,
    });
    const platDeckMesh = new THREE.Mesh(platDeckGeo, platDeckMat);
    platDeckMesh.position.set(0, 0.065, 0);
    platformGroup.add(platDeckMesh);

    // Cyan Illuminated Outer Perimeter Rim
    const platRimGeo = new THREE.TorusGeometry(1.36, 0.02, 16, 48);
    const platRimMesh = new THREE.Mesh(platRimGeo, cyanCoreMat);
    platRimMesh.position.set(0, 0.07, 0);
    platRimMesh.rotation.x = Math.PI / 2;
    platformGroup.add(platRimMesh);

    // Thin Concentric Glowing Cyan Rings
    const midRingGeo = new THREE.RingGeometry(0.85, 0.88, 40);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const midRingMesh = new THREE.Mesh(midRingGeo, ringMat);
    midRingMesh.position.set(0, 0.082, 0);
    midRingMesh.rotation.x = -Math.PI / 2;
    platformGroup.add(midRingMesh);

    const innerRingGeo = new THREE.RingGeometry(0.48, 0.505, 36);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, ringMat);
    innerRingMesh.position.set(0, 0.082, 0);
    innerRingMesh.rotation.x = -Math.PI / 2;
    platformGroup.add(innerRingMesh);

    // 6 Holographic Radial Tech Tick Notches (at 60° intervals)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const notchGeo = new THREE.PlaneGeometry(0.03, 0.22);
      const notchMesh = new THREE.Mesh(notchGeo, ringMat);
      notchMesh.position.set(Math.cos(angle) * 1.05, 0.083, Math.sin(angle) * 1.05);
      notchMesh.rotation.x = -Math.PI / 2;
      notchMesh.rotation.z = angle + Math.PI / 2;
      platformGroup.add(notchMesh);
    }

    // Center Emitter Hub (Graphite hub with cyan core)
    const hubDiskGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.02, 24);
    const hubDisk = new THREE.Mesh(hubDiskGeo, graphiteMat);
    hubDisk.position.set(0, 0.08, 0);
    platformGroup.add(hubDisk);

    const hubCoreGeo = new THREE.CircleGeometry(0.1, 24);
    const hubCore = new THREE.Mesh(hubCoreGeo, ringMat);
    hubCore.position.set(0, 0.092, 0);
    hubCore.rotation.x = -Math.PI / 2;
    platformGroup.add(hubCore);

    // Subtle Cyan Levitation Energy Column (Open translucent cone bridging platform and robot)
    const beamGeo = new THREE.CylinderGeometry(0.44, 0.88, 0.44, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const levitationBeam = new THREE.Mesh(beamGeo, beamMat);
    levitationBeam.position.set(0, 0.3, 0);
    platformGroup.add(levitationBeam);

    // Soft Blue Floor Glow Disc Under Platform
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const radGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    radGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    radGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.22)');
    radGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.35)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = radGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const floorGlowGeo = new THREE.PlaneGeometry(3.0, 1.8);
    const floorGlowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const floorGlow = new THREE.Mesh(floorGlowGeo, floorGlowMat);
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.set(0, -0.07, 0);
    platformGroup.add(floorGlow);

    // ==========================================
    // G. REAL-TIME INTERACTIONS & EVENT HANDLERS
    // ==========================================
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let pointerTravel = 0;

    let targetRotY = 0;
    let currentRotY = 0;
    let targetRotX = 0;
    let currentRotX = 0;

    // Click wave timer (waves smoothly ONLY when clicked)
    let clickWaveDuration = 0;
    let clickWaveProgress = 0;

    // Real-time normalized cursor position (-1 to 1)
    const normPointer = { x: 0, y: 0 };

    const updatePointerPos = (clientX: number, clientY: number) => {
      const winW = window.innerWidth || 1;
      const winH = window.innerHeight || 1;
      normPointer.x = (clientX - winW / 2) / (winW / 2);
      normPointer.y = (clientY - winH / 2) / (winH / 2);
    };

    const triggerClickWave = () => {
      const now = Date.now();
      // Interaction cooldown: 2.8s prevents rapid clicks from breaking the animation
      if (now - lastWaveTimeRef.current < 2800) return;
      lastWaveTimeRef.current = now;

      clickWaveDuration = 2.4;
      clickWaveProgress = 0;

      // Simultaneously trigger the futuristic holographic HELLO!! cloud
      if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);

      setIsBubbleFading(false);
      setShowHelloBubble(true);

      // Start smooth fade away after 2.0 seconds
      fadeTimerRef.current = window.setTimeout(() => {
        setIsBubbleFading(true);
      }, 2000);

      // Cleanly unmount after 2.6 seconds when robot returns to idle
      bubbleTimerRef.current = window.setTimeout(() => {
        setShowHelloBubble(false);
        setIsBubbleFading(false);
      }, 2600);
    };

    triggerWaveFnRef.current = triggerClickWave;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      pointerTravel = 0;
      prevPointer = { x: e.clientX, y: e.clientY };
      updatePointerPos(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);

      if (isDragging) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        pointerTravel += Math.hypot(dx, dy);

        // Smooth horizontal 360° rotation
        targetRotY += dx * 0.013;
        // Subtle vertical tilt clamp (-20° to +20°)
        targetRotX = THREE.MathUtils.clamp(targetRotX + dy * 0.006, -0.35, 0.35);

        prevPointer = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        setIsInteracting(false);
        // If movement was small (< 10px), user tapped/clicked upon the robot to wave!
        if (pointerTravel < 10) {
          triggerClickWave();
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    // ==========================================
    // H. ANIMATION LOOP (Synchronized Real-Time Tracking, High Arm Wave, Floating)
    // ==========================================
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Subtle, slow continuous floating/bobbing (robot hovers ~0.25 above platform)
      const floatY = Math.sin(elapsedTime * 1.5) * 0.055;
      floatGroup.position.y = floatY;

      // 2. Smooth 360° user rotation (No automatic spinning when stationary)
      currentRotY = THREE.MathUtils.lerp(currentRotY, targetRotY, 0.12);
      currentRotX = THREE.MathUtils.lerp(currentRotX, targetRotX, 0.12);
      rotationGroup.rotation.y = currentRotY;
      rotationGroup.rotation.x = currentRotX;

      // 3. REAL-TIME CURSOR TRACKING: Head and Eyes (Fast, responsive, zero noticeable lag)
      const targetHeadYaw = THREE.MathUtils.clamp(normPointer.x * 0.22, -0.26, 0.26);
      const targetHeadPitch = THREE.MathUtils.clamp(-normPointer.y * 0.16, -0.18, 0.18);
      // High responsiveness (0.45) tracks almost immediately with cursor
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadYaw, 0.45);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadPitch, 0.45);

      // BLACK EYES tracking cursor position across visor
      const targetEyeX = THREE.MathUtils.clamp(normPointer.x * 0.075, -0.085, 0.085);
      const targetEyeY = THREE.MathUtils.clamp(-normPointer.y * 0.055, -0.065, 0.065);
      eyesAndSmileGroup.position.x = THREE.MathUtils.lerp(eyesAndSmileGroup.position.x, targetEyeX, 0.55);
      eyesAndSmileGroup.position.y = THREE.MathUtils.lerp(eyesAndSmileGroup.position.y, targetEyeY, 0.55);

      // 4. CLICK-TO-WAVE ARM RIG (Whole arm raises up to head level, hand above shoulder, waves, returns)
      if (clickWaveDuration > 0) {
        clickWaveDuration -= delta;
        clickWaveProgress += delta;

        const totalWaveTime = 2.4;
        const progress = Math.min(1, clickWaveProgress / totalWaveTime);

        // Phase 1: Lift arm from shoulder (0s to 0.45s)
        // Phase 2: Gentle hand wave near head (0.45s to 1.85s)
        // Phase 3: Smooth return to idle (1.85s to 2.4s)
        let armLiftWeight = 0;
        let waveCycle = 0;

        if (clickWaveProgress < 0.45) {
          // Smoothly raising arm up
          const t = clickWaveProgress / 0.45;
          armLiftWeight = t * t * (3 - 2 * t); // smoothstep
        } else if (clickWaveProgress < 1.85) {
          // Arm held high near head, performing friendly wave
          armLiftWeight = 1.0;
          const waveTime = clickWaveProgress - 0.45;
          waveCycle = Math.sin(waveTime * 9.5);
        } else {
          // Smooth return to idle resting position
          const t = (clickWaveProgress - 1.85) / (totalWaveTime - 1.85);
          armLiftWeight = 1.0 - t * t * (3 - 2 * t);
        }

        // Entire arm moves:
        // Shoulder lifts upper arm up towards head height:
        leftArmRoot.rotation.z = THREE.MathUtils.lerp(0.25, -2.15, armLiftWeight);
        leftArmRoot.rotation.x = THREE.MathUtils.lerp(0, 0.35, armLiftWeight);
        leftArmRoot.rotation.y = THREE.MathUtils.lerp(0, 0.22, armLiftWeight);

        // Elbow flexes forearm upright so hand is clearly ABOVE shoulder level beside head:
        const elbowBendTarget = -1.25 + (armLiftWeight > 0.8 ? waveCycle * 0.3 : 0);
        wavePivot.rotation.z = THREE.MathUtils.lerp(-0.15, elbowBendTarget, armLiftWeight);
        wavePivot.rotation.x = THREE.MathUtils.lerp(0.1, 0.4, armLiftWeight);
        wavePivot.rotation.y = THREE.MathUtils.lerp(0, waveCycle * 0.16, armLiftWeight);
      } else {
        // Return/stay at calm resting idle posture (NO continuous automatic waving)
        leftArmRoot.rotation.z = THREE.MathUtils.lerp(leftArmRoot.rotation.z, 0.25, 0.1);
        leftArmRoot.rotation.x = THREE.MathUtils.lerp(leftArmRoot.rotation.x, 0, 0.1);
        leftArmRoot.rotation.y = THREE.MathUtils.lerp(leftArmRoot.rotation.y, 0, 0.1);

        wavePivot.rotation.z = THREE.MathUtils.lerp(wavePivot.rotation.z, -0.15, 0.1);
        wavePivot.rotation.x = THREE.MathUtils.lerp(wavePivot.rotation.x, 0.1, 0.1);
        wavePivot.rotation.y = THREE.MathUtils.lerp(wavePivot.rotation.y, 0, 0.1);
      }

      // Calm breathing on right arm
      rightArmRoot.rotation.z = -0.25 + Math.sin(elapsedTime * 1.5) * 0.02;

      // 5. Subtle levitation energy beam breathing
      const beamPulse = 0.14 + Math.sin(elapsedTime * 2.2) * 0.035;
      beamMat.opacity = beamPulse;
      platformLight.intensity = 1.8 + Math.sin(elapsedTime * 2.2) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // I. RESIZE & CLEANUP
    // ==========================================
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      helmetGeo.dispose();
      rearBevelGeo.dispose();
      visorGeo.dispose();
      visorTrimGeo.dispose();
      earPodGeo.dispose();
      earRingGeo.dispose();
      eyeArcGeo.dispose();
      smileGeo.dispose();
      torsoGeo.dispose();
      spineGeo.dispose();
      waistBezelGeo.dispose();
      waistInlayGeo.dispose();
      coreHousingGeo.dispose();
      cyanRingGeo.dispose();
      innerCoreGeo.dispose();
      diodeGeo.dispose();
      shoulderGeo.dispose();
      upperArmGeo.dispose();
      elbowGeo.dispose();
      forearmGeo.dispose();
      wristRingGeo.dispose();
      handGeo.dispose();
      hubGeo.dispose();
      legGeo.dispose();
      thrusterGeo.dispose();
      platBaseGeo.dispose();
      platDeckGeo.dispose();
      platRimGeo.dispose();
      midRingGeo.dispose();
      innerRingGeo.dispose();
      hubDiskGeo.dispose();
      hubCoreGeo.dispose();
      beamGeo.dispose();
      floorGlowGeo.dispose();
      shadowTex.dispose();

      pearlSilverMat.dispose();
      graphiteMat.dispose();
      smokedGlassMat.dispose();
      blackEyeMat.dispose();
      smileLightMat.dispose();
      cyanCoreMat.dispose();
      violetAccentMat.dispose();
      platDeckMat.dispose();
      ringMat.dispose();
      beamMat.dispose();
      floorGlowMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-[260px] sm:h-[280px] lg:h-[320px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onClick={() => {
          if (triggerWaveFnRef.current) triggerWaveFnRef.current();
        }}
        className={`w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing transition-transform ${
          isInteracting ? 'scale-[1.02]' : ''
        }`}
        style={{ touchAction: 'pan-y' }}
        title="Tap or click robot to wave • Drag to rotate 360°"
        aria-label="Futuristic AI Assistant 3D"
      />

      {/* Futuristic Holographic Thought Bubble (💭) with HELLO!! */}
      {showHelloBubble && (
        <div
          className={`absolute top-5 sm:top-7 left-[calc(50%+3.4rem)] sm:left-[calc(50%+4.1rem)] z-30 pointer-events-none ${
            isBubbleFading
              ? 'opacity-0 translate-y-2 scale-[0.96] transition-all duration-500 ease-in-out'
              : 'animate-[thoughtBubbleFloatIn_0.6s_cubic-bezier(0.34,1.3,0.64,1)_forwards]'
          }`}
          role="status"
          aria-live="polite"
        >
          {/* Subtle gentle hovering float effect */}
          <div className="relative inline-flex items-center justify-center animate-[thoughtBubbleHover_2.4s_ease-in-out_infinite]">
            {/* Soft Futuristic Holographic 💭 Cloud SVG Container */}
            <svg
              viewBox="0 0 144 86"
              className="w-[128px] sm:w-[140px] h-[72px] sm:h-[78px] overflow-visible drop-shadow-[0_0_15px_rgba(6,182,212,0.65)] filter"
            >
              <defs>
                <linearGradient id="cloudHoloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#081426" stopOpacity="0.96" />
                  <stop offset="50%" stopColor="#030712" stopOpacity="0.94" />
                  <stop offset="100%" stopColor="#04121d" stopOpacity="0.96" />
                </linearGradient>
              </defs>

              {/* Soft 💭 Cloud Contour */}
              <path
                d="M 32,48
                   C 18,48 10,38 14,27
                   C 17,16 30,12 40,18
                   C 47,8 68,6 80,14
                   C 90,6 110,8 118,18
                   C 128,14 138,20 138,30
                   C 138,40 128,48 118,48
                   C 122,57 110,65 98,62
                   C 88,68 70,68 60,62
                   C 48,68 34,64 30,55
                   C 24,55 27,48 32,48 Z"
                fill="url(#cloudHoloGrad)"
                stroke="rgba(0, 240, 255, 0.9)"
                strokeWidth="1.6"
              />

              {/* Trailing thought-bubble dots pointing towards the robot's head */}
              <circle
                cx="25"
                cy="64"
                r="4.2"
                fill="url(#cloudHoloGrad)"
                stroke="rgba(0, 240, 255, 0.9)"
                strokeWidth="1.4"
              />
              <circle
                cx="15"
                cy="73"
                r="2.8"
                fill="url(#cloudHoloGrad)"
                stroke="rgba(0, 240, 255, 0.9)"
                strokeWidth="1.2"
              />
              <circle
                cx="7"
                cy="80"
                r="1.6"
                fill="#00f0ff"
              />
            </svg>

            {/* Centered HELLO!! text in Serif Bold Italic + Emoji */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-2.5 pl-1.5 select-none pointer-events-none">
              <span className="font-serif font-bold italic tracking-wider text-cyan-200 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(0,240,255,0.95)]">
                HELLO!!
              </span>
              <span className="ml-1 text-sm sm:text-base animate-bounce select-none">
                👋
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
