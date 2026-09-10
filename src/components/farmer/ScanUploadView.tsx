import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { analyzeCropImage } from '../../services/aiAnalysisService';
import { SAMPLE_LEAF_IMAGES } from '../../data/mockData';
import { analyzeImageQuality, QualityCheckResult } from '../../utils/imageQualityCheck';
import { CropScanRecord, FarmerProfile } from '../../types';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Image as ImageIcon,
  Sliders,
  Scan,
  Check,
} from 'lucide-react';

export default function ScanUploadView() {
  const { t } = useLanguage();
  const {
    selectedCrop,
    capturedImage,
    setCapturedImage,
    currentUser,
    activeWeather,
    farmerScans,
    setCurrentView,
    setActivePrediction,
    addNewScanRecord,
  } = useApp();

  const farmer = currentUser as FarmerProfile;

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityCheck, setQualityCheck] = useState<QualityCheckResult | null>(null);
  const [isCheckingQuality, setIsCheckingQuality] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Automatically trigger instant smart scan quality check whenever image is set
  useEffect(() => {
    if (capturedImage) {
      setIsCheckingQuality(true);
      analyzeImageQuality(capturedImage).then((res) => {
        setQualityCheck(res);
        setIsCheckingQuality(false);
      });
    } else {
      setQualityCheck(null);
      setIsCheckingQuality(false);
    }
  }, [capturedImage]);

  // Initialize camera when camera tab is selected
  useEffect(() => {
    if (activeTab === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, capturedImage]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(t.cameraError);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(t.cameraError);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUri);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setCapturedImage(sampleUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage || !selectedCrop || !activeWeather) return;

    setIsAnalyzing(true);
    try {
      const prediction = await analyzeCropImage({
        imageUri: capturedImage,
        cropId: selectedCrop.id,
        cropName: selectedCrop.name,
        district: farmer?.district || 'Ahmednagar',
        village: farmer?.village || 'Aabithkhind',
        weather: activeWeather,
        cropHistory: farmerScans,
      });

      setActivePrediction(prediction);

      // Create new scan record in history
      const newScan: CropScanRecord = {
        id: `scan-${Date.now()}`,
        farmerId: farmer?.id || 'farmer-101',
        farmerName: farmer?.name || 'Registered Farmer',
        farmerMobile: farmer?.mobile || '9822104512',
        cropId: selectedCrop.id,
        cropName: selectedCrop.name,
        cropEmoji: selectedCrop.emoji,
        district: farmer?.district || 'Ahmednagar',
        village: farmer?.village || 'Aabithkhind',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        imageUrl: capturedImage,
        prediction,
        status: 'scanned',
      };

      addNewScanRecord(newScan);
      setIsAnalyzing(false);
      setCurrentView('analysis_result');
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          id="scan-upload-back-btn"
          onClick={() => setCurrentView('crop_selection')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Crop ({selectedCrop?.name})</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            Step 2 of 3
          </span>
        </div>
      </div>

      {/* Title & Selected Crop Context */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
            {t.captureTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t.captureSubtitle}
          </p>
        </div>

        {selectedCrop && (
          <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl self-start sm:self-auto">
            <span className="text-3xl">{selectedCrop.emoji}</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800">Target Crop</div>
              <div className="text-sm font-bold text-gray-900">{selectedCrop.name}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Area */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        {/* Toggle Tabs: [ Scan Crop ] / [ Upload Image ] */}
        {!capturedImage && (
          <div className="flex border-b border-gray-100 bg-gray-50/60">
            <button
              id="tab-scan-crop"
              onClick={() => {
                setActiveTab('camera');
                setCapturedImage(null);
              }}
              className={`flex-1 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                activeTab === 'camera'
                  ? 'text-emerald-900 border-b-2 border-emerald-700 bg-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t.scanCropTab}</span>
            </button>

            <button
              id="tab-upload-image"
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                activeTab === 'upload'
                  ? 'text-emerald-900 border-b-2 border-emerald-700 bg-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{t.uploadImageTab}</span>
            </button>
          </div>
        )}

        {/* Content Container */}
        <div className="p-6">
          {capturedImage ? (
            /* PREVIEW STATE */
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {t.previewTitle}
                </span>
              </div>

              <div className="relative max-w-md mx-auto aspect-4/3 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-200 bg-black flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full flex items-center space-x-1.5">
                  <span>{selectedCrop?.emoji}</span>
                  <span className="font-semibold">{selectedCrop?.name}</span>
                </div>
              </div>

              {/* SMART SCAN QUALITY CHECK SECTION */}
              <div className="max-w-md mx-auto">
                {isCheckingQuality ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 flex items-center justify-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>Analyzing image quality (focus, lighting & leaf presence)...</span>
                  </div>
                ) : qualityCheck && !qualityCheck.isGood ? (
                  /* POOR QUALITY WARNING CARD */
                  <div
                    id="quality-check-warning-card"
                    className="p-4.5 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-3.5 shadow-xs animate-in fade-in"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-extrabold text-amber-950">
                          ⚠️ Quality Check Warning
                        </h4>
                        <div className="mt-1.5 space-y-1">
                          {qualityCheck.warnings.map((warning, idx) => (
                            <div key={idx} className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-800 mt-2 font-medium bg-amber-100/70 p-2 rounded-lg border border-amber-200">
                          Low image quality may cause incorrect disease detection.
                        </p>
                      </div>
                    </div>

                    {/* Exactly the 2 requested options: [ Retake Photo ] and [ Continue Anyway ] */}
                    <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        id="btn-quality-retake"
                        onClick={handleRetake}
                        disabled={isAnalyzing}
                        className="w-full sm:w-1/2 py-2.5 px-4 bg-white hover:bg-gray-50 border border-amber-300 text-amber-950 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retake Photo</span>
                      </button>
                      <button
                        id="btn-quality-continue-anyway"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full sm:w-1/2 py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        {isAnalyzing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                        <span>Continue Anyway</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* GOOD QUALITY CARD */
                  <div
                    id="quality-check-good-card"
                    className="p-3.5 bg-emerald-50/90 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-2xs animate-in fade-in"
                  >
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <div className="font-extrabold text-emerald-950 text-xs">
                          ✓ Image Quality Good
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium">
                          Sharp leaf focus ({qualityCheck?.blurScore || 85}%) &bull; Balanced lighting &bull; Canopy detected
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-full">
                      Ready
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons if Quality is Good (or before check) */}
              {(!qualityCheck || qualityCheck.isGood) && (
                <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
                  <button
                    id="retake-image-btn"
                    onClick={handleRetake}
                    disabled={isAnalyzing}
                    className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.retakeBtn}</span>
                  </button>

                  <button
                    id="analyze-crop-btn"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                        <span>{t.analyzingText}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-300" />
                        <span>{t.analyzeBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'camera' ? (
            /* CAMERA STREAM VIEW */
            <div className="space-y-4 text-center">
              {cameraError ? (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="text-xs sm:text-sm">{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="text-xs font-bold text-emerald-800 underline"
                  >
                    Switch to File Upload
                  </button>
                </div>
              ) : (
                <div className="relative max-w-md mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-gray-900 shadow-inner border border-gray-700">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Camera overlay guidelines */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/60 rounded-2xl m-6 flex items-center justify-center">
                    <span className="text-[11px] text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                      {t.cameraLivePrompt}
                    </span>
                  </div>
                </div>
              )}

              {cameraActive && (
                <button
                  id="camera-capture-btn"
                  onClick={capturePhotoFromCamera}
                  className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-emerald-300" />
                  <span>{t.capturePhotoBtn}</span>
                </button>
              )}
            </div>
          ) : (
            /* FILE UPLOAD VIEW */
            <div className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="crop-leaf-file-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="max-w-md mx-auto border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-8 text-center cursor-pointer transition-colors"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Upload className="w-7 h-7 text-emerald-700" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {t.dragDropImage}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Supports JPEG, PNG, WEBP (Clear close-up recommended)
                </p>
                <span className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm">
                  <span>{t.selectImageBtn}</span>
                </span>
              </div>

              {/* Sample Preset Images for instant testing */}
              <div className="border-t border-gray-100 pt-5">
                <div className="text-xs font-semibold text-gray-700 mb-3 text-center">
                  {t.orTrySampleImages}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {SAMPLE_LEAF_IMAGES.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSample(sample.url)}
                      className="group p-2.5 rounded-xl border border-gray-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="aspect-16/10 rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-900">
                        {sample.title}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {sample.diseaseName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
