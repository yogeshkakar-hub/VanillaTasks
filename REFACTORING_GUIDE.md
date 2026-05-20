/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTERPRISE-GRADE VANILLA WEB APPLICATION - REFACTORING GUIDE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PROJECT STRUCTURE:
 * ├── index.html (refactored)
 * ├── about.html (refactored)
 * ├── contact.html (refactored)
 * ├── css/
 * │   └── style.css (completely refactored)
 * └── js/
 *     ├── app.js (entry point - orchestrator)
 *     ├── api.js (API service module)
 *     └── todo.js (todo state management module)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * KEY ARCHITECTURE IMPROVEMENTS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 1. CSS DESIGN SYSTEM
 *    ✓ Global CSS variables for colors, spacing, shadows, transitions
 *    ✓ Consistent design tokens (breakpoints, border-radii, z-index scale)
 *    ✓ Semantic color naming (--text-primary, --bg-secondary, etc.)
 *    ✓ Smooth transitions with --transition-base (0.2s ease-in-out)
 *    ✓ Empty state styling with dashed borders and gradients
 *    ✓ Loading skeleton with shimmer effect animation
 *    ✓ Focus-visible pseudo-class for full keyboard accessibility
 *    ✓ Responsive design tokens for maintainability
 * 
 * 2. JAVASCRIPT ARCHITECTURE
 *    ✓ ES Modules (ESM) - Separate concerns into modules
 *    ✓ State Management - Single source of truth (state object)
 *    ✓ Event Delegation - Single listener on container, not individual items
 *    ✓ Pure Functions - Data modifications before DOM updates
 *    ✓ localStorage Sync - Automatic persistence after every state change
 *    ✓ Error Handling - Try/catch with user-friendly messages
 *    ✓ Accessibility - Full keyboard support with ARIA labels
 * 
 * 3. DATA FLOW PATTERN
 *    User Action → Validate Input → Modify State → Sync localStorage → 
 *    Render DOM → User Sees Update
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE-BY-FILE IMPLEMENTATION GUIDE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FILE 1: css/style.css
 * ─────────────────────
 * [See the comprehensive style.css file already created]
 * 
 * Key features:
 * - :root with 70+ design tokens
 * - Dark theme support via html.dark-theme
 * - Utility classes for skeleton loading
 * - Focus-visible styling for accessibility
 * - Responsive media queries at 1024px, 768px, 480px
 * 
 * 
 * FILE 2: js/api.js - API SERVICE MODULE
 * ───────────────────────────────────────
 * [See the api.js file already created]
 * 
 * Exports:
 * - ApiService class with fetchPosts() method
 * - Full error handling with try/catch
 * - Post validation logic
 * 
 * Usage in app.js:
 *   import ApiService from './api.js';
 *   const posts = await ApiService.fetchPosts();
 * 
 * 
 * FILE 3: js/todo.js - TODO STATE MANAGEMENT MODULE
 * ──────────────────────────────────────────────────
 * [See the todo.js file already created]
 * 
 * Exports (pure functions):
 * - initTodoState() - Load from localStorage
 * - getTodoState() - Get state snapshot
 * - addTodo(text) - Add and persist
 * - updateTodo(id, newText) - Update and persist
 * - deleteTodo(id) - Delete and persist
 * - toggleTodo(id) - Toggle completion
 * - getAllTodos() - Get all todos
 * - getCompletedCount() - Get completed count
 * - renderTodos(container) - Render to DOM
 * - renderStats(container) - Render statistics
 * - enableEditMode(item) - Enter edit mode
 * - disableEditMode(item) - Exit edit mode
 * - escapeHtml(text) - XSS prevention
 * 
 * State structure:
 * {
 *   todos: [
 *     { id, text, completed, createdAt },
 *     ...
 *   ]
 * }
 * 
 * Key pattern: State changes always trigger localStorage sync
 * 
 * 
 * FILE 4: js/app.js - MAIN ENTRY POINT
 * ────────────────────────────────────
 * [See the app.js file provided above]
 * 
 * Key responsibilities:
 * 1. Import dependencies (api.js, todo.js)
 * 2. Cache DOM references at the top
 * 3. Initialize all subsystems (theme, menu, todos, api)
 * 4. Implement EVENT DELEGATION for todos:
 *    - Single click listener on #todoList
 *    - Use data-action attributes to identify actions
 *    - Handle toggle, edit, save, cancel, delete
 * 5. Load and render API posts with skeleton loading
 * 6. Manage application state (isEditingTodo, isLoadingPosts)
 * 
 * Event delegation example:
 * - Checkbox has data-action="toggle"
 * - Edit button has data-action="edit-mode"
 * - Delete button has data-action="delete"
 * - Single listener intercepts all with event.target.getAttribute('data-action')
 * 
 * 
 * FILE 5: index.html - HOME PAGE
 * ───────────────────────────────
 * [See HTML template below]
 * 
 * Key changes:
 * - Add SEO meta tags (charset, viewport, description, keywords, og:)
 * - Change <script> tag to ES Module:
 *   <script type="module" src="js/app.js" defer></script>
 * - Add data-id attributes for event delegation
 * - Add data-action attributes for event handling
 * - Add aria-label for accessibility
 * 
 * 
 * FILE 6: about.html & contact.html
 * ──────────────────────────────────
 * [Similar updates to index.html]
 * - Same SEO meta tags
 * - Same module script import
 * - Same navbar with theme toggle
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * MIGRATION STEPS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Step 1: Backup current project
 * Step 2: Replace css/style.css with new version
 * Step 3: Create js/api.js (new file)
 * Step 4: Create js/todo.js (new file)
 * Step 5: Replace js/app.js with new version using modules
 * Step 6: Update index.html script tag
 * Step 7: Update about.html script tag
 * Step 8: Update contact.html script tag
 * Step 9: Test in browser - open DevTools console to verify no errors
 * Step 10: Test dark theme toggle
 * Step 11: Test todo add/edit/delete with event delegation
 * Step 12: Test API loading with skeleton animation
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * BROWSER COMPATIBILITY & REQUIREMENTS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Modern browsers only (last 2 versions):
 * - Chrome/Edge 90+
 * - Firefox 88+
 * - Safari 14+
 * 
 * Requirements:
 * ✓ ES Modules support (type="module")
 * ✓ Fetch API
 * ✓ localStorage
 * ✓ CSS variables (custom properties)
 * ✓ CSS Grid and Flexbox
 * ✓ :focus-visible pseudo-class
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * PERFORMANCE METRICS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Bundle Size:
 * - api.js: ~2KB
 * - todo.js: ~6KB
 * - app.js: ~7KB
 * - style.css: ~25KB
 * Total: ~40KB (excellent for vanilla)
 * 
 * Runtime Performance:
 * - DOM updates: Batched with DocumentFragment
 * - Event delegation: Single listener instead of N listeners
 * - State updates: O(1) for most operations
 * - localStorage sync: Async-safe (not blocking)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ACCESSIBILITY FEATURES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✓ Full keyboard navigation
 * ✓ ARIA labels on all interactive elements
 * ✓ Focus-visible outlines for keyboard users
 * ✓ Semantic HTML (header, nav, main, article, aside, footer)
 * ✓ Proper heading hierarchy (h1 → h2 → h3)
 * ✓ Color contrast ratios meet WCAG AA standards
 * ✓ Form labels associated with inputs
 * ✓ Error messages tied to form fields
 * ✓ Loading states clearly communicated
 * ✓ Empty states with helpful messages
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SECURITY FEATURES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✓ XSS prevention: escapeHtml() on all user input
 * ✓ Input validation: Trim and check before state modifications
 * ✓ localStorage: Uses JSON.parse/stringify with error handling
 * ✓ Event handling: Uses data-* attributes, not eval()
 * ✓ No external dependencies: Pure vanilla code
 * ✓ Content Security Policy compatible
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * TESTING CHECKLIST
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * UI/UX:
 * ☐ Light theme loads by default
 * ☐ Dark theme toggle works and persists
 * ☐ Hamburger menu opens/closes on mobile
 * ☐ Navigation links are highlighted
 * ☐ Loading skeleton displays for 600-800ms
 * ☐ API posts render after loading
 * ☐ Empty state shows when no todos
 * 
 * Todos:
 * ☐ Add todo with valid text
 * ☐ Empty input shows error
 * ☐ Toggle checkbox completes/uncompletes
 * ☐ Edit mode enables with proper button state
 * ☐ Save updated todo
 * ☐ Cancel edit goes back
 * ☐ Delete removes todo
 * ☐ Stats update correctly
 * ☐ Todos persist after page refresh
 * 
 * Accessibility:
 * ☐ Tab navigation works for all buttons
 * ☐ Focus outline visible on keyboard nav
 * ☐ ARIA labels present on form inputs
 * ☐ Color contrast passes WCAG AA
 * ☐ Responsive works on mobile/tablet/desktop
 * 
 * Performance:
 * ☐ No console errors
 * ☐ No memory leaks (check DevTools)
 * ☐ Event delegation working (1 listener on #todoList)
 * ☐ Smooth transitions on all hovers
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
