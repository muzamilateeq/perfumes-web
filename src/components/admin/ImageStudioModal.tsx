"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FlipHorizontal, 
  Sun, 
  Contrast, 
  Crop, 
  Check, 
  Sparkles, 
  Upload, 
  Loader2, 
  RefreshCcw,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl?: string;
  onImageSaved: (url: string) => void;
  title?: string;
}

type AspectRatio = "4:5" | "1:1" | "16:9" | "free";

export default function ImageStudioModal({
  isOpen,
  onClose,
  initialImageUrl,
  onImageSaved,
  title = "Flacon Image Studio & Cropper"
}: ImageStudioModalProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:5");
  
  // Transform & Adjustment States
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  
  // Pan / Drag State
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset transforms when image changes
  const resetTransforms = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setIsFlippedH(false);
    setBrightness(100);
    setContrast(100);
    setPan({ x: 0, y: 0 });
    setErrorMessage("");
  }, []);

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
      resetTransforms();
    }
  }, [initialImageUrl, resetTransforms]);

  // Load image element
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageElementRef.current = img;
      renderPreview();
    };
    img.onerror = () => {
      setErrorMessage("Could not load image. You can upload a new photo from your device.");
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Render preview canvas
  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageElementRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Viewport dimensions
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Apply color filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    ctx.save();
    // Center transformations
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    if (isFlippedH) ctx.scale(-1, 1);
    ctx.scale(zoom, zoom);

    // Calculate dimensions to cover/fit
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawW, drawH;

    if (imgRatio > canvasRatio) {
      drawH = height;
      drawW = height * imgRatio;
    } else {
      drawW = width;
      drawH = width / imgRatio;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [zoom, rotation, isFlippedH, brightness, contrast, pan]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      resetTransforms();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Handlers for Mobile / Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y
    });
  };

  // Preset Filters
  const applyPreset = (preset: "natural" | "gold" | "dramatic" | "crisp") => {
    switch (preset) {
      case "natural":
        setBrightness(100);
        setContrast(100);
        break;
      case "gold":
        setBrightness(108);
        setContrast(112);
        break;
      case "dramatic":
        setBrightness(94);
        setContrast(128);
        break;
      case "crisp":
        setBrightness(104);
        setContrast(115);
        break;
    }
  };

  // Export & Upload Cropped Image
  const handleSaveAndUpload = async () => {
    const img = imageElementRef.current;
    if (!img) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Determine output dimensions
      let targetW = 800;
      let targetH = 1000; // 4:5

      if (aspectRatio === "1:1") {
        targetW = 800;
        targetH = 800;
      } else if (aspectRatio === "16:9") {
        targetW = 1280;
        targetH = 720;
      }

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = targetW;
      exportCanvas.height = targetH;
      const ctx = exportCanvas.getContext("2d");

      if (!ctx) throw new Error("Could not create canvas context");

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.save();
      ctx.translate(targetW / 2 + (pan.x * (targetW / 400)), targetH / 2 + (pan.y * (targetH / 500)));
      ctx.rotate((rotation * Math.PI) / 180);
      if (isFlippedH) ctx.scale(-1, 1);
      ctx.scale(zoom, zoom);

      const imgRatio = img.width / img.height;
      const canvasRatio = targetW / targetH;
      let drawW, drawH;

      if (imgRatio > canvasRatio) {
        drawH = targetH;
        drawW = targetH * imgRatio;
      } else {
        drawW = targetW;
        drawH = targetW / imgRatio;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Convert to WebP / JPEG Blob
      const blob = await new Promise<Blob | null>((resolve) =>
        exportCanvas.toBlob(resolve, "image/jpeg", 0.92)
      );

      if (!blob) throw new Error("Failed to export image blob");

      const file = new File([blob], `flacon-studio-${Date.now()}.jpg`, { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onImageSaved(data.url);
        onClose();
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      console.error("Studio save error:", err);
      setErrorMessage(err?.message || "Failed to crop and save image");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                <Crop className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-zinc-950 font-normal leading-tight">
                  {title}
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                  Precision Crop, Rotation & Luxury Light Adjustments
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Split View (Canvas on Left, Controls on Right) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left: Interactive Canvas Viewport */}
            <div className="md:col-span-7 flex flex-col items-center">
              <div 
                className="relative bg-zinc-950 rounded-xl overflow-hidden shadow-inner border border-zinc-800 flex items-center justify-center cursor-move select-none"
                style={{
                  width: "100%",
                  maxWidth: aspectRatio === "16:9" ? "440px" : aspectRatio === "1:1" ? "360px" : "320px",
                  aspectRatio: aspectRatio === "4:5" ? "4/5" : aspectRatio === "1:1" ? "1/1" : "16/9",
                  height: "auto",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                {imageUrl ? (
                  <canvas
                    ref={canvasRef}
                    width={aspectRatio === "4:5" ? 400 : aspectRatio === "1:1" ? 400 : 480}
                    height={aspectRatio === "4:5" ? 500 : aspectRatio === "1:1" ? 400 : 270}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="p-8 text-center text-zinc-400 space-y-3">
                    <Upload className="w-8 h-8 mx-auto text-zinc-600" />
                    <p className="text-xs">No image loaded. Upload a photo below.</p>
                  </div>
                )}

                {/* Subtle Framing Overlay Grid */}
                <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3 opacity-40">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Drag Hint Tag */}
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono backdrop-blur-xs">
                  Drag to frame bottle
                </span>
              </div>

              {/* Upload New Button */}
              <div className="mt-3.5 w-full flex justify-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold tracking-wider uppercase rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#8C7355]" />
                  <span>Choose Another Image</span>
                </button>

                <button
                  type="button"
                  onClick={resetTransforms}
                  className="px-3 py-2 text-zinc-500 hover:text-zinc-900 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                  title="Reset adjustments"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Studio Controls Panel */}
            <div className="md:col-span-5 space-y-5">
              
              {/* 1. Aspect Ratio Presets */}
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">
                  Aspect Framing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio("4:5")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center border ${
                      aspectRatio === "4:5"
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    4:5 Flacon
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio("1:1")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center border ${
                      aspectRatio === "1:1"
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    1:1 Square
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio("16:9")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center border ${
                      aspectRatio === "16:9"
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    16:9 Banner
                  </button>
                </div>
              </div>

              {/* 2. Zoom & Transform */}
              <div className="space-y-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-700 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-[#8C7355]" /> Zoom Scale
                  </span>
                  <span className="font-mono text-zinc-500">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-zinc-950 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="flex-1 py-1.5 bg-white border border-zinc-200 hover:border-zinc-950 rounded-lg text-xs font-semibold text-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlippedH((f) => !f)}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isFlippedH
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-950"
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Flip H</span>
                  </button>
                </div>
              </div>

              {/* 3. Luxury Tone & Light Adjustments */}
              <div className="space-y-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
                  Studio Lighting & Sparkle
                </span>

                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-600" /> Brightness
                    </span>
                    <span className="font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="135"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                    className="w-full accent-zinc-950 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Contrast className="w-3 h-3 text-zinc-800" /> Contrast
                    </span>
                    <span className="font-mono">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="140"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                    className="w-full accent-zinc-950 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Fast Presets */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPreset("natural")}
                    className="px-2 py-1 bg-white border border-zinc-200 hover:border-zinc-900 rounded text-[10px] font-semibold text-zinc-600"
                  >
                    Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("gold")}
                    className="px-2 py-1 bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 rounded text-[10px] font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Gold Warmth
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("dramatic")}
                    className="px-2 py-1 bg-white border border-zinc-300 hover:border-zinc-900 rounded text-[10px] font-semibold text-zinc-700"
                  >
                    Dramatic Noir
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMessage}
                </div>
              )}

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndUpload}
              disabled={isProcessing || !imageUrl}
              className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 disabled:opacity-40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                  <span>Processing & Uploading...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Apply Crop & Save Flacon</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
