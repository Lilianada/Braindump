
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.SERVER_PORT || 3001; // Use a different port than Vite, e.g., 3001

// In production, Vite builds to 'dist'. Express can serve these static files.
// This part is mainly for a production setup.
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../dist'); // Adjust if your server file is in a subdir of dist
  app.use(express.static(clientBuildPath));

  // For any other route, serve index.html (client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('In development, Vite dev server should proxy requests to this server.');
  }
});
