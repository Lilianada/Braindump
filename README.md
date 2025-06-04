
# Braindump - Your Digital Garden

Braindump is a Firebase-powered digital garden application designed to help you capture, connect, and cultivate your thoughts, notes, and knowledge in a flexible and interconnected way. It leverages Markdown for content creation and provides tools for organizing and navigating your personal knowledge base.

## Key Features

*   **Firebase Integration:** Seamlessly store and sync your notes using Firebase Firestore.
*   **Atomic Notes:** Create and manage individual pieces of information as Markdown content.
*   **Content Organization:** Structure your knowledge using a flexible tagging and categorization system.
*   **Tagging System:** Categorize and discover related content easily using tags. View all tags on a dedicated page and see items associated with specific tags.
*   **Markdown Support:** Write and render notes using familiar Markdown syntax, including code blocks, lists, and more.
*   **Graph Visualization:** Visualize connections between your notes in an interactive graph view.
*   **Responsive Design:** Access and manage your Braindump seamlessly across desktop, tablet, and mobile devices.
*   **Customizable Experience:**
    *   **Theme Toggle:** Switch between light and dark modes for comfortable viewing.
    *   **Font Selection:** Choose from various fonts (Geist Sans, Geist Mono, Satoshi, Kalam, Indie Flower, Lancelot, Cormorant Upright, Nitti) to personalize the appearance.
*   **Command Palette:** Quickly search and navigate your content using `⌘K` (or `Ctrl+K`).
*   **Content Previews:** See snippets of content on tag detail pages for quick insights.
*   **Developer Friendly:** Built with a modern tech stack (React, Vite, TypeScript, Tailwind CSS).

## Setup Instructions

### Option 1: Firebase Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd braindump
   npm install
   ```

2. **Create a Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (optional, for future features)

3. **Configure Firebase:**
   - Create a `src/lib/firebase.ts` file with your Firebase config:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

4. **Set up Firestore structure:**
   Create a collection called `notes` with documents containing:
   ```javascript
   {
     noteTitle: "Your Note Title",
     content: "# Your markdown content here",
     filePath: "path/to/your/note", // Used for routing
     slug: "your-note-slug",
     tags: ["tag1", "tag2"],
     publish: true, // Only published notes are shown
     category: {
       id: "category-id",
       name: "note", // or "zettel", "topic", etc.
       color: "#color-hex"
     },
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     updatedAt: firebase.firestore.FieldValue.serverTimestamp()
   }
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```

### Option 2: Local Markdown Files (Alternative)

If you prefer not to use Firebase, you can modify the app to work with local markdown files:

1. **Create a content structure:**
   ```
   src/content_files/
   ├── notes/
   │   └── your-note.md
   ├── topics/
   │   └── your-topic.md
   └── zettels/
       └── your-zettel.md
   ```

2. **Markdown file format:**
   ```markdown
   ---
   id: "unique-id"
   title: "Your Note Title"
   path: "notes/your-note"
   slug: "your-note"
   type: "note"
   tags:
     - "tag1"
     - "tag2"
   created: "2025-01-01"
   lastUpdated: "2025-01-01"
   ---

   # Your content here

   This is your markdown content.
   ```

3. **Modify the data source:**
   You'll need to update the hooks and services to use local file imports instead of Firebase calls.

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Routing:** React Router
*   **Icons:** Lucide React
*   **Database:** Firebase Firestore
*   **Graph Visualization:** React Flow
*   **Markdown Parsing:** `react-markdown` with plugins
*   **State Management:** React Context, hooks

## Usage

1.  **Explore Content:** Navigate through your notes using the sidebar, which organizes content by categories and tags.
2.  **Use Tags:** Click on tags within notes or visit the `/tags` page to find related information.
3.  **Search:** Press `⌘K` (or `Ctrl+K`) to open the command palette and search for specific notes by title or path.
4.  **Graph View:** Visit `/graph` to see visual connections between your notes.
5.  **Customize:** Use the theme and font toggles in the navbar to adjust the application's appearance to your liking.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes.** Ensure code is well-formatted and adheres to the project's coding style.
4.  **Test your changes thoroughly.**
5.  **Commit your changes** with descriptive messages.
6.  **Push to your branch** and open a Pull Request.

## Deployment

The app is configured for deployment on Vercel with proper routing support for React Router. Simply connect your repository to Vercel and deploy.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Braindumping!** 🧠✨
