/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Car,
  Upload,
  Download,
  ShieldCheck,
  RefreshCw,
  Eye,
  Zap,
  Trash2,
  Layers,
  FolderDown,
  Sun,
  Moon,
  Languages
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const LOGO_SRC = '/assets/img/logo_24b51984.png';

interface ProcessedImageItem {
  id: string;
  originalUrl: string;
  processedUrl: string;
  name: string;
  isDarkOverride: boolean;
  status: 'processing' | 'ready';
}

const TRANSLATIONS = {
  en: {
    appTitle: 'RunBD Car Gallery',
    appSubtitle: 'Professional Batch Watermarking Studio',
    addPhotos: 'Add More Photos',
    downloadAll: 'Download All',
    dragTitle: 'Drag & Drop Multiple Car Photos',
    dragSub: 'Drop your car photos here. Watermarks will be applied instantly with professional styling.',
    selectPhotos: 'Select Car Photos',
    processing: 'Processing watermarks...',
    originalPhoto: 'Original Photo',
    photoCounter: 'Photo',
    darkStyle: 'Dark Mode Style',
    lightStyle: 'Light Mode Style',
    holdToCompare: 'Hold to Compare',
    downloadThis: 'Download This Photo',
    queueTitle: 'Uploaded Batch Queue',
    queueSub: 'Click any photo to preview',
    studioControls: 'Studio Controls',
    studioSub: 'Configure styling for all uploaded photos simultaneously.',
    themeStyle: 'Watermark Theme Style',
    smartAuto: 'Smart Auto',
    lightPhoto: 'Light Photo',
    darkPhoto: 'Dark Photo',
    logoPos: 'Logo Position (Top)',
    opacity: 'Watermark Opacity',
    scale: 'Logo & Badge Scale',
    downloadAllBranded: 'Download All Branded Photos',
    footer: 'RunBD Car Gallery • Professional Batch Watermarking Studio',
    logoTopLinksBottom: 'Logo Top + Links Bottom Applied'
  },
  bn: {
    appTitle: 'রানবিডি কার গ্যালারি',
    appSubtitle: 'প্রফেশনাল ব্যাচ ওয়াটারমার্কিং স্টুডিও',
    add_more_photos: 'আরো ছবি যোগ করুন',
    addPhotos: 'আরো ছবি যোগ করুন',
    downloadAll: 'সবগুলো ডাউনলোড',
    dragTitle: 'একাধিক গাড়ির ছবি ড্রাগ এন্ড ড্রপ করুন',
    dragSub: 'এখানে আপনার গাড়ির ছবিগুলো ছেড়ে দিন। পেশাদার স্টাইলে ওয়াটারমার্ক অটোমেটিক বসে যাবে।',
    selectPhotos: 'গাড়ির ছবি নির্বাচন করুন',
    processing: 'ওয়াটারমার্ক প্রসেস করা হচ্ছে...',
    originalPhoto: 'মূল ছবি',
    photoCounter: 'ছবি',
    darkStyle: 'ডার্ক মোড স্টাইল',
    lightStyle: 'লাইট মোড স্টাইল',
    holdToCompare: 'আসল ছবি দেখতে ধরে রাখুন',
    downloadThis: 'এই ছবিটি ডাউনলোড করুন',
    queueTitle: 'আপলোড করা গাড়ির তালিকা',
    queueSub: 'প্রিভিউ দেখতে যেকোনো ছবিতে ক্লিক করুন',
    studioControls: 'স্টুডিও কন্ট্রোলস',
    studioSub: 'একসাথে সকল ছবির জন্য ওয়াটারমার্ক সাইজ ও থিম কাস্টমাইজ করুন।',
    themeStyle: 'ওয়াটারমার্ক থিম স্টাইল',
    smartAuto: 'স্মার্ট অটো',
    lightPhoto: 'লাইট ফটো',
    darkPhoto: 'ডার্ক ফটো',
    logoPos: 'লোগো পজিশন (উপরে)',
    opacity: 'ওয়াটারমার্ক অপাসিটি (স্বচ্ছতা)',
    scale: 'লোগো ও ব্যাজ সাইজ',
    downloadAllBranded: 'সকল ব্র্যান্ডেড ছবি ডাউনলোড করুন',
    footer: 'রানবিডি কার গ্যালারি • প্রফেশনাল ব্যাচ ওয়াটারমার্কিং স্টুডিও',
    logoTopLinksBottom: 'লোগো উপরে + লিংক নিচে সফলভাবে যুক্ত হয়েছে'
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'bn'>('bn'); // default to Bangla as requested
  const t = TRANSLATIONS[lang];

  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Customization controls
  const [opacity, setOpacity] = useState<number>(98);
  const [scale, setScale] = useState<number>(100);
  const [logoPosition, setLogoPosition] = useState<'top-center' | 'top-right' | 'top-left'>('top-center');
  const [themeMode, setThemeMode] = useState<'auto' | 'light_photo' | 'dark_photo'>('auto');
  
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Helper to process a single image URL into branded processed URL
  const processImage = (
    imgSrc: string,
    currentOpacity: number,
    currentScale: number,
    currentPos: 'top-center' | 'top-right' | 'top-left',
    mode: 'auto' | 'light_photo' | 'dark_photo'
  ): Promise<{ processedUrl: string; isDark: boolean }> => {
    return new Promise((resolve) => {
      const carImg = new Image();
      carImg.crossOrigin = 'anonymous';
      carImg.src = imgSrc;

      carImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ processedUrl: imgSrc, isDark: false });
          return;
        }

        canvas.width = carImg.naturalWidth || 1920;
        canvas.height = carImg.naturalHeight || 1080;

        // 1. Draw base car image
        ctx.drawImage(carImg, 0, 0);

        // Determine if dark
        let isDark = false;
        if (mode === 'dark_photo') {
          isDark = true;
        } else if (mode === 'light_photo') {
          isDark = false;
        } else {
          // Auto brightness analysis
          const sampleCanvas = document.createElement('canvas');
          const sampleCtx = sampleCanvas.getContext('2d');
          if (sampleCtx) {
            sampleCanvas.width = 100;
            sampleCanvas.height = 100;
            sampleCtx.drawImage(carImg, 0, 0, 100, 100);
            const data = sampleCtx.getImageData(0, 0, 100, 100).data;
            let sum = 0;
            for (let i = 0; i < data.length; i += 4) {
              sum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            }
            isDark = (sum / (data.length / 4)) < 100;
          }
        }

        ctx.save();
        ctx.globalAlpha = currentOpacity / 100;

        const baseSize = Math.min(canvas.width, canvas.height);

        // 2. Load and draw Logo at Top
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = LOGO_SRC;

        logoImg.onload = () => {
          const logoW = baseSize * 0.32 * (currentScale / 100);
          const logoH = logoW * (logoImg.naturalHeight / logoImg.naturalWidth);
          
          let logoX = (canvas.width - logoW) / 2;
          if (currentPos === 'top-right') logoX = canvas.width - logoW - 60;
          if (currentPos === 'top-left') logoX = 60;
          const logoY = 60;

          // Elegant Frosted Glass Background Pill behind logo
          ctx.fillStyle = isDark ? 'rgba(10, 15, 30, 0.82)' : 'rgba(255, 255, 255, 0.92)';
          ctx.strokeStyle = isDark ? 'rgba(34, 197, 94, 0.5)' : 'rgba(37, 99, 235, 0.3)';
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.roundRect(logoX - 24, logoY - 18, logoW + 48, logoH + 36, 18);
          ctx.fill();
          ctx.stroke();

          ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);

          // 3. Draw Bottom Badges
          const footerY = canvas.height - 130;
          const footerH = 74;
          const badgeWidth = baseSize * 0.44 * (currentScale / 100);
          const badgeSpacing = 50;
          const totalWidth = (badgeWidth * 2) + badgeSpacing;
          const startX = (canvas.width - totalWidth) / 2;

          const bgFillColor = isDark ? 'rgba(10, 15, 30, 0.88)' : 'rgba(255, 255, 255, 0.95)';
          const borderStrokeColor = isDark ? 'rgba(34, 197, 94, 0.5)' : 'rgba(37, 99, 235, 0.3)';
          const textFillColor = isDark ? '#ffffff' : '#0f172a';

          // Badge 1: Download App
          ctx.fillStyle = bgFillColor;
          ctx.strokeStyle = borderStrokeColor;
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.roundRect(startX, footerY, badgeWidth, footerH, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = textFillColor;
          ctx.font = `bold ${Math.max(16, baseSize * 0.022 * (currentScale / 100))}px system-ui, sans-serif`;
          ctx.fillText('📱 Download the Run BD App', startX + 28, footerY + 45);

          // Badge 2: Website
          const badge2X = startX + badgeWidth + badgeSpacing;
          ctx.fillStyle = bgFillColor;
          ctx.strokeStyle = borderStrokeColor;

          ctx.beginPath();
          ctx.roundRect(badge2X, footerY, badgeWidth, footerH, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = textFillColor;
          ctx.fillText('🌐 www.runbd.org', badge2X + 28, footerY + 45);

          ctx.restore();
          resolve({
            processedUrl: canvas.toDataURL('image/png', 0.95),
            isDark
          });
        };
      };
    });
  };

  // Re-process all items whenever settings change
  useEffect(() => {
    if (items.length === 0) return;

    setIsProcessingAll(true);
    Promise.all(
      items.map(async (item) => {
        const res = await processImage(item.originalUrl, opacity, scale, logoPosition, themeMode);
        return {
          ...item,
          processedUrl: res.processedUrl,
          isDarkOverride: res.isDark,
          status: 'ready' as const
        };
      })
    ).then((updatedItems) => {
      setItems(updatedItems);
      setIsProcessingAll(false);
    });
  }, [opacity, scale, logoPosition, themeMode]);

  const handleFilesAdded = async (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);
    if (newFiles.length === 0) return;

    setIsProcessingAll(true);
    const newItems: ProcessedImageItem[] = [];

    for (const file of newFiles) {
      const originalUrl = URL.createObjectURL(file);
      const res = await processImage(originalUrl, opacity, scale, logoPosition, themeMode);
      newItems.push({
        id: Math.random().toString(36).substring(7),
        originalUrl,
        processedUrl: res.processedUrl,
        name: file.name,
        isDarkOverride: res.isDark,
        status: 'ready'
      });
    }

    setItems((prev) => {
      const updated = [...prev, ...newItems];
      if (prev.length === 0) setCurrentIndex(0);
      return updated;
    });
    setIsProcessingAll(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDownloadSingle = (item: ProcessedImageItem) => {
    const link = document.createElement('a');
    link.href = item.processedUrl;
    link.download = `runbd-branded-${item.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    items.forEach((item, idx) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, idx * 250);
    });
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (currentIndex >= filtered.length) {
        setCurrentIndex(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
  };

  const activeItem = items[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between gap-8 px-8 py-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-xl bg-white/90 border border-slate-700 flex items-center justify-center p-1.5 shadow-lg">
            <img src={LOGO_SRC} alt="RunBD Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">{t.appTitle}</h1>
            <p className="text-xs text-slate-400">{t.appSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Toggle Button */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'en' ? 'বাংলা (BN)' : 'English (EN)'}
          </button>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30">
                <Upload className="w-4 h-4" />
                {t.addPhotos}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <FolderDown className="w-4 h-4" />
                {t.downloadAll} ({items.length})
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Single Page Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col justify-center">
        {items.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`max-w-xl mx-auto w-full border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-6 shadow-2xl transition-all ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-xl">
              <Upload className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-white">{t.dragTitle}</h2>
              <p className="text-sm text-slate-400">{t.dragSub}</p>
            </div>
            <label className="cursor-pointer px-8 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t.selectPhotos}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Left Column: Active Canvas Preview */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[500px]">
                {isProcessingAll && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-20 flex items-center justify-center gap-3">
                    <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-sm font-medium text-slate-200">{t.processing}</span>
                  </div>
                )}

                {activeItem && (
                  compareMode ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={activeItem.originalUrl}
                        alt="Original Car"
                        className="max-h-[560px] w-auto object-contain rounded-lg shadow-lg border border-slate-800"
                      />
                      <div className="absolute bottom-6 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
                        {t.originalPhoto} ({currentIndex + 1} / {items.length})
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={activeItem.processedUrl}
                        alt="Watermarked Car"
                        className="max-h-[560px] w-auto object-contain rounded-lg shadow-lg"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                        <ShieldCheck className="w-4 h-4" />
                        {t.photoCounter} {currentIndex + 1} / {items.length} ({activeItem.isDarkOverride ? t.darkStyle : t.lightStyle})
                      </div>
                    </div>
                  )
                )}

                {/* Floating Actions */}
                {activeItem && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur p-1.5 rounded-xl border border-slate-800 shadow-xl">
                    <button
                      onMouseDown={() => setCompareMode(true)}
                      onMouseUp={() => setCompareMode(false)}
                      onMouseLeave={() => setCompareMode(false)}
                      className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t.holdToCompare}
                    </button>
                    <button
                      onClick={() => handleDownloadSingle(activeItem)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t.downloadThis}
                    </button>
                  </div>
                )}
              </div>

              {/* Batch Queue Thumbnails Bar */}
              <div className="flex flex-col gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-400" />
                    {t.queueTitle} ({items.length})
                  </span>
                  <span className="text-xs text-slate-400">{t.queueSub}</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex-shrink-0 w-28 aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${currentIndex === idx ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'}`}
                    >
                      <img src={item.processedUrl} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                      <button
                        onClick={(e) => removeItem(item.id, e)}
                        className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 right-1 px-1 bg-slate-950/80 rounded text-[9px] text-slate-200 truncate">
                        #{idx + 1} {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Global Controls */}
            <div className="lg:col-span-4 flex flex-col gap-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {t.studioControls}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">{t.studioSub}</p>
              </div>

              {/* Theme Mode Selector */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {t.themeStyle}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setThemeMode('auto')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${themeMode === 'auto' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}`}
                  >
                    🤖 {t.smartAuto}
                  </button>
                  <button
                    onClick={() => setThemeMode('light_photo')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${themeMode === 'light_photo' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> {t.lightPhoto}
                  </button>
                  <button
                    onClick={() => setThemeMode('dark_photo')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${themeMode === 'dark_photo' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}`}
                  >
                    <Moon className="w-3.5 h-3.5 text-blue-400" /> {t.darkPhoto}
                  </button>
                </div>
              </div>

              {/* Logo Alignment */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {t.logoPos}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['top-left', 'top-center', 'top-right'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setLogoPosition(pos)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${logoPosition === pos ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Opacity & Scale */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{t.opacity}</span>
                    <span className="text-blue-400 font-semibold">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{t.scale}</span>
                    <span className="text-blue-400 font-semibold">{scale}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <hr className="border-slate-800" />

              {/* Download All Button */}
              <button
                onClick={handleDownloadAll}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all text-sm"
              >
                <FolderDown className="w-4 h-4" />
                {t.downloadAllBranded} ({items.length})
              </button>

            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500 bg-slate-900/50 flex flex-col md:flex-row items-center justify-center gap-2">
        <span>{t.footerText}</span>
        <a
          href="https://siblysadik-dev.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline"
        >
          Shimul.Dev
        </a>
      </footer>
      <SpeedInsights />
    </div>
  );
}
