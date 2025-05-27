
# Braindump - Your Digital Garden

Braindump is a digital garden application designed to help you capture, connect, and cultivate your thoughts, notes, and knowledge in a flexible and interconnected way. It leverages Markdown for content creation and provides tools for organizing and navigating your personal knowledge base.

## Key Features

*   **Atomic Notes:** Create and manage individual pieces of information as Markdown files.
*   **Content Organization:** Structure your knowledge using a clear file-based system with definable types (e.g., notes, dictionary entries, project logs).
*   **Tagging System:** Categorize and discover related content easily using tags. View all tags on a dedicated page and see items associated with specific tags.
*   **Markdown Support:** Write and render notes using familiar Markdown syntax, including code blocks, lists, and more.
*   **Responsive Design:** Access and manage your Braindump seamlessly across desktop, tablet, and mobile devices.
*   **Customizable Experience:**
    *   **Theme Toggle:** Switch between light and dark modes for comfortable viewing.
    *   **Font Selection:** Choose from various fonts to personalize the appearance.
*   **Command Palette:** Quickly search and navigate your content using `⌘K` (or `Ctrl+K`).
*   **Content Previews:** See snippets of content on tag detail pages for quick insights.
*   **Developer Friendly:** Built with a modern tech stack (React, Vite, TypeScript, Tailwind CSS).

## How to Use

1.  **Explore Content:** Navigate through your notes using the sidebar, which organizes content by its structure (e.g., `concepts`, `daily-logs`, `projects`).
2.  **Use Tags:** Click on tags within notes or visit the `/tags` page to find related information.
3.  **Search:** Press `⌘K` (or `Ctrl+K`) to open the command palette and search for specific notes by title or path.
4.  **Customize:** Use the theme and font toggles in the navbar to adjust the application's appearance to your liking.
5.  **Adding Content (Manual for now):**
    *   New content is added by creating `.md` files within the `src/content_files/` directory.
    *   Each file should include YAML frontmatter at the top to define metadata like `id`, `title`, `path`, `slug`, `type`, `tags`, `created`, and `lastUpdated`.
    *   Example frontmatter:
        ```yaml
        ---
        id: "my-new-note"
        title: "My New Note Title"
        path: "category/my-new-note" # Used for URL and navigation
        slug: "my-new-note"         # URL-friendly identifier
        type: "note"                # e.g., note, dictionary_entry, project
        tags:
          - "new"
          - "important"
        created: "YYYY-MM-DD"
        lastUpdated: "YYYY-MM-DD"
        ---

        Your note content in Markdown starts here...
        ```

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Routing:** React Router
*   **Icons:** Lucide React
*   **State Management (for UI):** React Context, `useState`, `useEffect`
*   **Markdown Parsing:** `react-markdown` and related plugins.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
3.  **Make your changes.** Ensure code is well-formatted and adheres to the project's coding style.
4.  **Test your changes thoroughly.**
5.  **Commit your changes:** `git commit -m "feat: Implement X feature"` or `fix: Resolve Y bug`.
6.  **Push to your branch:** `git push origin feature/your-feature-name`.
7.  **Open a Pull Request** against the `main` branch of the original repository. Provide a clear description of your changes.

We'll review your PR and merge it if everything looks good!

## Future Enhancements (Ideas)

*   In-app note creation and editing.
*   Graph visualization of note connections.
*   Advanced search capabilities.
*   User authentication and cloud persistence.

---

Happy Braindumping!
