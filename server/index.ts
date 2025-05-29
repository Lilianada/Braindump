
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// In production, serve static files from the dist directory
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../dist');
  app.use(express.static(clientBuildPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't intercept API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Development mode - add basic API endpoint for health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // In development, let Vite handle routing
  app.get('*', (req, res) => {
    res.status(404).json({ 
      error: 'In development mode, routing is handled by Vite dev server',
      message: 'This Express server is for API endpoints only during development'
    });
  });
}

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('In development, Vite dev server should handle client-side routing.');
  }
});
