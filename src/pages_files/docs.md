
## Documentation

This documentation page will guide you on how to use Braindump effectively as a local-first digital garden.

## Getting Started

*   **Navigation:** Use the left sidebar to browse through different sections of your digital garden: Pages, Content Sections (organized by folders), and Tags.
*   **Content Viewing:** Click on a note or topic in the sidebar to view its content in the main area.
*   **Theming:** Use the theme toggle (sun/moon icon) in the navbar to switch between light and dark modes.
*   **Fonts:** Use the font selector in the navbar to change the application's display font.

## Content Structure

All your content is stored in markdown files within the `Content/` directory at the root of your project. This local-first approach ensures:

- **Full ownership** of your data
- **No cloud dependencies** or recurring costs
- **Version control** with Git
- **Fast performance** with no network requests
- **Privacy** - your notes stay on your device

### File Organization

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

## Adding New Content

1. **Create a new markdown file** in the appropriate folder within `Content/`
2. **Add frontmatter** with required metadata (id, title, path, type, tags)
3. **Write your content** using markdown syntax
4. **Link to other notes** using `[[Note Title]]` syntax
5. **Save the file** - changes will be reflected immediately in the app

## Linking Between Notes

Use wiki-style linking to connect your notes:

- `[[Note Title]]` - Links to another note by title
- The link will be automatically resolved to the correct file
- Backlinks are automatically generated and displayed

## Tagging System

Use tags in your frontmatter to categorize content:

```yaml
tags: ["productivity", "knowledge-management", "tools"]
```

- View all tags on the `/tags` page
- Click any tag to see related content
- Tags help discover connections between ideas

## Graph Visualization

Visit `/graph` to see visual connections between your notes based on:

- Wiki-style links (`[[Note Title]]`)
- Shared tags
- Content relationships

## Local Development

Since Braindump is now local-first:

1. **Clone or fork** the repository
2. **Add your content** to the `Content/` directory
3. **Run locally** with `npm run dev`
4. **Deploy anywhere** - Vercel, Netlify, GitHub Pages, or your own server

## Sharing Your Garden

To share your digital garden:

1. **Fork the repository** on GitHub
2. **Add your content** to the `Content/` directory
3. **Deploy to your preferred platform**
4. **Customize** the styling and branding as needed

Your content remains private until you choose to share it.

## Best Practices

1. **Start small** - Begin with a few notes and grow organically
2. **Link liberally** - Connect related ideas using wiki links
3. **Use consistent tags** - Develop a tagging system that works for you
4. **Regular maintenance** - Review and update your notes periodically
5. **Version control** - Use Git to track changes to your content

## Future Features

Braindump will continue to evolve with features like:

- Enhanced search capabilities
- Better mobile editing experience
- Content templates and scaffolding
- Export and backup tools
- Integration with external note-taking apps

Thank you for using Braindump! We hope it becomes a valuable tool for your personal knowledge management journey.
