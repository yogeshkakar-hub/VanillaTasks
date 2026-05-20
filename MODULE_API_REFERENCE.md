═══════════════════════════════════════════════════════════════════════════════
                         MODULE API QUICK REFERENCE
═══════════════════════════════════════════════════════════════════════════════

This document provides quick reference for all exported functions from the
three modular JavaScript files.

═══════════════════════════════════════════════════════════════════════════════
1. api.js - API SERVICE MODULE
═══════════════════════════════════════════════════════════════════════════════

IMPORT:
  import ApiService from './api.js'

CLASS: ApiService
  Singleton pattern - only one instance exists throughout app

CONSTRUCTOR:
  new ApiService()
  • Initializes with 3 genuine blog posts
  • Posts about vanilla JS, CSS Grid/Flexbox, Web APIs

METHODS:

  📍 fetchPosts() - ASYNC
     Purpose: Fetch all blog posts
     Signature: async fetchPosts() → Promise<Array<Post>>
     Returns: Array of post objects
     Throws: Error if fetch fails
     Example:
       const posts = await ApiService.fetchPosts()
       console.log(posts[0].title)  // "Why Vanilla JavaScript Still Matters"
     Features:
       • Simulates 800ms network delay for realistic UX
       • Includes try/catch error handling
       • Validates each post before returning

  📍 getPostById(id) - SYNC
     Purpose: Get a single post by ID
     Signature: getPostById(id: number) → Post | null
     Returns: Post object or null if not found
     Example:
       const post = ApiService.getPostById(1)
       if (post) console.log(post.body)
     Validation: Calls validatePost() before returning

  📍 validatePost(post) - SYNC
     Purpose: Validate post structure
     Signature: validatePost(post: object) → boolean
     Returns: true if valid, throws error if invalid
     Checks:
       • post has required properties (id, title, body)
       • id is a number
       • title is non-empty string
       • body is non-empty string
     Example:
       try {
         ApiService.validatePost(invalidPost)
       } catch (error) {
         console.error(error.message)  // "Invalid post structure"
       }

DEFAULT EXPORT:
  export default new ApiService()
  • Use as: ApiService.fetchPosts()
  • This is the singleton instance

USAGE EXAMPLE:
  import ApiService from './api.js'
  
  try {
      const posts = await ApiService.fetchPosts()
      posts.forEach(post => console.log(post.title))
  } catch (error) {
      console.error('Failed to load posts:', error.message)
  }

═══════════════════════════════════════════════════════════════════════════════
2. todo.js - TODO STATE MANAGEMENT MODULE
═══════════════════════════════════════════════════════════════════════════════

IMPORT:
  import todoModule from './todo.js'

STORAGE KEY:
  localStorage key: 'vanilla_todos'
  • Automatically updated after every state change
  • JSON stringified array of todo objects

STATE STRUCTURE:
  {
    todos: [
      {
        id: 1699564800000,
        text: "Buy milk",
        completed: false,
        createdAt: "2024-01-20T10:00:00.000Z"
      },
      ...
    ]
  }

EXPORTED FUNCTIONS:

  📍 initTodoState() - SYNC
     Purpose: Initialize state from localStorage
     Signature: initTodoState() → Array<Todo>
     Returns: Array of loaded todos
     Called: Once on app startup
     Example:
       const todos = todoModule.initTodoState()
     Handles: Gracefully recovers from JSON parse errors

  📍 getTodoState() - SYNC
     Purpose: Get read-only snapshot of current state
     Signature: getTodoState() → Object
     Returns: Deep copy of state (cannot modify directly)
     Example:
       const currentState = todoModule.getTodoState()
       console.log(currentState.todos.length)

  📍 addTodo(text) - SYNC
     Purpose: Add a new todo
     Signature: addTodo(text: string) → Todo
     Returns: Created todo object
     Throws: Error if text is empty
     Side effects: Updates localStorage, modifies state
     Example:
       try {
           const newTodo = todoModule.addTodo("Buy milk")
           console.log(newTodo.id)  // Timestamp-based ID
       } catch (error) {
           console.error(error.message)  // "Todo text cannot be empty"
       }

  📍 updateTodo(id, newText) - SYNC
     Purpose: Update todo text
     Signature: updateTodo(id: number, newText: string) → Todo
     Returns: Updated todo object
     Throws: Error if todo not found or text empty
     Side effects: Updates localStorage
     Example:
       const updated = todoModule.updateTodo(1699564800000, "Buy milk and eggs")
       console.log(updated.text)

  📍 deleteTodo(id) - SYNC
     Purpose: Delete a todo
     Signature: deleteTodo(id: number) → boolean
     Returns: true on success
     Throws: Error if todo not found
     Side effects: Updates localStorage
     Example:
       todoModule.deleteTodo(1699564800000)

  📍 toggleTodo(id) - SYNC
     Purpose: Toggle todo completion status
     Signature: toggleTodo(id: number) → Todo
     Returns: Updated todo object
     Throws: Error if todo not found
     Side effects: Flips completed boolean, updates localStorage
     Example:
       const toggled = todoModule.toggleTodo(1699564800000)
       console.log(toggled.completed)  // Opposite of before

  📍 getAllTodos() - SYNC
     Purpose: Get all todos
     Signature: getAllTodos() → Array<Todo>
     Returns: Deep copy of todos array
     Example:
       const allTodos = todoModule.getAllTodos()
       allTodos.forEach(todo => console.log(todo.text))

  📍 getCompletedCount() - SYNC
     Purpose: Count completed todos
     Signature: getCompletedCount() → number
     Returns: Number of completed todos
     Example:
       const completed = todoModule.getCompletedCount()
       const total = todoModule.getAllTodos().length
       console.log(`${completed}/${total} done`)

  📍 clearAllTodos() - SYNC
     Purpose: Delete all todos
     Signature: clearAllTodos() → boolean
     Returns: true on success
     ⚠️ WARNING: This cannot be undone!
     Side effects: Clears state, updates localStorage
     Example:
       if (confirm('Really delete all?')) {
           todoModule.clearAllTodos()
       }

  📍 renderTodos(container, onItemClick) - SYNC
     Purpose: Render todos to DOM
     Signature: renderTodos(container: HTMLElement) → void
     Parameters:
       • container: #todoList element
     Side effects: Updates DOM, does NOT update state
     Behavior:
       • Clears container
       • Shows empty state if no todos
       • Creates li elements for each todo
       • Adds data-id and data-action attributes
       • Includes edit mode UI
     Example:
       const container = document.getElementById('todoList')
       todoModule.renderTodos(container)

  📍 renderStats(container) - SYNC
     Purpose: Render statistics
     Signature: renderStats(container: HTMLElement) → void
     Parameters:
       • container: #todoStats element
     Side effects: Updates DOM with HTML
     Displays:
       • Total count (bold)
       • Completed count (green)
       • Remaining count (orange)
     Example:
       const stats = document.getElementById('todoStats')
       todoModule.renderStats(stats)
       // Output: "5 total | 2 completed | 3 remaining"

  📍 enableEditMode(item) - SYNC
     Purpose: Enter edit mode for a todo
     Signature: enableEditMode(item: HTMLElement) → void
     Parameters:
       • item: The li[data-id] element
     Side effects: Shows input field, hides buttons
     Example:
       const todoItem = document.querySelector('[data-id="123"]')
       todoModule.enableEditMode(todoItem)

  📍 disableEditMode(item) - SYNC
     Purpose: Exit edit mode for a todo
     Signature: disableEditMode(item: HTMLElement) → void
     Parameters:
       • item: The li[data-id] element
     Side effects: Hides input field, shows buttons
     Example:
       todoModule.disableEditMode(todoItem)

  📍 escapeHtml(text) - SYNC
     Purpose: Escape HTML to prevent XSS
     Signature: escapeHtml(text: string) → string
     Returns: HTML-escaped string
     Example:
       const safe = todoModule.escapeHtml('<script>alert("hi")</script>')
       // Returns: "&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;"

DEFAULT EXPORT:
  export default { initTodoState, addTodo, ... }
  • All functions also available as named exports
  • Use as: todoModule.addTodo()

USAGE PATTERN (with event delegation):

  function handleTodoListClick(event) {
      const todoItem = event.target.closest('[data-id]')
      const todoId = parseInt(todoItem.getAttribute('data-id'))
      const action = event.target.getAttribute('data-action')
      
      switch(action) {
          case 'toggle':
              todoModule.toggleTodo(todoId)
              renderTodoList()
              renderTodoStats()
              break
          case 'delete':
              todoModule.deleteTodo(todoId)
              renderTodoList()
              renderTodoStats()
              break
          // ... other actions
      }
  }

═══════════════════════════════════════════════════════════════════════════════
3. app.js - MAIN APPLICATION ORCHESTRATOR
═══════════════════════════════════════════════════════════════════════════════

IMPORT:
  import ApiService from './api.js'
  import todoModule from './todo.js'

EXPORTS:
  export async function initApp() { ... }
  export { initApp }

ENTRY POINT:
  document.addEventListener('DOMContentLoaded', initApp)
  • Automatically called when DOM is ready

APP STATE:
  const appState = {
      isEditingTodo: null,      // ID of todo being edited
      isLoadingPosts: false     // Loading flag for API data
  }

FUNCTIONS (Internal - not exported):

  🔧 initTheme()
     • Loads theme from localStorage
     • Applies dark-theme class if needed
     • Sets up toggle button listener

  🔧 toggleTheme()
     • Toggles html.dark-theme class
     • Updates localStorage
     • Changes button emoji (☀️ ↔️ 🌙)

  🔧 initMenu()
     • Sets up hamburger menu toggle
     • Closes menu when links are clicked
     • Closes menu when clicking outside

  🔧 initTodos()
     • Loads todos from storage
     • Sets up event delegation listener
     • Initial render of todos and stats

  🔧 handleTodoListClick(event)
     • Event delegator for all todo interactions
     • Routes actions (toggle, edit, save, cancel, delete)
     • Handles all todo mutations

  🔧 handleTodoListKeypress(event)
     • Handles keyboard input in edit field
     • Enter to save, Escape to cancel

  🔧 addNewTodo()
     • Gets input value
     • Calls todoModule.addTodo()
     • Updates UI
     • Clears input

  🔧 saveEditedTodo(todoId, todoItem)
     • Gets new text from edit field
     • Validates input
     • Calls todoModule.updateTodo()
     • Re-renders

  🔧 renderTodoList()
     • Calls todoModule.renderTodos()
     • Updates #todoList element

  🔧 renderTodoStats()
     • Calls todoModule.renderStats()
     • Updates #todoStats element

  🔧 loadAndRenderPosts() - ASYNC
     • Shows loading skeletons
     • Calls ApiService.fetchPosts()
     • Renders posts on success
     • Shows error message on failure

  🔧 showLoadingSkeletons()
     • Displays shimmer animation
     • 3 placeholder cards

  🔧 renderPosts(posts)
     • Creates post card elements
     • Uses DocumentFragment for performance
     • Appends to #postsContainer

  🔧 createPostCard(post)
     • Creates article element
     • Adds title, body, meta
     • Returns DOM element

  🔧 showPostsError(errorMessage)
     • Displays error UI
     • HTML-escaped message

═══════════════════════════════════════════════════════════════════════════════
FULL WORKFLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════════════

USER: Visits website
  ↓
  app.js:DOMContentLoaded fires
  ↓
  initApp()
    ├─ initTheme() → loads theme from localStorage
    ├─ initMenu() → sets up hamburger menu
    ├─ initTodos() → loads todos, renders UI
    └─ loadAndRenderPosts() → async fetches API data
  ↓
  app.js:listen for #todoList clicks
  ↓
USER: Clicks "Add" button
  ↓
  app.js:addNewTodo()
    ├─ Get input value
    ├─ todoModule.addTodo(text)
    │   ├─ Create todo object with ID
    │   ├─ Push to state.todos
    │   ├─ syncToStorage() → update localStorage
    │   └─ Return new todo
    ├─ Clear input
    ├─ renderTodoList() → regenerate DOM from state
    └─ renderTodoStats() → update count display
  ↓
  UI updates with new todo

USER: Clicks checkbox to toggle completion
  ↓
  app.js:handleTodoListClick(event)
    ├─ action = "toggle"
    ├─ todoModule.toggleTodo(todoId)
    │   ├─ Find todo in state
    │   ├─ Flip completed boolean
    │   ├─ syncToStorage() → update localStorage
    │   └─ Return updated todo
    ├─ renderTodoList() → regenerate DOM
    └─ renderTodoStats() → update count
  ↓
  UI reflects new completed state (strikethrough, opacity)

═══════════════════════════════════════════════════════════════════════════════
COMMON USAGE PATTERNS
═══════════════════════════════════════════════════════════════════════════════

Pattern 1: READ FROM STATE
  const todos = todoModule.getAllTodos()
  console.log(`You have ${todos.length} todos`)

Pattern 2: MODIFY STATE AND UPDATE UI
  todoModule.deleteTodo(1699564800000)
  renderTodoList()
  renderTodoStats()

Pattern 3: HANDLE USER INTERACTION
  document.getElementById('myButton').addEventListener('click', () => {
      try {
          todoModule.addTodo(text)
          renderTodoList()
      } catch (error) {
          showNotification(error.message, 'error')
      }
  })

Pattern 4: ASYNC DATA LOADING
  try {
      const posts = await ApiService.fetchPosts()
      posts.forEach(post => renderPostCard(post))
  } catch (error) {
      showError(error.message)
  }

═══════════════════════════════════════════════════════════════════════════════
