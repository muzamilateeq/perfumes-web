"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  PenTool, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  Droplet, 
  ChevronRight, 
  SlidersHorizontal,
  Compass,
  Award,
  Sparkle,
  Type,
  Trash2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { PerfumeItem, PERFUMES_DATA } from "@/lib/perfumes";
import { useStore } from "@/context/StoreContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface SignatureScentClientProps {
  initialProducts?: PerfumeItem[];
}

type InkColor = "#C5A880" | "#18181B"; // Imperial Gold vs Midnight Onyx
type InputMode = "draw" | "type";

interface PersonalityReading {
  title: string;
  analysis: string;
  notesHarmonized: string;
  matchedSlug: string;
  matchScore: number;
}

const PERSONALITY_READINGS: Record<string, PersonalityReading> = {
  "oud-royale": {
    title: "The Sovereign • Commanding & Regal",
    analysis: "Your signature reveals firm, sweeping strokes with assertive terminal flourishes. In olfactory graphology, this denotes innate authority, unhurried confidence, and a deep appreciation for classical luxury. You do not shout for attention; your presence commands the room through an aura of magnetic warmth.",
    notesHarmonized: "Aged Cambodian Agarwood, Black Cardamom & Bourbon Vanilla",
    matchedSlug: "oud-royale",
    matchScore: 98,
  },
  "velvet-rose": {
    title: "The Aristocratic Romantic • Velvet & Magnetic",
    analysis: "Your calligraphic curves display delicate loop density paired with graceful ascenders. This reveals an intimate aesthetic sensibility, emotional intelligence, and an affinity for timeless beauty that lingers. Your aura calls for dark, moody florals that evolve as evening deepens.",
    notesHarmonized: "French May Rose Absolute, Frozen Blackcurrant & Earthy Patchouli",
    matchedSlug: "velvet-rose",
    matchScore: 97,
  },
  "midnight-citrus": {
    title: "The Executive Visionary • Crisp & Dynamic",
    analysis: "Your stroke velocity is swift, precise, and sharply delineated. This handwriting structure signals clear intellect, high discernment, and an energized modern elegance. You thrive on vibrant, high-projection freshness that maintains composure through demanding days.",
    notesHarmonized: "Calabrian Bergamot, Italian Neroli & Smoky Haitian Vetiver",
    matchedSlug: "midnight-citrus",
    matchScore: 99,
  },
  "santal-supreme": {
    title: "The Quiet Connoisseur • Pure Quiet Luxury",
    analysis: "Your signature carries balanced spacing, steady pen pressure, and understated symmetry. This indicates a connoisseur who rejects ostentation in favor of tactile perfection, bespoke tailoring, and unshakeable inner peace. You are drawn to creaminess, cashmere, and supple suede.",
    notesHarmonized: "Australian Sandalwood, Tuscan Suede & Florentine Iris",
    matchedSlug: "santal-supreme",
    matchScore: 98,
  },
  "vanilla-whisper": {
    title: "The Warm Enchanter • Intimate & Sensual",
    analysis: "Your signature features soft rounded baseline bowls with warm, inviting rhythm. Graphologically, this signifies warmth, approachable charisma, and a natural sensuality. You harmonize with smoky bourbon vanilla and roasted cacao pods that feel like a golden velvet embrace.",
    notesHarmonized: "Organic Bourbon Vanilla Pod, Roasted Tonka & Almond Heliotrope",
    matchedSlug: "vanilla-whisper",
    matchScore: 96,
  },
  "aqua-celestia": {
    title: "The Free Spirit • Oceanic & Infinite",
    analysis: "Your penmanship has expansive upward lift and generous breathing room between letters. This denotes a love for open skies, travel, and untamed natural vitality. Your spirit harmonizes with crystalline oceanic spray, sun-drenched driftwood, and bracing coastal sage.",
    notesHarmonized: "Oceanic Saline Mist, Coastal Blue Sage & Kaffir Lime",
    matchedSlug: "aqua-celestia",
    matchScore: 97,
  },
};

export default function SignatureScentClient({ initialProducts = PERFUMES_DATA }: SignatureScentClientProps) {
  const store = useStore();
  const products = initialProducts.length > 0 ? initialProducts : PERFUMES_DATA;

  // Signature Canvas & Input States
  const [inputMode, setInputMode] = useState<InputMode>("draw");
  const [typedName, setTypedName] = useState<string>("");
  const [typedFontFamily, setTypedFontFamily] = useState<string>("cursive");
  const [inkColor, setInkColor] = useState<InkColor>("#C5A880");
  const [penTipSize, setPenTipSize] = useState<number>(3);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Preference Preferences (Fine-tuning)
  const [selectedVibe, setSelectedVibe] = useState<string>("oud");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("evening");

  // Analysis Scanning States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);
  const [matchedPerfume, setMatchedPerfume] = useState<PerfumeItem | null>(null);
  const [personalityResult, setPersonalityResult] = useState<PersonalityReading | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const undoStackRef = useRef<ImageData[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const analysisSteps = [
    "Digitizing calligraphic stroke curvature and vector velocity...",
    "Evaluating pen pressure & flourish balance: Aristocratic confidence detected...",
    "Synthesizing olfactory notes pyramid with Aura Private Reserve...",
    "Stamping Official Gold Wax Seal and generating Bespoke Certificate..."
  ];

  // Canvas Initialization & DPI Handling
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penTipSize;

    // Save blank state for undo
    try {
      undoStackRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    } catch {}
  }, [inkColor, penTipSize]);

  useEffect(() => {
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [initCanvas]);

  // Update stroke style when ink or pen tip changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = penTipSize;
    }
  }, [inkColor, penTipSize]);

  // Mouse & Touch Coordinates Helper
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (inputMode !== "draw") return;
    const coords = getCanvasCoordinates(e);
    isDrawingRef.current = true;
    lastPointRef.current = coords;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || inputMode !== "draw") return;

    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPointRef.current) return;

    // Smooth quadratic curve interpolation
    const midX = (lastPointRef.current.x + coords.x) / 2;
    const midY = (lastPointRef.current.y + coords.y) / 2;

    ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
    ctx.stroke();

    lastPointRef.current = coords;
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Push new state to undo stack
    try {
      if (undoStackRef.current.length > 20) {
        undoStackRef.current.shift();
      }
      undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } catch {}
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undoStackRef.current = [];
    setHasDrawn(false);
    setSignatureDataUrl(null);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length <= 1) {
      clearCanvas();
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    undoStackRef.current.pop(); // Remove current
    const previous = undoStackRef.current[undoStackRef.current.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
  };

  // Convert typed name into canvas signature when typing mode is active
  const renderTypedSignatureOnCanvas = (name: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!name.trim()) {
      setHasDrawn(false);
      return;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = inkColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calligraphy font sizing based on length
    const fontSize = name.length > 15 ? 32 : name.length > 8 ? 44 : 54;
    ctx.font = `italic 300 ${fontSize}px "Playfair Display", "Baskerville", "Brush Script MT", cursive`;

    ctx.fillText(name, rect.width / 2, rect.height / 2);

    // Decorative flourishing underline
    ctx.beginPath();
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 1.5;
    const startX = rect.width / 2 - (name.length * fontSize * 0.22);
    const endX = rect.width / 2 + (name.length * fontSize * 0.22);
    const y = rect.height / 2 + fontSize * 0.45;

    ctx.moveTo(startX, y);
    ctx.quadraticCurveTo(rect.width / 2, y + 10, endX, y);
    ctx.stroke();

    ctx.restore();
    setHasDrawn(true);
  };

  // Run the AI Olfactory Scribe Analysis
  const handleStartAnalysis = () => {
    const canvas = canvasRef.current;
    if (!canvas || (!hasDrawn && !typedName.trim())) {
      alert("Please sign your name or type your moniker on the digital parchment first.");
      return;
    }

    // Capture signature image
    const dataUrl = canvas.toDataURL("image/png");
    setSignatureDataUrl(dataUrl);

    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    // Step progression timers
    const timer1 = setTimeout(() => setAnalysisStepIndex(1), 700);
    const timer2 = setTimeout(() => setAnalysisStepIndex(2), 1500);
    const timer3 = setTimeout(() => setAnalysisStepIndex(3), 2300);

    const timer4 = setTimeout(() => {
      // Determine best match based on vibe selection & calligraphic input
      let targetSlug = "oud-royale";

      if (selectedVibe === "rose") targetSlug = "velvet-rose";
      else if (selectedVibe === "citrus") targetSlug = "midnight-citrus";
      else if (selectedVibe === "santal") targetSlug = "santal-supreme";
      else if (selectedVibe === "vanilla") targetSlug = "vanilla-whisper";
      else if (selectedVibe === "marine") targetSlug = "aqua-celestia";
      else targetSlug = "oud-royale";

      // Match product
      const foundProduct = products.find((p) => p.slug === targetSlug) || products[0];
      const reading = PERSONALITY_READINGS[targetSlug] || PERSONALITY_READINGS["oud-royale"];

      setMatchedPerfume(foundProduct);
      setPersonalityResult(reading);
      setIsAnalyzing(false);

      // Scroll smoothly to results
      setTimeout(() => {
        const resultEl = document.getElementById("certificateResultSection");
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleReset = () => {
    setMatchedPerfume(null);
    setPersonalityResult(null);
    setSignatureDataUrl(null);
    setTypedName("");
    clearCanvas();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build WhatsApp URL for Bespoke Bottle Engraved Order
  const whatsappEngravedOrderUrl = matchedPerfume
    ? buildWhatsAppUrl(
        `Salam Aura Haute Parfumerie! ✨\n\nI just used your *AI Signature Scent Matcher* on your website and was harmonized with:\n\n👑 *Flacon:* ${matchedPerfume.name} (${matchedPerfume.concentration})\n💎 *Match Affinity:* ${personalityResult?.matchScore || 98}%\n💰 *Price:* ${matchedPerfume.price}\n\n🖋️ *Custom Signature Engraving:* I would like to order this flacon with my handwritten signature/name engraved in gold on the bottle glass or cap. Please advise on shipping details to my address!`
      )
    : "#";

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-zinc-900 selection:bg-zinc-950 selection:text-white">
      {/* Header */}
      <SiteHeader cartCount={store.cartCount} onOpenCart={store.openCart} />

      {/* Breadcrumb Navigation */}
      <nav className="border-b border-zinc-200 bg-white/70 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest font-medium overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-zinc-900 transition-colors shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[#8C7355] font-bold truncate shrink-0">AI Signature Scent Scribe</span>
        </div>
      </nav>

      {/* Main Experience Hero */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/15 border border-[#C5A880]/40 rounded-full text-[#8C7355] text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            The Bespoke Olfactory Atelier
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-zinc-950 leading-tight">
            Find Your Scent Through Your Signature
          </h1>

          <p className="text-zinc-600 font-light text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            In haute French perfumery, calligraphic strokes, loop curvature, and pen pressure reflect a client&apos;s emotional resonance. Sign your name or draw your personal monogram below to let our AI Olfactory Scribe reveal your soulmate flacon.
          </p>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE WORKSPACE (CANVAS + PERSONA TUNING)                */}
        {/* ============================================================== */}
        {!matchedPerfume && (
          <div className="bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden p-5 sm:p-8 md:p-10 space-y-8">
            
            {/* Top Mode Bar & Ink Customization */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Input Mode:
                </span>
                <div className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode("draw");
                      setTimeout(initCanvas, 50);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                      inputMode === "draw"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Handwritten Draw</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("type")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                      inputMode === "type"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Type Monogram</span>
                  </button>
                </div>
              </div>

              {/* Ink & Pen Selector */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hidden sm:inline">
                  Artisanal Ink:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInkColor("#C5A880")}
                    className={`w-7 h-7 rounded-full bg-[#C5A880] border-2 transition-all flex items-center justify-center shadow-xs ${
                      inkColor === "#C5A880" ? "border-zinc-950 scale-110 ring-2 ring-[#C5A880]/40" : "border-white"
                    }`}
                    title="Imperial Liquid Gold"
                  >
                    {inkColor === "#C5A880" && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInkColor("#18181B")}
                    className={`w-7 h-7 rounded-full bg-zinc-950 border-2 transition-all flex items-center justify-center shadow-xs ${
                      inkColor === "#18181B" ? "border-zinc-950 scale-110 ring-2 ring-zinc-400" : "border-white"
                    }`}
                    title="Midnight Onyx"
                  >
                    {inkColor === "#18181B" && <Check className="w-3 h-3 text-white" />}
                  </button>
                </div>

                <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

                {inputMode === "draw" && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleUndo}
                      className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
                      title="Undo Stroke"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Clear Digital Parchment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Type Mode Input (If Active) */}
            {inputMode === "type" && (
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 animate-in fade-in">
                <label className="block text-xs font-bold tracking-widest uppercase text-zinc-700">
                  Type Your Name or Royal Monogram
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => {
                      setTypedName(e.target.value);
                      renderTypedSignatureOnCanvas(e.target.value);
                    }}
                    placeholder="e.g. M. Ateeq or H. Al-Mansoor"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-zinc-200 text-sm font-serif text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => renderTypedSignatureOnCanvas(typedName)}
                    className="px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                  >
                    Generate Cursive
                  </button>
                </div>
              </div>
            )}

            {/* DIGITAL PARCHMENT CANVAS */}
            <div className="relative">
              <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] rounded-xl border-2 border-dashed border-[#C5A880]/50 bg-gradient-to-b from-[#FDFBF7] to-[#F7F4EB] shadow-inner overflow-hidden cursor-crosshair">
                
                {/* Background Luxury Guilloché / Watermark Pattern */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                  <span className="font-serif text-8xl sm:text-9xl font-light uppercase tracking-[0.4em]">AURA</span>
                </div>

                {/* Parchment Prompt Placeholder (Disappears once drawing begins) */}
                {!hasDrawn && !typedName && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-zinc-400 p-4 text-center select-none">
                    <PenTool className="w-8 h-8 text-[#C5A880]/60 mb-2 animate-bounce" />
                    <p className="font-serif italic text-base sm:text-lg text-zinc-500">
                      Sign your signature here with finger or mouse...
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1 font-sans font-bold">
                      Digital Archival Parchment • Touch & Stylus Supported
                    </span>
                  </div>
                )}

                {/* HTML5 Canvas Element */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ touchAction: "none" }}
                  className="w-full h-full block"
                />

                {/* Watermark Seal in Bottom Corner */}
                <div className="absolute bottom-3 right-3 pointer-events-none select-none flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#8C7355]/60 font-mono">
                  <span>Aura Scribe Atelier</span>
                  <span>•</span>
                  <span>Extrait 32%</span>
                </div>
              </div>
            </div>

            {/* OLFACTORY PERSONA TUNING (2 Intuitive Questions) */}
            <div className="pt-2 border-t border-zinc-200 space-y-6">
              
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-zinc-800 mb-3 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>1. Choose Your Preferred Soulmate Accord:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {[
                    { id: "oud", label: "Regal Oud & Amber", icon: "👑" },
                    { id: "rose", label: "Velvet Rose & Musk", icon: "🌹" },
                    { id: "citrus", label: "Crisp Bergamot", icon: "🍋" },
                    { id: "santal", label: "Quiet Luxury Santal", icon: "🪵" },
                    { id: "vanilla", label: "Warm Tonka Vanilla", icon: "🍦" },
                    { id: "marine", label: "Oceanic Saline Mist", icon: "🌊" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedVibe(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        selectedVibe === item.id
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-[#C5A880]/30"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-zinc-800 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>2. When will this fragrance be experienced?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "daily", title: "Daily Executive & Boardroom", desc: "Fresh, sophisticated & clean projection" },
                    { id: "evening", title: "Evening Galas & Black-Tie", desc: "Monumental, opulent 18+ hour sillage" },
                    { id: "intimate", title: "Romantic Dinners & Date Nights", desc: "Velvety, magnetic & whispering aura" },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedOccasion === occ.id
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-[#C5A880]/30"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      <p className="text-xs font-bold">{occ.title}</p>
                      <p className={`text-[11px] mt-0.5 ${selectedOccasion === occ.id ? "text-zinc-300" : "text-zinc-500"}`}>
                        {occ.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ACTION BUTTON TO ANALYZE */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!hasDrawn && !typedName.trim()}
                className="w-full py-4 sm:py-5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-bold tracking-[0.22em] uppercase transition-all shadow-xl flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C5A880] group-hover:rotate-12 transition-transform" />
                <span>Analyze My Signature & Reveal Flacon Match</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-zinc-500 mt-2 font-mono">
                100% Free Bespoke Analysis • Includes Option for Name Engraving on Flacon
              </p>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* SCANNING / ANALYSIS MODAL SCREEN                               */}
        {/* ============================================================== */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 text-white text-center"
            >
              <div className="max-w-md w-full p-8 bg-zinc-900 border border-[#C5A880]/50 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
                
                {/* Glowing Radar Sweep */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-[#C5A880]/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-[#C5A880]/40 animate-pulse" />
                  <PenTool className="w-8 h-8 text-[#C5A880] animate-bounce" />
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A880] block mb-1">
                    Haute Olfactory Scribe
                  </span>
                  <h3 className="font-serif text-2xl font-light">Decoding Calligraphic Aura...</h3>
                </div>

                {/* Dynamic Step Ticker */}
                <div className="p-3 bg-black/40 border border-zinc-800 rounded-lg min-h-[55px] flex items-center justify-center">
                  <p className="text-xs font-mono text-zinc-300 animate-in fade-in duration-300">
                    {analysisSteps[analysisStepIndex]}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#9E8255] via-[#C5A880] to-[#E5D2BA]"
                    initial={{ width: "10%" }}
                    animate={{ width: `${(analysisStepIndex + 1) * 25}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* REVEAL: BESPOKE SCENT CERTIFICATE & COMPATIBILITY FLACON       */}
        {/* ============================================================== */}
        {matchedPerfume && personalityResult && (
          <motion.div
            id="certificateResultSection"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Top Certificate Header Banner */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-widest">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Olfactory Analysis Complete • Certificate #{Math.floor(100000 + Math.random() * 900000)}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950">
                Your Bespoke Scent Alignment
              </h2>
            </div>

            {/* PARCHMENT CERTIFICATE CARD */}
            <div className="relative max-w-4xl mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE1] border-4 border-[#C5A880] rounded-2xl shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden">
              
              {/* Ornate Corner Accents */}
              <div className="absolute top-3 left-3 text-[#C5A880] text-xl select-none">❖</div>
              <div className="absolute top-3 right-3 text-[#C5A880] text-xl select-none">❖</div>
              <div className="absolute bottom-3 left-3 text-[#C5A880] text-xl select-none">❖</div>
              <div className="absolute bottom-3 right-3 text-[#C5A880] text-xl select-none">❖</div>

              {/* Certificate Inner Frame */}
              <div className="border border-[#C5A880]/50 rounded-xl p-4 sm:p-8 space-y-8">
                
                {/* Certificate Heading */}
                <div className="text-center space-y-1 pb-4 border-b border-[#C5A880]/30">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8C7355] block">
                    Aura Haute Parfumerie • Private Atelier
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-widest text-zinc-950">
                    Certificate of Olfactory Alignment
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Conferred by Master Scent Scribe on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* SIGNATURE MOUNT & OFFICIAL WAX SEAL */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Handwritten Signature Display */}
                  <div className="md:col-span-8 bg-white/90 border border-[#C5A880]/40 rounded-xl p-4 sm:p-6 shadow-xs relative">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 block mb-2 font-mono">
                      Analyzed Calligraphic Specimen
                    </span>
                    <div className="h-28 sm:h-32 flex items-center justify-center overflow-hidden">
                      {signatureDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={signatureDataUrl}
                          alt="Analyzed Signature"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="font-serif italic text-2xl text-[#C5A880]">
                          {typedName}
                        </span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Stroke Dynamics: High Harmony</span>
                      <span>Pressure: 32% Oil Affinity</span>
                    </div>
                  </div>

                  {/* Right: Golden Wax Seal Stamp */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#8C7355] via-[#C5A880] to-[#E9DCC9] shadow-xl border-4 border-[#FAF6ED] flex flex-col items-center justify-center text-zinc-950 select-none group hover:rotate-6 transition-transform">
                      <div className="absolute inset-1 rounded-full border border-zinc-950/20" />
                      <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest">AURA</span>
                      <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-zinc-900 mt-0.5">
                        OFFICIAL SEAL
                      </span>
                      <span className="text-[8px] font-mono font-bold mt-1 bg-zinc-950/15 px-2 py-0.5 rounded-full">
                        {personalityResult.matchScore}% MATCH
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7355] mt-2">
                      Certified Authentic
                    </span>
                  </div>

                </div>

                {/* GRAPHOLOGY READING & OLFACTORY PYRAMID */}
                <div className="space-y-4 pt-4 border-t border-[#C5A880]/30">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7355] block">
                      Persona Deciphered
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-light text-zinc-950 mt-0.5">
                      {personalityResult.title}
                    </h4>
                  </div>

                  <p className="font-serif text-sm sm:text-base text-zinc-700 leading-relaxed italic bg-white/60 p-4 rounded-xl border border-[#C5A880]/30">
                    &ldquo;{personalityResult.analysis}&rdquo;
                  </p>

                  <div className="p-3 bg-[#C5A880]/10 border border-[#C5A880]/40 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900">Harmonized Accords:</span>
                    <span className="text-[#8C7355] font-medium font-serif">{personalityResult.notesHarmonized}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* ============================================================== */}
            {/* RECOMMENDED MATCH PRODUCT CARD & INSTANT COMMERCE             */}
            {/* ============================================================== */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left: Perfume Flacon Image */}
                <div className="md:col-span-5 relative aspect-[4/5] bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 shadow-sm group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={matchedPerfume.image}
                    alt={matchedPerfume.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-zinc-950 text-[#C5A880] text-[9px] font-bold tracking-widest uppercase rounded shadow-md border border-[#C5A880]/30">
                    {personalityResult.matchScore}% Match
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 text-zinc-900 text-[9px] font-bold tracking-widest uppercase rounded shadow-xs font-mono">
                    {matchedPerfume.concentration}
                  </span>
                </div>

                {/* Right: Specs, Pricing & Purchase Actions */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#8C7355]">
                      <span>{matchedPerfume.category}</span>
                      <span>•</span>
                      <span>{matchedPerfume.volume}</span>
                    </div>
                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950 mt-1">
                      {matchedPerfume.name}
                    </h3>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="font-serif text-2xl sm:text-3xl font-medium text-zinc-950">
                        {matchedPerfume.price}
                      </span>
                      <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 rounded">
                        Complimentary 2ml Tester Included
                      </span>
                    </div>
                  </div>

                  {/* Notes Accord Specs */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5 text-xs">
                    <p><strong className="text-zinc-900">Top Notes:</strong> <span className="text-zinc-600">{matchedPerfume.topNotes}</span></p>
                    <p><strong className="text-zinc-900">Heart Notes:</strong> <span className="text-zinc-600">{matchedPerfume.heartNotes}</span></p>
                    <p><strong className="text-zinc-900">Base Foundation:</strong> <span className="text-zinc-600">{matchedPerfume.baseNotes}</span></p>
                  </div>

                  {/* Free Laser Engraving Promise */}
                  <div className="p-3 bg-[#FAF8F5] border border-[#C5A880]/40 rounded-xl flex items-center gap-2.5 text-xs text-zinc-800">
                    <Award className="w-5 h-5 text-[#C5A880] shrink-0" />
                    <span>
                      <strong>Complimentary Signature Engraving:</strong> We can laser engrave your exact signature or name on the flacon cap upon request!
                    </span>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        store.addToCart(matchedPerfume, 1);
                        store.openCart();
                      }}
                      className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                      <span>Add Bespoke Match To Bag • {matchedPerfume.price}</span>
                    </button>

                    <a
                      href={whatsappEngravedOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Order on WhatsApp with Custom Bottle Engraving</span>
                    </a>

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href={`/perfumes/${matchedPerfume.slug}`}
                        className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-semibold"
                      >
                        <span>View Complete Flacon Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-[#8C7355] hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sign Again / Retake Analysis</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </motion.div>
        )}

      </main>

      {/* Floating Concierge & Footer */}
      <WhatsAppConcierge />
      <SiteFooter />
    </div>
  );
}
