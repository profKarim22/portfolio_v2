import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import useTheme from "../hooks/useTheme";

/**
 * Procedurally generates the 1024x1536 High-Definition Texture Canvas
 * Supports both Dark Theme (Default) and Light Theme:
 * - Thick solid black outlines (3px - 8px)
 * - Hard offset drop shadows (zero blur)
 * - Dark theme: deep aubergine-black (#161124), rich purple & lilac (#bd7df8), lavender-white (#eee8f7)
 * - Light theme: pale lavender (#f7f1ff), saturated lilac (#d8b4fe), near-black (#000000)
 * - Authentic profile: Karim Abbas | Backend Developer & CS Senior | HICIS 6th of October
 * - 8 tactile Neo-Brutalist skill cards with zero dead space
 */
function createLavenderNeoBrutalistBadgeTexture(photoImage, isDark = true) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Polyfill roundRect
  if (!ctx.roundRect) {
    ctx.roundRect = function (x, y, w, h, r) {
      if (typeof r === "number") r = [r, r, r, r];
      const [tl, tr, br, bl] = r || [0, 0, 0, 0];
      this.moveTo(x + tl, y);
      this.lineTo(x + w - tr, y);
      this.quadraticCurveTo(x + w, y, x + w, y + tr);
      this.lineTo(x + w, y + h - br);
      this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
      this.lineTo(x + bl, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - bl);
      this.lineTo(x + tl);
      this.quadraticCurveTo(x, y, x + tl, y);
      this.closePath();
      return this;
    };
  }

  // Theme-aware palette variables
  const colors = isDark
    ? {
        bgStart: "#140e21",
        bgEnd: "#1f1633",
        gridLine: "rgba(189, 125, 248, 0.08)",
        outline: "#000000",
        shadow: "#000000",
        panelSurface: "#201736",
        panelMuted: "#271c42",
        cardSurface: "#1a132c",
        cardTextPrimary: "#ffffff",
        cardTextSecondary: "#bfb4cf",
        cardTextMuted: "#8e82a3",
        accentLilac: "#bd7df8",
        accentLilacText: "#0d0a19",
        photoBg: "#25193d",
        photoFallbackText: "#bd7df8",
        chipBg: "#2a1e45",
      }
    : {
        bgStart: "#f7f1ff",
        bgEnd: "#ede4fc",
        gridLine: "rgba(147, 51, 234, 0.06)",
        outline: "#000000",
        shadow: "#000000",
        panelSurface: "#ffffff",
        panelMuted: "#f5f0ff",
        cardSurface: "#ffffff",
        cardTextPrimary: "#000000",
        cardTextSecondary: "#4b5563",
        cardTextMuted: "#6b7280",
        accentLilac: "#d8b4fe",
        accentLilacText: "#000000",
        photoBg: "#e9d5ff",
        photoFallbackText: "#000000",
        chipBg: "#f3e8ff",
      };

  // Helper for drawing neo-brutalist box with hard black shadow
  const drawNeoBox = (
    x,
    y,
    w,
    h,
    radius,
    fillColor,
    shadowOffsetX = 6,
    shadowOffsetY = 6,
    strokeWidth = 3,
  ) => {
    // 1. Hard offset black drop shadow
    if (shadowOffsetX || shadowOffsetY) {
      ctx.fillStyle = colors.shadow;
      ctx.beginPath();
      ctx.roundRect(x + shadowOffsetX, y + shadowOffsetY, w, h, radius);
      ctx.fill();
    }
    // 2. Fill surface
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
    // 3. Solid black outline
    if (strokeWidth > 0) {
      ctx.strokeStyle = colors.outline;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  };

  // 1. Canvas Background Surface
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1536);
  bgGrad.addColorStop(0, colors.bgStart);
  bgGrad.addColorStop(1, colors.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1536);

  // Subtle Neo Grid Pattern
  ctx.strokeStyle = colors.gridLine;
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 1024; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1536);
    ctx.stroke();
  }
  for (let y = 0; y < 1536; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Thick Solid Black Outer Border
  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(14, 14, 996, 1508, 24);
  ctx.stroke();

  // 2. Punch Slot (Hardware clearance)
  ctx.fillStyle = colors.outline;
  ctx.beginPath();
  ctx.roundRect(432, 34, 160, 26, 13);
  ctx.fill();

  // Top Status Bar: Lilac Neo-Badge
  drawNeoBox(48, 86, 390, 48, 999, colors.accentLilac, 4, 4, 3);
  // Status green dot
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(76, 110, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = colors.accentLilacText;
  ctx.font = "800 18px 'Geist', 'Inter', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("HICIS 6TH OF OCT • CS SENIOR", 96, 110);

  // Top Right Info Pill
  drawNeoBox(654, 86, 322, 48, 999, colors.panelSurface, 4, 4, 3);
  ctx.fillStyle = colors.cardTextPrimary;
  ctx.font = "800 17px monospace";
  ctx.textAlign = "center";
  ctx.fillText("BACKEND ARCHITECT // 2026", 815, 110);

  // 3. Photo Frame (Tactile Neo-Mount)
  const photoX = 48;
  const photoY = 162;
  const photoW = 380;
  const photoH = 430;

  // Hard black shadow behind photo
  ctx.fillStyle = colors.shadow;
  ctx.beginPath();
  ctx.roundRect(photoX + 8, photoY + 8, photoW, photoH, 16);
  ctx.fill();

  // Photo container
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 16);
  ctx.clip();

  if (photoImage && photoImage.complete && photoImage.naturalWidth > 0) {
    const imgRatio = photoImage.naturalWidth / photoImage.naturalHeight;
    const boxRatio = photoW / photoH;
    let sw, sh, sx, sy;

    if (imgRatio > boxRatio) {
      sh = photoImage.naturalHeight;
      sw = sh * boxRatio;
      sx = (photoImage.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = photoImage.naturalWidth;
      sh = sw / boxRatio;
      sx = 0;
      sy = (photoImage.naturalHeight - sh) / 2;
    }
    ctx.drawImage(photoImage, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
  } else {
    // Elegant avatar placeholder
    ctx.fillStyle = colors.photoBg;
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = colors.photoFallbackText;
    ctx.font = "900 84px 'Geist', 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("KA", photoX + photoW / 2, photoY + photoH / 2 - 20);

    ctx.font = "800 20px monospace";
    ctx.fillText("KARIM ABBAS", photoX + photoW / 2, photoY + photoH / 2 + 50);
  }
  ctx.restore();

  // Solid Black Photo Border
  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 16);
  ctx.stroke();

  // 4. Identity Panel (Right of Photo)
  const idX = 464;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Eyebrow Label
  ctx.fillStyle = colors.cardTextSecondary;
  ctx.font = "700 20px monospace";
  ctx.fillText("// VERIFIED DEVELOPER PROFILE", idX, 206);

  // Primary Name
  ctx.fillStyle = colors.cardTextPrimary;
  ctx.font = "900 48px 'Geist', 'Inter', sans-serif";
  ctx.fillText("Karim Abbas", idX, 266);

  // Role Subtitle
  ctx.fillStyle = colors.accentLilac;
  ctx.font = "800 28px 'Geist', 'Inter', sans-serif";
  ctx.fillText("Backend Developer & CS Senior", idX, 312);

  // Clearance Pill Badge
  drawNeoBox(idX, 342, 330, 46, 999, colors.accentLilac, 4, 4, 3);
  ctx.fillStyle = colors.accentLilacText;
  ctx.font = "800 18px monospace";
  ctx.fillText("LEVEL 04 // SENIOR YEAR", idX + 24, 372);

  // Location / Context Pill
  drawNeoBox(idX, 412, 390, 46, 999, colors.panelSurface, 4, 4, 3);
  ctx.fillStyle = colors.cardTextPrimary;
  ctx.font = "700 17px 'Geist', 'Inter', sans-serif";
  ctx.fillText("📍 6th of October City, Giza, Egypt", idX + 20, 442);

  // Core Bio Summary Box
  drawNeoBox(idX, 482, 510, 110, 10, colors.panelSurface, 5, 5, 3);
  ctx.fillStyle = colors.cardTextSecondary;
  ctx.font = "500 18px 'Geist', 'Inter', sans-serif";
  ctx.fillText("Specializing in Node.js, Express, MySQL,", idX + 20, 522);
  ctx.fillText("MongoDB & RESTful API architecture.", idX + 20, 552);
  ctx.font = "800 18px 'Geist', 'Inter', sans-serif";
  ctx.fillStyle = colors.cardTextPrimary;
  ctx.fillText("Building reliable, database-driven services.", idX + 20, 582);

  // 5. Section Divider (Neo-Brutalist Rule + Pill Tag)
  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(48, 626);
  ctx.lineTo(976, 626);
  ctx.stroke();

  drawNeoBox(342, 604, 340, 44, 999, colors.accentLilac, 3, 3, 3);
  ctx.fillStyle = colors.accentLilacText;
  ctx.font = "800 16px monospace";
  ctx.textAlign = "center";
  ctx.fillText("TECHNICAL STACK & CORE SKILLS", 512, 631);

  // 6. THE 8-SKILL GRID (Y=672 to Y=1470)
  const skills = [
    {
      name: "Node.js",
      role: "Event-Loop & Async Services",
      color: "#16a34a",
      icon: "NODE",
    },
    {
      name: "Express.js",
      role: "REST APIs & Middleware",
      color: isDark ? "#ffffff" : "#000000",
      icon: "CODE",
    },
    {
      name: "TypeScript / ES6+",
      role: "Type-Safety & Scalability",
      color: "#38bdf8",
      icon: "TS",
    },
    {
      name: "MySQL & MongoDB",
      role: "Relational & Document Data",
      color: "#0891b2",
      icon: "DB",
    },
    {
      name: "Redis",
      role: "In-Memory Caching & Store",
      color: "#dc2626",
      icon: "REDIS",
    },
    {
      name: "JWT & Security",
      role: "Auth, Hashing & Protected APIs",
      color: colors.accentLilac,
      icon: "AUTH",
    },
    {
      name: "C++ & OOP",
      role: "Data Structures & Core Algorithms",
      color: "#818cf8",
      icon: "CPP",
    },
    {
      name: "React & Flutter",
      role: "Client-Side Foundations",
      color: "#0284c7",
      icon: "UI",
    },
  ];

  const startY = 672;
  const tileW = 446;
  const tileH = 175;
  const gapX = 36;
  const gapY = 24;

  skills.forEach((skill, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 48 + col * (tileW + gapX);
    const y = startY + row * (tileH + gapY);

    // 1. Neo-Card Surface with 6px black drop shadow
    drawNeoBox(x, y, tileW, tileH, 10, colors.cardSurface, 6, 6, 3);

    // 2. Left Accent Strip
    ctx.fillStyle = skill.color;
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 16, 6, tileH - 32, 3);
    ctx.fill();

    // 3. Icon Box (68px × 68px) with 3px solid black border & 3px shadow
    const iconX = x + 24;
    const iconY = y + (tileH - 68) / 2;
    drawNeoBox(iconX, iconY, 68, 68, 10, colors.chipBg, 3, 3, 2.5);

    // High-visibility vector glyph inside box
    ctx.save();
    ctx.translate(iconX + 34, iconY + 34);
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    ctx.strokeStyle = isDark ? "#ffffff" : "#000000";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (skill.icon) {
      case "NODE":
        ctx.strokeStyle = "#16a34a";
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = 20 * Math.cos(angle);
          const py = 20 * Math.sin(angle);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        break;

      case "TS":
        ctx.fillStyle = "#38bdf8";
        ctx.font = "900 24px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("TS", 0, 1);
        break;

      case "DB":
        ctx.strokeStyle = "#0891b2";
        ctx.strokeRect(-18, -18, 36, 36);
        ctx.beginPath();
        ctx.moveTo(-18, -5);
        ctx.lineTo(18, -5);
        ctx.moveTo(-18, 8);
        ctx.lineTo(18, 8);
        ctx.stroke();
        break;

      case "REDIS":
        ctx.strokeStyle = "#dc2626";
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(18, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(-18, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fillRect(-5, -5, 10, 10);
        break;

      case "AUTH":
        ctx.strokeStyle = colors.accentLilac;
        ctx.fillStyle = colors.accentLilac;
        ctx.beginPath();
        ctx.arc(0, -6, 10, Math.PI, 0, false);
        ctx.stroke();
        ctx.strokeRect(-14, -4, 28, 20);
        ctx.fillRect(-3, 2, 6, 7);
        break;

      case "CPP":
        ctx.fillStyle = "#818cf8";
        ctx.font = "900 24px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("C++", 0, 1);
        break;

      case "UI":
        ctx.strokeStyle = "#0284c7";
        ctx.strokeRect(-18, -14, 36, 28);
        ctx.beginPath();
        ctx.moveTo(-18, -4);
        ctx.lineTo(18, -4);
        ctx.stroke();
        break;

      default:
        ctx.font = "900 24px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("</>", 0, 1);
        break;
    }
    ctx.restore();

    // Typography for Skill Name
    const textStartX = iconX + 68 + 18;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = colors.cardTextPrimary;
    ctx.font = "900 32px 'Geist', 'Inter', sans-serif";
    ctx.fillText(skill.name, textStartX, y + 68);

    // Role / Sub-title
    ctx.fillStyle = colors.cardTextSecondary;
    ctx.font = "600 17px 'Geist', 'Inter', sans-serif";
    ctx.fillText(skill.role, textStartX, y + 104);

    // Neo-Pill Tag (Bottom right)
    drawNeoBox(textStartX, y + 120, 130, 28, 999, colors.chipBg, 2, 2, 2);
    ctx.fillStyle = colors.accentLilac;
    ctx.font = "800 13px monospace";
    ctx.fillText("VERIFIED STACK", textStartX + 12, y + 138);
  });

  return canvas;
}

/**
 * 3D Badge Scene Component:
 * - RoundedBox args={[1.54, 2.38, 0.034]} with radius={0.06}, smoothness={4}
 * - Thick solid black neo-brutalist border frame
 * - Smooth physics (Hooke's spring, inertia tilt, pointer dragging, dynamic spline lanyard)
 * - Seamless wire attachment directly into the navbar bottom border (anchor at top of canvas)
 * - Fully theme-reactive (Dark Mode default & Light Mode support)
 */
function BadgeScene({ isDraggingState, setIsDraggingState, isDark }) {
  const cardGroupRef = useRef();
  const clampRef = useRef();
  const lanyardRef = useRef();
  const photoImageRef = useRef(null);

  // Physics state stored in refs (Zero re-renders during interaction)
  const isDragging = useRef(false);
  const currentPos = useRef(new THREE.Vector3(0, -0.35, 0));
  const targetPos = useRef(new THREE.Vector3(0, -0.35, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  const planeIntersection = useRef(new THREE.Vector3());

  const { viewport, camera, gl } = useThree();

  // Dynamic Anchor Point: Positioned at the exact top boundary of the canvas viewport
  // (y = viewport.height / 2 aligns seamlessly with the bottom edge of the sticky navbar with zero gap)
  const anchorWorld = useMemo(
    () => new THREE.Vector3(0, viewport.height / 2, 0),
    [viewport.height],
  );
  const midPoint = useRef(new THREE.Vector3());
  const strapAttachWorld = useRef(new THREE.Vector3());
  const strapLocal = useMemo(() => new THREE.Vector3(0, 0.052, 0), []);

  // CatmullRomCurve3 spline
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      anchorWorld,
      new THREE.Vector3(0, 1.25, 0.22),
      new THREE.Vector3(0, 0.85, 0),
    ]);
  }, [anchorWorld]);

  // Texture creation with 16x anisotropy
  const badgeTexture = useMemo(() => {
    const initialCanvas = createLavenderNeoBrutalistBadgeTexture(null, isDark);
    const texture = new THREE.CanvasTexture(initialCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const img = new Image();
    img.crossOrigin = "anonymous";
    const photoSources = [
      "/karim_abbas.jpeg",
      "./karim_abbas.jpeg",
      "./assets/karim_abbas.jpeg",
      "/portfolio/karim_abbas.jpeg",
    ];
    let srcIndex = 0;

    const tryNext = () => {
      if (srcIndex < photoSources.length) {
        img.src = photoSources[srcIndex++];
      }
    };

    img.onload = () => {
      photoImageRef.current = img;
      const updatedCanvas = createLavenderNeoBrutalistBadgeTexture(img, isDark);
      texture.image = updatedCanvas;
      texture.needsUpdate = true;
    };

    img.onerror = () => {
      if (srcIndex < photoSources.length) {
        tryNext();
      }
    };

    tryNext();
    return texture;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-generate texture when theme changes
  useEffect(() => {
    if (badgeTexture) {
      const updatedCanvas = createLavenderNeoBrutalistBadgeTexture(
        photoImageRef.current,
        isDark,
      );
      badgeTexture.image = updatedCanvas;
      badgeTexture.needsUpdate = true;
    }
  }, [isDark, badgeTexture]);

  // Window-level pointer listeners for continuous, unclipped, responsive dragging anywhere across the screen
  useEffect(() => {
    const canvasEl = gl.domElement;
    if (!canvasEl) return;

    const handleWindowPointerMove = (e) => {
      if (!isDragging.current) return;

      const rect = canvasEl.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: nx, y: ny }, camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersection.current);

      // Large generous horizontal movement freedom:
      // Card width with 1.085 scale is 1.54 * 1.085 = 1.671 (half-width ~0.835)
      // Boundary calculation guarantees the card remains 100% visible inside the canvas with zero edge clipping
      const cardHalfWidth = 0.835;
      const safeBuffer = cardHalfWidth + 0.05;
      const maxDragX = Math.max(0.75, viewport.width / 2 - safeBuffer);
      const minDragX = -maxDragX;

      // Vertical safety limit ensuring card stays within comfortable viewport range
      const maxDragY = 0.5;
      const minDragY = Math.min(-0.75, -(viewport.height / 2) + 1.25);

      const clampedX = THREE.MathUtils.clamp(
        planeIntersection.current.x,
        minDragX,
        maxDragX,
      );
      const clampedY = THREE.MathUtils.clamp(
        planeIntersection.current.y,
        minDragY,
        maxDragY,
      );
      targetPos.current.set(clampedX, clampedY, 0);
    };

    const handleWindowPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsDraggingState(false);
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: true,
    });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [
    camera,
    dragPlane,
    gl.domElement,
    setIsDraggingState,
    viewport.height,
    viewport.width,
  ]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (badgeTexture) badgeTexture.dispose();
      if (lanyardRef.current && lanyardRef.current.geometry) {
        lanyardRef.current.geometry.dispose();
      }
    };
  }, [badgeTexture]);

  // Pointer drag events with setPointerCapture
  const onPointerDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    setIsDraggingState(true);
    e.ray.intersectPlane(dragPlane, planeIntersection.current);
    targetPos.current.copy(planeIntersection.current);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    e.ray.intersectPlane(dragPlane, planeIntersection.current);

    // Dynamic horizontal safety limit ensuring full card visibility with generous travel
    const cardHalfWidth = 0.835;
    const safeBuffer = cardHalfWidth + 0.05;
    const maxDragX = Math.max(0.75, viewport.width / 2 - safeBuffer);
    const minDragX = -maxDragX;

    // Vertical safety limit ensuring card stays within comfortable viewport range
    const maxDragY = 0.5;
    const minDragY = Math.min(-0.75, -(viewport.height / 2) + 1.25);

    const clampedX = THREE.MathUtils.clamp(
      planeIntersection.current.x,
      minDragX,
      maxDragX,
    );
    const clampedY = THREE.MathUtils.clamp(
      planeIntersection.current.y,
      minDragY,
      maxDragY,
    );
    targetPos.current.set(clampedX, clampedY, 0);
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    isDragging.current = false;
    setIsDraggingState(false);
  };

  // Real-time animation, light & responsive physics & dynamic lanyard tracking
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    if (isDragging.current) {
      // Light, nimble drag follow (0.55 lerp immediately tracks pointer without sluggishness)
      currentPos.current.lerp(targetPos.current, 0.55);
      velocity.current
        .subVectors(targetPos.current, currentPos.current)
        .multiplyScalar(8);
    } else {
      // Hooke's spring return to rest position [0, -0.32, 0]
      const restPos = new THREE.Vector3(0, -0.32, 0);
      const displacement = new THREE.Vector3().subVectors(
        restPos,
        currentPos.current,
      );

      const springForce = displacement.multiplyScalar(18);
      velocity.current.addScaledVector(springForce, dt);
      velocity.current.multiplyScalar(0.92);

      const time = state.clock.elapsedTime;
      const swayX = Math.sin(time * 1.1) * 0.012;
      const swayY = Math.cos(time * 0.8) * 0.008;

      currentPos.current.addScaledVector(velocity.current, dt);
      currentPos.current.x += swayX * dt;
      currentPos.current.y += swayY * dt;
    }

    if (cardGroupRef.current) {
      cardGroupRef.current.position.copy(currentPos.current);

      // Inertial velocity tilt + natural position tilt
      const targetRotX = -velocity.current.y * 0.16;
      const targetRotZ = -velocity.current.x * 0.24;
      const targetRotY = currentPos.current.x * 0.18;

      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.x,
        targetRotX,
        0.18,
      );
      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.y,
        targetRotY,
        0.18,
      );
      cardGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.z,
        targetRotZ,
        0.18,
      );

      cardGroupRef.current.updateMatrixWorld(true);
    }

    // Dynamic Spline Synchronization
    if (clampRef.current && lanyardRef.current) {
      strapAttachWorld.current.copy(strapLocal);
      clampRef.current.localToWorld(strapAttachWorld.current);

      midPoint.current.set(
        (anchorWorld.x + strapAttachWorld.current.x) * 0.5,
        (anchorWorld.y + strapAttachWorld.current.y) * 0.5,
        (anchorWorld.z + strapAttachWorld.current.z) * 0.5 + 0.2,
      );

      curve.points[0].copy(anchorWorld);
      curve.points[1].copy(midPoint.current);
      curve.points[2].copy(strapAttachWorld.current);

      if (lanyardRef.current.geometry) {
        lanyardRef.current.geometry.dispose();
      }
      lanyardRef.current.geometry = new THREE.TubeGeometry(
        curve,
        32,
        0.026,
        8,
        false,
      );
    }
  });

  const wireColor = isDark ? "#bd7df8" : "#9333ea";
  const backplateColor = isDark ? "#171026" : "#ede4fc";

  return (
    <group frustumCulled={false}>
      {/* Studio Lighting */}
      <ambientLight intensity={isDark ? 1.8 : 2.0} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isDark ? 2.2 : 2.4}
        color={isDark ? "#f3e8ff" : "#ffffff"}
      />
      <directionalLight
        position={[-4, -3, 2]}
        intensity={0.9}
        color={isDark ? "#bd7df8" : "#ede9fe"}
      />

      {/* Wire / Lanyard Ribbon reaching directly to the navbar bottom border */}
      <mesh ref={lanyardRef} frustumCulled={false}>
        <tubeGeometry args={[curve, 32, 0.026, 8, false]} />
        <meshStandardMaterial
          color={wireColor}
          roughness={0.65}
          metalness={0.08}
          emissive={isDark ? "#2a1548" : "#1a0d30"}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Main Interactive Card Group */}
      <group
        ref={cardGroupRef}
        scale={[1.085, 1.085, 1.085]}
        frustumCulled={false}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Hardware Clamp Assembly (Solid Matte Black #000000) */}
        <group ref={clampRef} position={[0, 1.18, 0]} frustumCulled={false}>
          {/* Swivel Collar Base */}
          <mesh position={[0, 0.048, 0]} frustumCulled={false}>
            <cylinderGeometry args={[0.032, 0.036, 0.016, 20]} />
            <meshStandardMaterial
              color="#000000"
              metalness={0.25}
              roughness={0.7}
            />
          </mesh>

          {/* Swivel Loop */}
          <mesh
            position={[0, 0.05, 0]}
            rotation={[0, 0, 0]}
            frustumCulled={false}
          >
            <torusGeometry args={[0.035, 0.012, 16, 24]} />
            <meshStandardMaterial
              color="#000000"
              metalness={0.25}
              roughness={0.7}
            />
          </mesh>

          {/* Clamp Body */}
          <mesh position={[0, 0, 0]} frustumCulled={false}>
            <boxGeometry args={[0.26, 0.1, 0.06]} />
            <meshStandardMaterial
              color="#000000"
              metalness={0.25}
              roughness={0.7}
            />
          </mesh>

          {/* Slot pin */}
          <mesh
            position={[0, -0.02, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            frustumCulled={false}
          >
            <cylinderGeometry args={[0.016, 0.016, 0.08, 16]} />
            <meshStandardMaterial
              color="#000000"
              metalness={0.25}
              roughness={0.7}
            />
          </mesh>
        </group>

        {/* Thick Solid Black Rim Frame */}
        <RoundedBox
          args={[1.54, 2.38, 0.034]}
          radius={0.06}
          smoothness={4}
          position={[0, 0, 0]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            color="#000000"
            roughness={0.8}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Front Face: High-Definition Neo-Brutalist Texture Map */}
        <mesh position={[0, 0, 0.0172]} frustumCulled={false}>
          <planeGeometry args={[1.51, 2.34]} />
          <meshStandardMaterial
            map={badgeTexture}
            roughness={0.55}
            metalness={0.02}
            transparent={false}
          />
        </mesh>

        {/* Backplate: Clean Paper Backing */}
        <mesh
          position={[0, 0, -0.0172]}
          rotation={[0, Math.PI, 0]}
          frustumCulled={false}
        >
          <planeGeometry args={[1.51, 2.34]} />
          <meshStandardMaterial
            color={backplateColor}
            roughness={0.7}
            metalness={0.02}
          />
        </mesh>
      </group>
    </group>
  );
}

class BadgeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn(
      "Badge3D WebGL Canvas could not initialize:",
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="badge-fallback-card neo-panel"
          style={{
            width: "320px",
            height: "460px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #000000",
              boxShadow: "3px 3px 0 #000000",
              marginBottom: "16px",
              background: "#bd7df8",
            }}
          >
            <img
              src="/karim_abbas.jpeg"
              alt="Karim Abbas"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <h3
            style={{
              margin: "0 0 6px 0",
              fontSize: "1.3rem",
              fontWeight: "800",
            }}
          >
            Karim Abbas
          </h3>
          <p
            style={{
              margin: "0 0 16px 0",
              color: "#bd7df8",
              fontSize: "0.9rem",
              fontWeight: "700",
            }}
          >
            Backend Developer &amp; Computer Science Senior
          </p>
          <span className="new-badge">VERIFIED PROFILE</span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Primary Export: Viewport-Bleed, Neo-Brutalist 3D ID Badge Component
 */
export default function Badge3D() {
  const [isDraggingState, setIsDraggingState] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className="badge-canvas-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "visible",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        touchAction: "pan-y",
        cursor: isDraggingState ? "grabbing" : "grab",
      }}
    >
      <BadgeErrorBoundary>
        <Canvas
          camera={{ position: [0, -0.05, 5.2], fov: 46 }}
          dpr={[1, 1.5]}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.setClearAlpha(0);
          }}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            overflow: "visible",
            pointerEvents: "auto",
            touchAction: "pan-y",
          }}
        >
          <BadgeScene
            isDraggingState={isDraggingState}
            setIsDraggingState={setIsDraggingState}
            isDark={isDark}
          />
        </Canvas>
      </BadgeErrorBoundary>
    </div>
  );
}
