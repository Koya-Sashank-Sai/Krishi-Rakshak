export interface QualityCheckResult {
  isGood: boolean;
  blurDetected: boolean;
  blurScore: number; // 0 (very blurry) to 100 (razor sharp)
  lightingStatus: 'Good' | 'Too Dark' | 'Too Bright';
  brightness: number; // 0 - 255
  leafPresent: boolean;
  leafPercentage: number;
  warnings: string[];
}

/**
 * Runs client-side canvas-based quality analysis on an image URI.
 * Checks for:
 * 1. Blur detection (Laplacian gradient variance)
 * 2. Lighting check (average luminance)
 * 3. Leaf presence check (foliage color distribution)
 */
export function analyzeImageQuality(imageUri: string): Promise<QualityCheckResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDimension = 320;
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(32, Math.floor(img.width * scale));
        const height = Math.max(32, Math.floor(img.height * scale));

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve(getDefaultGoodResult());
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // 1. Lighting calculation (average luminance)
        let totalLuminance = 0;
        let foliagePixels = 0;
        const totalPixels = width * height;
        const grayValues = new Float32Array(totalPixels);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Perceived luminance formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;
          grayValues[i / 4] = lum;

          // Foliage & Leaf Presence Check:
          // Checks for green vegetative tones, yellow-chlorosis, or diseased leaf brown tones
          const isGreenDominant = g > r * 0.85 && g > b * 0.85 && g > 35;
          const isYellowOrangeChlorosis = r > 70 && g > 70 && b < r * 0.8 && Math.abs(r - g) < 60;
          const isFoliageBrown = r > 50 && g > 40 && b < g && r > b;

          if (isGreenDominant || isYellowOrangeChlorosis || isFoliageBrown) {
            foliagePixels++;
          }
        }

        const avgBrightness = Math.round(totalLuminance / totalPixels);

        // 2. Blur / Edge Variance detection using 3x3 Laplacian filter approximation
        let varianceSum = 0;
        let edgeSamples = 0;

        for (let y = 1; y < height - 1; y += 2) {
          for (let x = 1; x < width - 1; x += 2) {
            const idx = y * width + x;
            const center = grayValues[idx];
            const laplacian =
              grayValues[idx - 1] +
              grayValues[idx + 1] +
              grayValues[idx - width] +
              grayValues[idx + width] -
              4 * center;

            varianceSum += Math.abs(laplacian);
            edgeSamples++;
          }
        }

        const edgeScore = edgeSamples > 0 ? varianceSum / edgeSamples : 30;
        const normalizedBlurScore = Math.min(100, Math.round(edgeScore * 3.2));
        const blurDetected = normalizedBlurScore < 20;

        // Lighting status determination
        let lightingStatus: 'Good' | 'Too Dark' | 'Too Bright' = 'Good';
        if (avgBrightness < 38) {
          lightingStatus = 'Too Dark';
        } else if (avgBrightness > 230) {
          lightingStatus = 'Too Bright';
        }

        // Leaf presence check
        const leafPercentage = Math.round((foliagePixels / totalPixels) * 100);
        const leafPresent = leafPercentage >= 10;

        // Warnings list
        const warnings: string[] = [];
        if (blurDetected) {
          warnings.push('Image appears blurry');
        }
        if (lightingStatus === 'Too Dark') {
          warnings.push('Lighting is too dark');
        } else if (lightingStatus === 'Too Bright') {
          warnings.push('Lighting is too bright / glare detected');
        }
        if (!leafPresent) {
          warnings.push('Crop leaf or vegetation not clearly visible');
        }

        const isGood = warnings.length === 0;

        resolve({
          isGood,
          blurDetected,
          blurScore: normalizedBlurScore,
          lightingStatus,
          brightness: avgBrightness,
          leafPresent,
          leafPercentage,
          warnings,
        });
      } catch (e) {
        console.warn('Quality check calculation fallback:', e);
        resolve(getDefaultGoodResult());
      }
    };

    img.onerror = () => {
      resolve(getDefaultGoodResult());
    };

    img.src = imageUri;
  });
}

function getDefaultGoodResult(): QualityCheckResult {
  return {
    isGood: true,
    blurDetected: false,
    blurScore: 85,
    lightingStatus: 'Good',
    brightness: 128,
    leafPresent: true,
    leafPercentage: 75,
    warnings: [],
  };
}
