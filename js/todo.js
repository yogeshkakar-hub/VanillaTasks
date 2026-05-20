/**
 * TODO MODULE
 * Handles all todo state management, localStorage sync, and rendering
 * Pure data flow: State → localStorage → DOM Render
 */

const STORAGE_KEY = 'vanilla_todos';

/**
 * Internal state - single source of truth
 */
let state = {
    todos: [],
    isLoading: false,
    error: null
};

/**
 * Initialize state from localStorage
 */
export function initTodoState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        state.todos = stored ? JSON.parse(stored) : [];
        return state.todos;
    } catch (error) {
        console.error('Failed to load todos:', error);
        state.todos = [];
        return [];
    }
}

/**
 * Get current state (read-only snapshot)
 * @returns {Object} Current state
 */
export function getTodoState() {
    return JSON.parse(JSON.stringify(state));
}

/**
 * Sync state to localStorage
 */
function syncToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    } catch (error) {
        console.error('Failed to save todos:', error);
        state.error = 'Failed to save todos';
    }
}

/**
 * Add a new todo
 * @param {string} text - Todo text
 * @returns {Object} Created todo object
 */
export function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) {
        throw new Error('Todo text cannot be empty');
    }

    const todo = {
        id: Date.now(),
        text: trimmed,
        completed: false,
        createdAt: new Date().toISOString()
    };

    state.todos.push(todo);
    syncToStorage();
    return todo;
}

/**
 * Update todo text
 * @param {number} id - Todo ID
 * @param {string} newText - New text
 * @returns {Object|null} Updated todo or null if not found
 */
export function updateTodo(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
        throw new Error('Todo text cannot be empty');
    }

    const todo = state.todos.find(t => t.id === id);
    if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
    }

    todo.text = trimmed;
    syncToStorage();
    return todo;
}

/**
 * Delete todo
 * @param {number} id - Todo ID
 * @returns {boolean} True if deleted
 */
export function deleteTodo(id) {
    const index = state.todos.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }

    state.todos.splice(index, 1);
    syncToStorage();
    return true;
}

/**
 * Toggle todo completion
 * @param {number} id - Todo ID
 * @returns {Object|null} Updated todo or null
 */
export function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
    }

    todo.completed = !todo.completed;
    syncToStorage();
    return todo;
}

/**
 * Get all todos
 * @returns {Array} Array of todos
 */
export function getAllTodos() {
    return JSON.parse(JSON.stringify(state.todos));
}

/**
 * Get completed todos count
 * @returns {number} Count of completed todos
 */
export function getCompletedCount() {
    return state.todos.filter(t => t.completed).length;
}

/**
 * Clear all todos
 * @returns {boolean} True if cleared
 */
export function clearAllTodos() {
    state.todos = [];
    syncToStorage();
    return true;
}

/**
 * Render todos to DOM
 * @param {HTMLElement} container - Container element
 * @param {Function} onItemClick - Click handler for items
 */
export function renderTodos(container, onItemClick) {
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Show empty state
    if (state.todos.length === 0) {
        container.innerHTML = `
            <div class="todo-empty">
                <p>✨ No tasks yet. Add one to get started!</p>
            </div>
        `;
        return;
    }

    // Create fragment for better performance
    const fragment = document.createDocumentFragment();

    state.todos.forEach(todo => {
        const li = createTodoElement(todo);
        fragment.appendChild(li);
    });

    container.appendChild(fragment);
}

/**
 * Create a single todo list item element
 * @param {Object} todo - Todo object
 * @returns {HTMLElement} List item element
 */
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', todo.id);

    li.innerHTML = `
        <div class="todo-left">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                aria-label="Complete task: ${escapeHtml(todo.text)}"
                data-action="toggle"
            >
            <span class="todo-text" data-action="edit">${escapeHtml(todo.text)}</span>
            <div class="todo-edit-input" style="display: none;">
                <input 
                    type="text" 
                    class="todo-edit-field" 
                    value="${escapeHtml(todo.text)}"
                    aria-label="Edit task"
                    data-action="edit-field"
                >
            </div>
        </div>
        <div class="todo-right">
            <button class="todo-btn-edit" data-action="edit-mode" aria-label="Edit task">Edit</button>
            <button class="todo-btn-save" data-action="save" style="display: none;" aria-label="Save task">Save</button>
            <button class="todo-btn-cancel" data-action="cancel" style="display: none;" aria-label="Cancel edit">Cancel</button>
            <button class="todo-btn-delete" data-action="delete" aria-label="Delete task">Delete</button>
        </div>
    `;

    return li;
}

/**
 * Update stats display
 * @param {HTMLElement} container - Stats container
 */
export function renderStats(container) {
    if (!container) return;

    const total = state.todos.length;
    const completed = getCompletedCount();
    const remaining = total - completed;

    container.innerHTML = `
        <strong>${total}</strong> total | 
        <span style="color: var(--color-success);"><strong>${completed}</strong> completed</span> | 
        <span style="color: var(--color-warning);"><strong>${remaining}</strong> remaining</span>
    `;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Enable edit mode for a todo
 * @param {HTMLElement} item - Todo item element
 */
export function enableEditMode(item) {
    if (!item) return;
    
    item.classList.add('editing');
    const editBtn = item.querySelector('[data-action="edit-mode"]');
    const saveBtn = item.querySelector('[data-action="save"]');
    const cancelBtn = item.querySelector('[data-action="cancel"]');
    const editField = item.querySelector('[data-action="edit-field"]');
    
    if (editBtn) editBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'block';
    if (cancelBtn) cancelBtn.style.display = 'block';
    if (editField) editField.focus();
}

/**
 * Disable edit mode for a todo
 * @param {HTMLElement} item - Todo item element
 */
export function disableEditMode(item) {
    if (!item) return;
    
    item.classList.remove('editing');
    const editBtn = item.querySelector('[data-action="edit-mode"]');
    const saveBtn = item.querySelector('[data-action="save"]');
    const cancelBtn = item.querySelector('[data-action="cancel"]');
    
    if (editBtn) editBtn.style.display = 'block';
    if (saveBtn) saveBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

export default {
    initTodoState,
    getTodoState,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getAllTodos,
    getCompletedCount,
    clearAllTodos,
    renderTodos,
    renderStats,
    enableEditMode,
    disableEditMode,
    escapeHtml
};
