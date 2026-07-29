"use client";

import React, { useState, useEffect, useRef } from "react";

// Translations Dictionary (ES / EN)
const dict = {
  es: {
    promoText: "Lanzamiento — 50 créditos gratis al crear tu cuenta | Ver detalles →",
    navBrand: "Lumen Studio",
    navCanvas: "Studio Canvas",
    navVideo: "Video",
    navImage: "Imagen",
    navTemplates: "Plantillas",
    navPricing: "Precios",
    creditPill: "36/100 créditos",
    signIn: "Iniciar Sesión",
    tryFree: "Probar Gratis",
    badgeAi: "Impulsado por IA de última generación",
    heroTitlePrefix: "Cualquier idea,",
    heroTitleSuffix: "en movimiento",
    heroSubtitle:
      "Transforma listings de Airbnb, Zillow y MLS o fotografías HD en recorridos cinemáticos 4K de calidad hollywoodense en cuestión de segundos.",
    btnStartCanvas: "Empezar Studio Canvas ⚡",
    btnViewDemos: "Explorar Comunidad 🎬",
    trustRow: "340K+ videos generados | 4.9/5 valoración media | 4K hasta 60fps",
    liveIndicator: "Lumen Studio Canvas · Sesión 2 · autoguardado",
    block1Title: "1. Scraper Inteligente de Propiedades",
    urlPlaceholder: "Pega la URL de Airbnb, Zillow o MLS...",
    btnScrape: "Analizar y generar ⚡",
    quickChips: "Prueba rápida:",
    chipToluca: "Villa Toluca (Airbnb)",
    chipSoHo: "Penthouse SoHo (Zillow)",
    chipBariloche: "Rancho Bariloche (MLS)",
    block2Title: "2. Cargador de Fotografía HD",
    uploaderSubtitle: "Arrastra tus fotos de alta resolución o selecciona archivos",
    uploaderFormats: "Soporta JPG, PNG, WEBP, HEIC hasta 25MB por imagen",
    uploaderBrowse: "Examinar archivos",
    loadSamples: "Cargar fotos de muestra",
    block3Title: "3. Panel de Control Cinemático",
    ctrlInterior: "Recorrido interior",
    descInterior: "Navegación fluida por ambientes",
    ctrlDrone: "Dron virtual FP",
    descDrone: "Sobrevuelo de fachada y jardines",
    ctrlLuxury: "Enfoque de lujo",
    descLuxury: "Detalle de acabados y materiales",
    ctrlTwilight: "Atardecer y noche",
    descTwilight: "Transiciones de luz ambiente",
    block4Title: "4. Parámetros de Producción",
    aspectRatio: "Relación de aspecto",
    cameraSpeed: "Velocidad de cámara",
    lighting: "Iluminación y tono",
    resolution: "Resolución final",
    generateBtnText: "Generar recorrido cinemático 4K · 1 crédito",
    pipelineTitle: "Pipeline de Renderizado IA en Tiempo Real",
    stageScraping: "1. Extrayendo imágenes y metadatos",
    stageRender: "2. Sintetizando movimiento 3D (IA Veo 3 Engine)",
    stageFinal: "3. Masterización 4K UHD & Audio Surround",
    completed: "¡Renderizado completado con éxito!",
    viewLogs: "Ver Logs de Consola",
    playerTitle: "Previsualizador 4K & Exportación Studio",
    exportMp4: "Descargar MP4 4K",
    exportReel: "Exportar Reels 9:16",
    communityTitle: "Creado con Lumen",
    communitySubtitle: "Explora recorridos cinemáticos reales creados por la comunidad global",
    filterAll: "Todos",
    filterInterior: "Interior",
    filterAerial: "Aéreo",
    filterLuxury: "Lujo",
    filterTwilight: "Atardecer",
    ctaGridTitle: "50 créditos gratis al registrarte",
    ctaGridDesc: "Crea tus primeros 10 recorridos cinemáticos sin tarjeta requerida.",
    ctaGridBtn: "Empezar gratis ⚡",
    featTitle: "Control cinematográfico total",
    featSub: "Elige movimiento de cámara, ritmo e iluminación como si dirigieras el rodaje, directamente desde el panel de Studio Canvas.",
    feat1Title: "Generación en segundos",
    feat1Desc: "De listing o imagen a video terminado en menos de un minuto, sin renders eternos.",
    feat2Title: "Exporta en cualquier formato",
    feat2Desc: "16:9 para web, 9:16 para redes — un clic y tienes ambos listos para publicar.",
    pricingTitle: "Elige la velocidad y el volumen perfecto para tus proyectos",
    pricingSubtitle: "Planes diseñados para escalar",
    planPopular: "Más popular",
    footerCopy: "© 2026 Lumen AI Studio · Todos los derechos reservados",
    footerSignature: "Hecho con Lumen Motion",
  },
  en: {
    promoText: "Launch Offer — 50 free credits upon account creation | View details →",
    navBrand: "Lumen Studio",
    navCanvas: "Studio Canvas",
    navVideo: "Video",
    navImage: "Image",
    navTemplates: "Templates",
    navPricing: "Pricing",
    creditPill: "36/100 credits",
    signIn: "Sign In",
    tryFree: "Try Free",
    badgeAi: "Powered by Next-Gen AI",
    heroTitlePrefix: "Any idea,",
    heroTitleSuffix: "in motion",
    heroSubtitle: "Transform Airbnb, Zillow, or MLS listings or HD photos into Hollywood-grade 4K cinematic walkthroughs in seconds.",
    btnStartCanvas: "Start Studio Canvas ⚡",
    btnViewDemos: "Explore Community 🎬",
    trustRow: "340K+ generated videos | 4.9/5 rating | 4K up to 60fps",
    liveIndicator: "Lumen Studio Canvas · Session 2 · auto-saved",
    block1Title: "1. Import listing or upload photos",
    urlPlaceholder: "Paste Airbnb, Zillow, or MLS URL...",
    btnScrape: "Analyze and generate ⚡",
    quickChips: "Quick test:",
    chipToluca: "Villa Toluca (Airbnb)",
    chipSoHo: "Penthouse SoHo (Zillow)",
    chipBariloche: "Rancho Bariloche (MLS)",
    block2Title: "2. Or drag & drop high-res photos",
    uploaderSubtitle: "Drag & drop high-res property photos or browse files",
    uploaderFormats: "Supports JPG, PNG, WEBP, HEIC up to 25MB per image",
    uploaderBrowse: "Browse files",
    loadSamples: "Load sample photos",
    block3Title: "3. Choose cinematic control panel",
    ctrlInterior: "Interior walkthrough",
    descInterior: "Smooth room navigation",
    ctrlDrone: "Virtual drone FP",
    descDrone: "Facade and garden flyover",
    ctrlLuxury: "Luxury focus",
    descLuxury: "Finishes and material detail",
    ctrlTwilight: "Sunset & twilight",
    descTwilight: "Ambient light transitions",
    block4Title: "4. Production parameters",
    aspectRatio: "Aspect ratio",
    cameraSpeed: "Camera speed",
    lighting: "Lighting and mood",
    resolution: "Final resolution",
    generateBtnText: "Generate 4K cinematic walkthrough · 1 credit",
    pipelineTitle: "Real-Time AI Rendering Pipeline",
    stageScraping: "1. Scraping images & metadata",
    stageRender: "2. Synthesizing 3D motion (AI Veo 3 Engine)",
    stageFinal: "3. 4K UHD Mastering & Surround Audio",
    completed: "Rendering successfully completed!",
    viewLogs: "View Console Logs",
    playerTitle: "4K Preview & Export Studio",
    exportMp4: "Download MP4 4K",
    exportReel: "Export 9:16 Reels",
    communityTitle: "Created with Lumen",
    communitySubtitle: "Explore real AI walkthroughs created by the global community",
    filterAll: "All",
    filterInterior: "Interior",
    filterAerial: "Aerial",
    filterLuxury: "Luxury",
    filterTwilight: "Twilight",
    ctaGridTitle: "50 free credits upon sign up",
    ctaGridDesc: "Create your first 10 cinematic tours without a credit card.",
    ctaGridBtn: "Get started free ⚡",
    featTitle: "Total cinematic control",
    featSub: "Choose camera movement, pace, and lighting like a movie director, straight from the Studio Canvas.",
    feat1Title: "Generation in seconds",
    feat1Desc: "From listing or photo to finished video in under a minute, no endless rendering times.",
    feat2Title: "Export in any format",
    feat2Desc: "16:9 for web, 9:16 for social — one click and both are ready to publish.",
    pricingTitle: "Choose the perfect speed and volume for your projects",
    pricingSubtitle: "Plans built to scale",
    planPopular: "Most popular",
    footerCopy: "© 2026 Lumen AI Studio · All rights reserved",
    footerSignature: "Made with Lumen Motion",
  },
};

const SAMPLE_PHOTOS = [
  { id: "s1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", name: "Fachada & Piscina Infiniti.jpg" },
  { id: "s2", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", name: "Sala Principal Open Concept.jpg" },
  { id: "s3", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80", name: "Cocina Gourmet Marmol.jpg" },
  { id: "s4", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", name: "Suite Principal Panoramica.jpg" },
  { id: "s5", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", name: "Baño Spa Acabados Oro.jpg" },
  { id: "s6", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", name: "Terraza Vista Mar.jpg" },
];

const COMMUNITY_VIDEOS = [
  {
    id: "g1",
    title: "Villa Bahía — Tulum Coast",
    sub: "Recorrido 4K · 24s",
    category: "interior",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-architectural-design-41007-large.mp4",
    author: "Riviera Luxury RE",
    tag: "Destacado",
    tall: true,
  },
  {
    id: "g2",
    title: "Malibu Offshore Aerial Sweep",
    sub: "Ocean Breeze Studios",
    category: "aereo",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-large-house-with-a-pool-41008-large.mp4",
    author: "Sunset Drone Studio",
    tag: "Aéreo",
    tall: false,
  },
  {
    id: "g3",
    title: "Penthouse 88 — Manhattan Skyline",
    sub: "WK Prime Properties",
    category: "lujo",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-living-room-with-a-modern-fireplace-41006-large.mp4",
    author: "NYC Prime Properties",
    tag: "Lujo",
    tall: false,
  },
  {
    id: "g4",
    title: "Marbella Twilight Elevation",
    sub: "Costa del Sol Estates",
    category: "twilight",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-a-modern-building-41009-large.mp4",
    author: "Costa del Sol Estates",
    tag: "Interior",
    tall: false,
  },
  {
    id: "g5",
    title: "Whitesand Alpine Chalet",
    sub: "Alpine Elite Realty",
    category: "aereo",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-architectural-design-41007-large.mp4",
    author: "Swiss Alps Realty",
    tag: "Aéreo",
    tall: false,
  },
  {
    id: "g6",
    title: "Rockwiler Cliff Horizon",
    sub: "Aegean Brokers",
    category: "twilight",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-large-house-with-a-pool-41008-large.mp4",
    author: "Aegean Brokers",
    tag: "Atardecer",
    tall: false,
  },
];

export default function LumenStudioPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [credits, setCredits] = useState(36);
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
  const [cameraSpeed, setCameraSpeed] = useState("Ritmo Normal");
  const [lighting, setLighting] = useState("Ámbar Cálido");
  const [resolution, setResolution] = useState("4K Ultra HD");

  // Render Pipeline State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState<"idle" | "scraping" | "veo3" | "finalizing" | "completed">("idle");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Gallery Filter State & Modal
  const [galleryFilter, setGalleryFilter] = useState<"todos" | "interior" | "aereo" | "lujo" | "twilight">("todos");
  const [activeModalVideo, setActiveModalVideo] = useState<typeof COMMUNITY_VIDEOS[0] | null>(null);

  // URL Detector
  useEffect(() => {
    const lower = urlInput.toLowerCase();
    if (lower.includes("airbnb.")) setDetectedPlatform("airbnb");
    else if (lower.includes("zillow.")) setDetectedPlatform("zillow");
    else if (lower.includes("mls") || lower.includes("realtor.")) setDetectedPlatform("mls");
    else setDetectedPlatform(null);
  }, [urlInput]);

  const handlePreset = (url: string) => {
    setUrlInput(url);
    if (photos.length === 0) setPhotos(SAMPLE_PHOTOS);
  };

  // Drag & Drop Handlers
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

  // Render Simulation Trigger
  const startGeneration = () => {
    if (credits <= 0) {
      alert("No tienes suficientes créditos. Recarga tus créditos gratis.");
      return;
    }
    setIsRendering(true);
    setRenderProgress(0);
    setRenderStage("scraping");
    setShowVideo(false);
    setConsoleLogs([
      "[00:01] Iniciando Lumen-Engine Veo 3 Spatial Synthesizer...",
      `[00:02] Analizando fuente: ${urlInput || `${photos.length || 6} fotos HD`}`,
      "[00:04] Construyendo malla 3D de profundidad espacial y geometría...",
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setRenderProgress(progress);

      if (progress === 30) {
        setRenderStage("veo3");
        setConsoleLogs((prev) => [
          ...prev,
          "[00:07] Inyectando prompts cinematográficos Veo 3 Spatial Engine...",
          "[00:10] Sintetizando trayectoria fluida de cámara a 60fps...",
        ]);
      } else if (progress === 75) {
        setRenderStage("finalizing");
        setConsoleLogs((prev) => [
          ...prev,
          "[00:15] Aplicando color grading 4K UHD & iluminación dinámicos...",
          "[00:19] Sincronizando audio ambiental multicanal...",
        ]);
      } else if (progress >= 100) {
        clearInterval(interval);
        setRenderStage("completed");
        setIsRendering(false);
        setCredits((prev) => Math.max(0, prev - 1));
        setShowVideo(true);
        setConsoleLogs((prev) => [
          ...prev,
          "[00:23] Renderizado finalizado con éxito (Status 200 OK).",
        ]);
      }
    }, 200);
  };

  const filteredGallery = COMMUNITY_VIDEOS.filter((item) => {
    if (galleryFilter === "todos") return true;
    return item.category === galleryFilter;
  });

  return (
    <div className="min-h-screen bg-[#08070A] text-zinc-100 flex flex-col hero-bg-glow">
      {/* 1. Top Promo Bar */}
      {showPromo && (
        <div className="bg-[#121014] border-b border-[#1C191F] py-2.5 px-4 text-xs font-mono text-center flex items-center justify-center gap-3 relative z-50">
          <span className="text-zinc-300">
            Lanzamiento — <b className="text-[#F5A623]">50 créditos gratis</b> al crear tu cuenta
          </span>
          <a href="#canvas" className="text-zinc-100 hover:text-[#F5A623] underline underline-offset-4 font-semibold transition">
            Ver detalles →
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

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#08070A]/85 border-b border-[#1C191F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5A623] to-[#FF7A45] flex items-center justify-center shadow-lg shadow-[#F5A623]/20">
              <svg className="w-4 h-4 text-[#08070A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="display text-xl font-bold tracking-tight text-white">Lumen</span>
              <span className="text-[9.5px] font-mono font-semibold text-[#F5A623] bg-[#F5A623]/10 border border-[#6B5326] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Studio
              </span>
            </div>
          </div>

          {/* Megamenu Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a href="#canvas" className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition">
              {t.navCanvas}
            </a>

            <div className="nav-item">
              <button className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5">
                {t.navVideo}
                <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="mega">
                <div>
                  <div className="mega-col-title">Funciones</div>
                  <a href="#canvas" className="mega-link">
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                    </div>
                    <div>
                      <div className="mega-link-title">Crear video</div>
                      <div className="mega-link-desc">Genera video con IA desde texto o imagen</div>
                    </div>
                  </a>
                  <a href="#canvas" className="mega-link">
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    </div>
                    <div>
                      <div className="mega-link-title">Studio Canvas <span className="tag-new">Nuevo</span></div>
                      <div className="mega-link-desc">Dirección cinematográfica asistida por IA</div>
                    </div>
                  </a>
                  <a href="#canvas" className="mega-link">
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 3v4a1 1 0 001 1h4M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                      <div className="mega-link-title">Editar video</div>
                      <div className="mega-link-desc">Ajusta escenas, tomas y elementos</div>
                    </div>
                  </a>
                </div>

                <div>
                  <div className="mega-col-title">Modelos</div>
                  <a href="#canvas" className="mega-link">
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6l-6.3 4.4 2.3-7.2-6-4.4h7.6z"/></svg>
                    </div>
                    <div>
                      <div className="mega-link-title">Lumen Motion <span className="tag-new">4K</span></div>
                      <div className="mega-link-desc">4s – 15s · máxima fidelidad</div>
                    </div>
                  </a>
                  <a href="#canvas" className="mega-link">
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                    </div>
                    <div>
                      <div className="mega-link-title">Lumen Motion Fast</div>
                      <div className="mega-link-desc">4s – 15s · generación rápida</div>
                    </div>
                  </a>
                  <a href="#canvas" className="mega-link">
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 18V5l12-2v13M9 9l12-2M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z"/></svg>
                    </div>
                    <div>
                      <div className="mega-link-title">Lumen Voice+Motion</div>
                      <div className="mega-link-desc">Video con audio nativo sincronizado</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <a href="#explore" className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition">
              {t.navImage}
            </a>
            <a href="#explore" className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition">
              {t.navTemplates}
            </a>
            <a href="#pricing" className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition">
              {t.navPricing}
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Credit Pill */}
            <div className="flex items-center gap-2 border border-[#2A262E] bg-[#121014] px-3 py-1.5 rounded-full text-xs text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              <span><b>{credits}</b>/100 créditos</span>
              <button
                onClick={() => setCredits(100)}
                className="text-[11px] font-mono text-zinc-400 hover:text-white underline ml-1"
              >
                Recargar
              </button>
            </div>

            <div className="w-px h-5 bg-[#1C191F]" />

            {/* ES / EN Language Toggle */}
            <div className="flex items-center bg-[#121014] border border-[#2A262E] rounded-full p-1 text-xs font-mono">
              <button
                onClick={() => setLang("es")}
                className={`px-2 py-0.5 rounded-full transition ${
                  lang === "es" ? "bg-[#6C93FF] text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded-full transition ${
                  lang === "en" ? "bg-[#6C93FF] text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition">
                {t.signIn}
              </button>
              <a href="#canvas" className="gold-btn px-4 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5">
                {t.tryFree}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Hero Section with Background Triangles (.hero-deco) */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Floating Translucent Background Triangles */}
        <div className="hero-deco">
          <svg className="hero-deco-1" viewBox="0 0 100 100" fill="none">
            <polygon points="50,10 90,90 10,90" fill="rgba(108, 147, 255, 0.08)" stroke="rgba(108, 147, 255, 0.25)" strokeWidth="1.5" />
          </svg>
          <svg className="hero-deco-2" viewBox="0 0 100 100" fill="none">
            <polygon points="50,10 90,90 10,90" fill="rgba(245, 166, 35, 0.07)" stroke="rgba(245, 166, 35, 0.22)" strokeWidth="1.5" />
          </svg>
          <svg className="hero-deco-3" viewBox="0 0 100 100" fill="none">
            <polygon points="50,10 90,90 10,90" fill="rgba(255, 122, 69, 0.08)" stroke="rgba(255, 122, 69, 0.25)" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Animated Conic Badge */}
          <div className="inline-block">
            <div className="badge-conic px-4 py-2">
              <span className="text-xs font-mono font-medium text-zinc-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-ping" />
                {t.badgeAi}
              </span>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {t.heroTitlePrefix} <span className="gold-blue-gradient">{t.heroTitleSuffix}</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Hero Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#canvas" className="gold-btn px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-2xl flex items-center gap-2">
              {t.btnStartCanvas}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#explore" className="blue-btn px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-2xl flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {t.btnViewDemos}
            </a>
          </div>

          {/* Trust Row Social Proof */}
          <div className="pt-6">
            <div className="inline-flex flex-wrap items-center justify-center gap-8 px-6 py-3 bg-[#121014]/80 border border-[#2A262E] rounded-full text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-2"><strong className="text-white text-base display">340K+</strong> videos generados</span>
              <span className="flex items-center gap-2"><strong className="text-white text-base display">4.9/5</strong> valoración media</span>
              <span className="flex items-center gap-2"><strong className="text-white text-base display">4K</strong> hasta 60fps</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Studio Canvas Bento Panel (#canvas) */}
      <section id="canvas" className="py-12 relative max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="animated-border p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A262E] pb-4">
            <div className="flex items-center gap-2 text-sm font-semibold display">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Lumen Studio Canvas
            </div>
            <span className="text-xs font-mono text-zinc-500">Sesión 2 · autoguardado</span>
          </div>

          {/* Step 1: URL Scraper */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <span className="w-4 h-4 rounded bg-[#221E25] text-zinc-300 flex items-center justify-center text-[10px]">1</span>
              {t.block1Title}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  className="w-full bg-[#1A171D] border border-[#2A262E] focus:border-[#F5A623] rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition"
                />
                {detectedPlatform && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#6C93FF]/20 text-[#6C93FF] border border-[#6C93FF]/40 uppercase">
                    {detectedPlatform}
                  </span>
                )}
              </div>
              <button
                onClick={startGeneration}
                disabled={isRendering}
                className="gold-btn px-6 py-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2"
              >
                {t.btnScrape}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-zinc-500">{t.quickChips}</span>
              <button onClick={() => handlePreset("https://www.airbnb.com/rooms/villa-toluca")} className="text-xs font-mono px-3 py-1 rounded-full bg-[#1A171D] hover:bg-[#221E25] border border-[#1C191F] text-zinc-400 hover:text-white transition">
                {t.chipToluca}
              </button>
              <button onClick={() => handlePreset("https://www.zillow.com/homedetails/penthouse-soho")} className="text-xs font-mono px-3 py-1 rounded-full bg-[#1A171D] hover:bg-[#221E25] border border-[#1C191F] text-zinc-400 hover:text-white transition">
                {t.chipSoHo}
              </button>
              <button onClick={() => handlePreset("https://www.mls.com/listings/rancho-bariloche")} className="text-xs font-mono px-3 py-1 rounded-full bg-[#1A171D] hover:bg-[#221E25] border border-[#1C191F] text-zinc-400 hover:text-white transition">
                {t.chipBariloche}
              </button>
            </div>
          </div>

          {/* Step 2: Drag & Drop Photo Uploader */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <span className="w-4 h-4 rounded bg-[#221E25] text-zinc-300 flex items-center justify-center text-[10px]">2</span>
              {t.block2Title}
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`dropzone p-8 text-center flex flex-col items-center justify-center gap-3 ${
                isDragging ? "drag-active" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#221E25] border border-[#2A262E] flex items-center justify-center text-xl text-[#F5A623]">
                📸
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{t.uploaderSubtitle}</h4>
                <p className="text-xs text-zinc-500 mt-1">{t.uploaderFormats}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
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
                  className="px-4 py-2 rounded-lg bg-[#1A171D] hover:bg-[#221E25] text-xs font-medium text-zinc-300 border border-[#2A262E] transition"
                >
                  {t.uploaderBrowse}
                </button>
                <button
                  onClick={() => setPhotos(SAMPLE_PHOTOS)}
                  className="gold-btn px-4 py-2 rounded-lg text-xs font-semibold transition"
                >
                  {t.loadSamples}
                </button>
              </div>
            </div>

            {/* Uploaded Thumbnails Grid */}
            {photos.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>📸 <strong>{photos.length}</strong> fotos preparadas</span>
                  <button onClick={() => setPhotos([])} className="text-rose-400 hover:underline">Limpiar</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {photos.map((p) => (
                    <div key={p.id} className="relative group aspect-video rounded-lg overflow-hidden border border-[#2A262E] bg-[#121014]">
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <button
                        onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Cinematic Control Tiles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <span className="w-4 h-4 rounded bg-[#221E25] text-zinc-300 flex items-center justify-center text-[10px]">3</span>
              {t.block3Title}
            </div>

            <div className="ctrl-grid">
              {[
                { id: "recorrido", title: t.ctrlInterior, desc: t.descInterior, icon: "🏰" },
                { id: "dron", title: t.ctrlDrone, desc: t.descDrone, icon: "🛸" },
                { id: "enfoque", title: t.ctrlLuxury, desc: t.descLuxury, icon: "💎" },
                { id: "twilight", title: t.ctrlTwilight, desc: t.descTwilight, icon: "🌅" },
              ].map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id as any)}
                  className={`ctrl-tile ${selectedStyle === st.id ? "active" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{st.icon}</span>
                    {selectedStyle === st.id && (
                      <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                    )}
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-white">{st.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-normal">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Production Parameters */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <span className="w-4 h-4 rounded bg-[#221E25] text-zinc-300 flex items-center justify-center text-[10px]">4</span>
              {t.block4Title}
            </div>

            <div className="param-grid">
              <div className="bg-[#1A171D] border border-[#1C191F] rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">{t.aspectRatio}</span>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="16:9" className="bg-[#121014]">16:9 (Horizontal 4K)</option>
                  <option value="9:16" className="bg-[#121014]">9:16 (Reels Vertical)</option>
                  <option value="1:1" className="bg-[#121014]">1:1 (Cuadrado)</option>
                </select>
              </div>

              <div className="bg-[#1A171D] border border-[#1C191F] rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">{t.cameraSpeed}</span>
                <select
                  value={cameraSpeed}
                  onChange={(e) => setCameraSpeed(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="Ritmo Lento" className="bg-[#121014]">Ritmo Lento (Cinemático)</option>
                  <option value="Ritmo Normal" className="bg-[#121014]">Ritmo Normal</option>
                  <option value="Dinámico" className="bg-[#121014]">Dinámico FP</option>
                </select>
              </div>

              <div className="bg-[#1A171D] border border-[#1C191F] rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">{t.lighting}</span>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="Ámbar Cálido" className="bg-[#121014]">Ámbar Cálido</option>
                  <option value="Luz Natural Sol" className="bg-[#121014]">Luz Natural Sol</option>
                  <option value="Atardecer Dorado" className="bg-[#121014]">Atardecer Dorado</option>
                </select>
              </div>

              <div className="bg-[#1A171D] border border-[#1C191F] rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">{t.resolution}</span>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-[#F5A623] focus:outline-none cursor-pointer"
                >
                  <option value="4K Ultra HD" className="bg-[#121014]">4K Ultra HD (60fps)</option>
                  <option value="1080p Full HD" className="bg-[#121014]">1080p Full HD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Full-Width Generate Button */}
          <div className="pt-2">
            <button
              onClick={startGeneration}
              disabled={isRendering}
              className="generate-btn text-sm font-bold display"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h7v8l10-12h-7V2z" />
              </svg>
              <span>{isRendering ? "Procesando Veo 3 Engine..." : t.generateBtnText}</span>
            </button>
          </div>

          {/* Render Pipeline Console */}
          {(isRendering || renderStage === "completed") && (
            <div className="bg-[#1A171D] border border-[#2A262E] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-ping" />
                  {t.pipelineTitle}
                </h4>
                <span className="text-xs font-mono font-bold text-[#F5A623]">{renderProgress}%</span>
              </div>

              <div className="w-full h-2 bg-[#08070A] rounded-full overflow-hidden p-0.5 border border-[#1C191F]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6C93FF] via-[#F5A623] to-[#FF7A45] transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                <div className={renderProgress >= 30 ? "text-emerald-400 font-semibold" : "text-zinc-500"}>
                  {renderProgress >= 30 ? "✓" : "⏳"} {t.stageScraping}
                </div>
                <div className={renderProgress >= 75 ? "text-emerald-400 font-semibold" : renderProgress >= 30 ? "text-[#6C93FF] font-semibold" : "text-zinc-500"}>
                  {renderProgress >= 75 ? "✓" : renderProgress >= 30 ? "⚡" : "⏳"} {t.stageRender}
                </div>
                <div className={renderProgress >= 100 ? "text-emerald-400 font-semibold" : renderProgress >= 75 ? "text-[#FF7A45] font-semibold" : "text-zinc-500"}>
                  {renderProgress >= 100 ? "✓" : "⏳"} {t.stageFinal}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C191F]">
                <button onClick={() => setShowLogs(!showLogs)} className="text-xs font-mono text-[#6C93FF] hover:underline">
                  {showLogs ? "Ocultar Console Logs" : t.viewLogs} ({consoleLogs.length})
                </button>
                {showLogs && (
                  <div className="mt-2 p-3 bg-[#08070A] rounded-lg font-mono text-[11px] text-zinc-400 space-y-1 max-h-36 overflow-y-auto">
                    {consoleLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Player Studio */}
          {showVideo && (
            <div className="bg-[#1A171D] border border-white/10 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📹</span> {t.playerTitle}
                </h4>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  STATUS 200 OK
                </span>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2A262E]">
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
                  download="Lumen_Walkthrough_4K.mp4"
                  className="gold-btn flex-1 py-3 px-4 rounded-xl text-xs font-bold text-center"
                >
                  ⬇️ {t.exportMp4}
                </a>
                <a
                  href="https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-architectural-design-41007-large.mp4"
                  download="Lumen_Reel_916.mp4"
                  className="blue-btn flex-1 py-3 px-4 rounded-xl text-xs font-bold text-center"
                >
                  📱 {t.exportReel}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Community Bento Grid (#explore) */}
      <section id="explore" className="py-16 border-t border-[#1C191F] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[#F5A623] uppercase tracking-widest mb-1">En la comunidad</div>
            <h2 className="display text-3xl font-bold text-white">{t.communityTitle}</h2>
          </div>

          <div className="segmented">
            <button onClick={() => setGalleryFilter("todos")} className={`segmented-item ${galleryFilter === "todos" ? "active" : ""}`}>
              {t.filterAll}
            </button>
            <button onClick={() => setGalleryFilter("interior")} className={`segmented-item ${galleryFilter === "interior" ? "active" : ""}`}>
              {t.filterInterior}
            </button>
            <button onClick={() => setGalleryFilter("aereo")} className={`segmented-item ${galleryFilter === "aereo" ? "active" : ""}`}>
              {t.filterAerial}
            </button>
            <button onClick={() => setGalleryFilter("lujo")} className={`segmented-item ${galleryFilter === "lujo" ? "active" : ""}`}>
              {t.filterLuxury}
            </button>
            <button onClick={() => setGalleryFilter("twilight")} className={`segmented-item ${galleryFilter === "twilight" ? "active" : ""}`}>
              {t.filterTwilight}
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalVideo(item)}
              className={`vcard group cursor-pointer ${item.tall ? "tall" : ""}`}
            >
              <div className={`vmedia ${item.tall ? "aspect-auto min-h-[380px] h-full" : "aspect-video"}`}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-2.5 left-2.5 z-20 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#08070A]/70 border border-white/10 text-white">
                  {item.tag}
                </span>

                <div className="hover-layer">
                  <div className="vplay">
                    <svg className="w-5 h-5 ml-0.5 text-[#08070A]" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-3.5 space-y-0.5">
                <h4 className="text-sm font-bold text-white display">{item.title}</h4>
                <p className="text-xs text-zinc-500 font-mono">{item.sub}</p>
              </div>
            </div>
          ))}

          {/* Embedded CTA Grid Card */}
          <div className="grid-cta col-span-1 sm:col-span-2 space-y-3 text-left items-start">
            <h3 className="display text-lg font-bold text-white">{t.ctaGridTitle}</h3>
            <p className="text-xs text-zinc-400">{t.ctaGridDesc}</p>
            <a href="#canvas" className="gold-btn px-5 py-2.5 rounded-lg text-xs font-bold">
              {t.ctaGridBtn}
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal Popup */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#121014] border border-[#2A262E] rounded-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="display text-lg font-bold text-white">{activeModalVideo.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">{activeModalVideo.author}</p>
              </div>
              <button
                onClick={() => setActiveModalVideo(null)}
                className="w-8 h-8 rounded-full bg-[#1A171D] text-white flex items-center justify-center text-lg hover:bg-white/20"
              >
                ×
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2A262E]">
              <video src={activeModalVideo.video} controls autoPlay loop className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* 6. Features Bento Section */}
      <section className="py-16 border-t border-[#1C191F] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#F5A623] uppercase tracking-widest">Por qué Lumen</div>
          <h2 className="display text-3xl font-bold text-white">Todo lo que necesitas para producir video</h2>
        </div>

        <div className="feat-bento">
          <div className="feat-main flex flex-col justify-end min-h-[260px]">
            <div className="w-10 h-10 rounded-xl bg-[#1A171D] border border-[#2A262E] flex items-center justify-center text-[#F5A623] mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
            <h3 className="display text-lg font-bold text-white mb-2">{t.featTitle}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">{t.featSub}</p>
          </div>

          <div className="feat-stack">
            <div className="feat-card space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A171D] border border-[#2A262E] flex items-center justify-center text-[#F5A623]">
                ⚡
              </div>
              <h3 className="display text-sm font-bold text-white">{t.feat1Title}</h3>
              <p className="text-xs text-zinc-400">{t.feat1Desc}</p>
            </div>

            <div className="feat-card space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A171D] border border-[#2A262E] flex items-center justify-center text-[#F5A623]">
                📐
              </div>
              <h3 className="display text-sm font-bold text-white">{t.feat2Title}</h3>
              <p className="text-xs text-zinc-400">{t.feat2Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Bento Grid (#pricing) */}
      <section id="pricing" className="py-16 border-t border-[#1C191F] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-[#F5A623] uppercase tracking-widest">{t.pricingSubtitle}</div>
          <h2 className="display text-3xl font-bold text-white">{t.pricingTitle}</h2>
        </div>

        <div className="pricing-grid">
          {/* Starter */}
          <div className="bg-[#121014] border border-[#1C191F] rounded-2xl p-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">STARTER</span>
              <div className="display text-4xl font-bold text-white">$49<span className="text-sm font-normal text-zinc-500">/mes</span></div>
              <p className="text-xs text-zinc-400">Para agentes independientes que arrancan.</p>
              <ul className="space-y-2.5 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">✓ 50 videos al mes</li>
                <li className="flex items-center gap-2">✓ Resolución 1080p y 4K</li>
                <li className="flex items-center gap-2">✓ Exporta en 9:16 y 16:9</li>
                <li className="flex items-center gap-2 text-zinc-600">✗ Marca de agua removible</li>
              </ul>
            </div>
            <a href="#canvas" className="block text-center py-3 rounded-xl bg-[#1A171D] hover:bg-[#221E25] border border-[#2A262E] text-xs font-bold text-white transition">
              Suscribirse
            </a>
          </div>

          {/* Pro (Popular) */}
          <div className="animated-border-gold p-7 space-y-6 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#F5A623] to-[#FF7A45] text-[#08070A] text-[10px] font-mono font-bold uppercase tracking-wider">
              {t.planPopular}
            </span>
            <div className="space-y-4 pt-2">
              <span className="text-xs font-mono text-[#F5A623] uppercase tracking-widest">PRO VEO 3</span>
              <div className="display text-4xl font-bold text-white">$149<span className="text-sm font-normal text-zinc-500">/mes</span></div>
              <p className="text-xs text-zinc-400">Para agencias con volumen y marketing activo.</p>
              <ul className="space-y-2.5 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">✓ 200 videos al mes</li>
                <li className="flex items-center gap-2">✓ Resolución 4K sin marca de agua</li>
                <li className="flex items-center gap-2">✓ Estudio Canvas completo</li>
                <li className="flex items-center gap-2">✓ Soporte prioritario</li>
              </ul>
            </div>
            <a href="#canvas" className="gold-btn block text-center py-3.5 rounded-xl text-xs font-bold">
              Comenzar Pro ⚡
            </a>
          </div>

          {/* Enterprise */}
          <div className="bg-[#121014] border border-[#1C191F] rounded-2xl p-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#6C93FF] uppercase tracking-widest">ENTERPRISE</span>
              <div className="display text-4xl font-bold text-white">$299<span className="text-sm font-normal text-zinc-500">/mes</span></div>
              <p className="text-xs text-zinc-400">Para constructoras e inmobiliarias a gran escala.</p>
              <ul className="space-y-2.5 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">✓ Videos ilimitados</li>
                <li className="flex items-center gap-2">✓ API y renderizado prioritario</li>
                <li className="flex items-center gap-2">✓ Soporte dedicado 24/7</li>
                <li className="flex items-center gap-2">✓ Licencia comercial ampliada</li>
              </ul>
            </div>
            <a href="#canvas" className="blue-btn block text-center py-3 rounded-xl text-xs font-bold">
              Contactar ventas
            </a>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-[#1C191F] py-8 bg-[#08070A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>{t.footerCopy}</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-300">Términos</a>
            <a href="#" className="hover:text-zinc-300">Privacidad</a>
            <a href="#" className="hover:text-zinc-300">API</a>
          </div>
          <div>{t.footerSignature}</div>
        </div>
      </footer>
    </div>
  );
}
