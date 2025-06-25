
# Braindump - Your Local-First Digital Garden

Braindump is a local-first digital garden application designed to help you capture, connect, and cultivate your thoughts, notes, and knowledge. It processes markdown files from your local file system, providing a fast and private way to build your personal knowledge base.

## Key Features

*   **Local-First Architecture:** All your content stays on your device - no cloud dependencies or data lock-in
*   **Markdown-Powered:** Write and organize your notes using familiar markdown syntax with frontmatter metadata
*   **Atomic Notes:** Create and manage individual pieces of information that can be interconnected
*   **Wiki-Style Linking:** Connect notes using `[[Note Title]]` syntax with automatic backlink generation
*   **Flexible Organization:** Structure your knowledge using folders, tags, and content types
*   **Graph Visualization:** Visualize connections between your notes in an interactive graph view
*   **Responsive Design:** Access and manage your digital garden across desktop, tablet, and mobile devices
*   **Customizable Experience:**
    *   **Theme Toggle:** Switch between light and dark modes
    *   **Font Selection:** Choose from various fonts (Geist Sans, Geist Mono, Satoshi, Kalam, Indie Flower, Lancelot, Cormorant Upright, Nitti)
*   **Command Palette:** Quickly search and navigate your content using `⌘K` (or `Ctrl+K`)
*   **Math Support:** Render mathematical equations using KaTeX
*   **Diagram Support:** Create diagrams using Mermaid syntax
*   **Fast Performance:** No network requests - everything runs locally

## Getting Started

### Quick Setup

1. **Clone or fork this repository:**
   ```bash
   git clone <repository-url>
   cd braindump
   npm install
   ```

2. **Add your content:**
   - Create markdown files in the `Content/` directory
   - Follow the frontmatter format (see example below)
   - Organize files in folders as needed

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Start writing and linking your notes!**

### Content Structure

Your content lives in the `Content/` directory at the root of the project:

```
Content/
├── README.md                    # Overview of your content
├── zettels/                     # Atomic notes and ideas
│   ├── atomic-thinking.md
│   └── zettelkasten-method.md
├── wikis/                       # Comprehensive guides
│   ├── programming/
│   │   └── javascript-fundamentals.md
│   └── knowledge-management/
│       └── digital-gardens.md
├── topics/                      # Subject-specific content
│   └── personal-knowledge-management.md
└── logs/                        # Daily notes and journals
    └── 2025-01-20.md
```

### Markdown File Format

Each markdown file should include frontmatter with metadata:

```markdown
---
id: "unique-identifier"
title: "Your Note Title"
path: "folder/filename"
type: "note"
tags: ["tag1", "tag2", "tag3"]
created: "2025-01-20"
lastUpdated: "2025-01-20"
---

# Your Content Here

Write your markdown content below the frontmatter.

You can link to other notes using [[Note Title]] syntax.
```

### Content Types

- **note**: General notes and observations
- **zettel**: Atomic ideas in Zettelkasten style
- **topic**: Comprehensive subject guides
- **glossary_term**: Definitions and explanations
- **log**: Time-based entries and journals
- **concept**: Abstract ideas and theories
- **folder**: Organizational containers (automatically created)

## Features in Detail

### Wiki-Style Linking
Connect your notes using `[[Note Title]]` syntax. Braindump will automatically:
- Resolve links to the correct files
- Generate backlinks for each note
- Display related content suggestions

### Tagging System
Organize and discover content using tags:
- Add tags to frontmatter: `tags: ["productivity", "tools"]`
- View all tags at `/tags`
- Filter content by tag
- Discover related notes through shared tags

### Graph Visualization
Visit `/graph` to see your knowledge network:
- Visual representation of note connections
- Interactive exploration of relationships
- Based on wiki links and shared tags

### Math and Diagrams
Enhanced content with:
- **KaTeX math rendering:** `$$E = mc^2$$`
- **Mermaid diagrams:** Create flowcharts, graphs, and more
- **Code syntax highlighting:** Multiple language support

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Routing:** React Router
*   **Icons:** Lucide React
*   **Content Processing:** Gray Matter (frontmatter parsing)
*   **Graph Visualization:** React Flow
*   **Markdown Parsing:** `react-markdown` with plugins
*   **Math Rendering:** KaTeX
*   **Diagram Rendering:** Mermaid

## Deployment Options

Since Braindump is local-first, you can deploy it anywhere:

### Static Site Hosting
- **Vercel** (recommended): Connect your GitHub repository
- **Netlify**: Deploy from Git with automatic builds
- **GitHub Pages**: Host directly from your repository
- **Your own server**: Build and serve the static files

### Self-Hosting
```bash
# Build for production
npm run build

# Serve the dist folder with any static file server
npx serve dist
```

## Customization

### Styling
- Modify `src/index.css` for global styles
- Update Tailwind configuration in `tailwind.config.ts`
- Customize component styles in `src/components/`

### Content Processing
- Extend `src/services/contentService.ts` for custom parsing
- Add new content types in `src/types/content.ts`
- Customize frontmatter handling

### Features
- Add new pages in `src/pages/`
- Create custom components in `src/components/`
- Extend the graph visualization logic

## Privacy and Data Ownership

Braindump is designed with privacy in mind:
- **No external dependencies** for core functionality
- **No analytics or tracking** by default
- **Full data ownership** - your content never leaves your control
- **No account required** - just clone and run
- **Offline capable** - works without internet connection

## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test thoroughly
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

## License

This project is open source and available under the [MIT License](LICENSE).

## Getting Help

- **Documentation**: Visit `/docs` in your running application
- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Share ideas and get help in GitHub Discussions

---

**Happy Knowledge Gardening!** 🌱🧠

Start building your personal knowledge network today with Braindump's local-first approach to digital gardening.
