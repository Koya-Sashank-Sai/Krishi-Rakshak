import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const getCurrentDir = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
};

async function startServer() {
  const app = express();
  const dir = getCurrentDir();

  // Determine if running as bundled production server or development server
  const isProduction = process.env.NODE_ENV === 'production' || dir.endsWith('dist');

  // Cloud Run sets PORT (typically 8080).
  // In development inside the dev container, nginx reverse-proxies to 3000, so dev must listen on 3000.
  // In Cloud Run production, the container directly receives traffic on PORT (e.g. 8080).
  const primaryPort = isProduction
    ? (Number(process.env.PORT) || 3000)
    : 3000;

  app.use(express.json({ limit: '25mb' }));

  // Health check endpoint for Cloud Run and container probes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Optional server-side Gemini endpoint with lazy initialization
  app.post('/api/ai/diagnose', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          available: false,
          message: 'GEMINI_API_KEY not configured. Falling back to local ICAR expert model.',
        });
      }
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const { prompt } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt || 'Provide a brief agronomic advisory for crop pest protection.',
      });
      return res.json({ available: true, text: response.text });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({ error: err.message || 'AI service error' });
    }
  });

  // Development: Mount Vite middleware dynamically (zero Vite dependency in production)
  // Production: Serve pre-built static assets from dist/
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(process.cwd(), 'dist'))
      ? path.join(process.cwd(), 'dist')
      : dir;

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('App is compiling...');
      }
    });
  }

  const server = app.listen(primaryPort, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${primaryPort} (${isProduction ? 'production' : 'development'})`);
  });

  // If in production and primaryPort is not 3000, also bind to port 3000 if available
  if (isProduction && primaryPort !== 3000) {
    try {
      const secondaryServer = app.listen(3000, '0.0.0.0', () => {
        console.log(`Also listening on port 3000`);
      });
      secondaryServer.on('error', () => {
        // Port 3000 in use or not accessible, ignore
      });
    } catch {
      // Ignore
    }
  }

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server');
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

