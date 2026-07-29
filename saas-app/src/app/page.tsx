"use client";

import React, { useState, useEffect, useRef } from "react";

// Dictionaries for ES & EN
const dict = {
  es: {
    promoText: "✨ Lanzamiento — 50 créditos gratis al crear tu cuenta con el código",
    promoCode: "LUMEN50",
    promoClaim: "Reclamar Créditos →",
    navVideo: "Video",
    navImage: "Imagen",
    navTemplates: "Plantillas",
    navPricing: "Precios",
    navStudio: "Studio Canvas",
    credits: "Créditos",
    reload: "Recargar",
    signIn: "Iniciar Sesión",
    tryFree: "Probar Gratis",
    badgeAi: "✨ Impulsado por IA de última generación (Veo 3)",
    heroTitlePrefix: "Cualquier idea,",
    heroTitleSuffix: "en movimiento",
    heroSubtitle:
      "Transforma listings de Airbnb, Zillow y MLS o fotografías HD en recorridos cinemáticos 4K de calidad hollywoodense en cuestión de segundos.",
    btnStartStudio: "Empezar Studio Canvas ⚡",
    btnViewDemos: "Ver Demostraciones 🎬",
    trustVideos: "340K+ videos generados",
    trustRating: "4.9/5 valoración",
    trustQuality: "60fps hasta 4K",
    trustSuccess: "99.8% tasa de éxito",
    studioTitle: "Altus Studio Canvas",
    studioSubtitle: "Crea recorridos virtuales para inmuebles con IA Veo 3",
    urlPlaceholder: "Pega la URL de Airbnb, Zillow o MLS...",
    btnScrape: "Extraer & Generar ⚡",
    presetLabel: "Prueba rápida con URL demo:",
    tulumVilla: "Villa Tulum (Airbnb)",
    nyPenthouse: "Penthouse NYC (Zillow)",
    marbellaMansion: "Mansión Marbella (MLS)",
    uploaderTitle: "Cargador de Fotografía HD",
    uploaderSubtitle: "Arrastra tus fotos de alta resolución o selecciona archivos",
    uploaderFormats: "Soporta JPG, PNG, WEBP hasta 25MB por imagen",
    uploaderBrowse: "Examinar Archivos",
    loadSamples: "Cargar Fotos de Muestra",
    uploadedCount: "fotografías listas para procesar",
    styleSectionTitle: "Panel de Control Cinemático",
    styleRecorrido: "Recorrido 4K Interior",
    descRecorrido: "Navegación fluida por estancias principales con luz natural.",
    styleDron: "Dron Virtual FP",
    descDron: "Vuelajes aéreos dinámicos de fachadas, piscina y entorno exterior.",
    styleEnfoque: "Enfoque de Lujo",
    descEnfoque: "Macro cinemático enfocado en acabados de mármol y detalles de autor.",
    styleTwilight: "Atardecer & Noche",
    descTwilight: "Transición dramática de hora dorada a iluminación nocturna cálida.",
    fineTuningTitle: "Parámetros de Producción",
    aspectRatio: "Relación de Aspecto",
    cameraSpeed: "Velocidad de Cámara",
    lighting: "Iluminación & Mood",
    soundtrack: "Banda Sonora",
    resolution: "Resolución Final",
    generateBtn: "Generar Recorrido Cinemático 4K (1 Crédito)",
    renderingTitle: "Pipeline de Renderizado IA en Tiempo Real",
    stageScraping: "1. Extrayendo imágenes y metadatos",
    stageVeo3: "2. Generando movimiento espacial (IA Veo 3)",
    stageFinalizing: "3. Renderizado 4K y sincronización de audio",
    stageCompleted: "¡Renderizado completado con éxito!",
    viewLogs: "Ver Logs de Consola",
    playerTitle: "Previsualizador 4K & Exportación",
    exportMp4: "Descargar MP4 4K",
    exportReel: "Exportar Reel 9:16",
    shareLink: "Copiar Enlace",
    regenerate: "Regenerar Video",
    specsTitle: "Especificaciones del Render",
    specRes: "Resolución: 3840x2160 (4K UHD)",
    specFps: "Tasa de Cuadros: 60 FPS Fluidos",
    specEngine: "Motor IA: Veo 3 Ultra Spatial Engine",
    specDuration: "Duración: 00:24 seg",
    galleryTitle: "Galería de la Comunidad Lumen",
    gallerySubtitle: "Explora proyectos reales creados con IA por agencias de todo el mundo",
    filterAll: "Todos",
    filterInterior: "Interior",
    filterAerial: "Aéreo",
    filterLuxury: "Lujo",
    filterTwilight: "Atardecer",
    ctaGridTitle: "50 Créditos Gratis",
    ctaGridDesc: "Crea tu primer video inmobiliario en 60 segundos sin tarjeta de crédito.",
    ctaGridBtn: "Comenzar Gratis ⚡",
    pricingTitle: "Planes Diseñados para Escalar",
    pricingSubtitle: "Elige la velocidad y resolución perfecta para tus proyectos",
    footerCopy: "© 2026 Altus Studio x Lumen. Todos los derechos reservados.",
    footerStatus: "Sistemas Operativos | 99.9% Uptime",
  },
  en: {
    promoText: "✨ Launch Offer — 50 free credits upon account creation with code",
    promoCode: "LUMEN50",
    promoClaim: "Claim Credits →",
    navVideo: "Video",
    navImage: "Image",
    navTemplates: "Templates",
    navPricing: "Pricing",
    navStudio: "Studio Canvas",
    credits: "Credits",
    reload: "Top up",
    signIn: "Sign In",
    tryFree: "Try Free",
    badgeAi: "✨ Powered by Next-Gen AI (Veo 3)",
    heroTitlePrefix: "Any idea,",
    heroTitleSuffix: "in motion",
    heroSubtitle:
      "Transform Airbnb, Zillow, or MLS listings or HD photos into Hollywood-grade 4K cinematic walkthroughs in seconds.",
    btnStartStudio: "Start Studio Canvas ⚡",
    btnViewDemos: "Watch Demos 🎬",
    trustVideos: "340K+ videos generated",
    trustRating: "4.9/5 rating",
    trustQuality: "60fps up to 4K",
    trustSuccess: "99.8% success rate",
    studioTitle: "Altus Studio Canvas",
    studioSubtitle: "Create real estate virtual tours powered by AI Veo 3",
    urlPlaceholder: "Paste Airbnb, Zillow, or MLS URL...",
    btnScrape: "Extract & Generate ⚡",
    presetLabel: "Quick test with demo URL:",
    tulumVilla: "Tulum Villa (Airbnb)",
    nyPenthouse: "NYC Penthouse (Zillow)",
    marbellaMansion: "Marbella Mansion (MLS)",
    uploaderTitle: "HD Photo Uploader",
    uploaderSubtitle: "Drag & drop high-res property photos or browse files",
    uploaderFormats: "Supports JPG, PNG, WEBP up to 25MB per image",
    uploaderBrowse: "Browse Files",
    loadSamples: "Load Sample Photos",
    uploadedCount: "photos ready for processing",
    styleSectionTitle: "Cinematic Control Panel",
    styleRecorrido: "4K Interior Walkthrough",
    descRecorrido: "Smooth navigation across main rooms with natural lighting.",
    styleDron: "Virtual Drone FP",
    descDron: "Dynamic aerial sweeps of facades, pool, and surroundings.",
    styleEnfoque: "Luxury Detail Focus",
    descEnfoque: "Cinematic macro focus on marble finishes and designer details.",
    styleTwilight: "Golden Hour & Twilight",
    descTwilight: "Dramatic transition from golden hour sunset to warm evening glow.",
    fineTuningTitle: "Production Parameters",
    aspectRatio: "Aspect Ratio",
    cameraSpeed: "Camera Speed",
    lighting: "Lighting & Mood",
    soundtrack: "Soundtrack",
    resolution: "Final Resolution",
    generateBtn: "Generate 4K Video (1 Credit)",
    renderingTitle: "Real-Time AI Rendering Pipeline",
    stageScraping: "1. Scraping images & metadata",
    stageVeo3: "2. Synthesizing spatial motion (AI Veo 3)",
    stageFinalizing: "3. 4K rendering & audio sync",
    stageCompleted: "Rendering successfully completed!",
    viewLogs: "View Console Logs",
    playerTitle: "4K Preview & Export Studio",
    exportMp4: "Download MP4 4K",
    exportReel: "Export 9:16 Reel",
    shareLink: "Copy Link",
    regenerate: "Regenerate Video",
    specsTitle: "Render Specifications",
    specRes: "Resolution: 3840x2160 (4K UHD)",
    specFps: "Frame Rate: 60 FPS Smooth",
    specEngine: "AI Engine: Veo 3 Ultra Spatial Engine",
    specDuration: "Duration: 00:24 sec",
    galleryTitle: "Lumen Community Showcase",
    gallerySubtitle: "Explore real AI projects created by top real estate agencies",
    filterAll: "All",
    filterInterior: "Interior",
    filterAerial: "Aerial",
    filterLuxury: "Luxury",
    filterTwilight: "Twilight",
    ctaGridTitle: "50 Free Credits",
    ctaGridDesc: "Create your first real estate video in 60 seconds without a credit card.",
    ctaGridBtn: "Get Started Free ⚡",
    pricingTitle: "Plans Built to Scale",
    pricingSubtitle: "Choose the perfect rendering speed and resolution for your team",
    footerCopy: "© 2026 Altus Studio x Lumen. All rights reserved.",
    footerStatus: "All Systems Operational | 99.9% Uptime",
  },
};

const SAMPLE_PHOTOS = [
  { id: "s1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80", name: "Fachada & Piscina Infiniti.jpg" },
  { id: "s2", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80", name: "Sala Principal Open Concept.jpg" },
  { id: "s3", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80", name: "Cocina Gourmet Marmol.jpg" },
  { id: "s4", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", name: "Suite Principal Panoramica.jpg" },
  { id: "s5", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80", name: "Baño Spa Acabados Oro.jpg" },
  { id: "s6", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", name: "Terraza Vista Mar.jpg" },
];

const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Villa Solaria — Tulum Coast",
    category: "interior",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    author: "Riviera Luxury RE",
    views: "14.2K",
    res: "4K 60fps",
    tall: false,
  },
  {
    id: "g2",
    title: "Malibu Cliffside Aerial Sweep",
    category: "aereo",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    author: "Sunset Drone Studio",
    views: "28.9K",
    res: "4K 60fps",
    tall: true,
  },
  {
    id: "g3",
    title: "Penthouse 54 — Manhattan Skyline",
    category: "lujo",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    author: "NYC Prime Properties",
    views: "19.5K",
    res: "4K 60fps",
    tall: false,
  },
  {
    id: "g4",
    title: "Marbella Twilight Mansion",
    category: "twilight",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    author: "Costa del Sol Estates",
    views: "32.1K",
    res: "4K 60fps",
    tall: false,
  },
  {
    id: "g5",
    title: "Minimalist Alpine Chalet",
    category: "interior",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    author: "Swiss Alps Realty",
    views: "11.4K",
    res: "4K 60fps",
    tall: false,
  },
  {
    id: "g6",
    title: "Santorini Cliff Horizon",
    category: "aereo",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    author: "Aegean Drones",
    views: "41.0K",
    res: "4K 60fps",
    tall: true,
  },
];

export default function AltusLumenStudioPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [credits, setCredits] = useState(10);
  const [showPromo, setShowPromo] = useState(true);
  const t = dict[lang];

  // Scraper State
  const [urlInput, setUrlInput] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<"airbnb" | "zillow" | "mls" | null>(null);

  // Uploader State
  const [photos, setPhotos] = useState<Array<{ id: string; url: string; name: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Controls State
  const [selectedStyle, setSelectedStyle] = useState<"recorrido" | "dron" | "enfoque" | "twilight">("recorrido");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [cameraSpeed, setCameraSpeed] = useState("1.0x");
  const [lighting, setLighting] = useState("Atardecer");
  const [music, setMusic] = useState("Cinematic Ambient");
  const [resolution, setResolution] = useState("4K");

  // Render Pipeline State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState<"idle" | "scraping" | "veo3" | "finalizing" | "completed">("idle");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Gallery Filter State
  const [galleryFilter, setGalleryFilter] = useState<"todos" | "interior" | "aereo" | "lujo" | "twilight">("todos");

  // URL Detector
  useEffect(() => {
    const lower = urlInput.toLowerCase();
    if (lower.includes("airbnb.")) setDetectedPlatform("airbnb");
    else if (lower.includes("zillow.")) setDetectedPlatform("zillow");
    else if (lower.includes("mls") || lower.includes("realtor.")) setDetectedPlatform("mls");
    else setDetectedPlatform(null);
  }, [urlInput]);

  // Demo Preset loader
  const handlePreset = (url: string) => {
    setUrlInput(url);
    if (photos.length === 0) {
      setPhotos(SAMPLE_PHOTOS);
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((f, i) => ({
        id: `upload-${Date.now()}-${i}`,
        url: URL.createObjectURL(f),
        name: f.name,
      }));
      setPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f, i) => ({
        id: `upload-${Date.now()}-${i}`,
        url: URL.createObjectURL(f),
        name: f.name,
      }));
      setPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  // Start Generation Simulation
  const startGeneration = () => {
    if (credits <= 0) {
      alert("No tienes suficientes créditos.");
      return;
    }
    setIsRendering(true);
    setRenderProgress(0);
    setRenderStage("scraping");
    setShowVideo(false);
    setConsoleLogs([
      "[00:01] Iniciando Altus-Lumen Pipeline Engine v3.4...",
      `[00:02] Analizando fuente: ${urlInput || `${photos.length} fotos subidas`}`,
      "[00:03] Detectando geometría 3D y mapas de profundidad...",
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setRenderProgress(progress);

      if (progress === 30) {
        setRenderStage("veo3");
        setConsoleLogs((prev) => [
          ...prev,
          "[00:06] Inyectando promps de cámara Veo 3 Spatial Engine...",
          "[00:09] Generando trayectorias fluidas a 60fps...",
        ]);
      } else if (progress === 70) {
        setRenderStage("finalizing");
        setConsoleLogs((prev) => [
          ...prev,
          "[00:14] Aplicando renderizado 4K UHD & HDR Color Grading...",
          "[00:18] Sincronizando audio ambiental & masterización final...",
        ]);
      } else if (progress >= 100) {
        clearInterval(interval);
        setRenderStage("completed");
        setIsRendering(false);
        setCredits((prev) => Math.max(0, prev - 1));
        setShowVideo(true);
        setConsoleLogs((prev) => [
          ...prev,
          "[00:22] Renderizado finalizado con éxito (Status 200 OK).",
        ]);
      }
    }, 250);
  };

  // Filtered Gallery
  const filteredGallery = GALLERY_ITEMS.filter((item) => {
    if (galleryFilter === "todos") return true;
    return item.category === galleryFilter;
  });

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 flex flex-col bg-lumen-glow">
      {/* 1. Top Promo Bar */}
      {showPromo && (
        <div className="promo py-2.5 px-4 text-xs font-mono text-center flex items-center justify-center gap-3 relative z-50">
          <span className="text-zinc-200">
            {t.promoText}{" "}
            <strong className="text-[#FF7A45] bg-[#FF7A45]/10 px-2 py-0.5 rounded border border-[#FF7A45]/30">
              {t.promoCode}
            </strong>
          </span>
          <a
            href="#studio"
            className="text-[#5B8CFF] hover:text-white font-semibold underline decoration-1 underline-offset-4 transition"
          >
            {t.promoClaim}
          </a>
          <button
            onClick={() => setShowPromo(false)}
            className="absolute right-4 text-zinc-400 hover:text-white text-base leading-none"
            aria-label="Cerrar promo"
          >
            ×
          </button>
        </div>
      )}

      {/* 2. Main Header / Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07070A]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B8CFF] via-[#d4af37] to-[#FF7A45] p-[1.5px] shadow-lg shadow-[#5B8CFF]/20">
              <div className="w-full h-full bg-[#07070A] rounded-[10.5px] flex items-center justify-center">
                <span className="text-lg font-black tracking-tighter text-white">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                ALTUS <span className="text-xs font-mono text-[#d4af37] px-1.5 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">LUMEN</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider">AI VEO 3 VIDEO STUDIO</span>
            </div>
          </div>

          {/* Megamenu Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="nav-item">
              <button className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5">
                {t.navVideo}
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="mega absolute top-full left-0 w-80 p-4 bg-[#111114] border border-white/10 rounded-2xl shadow-2xl space-y-2">
                <a href="#studio" className="block p-2.5 rounded-xl hover:bg-white/5 transition">
                  <div className="text-sm font-semibold text-white">Recorridos 4K Interior</div>
                  <div className="text-xs text-zinc-400">Navegación cinemática fluida en 60fps</div>
                </a>
                <a href="#studio" className="block p-2.5 rounded-xl hover:bg-white/5 transition">
                  <div className="text-sm font-semibold text-white">Dron Virtual FP</div>
                  <div className="text-xs text-zinc-400">Tomas aéreas dinámicas de exteriores</div>
                </a>
                <a href="#studio" className="block p-2.5 rounded-xl hover:bg-white/5 transition">
                  <div className="text-sm font-semibold text-white">Enfoque de Lujo</div>
                  <div className="text-xs text-zinc-400">Macros cinemáticos de detalles</div>
                </a>
              </div>
            </div>

            <div className="nav-item">
              <button className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5">
                {t.navImage}
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="mega absolute top-full left-0 w-80 p-4 bg-[#111114] border border-white/10 rounded-2xl shadow-2xl space-y-2">
                <a href="#gallery" className="block p-2.5 rounded-xl hover:bg-white/5 transition">
                  <div className="text-sm font-semibold text-white">Virtual Staging IA</div>
                  <div className="text-xs text-zinc-400">Amueblado fotorrealista automático</div>
                </a>
                <a href="#gallery" className="block p-2.5 rounded-xl hover:bg-white/5 transition">
                  <div className="text-sm font-semibold text-white">Modo Twilight / Atardecer</div>
                  <div className="text-xs text-zinc-400">Transforma iluminación diurna a hora dorada</div>
                </a>
              </div>
            </div>

            <a href="#gallery" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition">
              {t.navTemplates}
            </a>
            <a href="#pricing" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition">
              {t.navPricing}
            </a>
            <a href="#studio" className="px-4 py-2 text-sm font-medium text-[#d4af37] hover:text-[#f3e5ab] transition">
              {t.navStudio}
            </a>
          </nav>

          {/* Right Controls: Credits + Lang + Account */}
          <div className="flex items-center gap-3">
            {/* Credits Counter */}
            <div className="flex items-center gap-2 bg-[#18181C] border border-[#d4af37]/30 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
              <span className="text-xs font-mono font-semibold text-[#f3e5ab]">
                ⚡ {credits}/10 {t.credits}
              </span>
              <button
                onClick={() => setCredits(10)}
                className="text-[11px] font-mono text-zinc-400 hover:text-white transition underline"
              >
                {t.reload}
              </button>
            </div>

            {/* ES / EN Selector */}
            <div className="flex items-center bg-[#18181C] border border-white/10 rounded-full p-1 text-xs font-mono">
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 rounded-full transition ${
                  lang === "es" ? "bg-[#5B8CFF] text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-full transition ${
                  lang === "en" ? "bg-[#5B8CFF] text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Account Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition">
                {t.signIn}
              </button>
              <a href="#studio" className="gold-btn px-5 py-2.5 rounded-full text-xs font-bold tracking-wide">
                {t.tryFree}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full gradient-badge">
            <span className="w-2 h-2 rounded-full bg-[#FF7A45] animate-pulse" />
            <span className="text-xs font-mono font-medium text-zinc-200">{t.badgeAi}</span>
          </div>

          {/* Title */}
          <h1 className="display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {t.heroTitlePrefix} <span className="lumen-gold-gradient">{t.heroTitleSuffix}</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#studio" className="gold-btn px-8 py-4 rounded-full text-sm font-bold tracking-wide shadow-xl">
              {t.btnStartStudio}
            </a>
            <a href="#gallery" className="lumen-btn px-8 py-4 rounded-full text-sm font-bold tracking-wide shadow-xl">
              {t.btnViewDemos}
            </a>
          </div>

          {/* Trust Row Social Proof */}
          <div className="pt-8">
            <div className="trust-row max-w-3xl mx-auto text-xs font-mono text-zinc-300">
              <span className="flex items-center gap-2">🎬 <strong>{t.trustVideos}</strong></span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-2">⭐ <strong>{t.trustRating}</strong></span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-2">⚡ <strong>{t.trustQuality}</strong></span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-2">🛡️ <strong>{t.trustSuccess}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Studio Canvas (Interactive Core App) */}
      <section id="studio" className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-white">
              {t.studioTitle}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">{t.studioSubtitle}</p>
          </div>

          {/* Main Studio Container */}
          <div className="animated-border p-6 sm:p-8 space-y-10">
            {/* Scraper Input Panel */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                1. Scraper Inteligente de Propiedades
              </label>

              <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={t.urlPlaceholder}
                    className="w-full bg-[#18181C] border border-white/15 focus:border-[#d4af37] rounded-xl px-4 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition"
                  />
                  {detectedPlatform && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#5B8CFF]/20 text-[#5B8CFF] border border-[#5B8CFF]/40 uppercase">
                      {detectedPlatform} DETECTADO
                    </span>
                  )}
                </div>

                <button
                  onClick={startGeneration}
                  disabled={isRendering}
                  className="orange-btn px-8 py-4 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {t.btnScrape}
                </button>
              </div>

              {/* Demo Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-mono text-zinc-400">{t.presetLabel}</span>
                <button
                  onClick={() => handlePreset("https://www.airbnb.com/rooms/sample-tulum-villa")}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#18181C] hover:bg-white/10 text-zinc-300 border border-white/10 transition"
                >
                  🏖️ {t.tulumVilla}
                </button>
                <button
                  onClick={() => handlePreset("https://www.zillow.com/homedetails/sample-nyc-penthouse")}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#18181C] hover:bg-white/10 text-zinc-300 border border-white/10 transition"
                >
                  🏙️ {t.nyPenthouse}
                </button>
                <button
                  onClick={() => handlePreset("https://www.mls.com/listings/sample-marbella-mansion")}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#18181C] hover:bg-white/10 text-zinc-300 border border-white/10 transition"
                >
                  🏰 {t.marbellaMansion}
                </button>
              </div>
            </div>

            {/* Photo Uploader Panel */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-[#5B8CFF]">
                2. {t.uploaderTitle}
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-[#5B8CFF] bg-[#5B8CFF]/10"
                    : "border-white/15 bg-[#18181C]/50 hover:border-white/30"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                  📸
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">{t.uploaderSubtitle}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{t.uploaderFormats}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition"
                  >
                    {t.uploaderBrowse}
                  </button>
                  <button
                    onClick={() => setPhotos(SAMPLE_PHOTOS)}
                    className="gold-btn px-5 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    ⚡ {t.loadSamples}
                  </button>
                </div>
              </div>

              {/* Uploaded Thumbnails Grid */}
              {photos.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">
                      📸 <strong>{photos.length}</strong> {t.uploadedCount}
                    </span>
                    <button
                      onClick={() => setPhotos([])}
                      className="text-xs font-mono text-rose-400 hover:underline"
                    >
                      Limpiar fotos
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {photos.map((p) => (
                      <div
                        key={p.id}
                        className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#18181C]"
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <button
                          onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cinematic Style Control Panel */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-[#FF7A45]">
                3. {t.styleSectionTitle}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: "recorrido", title: t.styleRecorrido, desc: t.descRecorrido, icon: "🏰" },
                  { id: "dron", title: t.styleDron, desc: t.descDron, icon: "🛸" },
                  { id: "enfoque", title: t.styleEnfoque, desc: t.descEnfoque, icon: "💎" },
                  { id: "twilight", title: t.styleTwilight, desc: t.descTwilight, icon: "🌅" },
                ].map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStyle(st.id as any)}
                    className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-3 ${
                      selectedStyle === st.id
                        ? "bg-gradient-to-br from-[#18181C] to-[#222228] border-[#d4af37] shadow-lg shadow-[#d4af37]/15"
                        : "bg-[#18181C]/60 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{st.icon}</span>
                      {selectedStyle === st.id && (
                        <span className="w-3 h-3 rounded-full bg-[#d4af37]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{st.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Parameters */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400">
                4. {t.fineTuningTitle}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Aspect Ratio */}
                <div className="bg-[#18181C] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">{t.aspectRatio}</span>
                  <div className="flex gap-1">
                    {(["16:9", "9:16", "1:1"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setAspectRatio(r)}
                        className={`flex-1 py-1 rounded text-xs font-mono font-bold transition ${
                          aspectRatio === r ? "bg-[#5B8CFF] text-white" : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera Speed */}
                <div className="bg-[#18181C] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">{t.cameraSpeed}</span>
                  <select
                    value={cameraSpeed}
                    onChange={(e) => setCameraSpeed(e.target.value)}
                    className="w-full bg-[#111114] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="0.75x">0.75x (Cinemática Lenta)</option>
                    <option value="1.0x">1.0x (Normal Flotante)</option>
                    <option value="1.5x">1.5x (Dinámica Recorrido)</option>
                  </select>
                </div>

                {/* Lighting */}
                <div className="bg-[#18181C] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">{t.lighting}</span>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full bg-[#111114] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="Natural">Luz Natural de Sol</option>
                    <option value="Atardecer">Atardecer Dorado (Golden Hour)</option>
                    <option value="Noche">Noche Lujosa Cálida</option>
                  </select>
                </div>

                {/* Soundtrack */}
                <div className="bg-[#18181C] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">{t.soundtrack}</span>
                  <select
                    value={music}
                    onChange={(e) => setMusic(e.target.value)}
                    className="w-full bg-[#111114] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="Cinematic Ambient">Cinematic Ambient</option>
                    <option value="Modern Luxury">Modern Luxury Lounge</option>
                    <option value="Classical Piano">Piano Fino & Cuerdas</option>
                  </select>
                </div>

                {/* Resolution */}
                <div className="bg-[#18181C] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">{t.resolution}</span>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-[#111114] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none font-bold text-[#d4af37]"
                  >
                    <option value="4K">4K Ultra HD (60fps)</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Start Main Generation Button */}
            <div className="pt-4">
              <button
                onClick={startGeneration}
                disabled={isRendering}
                className="w-full gold-btn py-5 rounded-2xl text-base font-extrabold tracking-wide flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{isRendering ? "Generando Recorrido Veo 3..." : t.generateBtn}</span>
              </button>
            </div>

            {/* Live Progress Pipeline Bar & Console */}
            {(isRendering || renderStage === "completed") && (
              <div className="bg-[#18181C] border border-[#d4af37]/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping" />
                    {t.renderingTitle}
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#d4af37]">{renderProgress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-[#07070A] rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5B8CFF] via-[#d4af37] to-[#FF7A45] transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>

                {/* Stage Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className={renderProgress >= 30 ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                    {renderProgress >= 30 ? "✓" : "⏳"} {t.stageScraping}
                  </div>
                  <div className={renderProgress >= 70 ? "text-emerald-400 font-bold" : renderProgress >= 30 ? "text-[#5B8CFF] font-bold" : "text-zinc-500"}>
                    {renderProgress >= 70 ? "✓" : renderProgress >= 30 ? "⚡" : "⏳"} {t.stageVeo3}
                  </div>
                  <div className={renderProgress >= 100 ? "text-emerald-400 font-bold" : renderProgress >= 70 ? "text-[#FF7A45] font-bold" : "text-zinc-500"}>
                    {renderProgress >= 100 ? "✓" : "⏳"} {t.stageFinalizing}
                  </div>
                </div>

                {/* Console Logs Toggle */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowLogs(!showLogs)}
                    className="text-xs font-mono text-[#5B8CFF] hover:underline"
                  >
                    {showLogs ? "Ocultar Logs" : t.viewLogs} ({consoleLogs.length})
                  </button>

                  {showLogs && (
                    <div className="mt-2 p-3 bg-[#07070A] rounded-xl border border-white/10 font-mono text-xs text-zinc-400 space-y-1 max-h-40 overflow-y-auto">
                      {consoleLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Player & Export */}
            {showVideo && (
              <div className="bg-[#18181C] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📹</span> {t.playerTitle}
                  </h4>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    STATUS 200 OK
                  </span>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                  <video
                    src="https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-architectural-design-41007-large.mp4"
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-architectural-design-41007-large.mp4"
                    download="Altus_Lumen_Walkthrough_4K.mp4"
                    className="gold-btn flex-1 py-3.5 px-4 rounded-xl text-xs font-bold text-center"
                  >
                    ⬇️ {t.exportMp4}
                  </a>
                  <a
                    href="https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-architectural-design-41007-large.mp4"
                    download="Altus_Lumen_Reel_916.mp4"
                    className="lumen-btn flex-1 py-3.5 px-4 rounded-xl text-xs font-bold text-center"
                  >
                    📱 {t.exportReel}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Lumen Community Showcase Section */}
      <section id="gallery" className="py-16 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-white">
              {t.galleryTitle}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">{t.gallerySubtitle}</p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex justify-center">
            <div className="segmented">
              <button
                onClick={() => setGalleryFilter("todos")}
                className={`segmented-item ${galleryFilter === "todos" ? "active" : ""}`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setGalleryFilter("interior")}
                className={`segmented-item ${galleryFilter === "interior" ? "active" : ""}`}
              >
                {t.filterInterior}
              </button>
              <button
                onClick={() => setGalleryFilter("aereo")}
                className={`segmented-item ${galleryFilter === "aereo" ? "active" : ""}`}
              >
                {t.filterAerial}
              </button>
              <button
                onClick={() => setGalleryFilter("lujo")}
                className={`segmented-item ${galleryFilter === "lujo" ? "active" : ""}`}
              >
                {t.filterLuxury}
              </button>
              <button
                onClick={() => setGalleryFilter("twilight")}
                className={`segmented-item ${galleryFilter === "twilight" ? "active" : ""}`}
              >
                {t.filterTwilight}
              </button>
            </div>
          </div>

          {/* Gallery Grid with VCard Pattern */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div key={item.id} className="vcard group cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/70 border border-white/10 text-white">
                    {item.res}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>👁️ {item.views}</span>
                    <span className="text-[#5B8CFF] font-bold">VER RECORRIDO →</span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-bold text-white display">{item.title}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{item.author}</p>
                </div>
              </div>
            ))}

            {/* Embedded CTA Grid Card */}
            <div className="grid-cta space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-2xl">
                ✨
              </div>
              <div className="space-y-1">
                <h3 className="display text-xl font-bold text-white">{t.ctaGridTitle}</h3>
                <p className="text-xs text-zinc-400">{t.ctaGridDesc}</p>
              </div>
              <a href="#studio" className="gold-btn px-6 py-3 rounded-full text-xs font-bold">
                {t.ctaGridBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-16 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-white">
              {t.pricingTitle}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">{t.pricingSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-[#111114] border border-white/10 rounded-2xl p-8 space-y-6 relative hover:border-white/30 transition">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">STARTER</span>
                <div className="display text-4xl font-extrabold text-white mt-2">$49<span className="text-sm font-sans font-normal text-zinc-400">/mes</span></div>
                <p className="text-xs text-zinc-400 mt-2">Para agentes independientes y pequeñas agencias.</p>
              </div>

              <ul className="space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">✓ 10 Videos HD / mes</li>
                <li className="flex items-center gap-2">✓ Exportación 1080p & Reels</li>
                <li className="flex items-center gap-2">✓ Scraper de Airbnb & Zillow</li>
                <li className="flex items-center gap-2 text-zinc-500">✗ Sin marcas de agua personalizadas</li>
              </ul>

              <a href="#studio" className="block w-full text-center py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition">
                Seleccionar Plan
              </a>
            </div>

            {/* Pro (Featured) */}
            <div className="animated-border-gold p-8 space-y-6 relative">
              <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                MÁS POPULAR
              </span>
              <div>
                <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">PRO VEO 3</span>
                <div className="display text-4xl font-extrabold text-white mt-2">$149<span className="text-sm font-sans font-normal text-zinc-400">/mes</span></div>
                <p className="text-xs text-zinc-400 mt-2">Para agencias de alto volumen y equipos de marketing.</p>
              </div>

              <ul className="space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">✓ 40 Videos 4K Ultra HD / mes</li>
                <li className="flex items-center gap-2">✓ Renderizado 60fps con IA Veo 3</li>
                <li className="flex items-center gap-2">✓ Scraper MLS, Zillow & Airbnb</li>
                <li className="flex items-center gap-2">✓ Logo y marcas de agua personalizadas</li>
                <li className="flex items-center gap-2">✓ Licencia comercial completa</li>
              </ul>

              <a href="#studio" className="gold-btn block w-full text-center py-3.5 rounded-xl text-xs font-bold">
                Comenzar Plan Pro ⚡
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-[#111114] border border-white/10 rounded-2xl p-8 space-y-6 relative hover:border-white/30 transition">
              <div>
                <span className="text-xs font-mono text-[#5B8CFF] uppercase tracking-widest">ENTERPRISE</span>
                <div className="display text-4xl font-extrabold text-white mt-2">$299<span className="text-sm font-sans font-normal text-zinc-400">/mes</span></div>
                <p className="text-xs text-zinc-400 mt-2">Para franquicias inmobiliarias y plataformas SaaS.</p>
              </div>

              <ul className="space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">✓ Videos 4K Ilimitados</li>
                <li className="flex items-center gap-2">✓ API & Webhooks de alta velocidad</li>
                <li className="flex items-center gap-2">✓ Renderizado prioritario ultrarrápido</li>
                <li className="flex items-center gap-2">✓ Soporte técnico dedicado 24/7</li>
              </ul>

              <a href="#studio" className="lumen-btn block w-full text-center py-3.5 rounded-xl text-xs font-bold">
                Contactar Ventas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="mt-auto border-t border-white/10 py-10 bg-[#07070A]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>{t.footerCopy}</div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t.footerStatus}
          </div>
        </div>
      </footer>
    </div>
  );
}
