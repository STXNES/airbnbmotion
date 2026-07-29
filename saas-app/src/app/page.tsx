"use client";

import React, { useState, useEffect, useRef } from "react";

// Dictionaries for ES / EN
const dict = {
  es: {
    navStudio: "Studio Canvas",
    navProjects: "Mis Proyectos",
    navTemplates: "Plantillas 4K",
    navApi: "API & Webhooks",
    credits: "Créditos",
    reload: "Recargar",
    heroTitle: "Transforma Propiedades en Recorridos Cinemáticos 4K",
    heroSubtitle:
      "Pega una URL de Airbnb, Zillow o MLS, o sube fotografías HD para generar recorridos hiperrealistas con IA Veo 3.",
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
    styleSectionTitle: "Panel de Control de Estilos Cinemáticos",
    styleRecorrido: "Recorrido 4K Interior",
    descRecorrido: "Navegación fluida por estancias principales con iluminación natural.",
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
  },
  en: {
    navStudio: "Studio Canvas",
    navProjects: "My Projects",
    navTemplates: "4K Templates",
    navApi: "API & Webhooks",
    credits: "Credits",
    reload: "Top up",
    heroTitle: "Transform Real Estate into Cinematic 4K Videos",
    heroSubtitle:
      "Paste an Airbnb, Zillow, or MLS URL, or upload HD photos to generate hyper-realistic AI walkthroughs powered by Veo 3.",
    urlPlaceholder: "Paste Airbnb, Zillow, or MLS property URL...",
    btnScrape: "Extract & Generate ⚡",
    presetLabel: "Quick test with demo URL:",
    tulumVilla: "Tulum Villa (Airbnb)",
    nyPenthouse: "NYC Penthouse (Zillow)",
    marbellaMansion: "Marbella Mansion (MLS)",
    uploaderTitle: "HD Photo Uploader",
    uploaderSubtitle: "Drag & drop your high-res property photos or browse files",
    uploaderFormats: "Supports JPG, PNG, WEBP up to 25MB per image",
    uploaderBrowse: "Browse Files",
    loadSamples: "Load Sample Photos",
    uploadedCount: "photos ready for processing",
    styleSectionTitle: "Cinematic Style Control Panel",
    styleRecorrido: "4K Interior Walkthrough",
    descRecorrido: "Smooth navigation across main rooms with natural ambient lighting.",
    styleDron: "Virtual Drone FP",
    descDron: "Dynamic aerial sweeps of facades, infinity pool, and surroundings.",
    styleEnfoque: "Luxury Detail Focus",
    descEnfoque: "Cinematic macro focus on marble finishes and designer details.",
    styleTwilight: "Golden Hour & Twilight",
    descTwilight: "Dramatic transition from golden hour sunset to warm evening glow.",
    fineTuningTitle: "Production Parameters",
    aspectRatio: "Aspect Ratio",
    cameraSpeed: "Camera Motion Speed",
    lighting: "Lighting & Mood",
    soundtrack: "Soundtrack",
    resolution: "Final Resolution",
    generateBtn: "Generate 4K Cinematic Video (1 Credit)",
    renderingTitle: "Real-time AI Rendering Pipeline",
    stageScraping: "1. Scraping images & property metadata",
    stageVeo3: "2. Synthesizing 3D spatial motion (AI Veo 3)",
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

export default function AltusStudioPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [credits, setCredits] = useState(10);
  const t = dict[lang];

  // Scraper & Input states
  const [urlInput, setUrlInput] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<"airbnb" | "zillow" | "mls" | null>(null);
  
  // Uploader state
  const [photos, setPhotos] = useState<Array<{ id: string; url: string; name: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Style Selection state
  const [selectedStyle, setSelectedStyle] = useState<"recorrido" | "dron" | "enfoque" | "twilight">("recorrido");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [cameraSpeed, setCameraSpeed] = useState("1.0x");
  const [lighting, setLighting] = useState("Atardecer");
  const [music, setMusic] = useState("Cinematic Ambient");
  const [resolution, setResolution] = useState("4K");

  // Rendering & Pipeline state
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<"idle" | "scraping" | "veo3" | "finalizing" | "completed">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto detect platform from URL input
  useEffect(() => {
    const lower = urlInput.toLowerCase();
    if (lower.includes("airbnb")) setDetectedPlatform("airbnb");
    else if (lower.includes("zillow")) setDetectedPlatform("zillow");
    else if (lower.includes("mls") || lower.includes("realtor") || lower.includes("redfin")) setDetectedPlatform("mls");
    else setDetectedPlatform(null);
  }, [urlInput]);

  // Demo URL fast presets
  const applyPresetUrl = (presetType: "airbnb" | "zillow" | "mls") => {
    if (presetType === "airbnb") {
      setUrlInput("https://www.airbnb.com/rooms/84920491-luxury-villa-tulum-private-pool");
    } else if (presetType === "zillow") {
      setUrlInput("https://www.zillow.com/homedetails/432-park-ave-penthouse-new-york-ny");
    } else {
      setUrlInput("https://www.mls.com/property/mansión-marbella-golden-mile-spain-luxury-9402");
    }
  };

  const loadSamplePhotos = () => {
    setPhotos(SAMPLE_PHOTOS);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).map((f, idx) => ({
      id: `u-${Date.now()}-${idx}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  // Start Generation Pipeline
  const startGeneration = () => {
    if (credits <= 0) {
      alert("No tienes créditos suficientes.");
      return;
    }
    setCredits((prev) => prev - 1);
    setIsRendering(true);
    setRenderProgress(0);
    setCurrentStage("scraping");
    setLogs([
      `[${new Date().toLocaleTimeString()}] Iniciando conexión con scraper de metadatos...`,
    ]);

    // Timer simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setRenderProgress(progress);

      if (progress === 10) {
        setLogs((l) => [
          ...l,
          `[${new Date().toLocaleTimeString()}] Extraídas 12 fotografías HD y metadatos de propiedad.`,
        ]);
      } else if (progress === 36) {
        setCurrentStage("veo3");
        setLogs((l) => [
          ...l,
          `[${new Date().toLocaleTimeString()}] Inicializando modelo IA Veo 3 Spatial Engine (60FPS)...`,
          `[${new Date().toLocaleTimeString()}] Sintetizando iluminación volumétrica y trayectoria de cámara.`,
        ]);
      } else if (progress === 76) {
        setCurrentStage("finalizing");
        setLogs((l) => [
          ...l,
          `[${new Date().toLocaleTimeString()}] Renderizando cuadros 4K Ultra HD y codificando H.265...`,
          `[${new Date().toLocaleTimeString()}] Sincronizando pista de audio '${music}'...`,
        ]);
      } else if (progress >= 100) {
        clearInterval(interval);
        setCurrentStage("completed");
        setIsRendering(false);
        setLogs((l) => [
          ...l,
          `[${new Date().toLocaleTimeString()}] ¡Proceso completado con éxito! Video disponible para exportar.`,
        ]);
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }, 150);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://altustudio.ai/v/demo1-4k-luxury");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background ambient lighting subtle glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#aa7c11]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* HEADER NAVEGABLE */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-[#d4af37]/25 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider gold-gradient-text">ALTUS STUDIO</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                  PRO VEO 3
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4 text-xs font-medium text-zinc-400">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white border border-white/10">{t.navStudio}</button>
            <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition">{t.navProjects}</button>
            <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition">{t.navTemplates}</button>
            <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition">{t.navApi}</button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-lg border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setLang("es")}
              className={`px-2.5 py-1 rounded-md transition ${lang === "es" ? "bg-[#d4af37] text-black font-bold shadow" : "text-zinc-400 hover:text-white"}`}
            >
              ES
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-md transition ${lang === "en" ? "bg-[#d4af37] text-black font-bold shadow" : "text-zinc-400 hover:text-white"}`}
            >
              EN
            </button>
          </div>

          {/* Credit Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel-gold border border-[#d4af37]/30">
            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
              ⚡
            </div>
            <span className="text-xs font-bold text-zinc-200">
              <span className="text-[#d4af37] font-extrabold">{credits}</span>/10 {t.credits}
            </span>
            <button
              onClick={() => setCredits(10)}
              className="ml-1 text-[10px] uppercase font-bold text-[#d4af37] hover:underline"
            >
              {t.reload}
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer hover:border-[#d4af37] transition">
                AX
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0a0a0c]" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN STUDIO CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: URL SCRAPER, PHOTO UPLOADER & STYLES (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* STUDIO HERO / URL SCRAPER BANNER */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                ✨ AI Real Estate Video Studio
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight mb-2">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5 leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* URL INPUT BAR */}
            <div className="space-y-3">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-zinc-400">
                  🔗
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  className="w-full bg-zinc-950/80 border border-white/15 focus:border-[#d4af37] rounded-xl pl-10 pr-32 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition shadow-inner"
                />
                
                {/* Detected Platform Tag */}
                {detectedPlatform && (
                  <span className="absolute right-3 font-semibold text-xs px-2.5 py-1 rounded-md bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 uppercase tracking-wider animate-pulse">
                    {detectedPlatform}
                  </span>
                )}
              </div>

              {/* Quick Demo Preset Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-zinc-500 font-medium">{t.presetLabel}</span>
                <button
                  onClick={() => applyPresetUrl("airbnb")}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-[#d4af37]/50 text-zinc-300 transition text-[11px]"
                >
                  🏡 {t.tulumVilla}
                </button>
                <button
                  onClick={() => applyPresetUrl("zillow")}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-[#d4af37]/50 text-zinc-300 transition text-[11px]"
                >
                  🏙️ {t.nyPenthouse}
                </button>
                <button
                  onClick={() => applyPresetUrl("mls")}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-[#d4af37]/50 text-zinc-300 transition text-[11px]"
                >
                  🏰 {t.marbellaMansion}
                </button>
              </div>
            </div>
          </div>

          {/* DRAG & DROP PHOTO UPLOADER */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📸</span> {t.uploaderTitle}
                </h3>
                <p className="text-xs text-zinc-400">{t.uploaderSubtitle}</p>
              </div>
              <button
                onClick={loadSamplePhotos}
                className="px-3 py-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold transition"
              >
                {t.loadSamples}
              </button>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#d4af37] bg-[#d4af37]/10"
                  : "border-white/15 hover:border-[#d4af37]/60 bg-zinc-950/40 hover:bg-zinc-900/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xl text-[#d4af37]">
                ☁️
              </div>
              <p className="text-xs font-medium text-zinc-300 mb-1">
                {t.uploaderSubtitle}
              </p>
              <p className="text-[11px] text-zinc-500">{t.uploaderFormats}</p>
            </div>

            {/* Uploaded Photos Grid Preview */}
            {photos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-300">
                    <span className="text-[#d4af37] font-bold">{photos.length}</span> {t.uploadedCount}
                  </span>
                  <button
                    onClick={() => setPhotos([])}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Vaciar lista
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-white/15 bg-zinc-900 aspect-square">
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                        #{idx + 1}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(photo.id);
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600/90 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CINEMATIC STYLE CONTROL PANEL */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎬</span> {t.styleSectionTitle}
            </h3>

            {/* Style Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "recorrido", title: t.styleRecorrido, desc: t.descRecorrido, icon: "🏰" },
                { id: "dron", title: t.styleDron, desc: t.descDron, icon: "🚁" },
                { id: "enfoque", title: t.styleEnfoque, desc: t.descEnfoque, icon: "💎" },
                { id: "twilight", title: t.styleTwilight, desc: t.descTwilight, icon: "🌅" },
              ].map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id as any)}
                    className={`p-4 rounded-xl cursor-pointer transition border ${
                      isSelected
                        ? "glass-panel-gold border-[#d4af37] shadow-lg shadow-[#d4af37]/10"
                        : "glass-card hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{style.icon}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-bold text-xs flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{style.title}</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug">{style.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* FINE-TUNING PARAMETERS */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                {t.fineTuningTitle}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-zinc-400 mb-1.5 font-medium">{t.aspectRatio}</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="16:9">16:9 (Horizontal)</option>
                    <option value="9:16">9:16 (Reels/TikTok)</option>
                    <option value="1:1">1:1 (Cuadrado)</option>
                  </select>
                </div>

                {/* Camera Speed */}
                <div>
                  <label className="block text-zinc-400 mb-1.5 font-medium">{t.cameraSpeed}</label>
                  <select
                    value={cameraSpeed}
                    onChange={(e) => setCameraSpeed(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="0.8x">0.8x (Suave)</option>
                    <option value="1.0x">1.0x (Estándar)</option>
                    <option value="1.2x">1.2x (Dinámico)</option>
                  </select>
                </div>

                {/* Lighting */}
                <div>
                  <label className="block text-zinc-400 mb-1.5 font-medium">{t.lighting}</label>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="Atardecer">Atardecer Dorado</option>
                    <option value="Mediodia">Luz Natural</option>
                    <option value="Noche">Noche Elegante</option>
                  </select>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-zinc-400 mb-1.5 font-medium">{t.resolution}</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="4K">4K Ultra HD ⚡</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GENERATE ACTION BUTTON */}
            <button
              onClick={startGeneration}
              disabled={isRendering}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition shadow-xl flex items-center justify-center gap-2 ${
                isRendering
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/10"
                  : "gold-btn cursor-pointer"
              }`}
            >
              <span>⚡</span>
              <span>{isRendering ? "Procesando Renderizado IA..." : t.generateBtn}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME PLAYER & PIPELINE (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* RENDERING PIPELINE PROGRESS CARD */}
          {(isRendering || currentStage === "completed") && (
            <div className="glass-panel p-6 rounded-2xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping" />
                  {t.renderingTitle}
                </h3>
                <span className="text-xs font-extrabold text-[#d4af37] font-mono">
                  {renderProgress}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                <div
                  className="h-full rounded-full gold-gradient-bg transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${renderProgress}%` }}
                >
                  <div className="absolute inset-0 animate-shimmer" />
                </div>
              </div>

              {/* Stage Indicators */}
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2 ${renderProgress >= 10 ? "text-white font-semibold" : "text-zinc-500"}`}>
                  <span>{renderProgress >= 35 ? "✅" : "⏳"}</span>
                  <span>{t.stageScraping}</span>
                </div>
                <div className={`flex items-center gap-2 ${renderProgress >= 36 ? "text-white font-semibold" : "text-zinc-500"}`}>
                  <span>{renderProgress >= 75 ? "✅" : renderProgress >= 36 ? "⚡" : "⏳"}</span>
                  <span>{t.stageVeo3}</span>
                </div>
                <div className={`flex items-center gap-2 ${renderProgress >= 76 ? "text-white font-semibold" : "text-zinc-500"}`}>
                  <span>{renderProgress >= 100 ? "✅" : renderProgress >= 76 ? "⚡" : "⏳"}</span>
                  <span>{t.stageFinalizing}</span>
                </div>
              </div>

              {/* Console Logs Toggle */}
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-[11px] text-[#d4af37] hover:underline font-mono"
              >
                {showLogs ? "Ocultar Logs" : t.viewLogs} ({logs.length})
              </button>

              {showLogs && (
                <div className="p-3 bg-black/80 rounded-lg border border-white/10 font-mono text-[10px] text-zinc-400 max-h-36 overflow-y-auto space-y-1">
                  {logs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INTERACTIVE VIDEO PLAYER CARD */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📹</span> {t.playerTitle}
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                PRO 4K READY
              </span>
            </div>

            {/* Video Player Box */}
            <div className={`relative rounded-xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center ${
              aspectRatio === "9:16" ? "aspect-[9/16] max-w-[280px] mx-auto" : "aspect-video w-full"
            }`}>
              <video
                ref={videoRef}
                src={aspectRatio === "9:16" ? "/videos/demo1vertical.mp4" : "/videos/demo1.mp4"}
                className="w-full h-full object-cover"
                loop
                playsInline
              />

              {/* Custom Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-black/60 text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/40">
                    4K UHD • 60 FPS
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full gold-gradient-bg text-black flex items-center justify-center font-bold shadow-lg hover:scale-110 transition"
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>

                  <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full bg-[#d4af37] w-2/3" />
                  </div>

                  <span className="text-[11px] font-mono text-zinc-300">00:16 / 00:24</span>
                </div>
              </div>
            </div>

            {/* ONE-CLICK EXPORT & ACTION BUTTONS */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="/videos/demo1.mp4"
                  download="Altus_Recorrido_4K.mp4"
                  className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-[#d4af37] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <span>⬇️</span>
                  <span>{t.exportMp4}</span>
                </a>
                <a
                  href="/videos/demo1vertical.mp4"
                  download="Altus_Reel_916.mp4"
                  className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-[#d4af37] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <span>📱</span>
                  <span>{t.exportReel}</span>
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition"
                >
                  {copiedLink ? "¡Copiado! ✓" : `🔗 ${t.shareLink}`}
                </button>
                <button
                  onClick={startGeneration}
                  className="py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition"
                >
                  🔄 {t.regenerate}
                </button>
              </div>
            </div>

            {/* TECHNICAL SPECS */}
            <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-white/10 space-y-1 text-[11px] font-mono text-zinc-400">
              <p className="text-zinc-200 font-bold mb-1 font-sans">{t.specsTitle}:</p>
              <p>• {t.specRes}</p>
              <p>• {t.specFps}</p>
              <p>• {t.specEngine}</p>
              <p>• {t.specDuration}</p>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/10 py-6 text-center text-xs text-zinc-500 glass-panel">
        <p>© 2026 Altus Studio Inc. All rights reserved. Driven by AI Veo 3 Spatial Engine.</p>
      </footer>
    </div>
  );
}
