/**
 * MAIN APPLICATION MODULE
 * Full-Stack API Integration (Express & MongoDB) with JWT Authentication
 * Combines Theme Management, Mobile Menu, API Post Loading,
 * and Authenticated Database To-Do Management
 */

import ApiService from './api.js';

// ===== CONFIGURATION =====
const API_URL = 'http://localhost:5000/api/todos';
const AUTH_URL = 'http://localhost:5000/api';

// ===== APPLICATION STATE =====
let todos = [];
const appState = {
    isLoadingPosts: false
};

// ===== DOM REFERENCES (DYNAMIC GETTERS FOR LIFECYCLE ROBUSTNESS) =====
const domRefs = {
    get themeToggle() { return document.getElementById('themeToggle'); },
    get hamburger() { return document.getElementById('hamburger'); },
    get navLinks() { return document.getElementById('navLinks'); },
    get logoutNavItem() { return document.getElementById('logoutNavItem'); },
    get logoutLink() { return document.getElementById('logoutLink'); },
    
    // Auth elements
    get authContainer() { return document.getElementById('authContainer'); },
    get todoContainer() { return document.getElementById('todoContainer'); },
    get loginForm() { return document.getElementById('loginForm'); },
    get registerForm() { return document.getElementById('registerForm'); },
    get tabLogin() { return document.getElementById('tabLogin'); },
    get tabRegister() { return document.getElementById('tabRegister'); },
    get authError() { return document.getElementById('authError'); },
    
    // Todo elements
    get todoInput() { return document.getElementById('todoInput'); },
    get todoAddBtn() { return document.getElementById('addBtn'); },
    get todoList() { return document.getElementById('todoList'); },
    get todoStats() { return document.getElementById('todoStats'); },
    
    // Blog elements
    get postsContainer() { return document.getElementById('postsContainer'); }
};

// ===== INITIALIZATION =====

/**
 * Initialize the entire application
 */
export async function initApp() {
    try {
        // Initialize theme
        initTheme();
        
        // Initialize menu
        initMenu();
        
        // Initialize authentication layout and actions
        initAuth();
        
        // Fetch and render API data
        await loadAndRenderPosts();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Application initialization failed:', error);
    }
}

// ===== AUTHENTICATION MANAGEMENT =====

function initAuth() {
    // 1. Check for existing login token
    const token = localStorage.getItem('token');
    updateAuthUI(!!token);
    
    if (token) {
        initTodos();
    }
    
    // 2. Setup auth tab switching
    if (domRefs.tabLogin) {
        domRefs.tabLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthTab('login');
        });
    }
    if (domRefs.tabRegister) {
        domRefs.tabRegister.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthTab('register');
        });
    }
    
    // 3. Setup auth form submissions
    if (domRefs.loginForm) {
        domRefs.loginForm.addEventListener('submit', handleLogin);
    }
    if (domRefs.registerForm) {
        domRefs.registerForm.addEventListener('submit', handleRegister);
    }
    
    // 4. Setup logout actions
    if (domRefs.logoutLink) {
        domRefs.logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

function updateAuthUI(isLoggedIn) {
    if (isLoggedIn) {
        if (domRefs.authContainer) domRefs.authContainer.style.display = 'none';
        if (domRefs.todoContainer) domRefs.todoContainer.style.display = 'block';
        if (domRefs.logoutNavItem) domRefs.logoutNavItem.style.display = 'block';
    } else {
        if (domRefs.authContainer) domRefs.authContainer.style.display = 'block';
        if (domRefs.todoContainer) domRefs.todoContainer.style.display = 'none';
        if (domRefs.logoutNavItem) domRefs.logoutNavItem.style.display = 'none';
        todos = [];
        if (domRefs.todoList) domRefs.todoList.innerHTML = '';
    }
}

function switchAuthTab(tab) {
    if (!domRefs.loginForm || !domRefs.registerForm || !domRefs.tabLogin || !domRefs.tabRegister || !domRefs.authError) return;
    
    domRefs.authError.style.display = 'none';
    
    if (tab === 'login') {
        domRefs.loginForm.style.display = 'flex';
        domRefs.registerForm.style.display = 'none';
        domRefs.tabLogin.classList.add('active');
        domRefs.tabRegister.classList.remove('active');
    } else {
        domRefs.loginForm.style.display = 'none';
        domRefs.registerForm.style.display = 'flex';
        domRefs.tabLogin.classList.remove('active');
        domRefs.tabRegister.classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password || !domRefs.authError) return;
    
    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Save token & initialize App
        localStorage.setItem('token', data.token);
        domRefs.authError.style.display = 'none';
        
        // Clear login inputs
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        updateAuthUI(true);
        initTodos();
    } catch (error) {
        domRefs.authError.textContent = error.message;
        domRefs.authError.style.display = 'block';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    
    if (!email || !password || !domRefs.authError) return;
    
    try {
        const response = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        // Save token & initialize App
        localStorage.setItem('token', data.token);
        domRefs.authError.style.display = 'none';
        
        // Clear register inputs
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        
        updateAuthUI(true);
        initTodos();
    } catch (error) {
        domRefs.authError.textContent = error.message;
        domRefs.authError.style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    updateAuthUI(false);
}

// ===== TODO MANAGEMENT (AUTHENTICATED API DRIVEN) =====

async function initTodos() {
    // 1. Fetch initial todos list from DB
    await fetchTodos();
    
    // 2. Add Task Listeners (avoid double listener mapping)
    if (domRefs.todoAddBtn && !domRefs.todoAddBtn.dataset.listener) {
        domRefs.todoAddBtn.dataset.listener = 'true';
        domRefs.todoAddBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await addNewTodo();
        });
    }
    
    if (domRefs.todoInput && !domRefs.todoInput.dataset.listener) {
        domRefs.todoInput.dataset.listener = 'true';
        domRefs.todoInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                await addNewTodo();
            }
        });
    }
    
    // 3. Event Delegation for Delete and Toggle Complete
    if (domRefs.todoList && !domRefs.todoList.dataset.listener) {
        domRefs.todoList.dataset.listener = 'true';
        domRefs.todoList.addEventListener('click', handleTodoListClick);
    }
}

async function fetchTodos() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
        if (domRefs.todoList) {
            domRefs.todoList.innerHTML = `<div class="error-message">❌ Database Offline: ${error.message}</div>`;
        }
    }
}

async function addNewTodo() {
    const token = localStorage.getItem('token');
    if (!token || !domRefs.todoInput) return;
    
    const text = domRefs.todoInput.value.trim();
    if (!text) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text, completed: false })
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const newTodo = await response.json();
        todos.unshift(newTodo); 
        domRefs.todoInput.value = '';
        domRefs.todoInput.focus();
        renderTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function handleTodoListClick(e) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const target = e.target;
    const action = target.getAttribute('data-action');
    const todoItem = target.closest('[data-id]');
    
    if (!todoItem) return;
    const todoId = todoItem.getAttribute('data-id'); 
    
    if (action === 'delete') {
        try {
            const response = await fetch(`${API_URL}/${todoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete task');
            
            todos = todos.filter(todo => todo._id !== todoId);
            renderTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    } else if (action === 'toggle') {
        const todo = todos.find(todo => todo._id === todoId);
        if (todo) {
            try {
                const response = await fetch(`${API_URL}/${todoId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ completed: target.checked })
                });
                if (!response.ok) throw new Error('Failed to toggle completion');
                
                const updatedTodo = await response.json();
                todo.completed = updatedTodo.completed;
                renderTodos();
            } catch (error) {
                console.error('Error updating todo state:', error);
                target.checked = !target.checked; 
            }
        }
    }
}

function renderTodos() {
    if (!domRefs.todoList) return;
    
    domRefs.todoList.innerHTML = '';
    
    if (todos.length === 0) {
        domRefs.todoList.innerHTML = `
            <div class="todo-empty">
                <p>✨ No tasks yet. Add one to get started!</p>
            </div>
        `;
        renderTodoStats();
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo._id); 
        
        li.innerHTML = `
            <div class="todo-left">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    aria-label="Complete task: ${escapeHtml(todo.text)}"
                    data-action="toggle"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
            </div>
            <div class="todo-right">
                <button class="todo-btn-delete" data-action="delete" aria-label="Delete task">Delete</button>
            </div>
        `;
        fragment.appendChild(li);
    });
    
    domRefs.todoList.appendChild(fragment);
    renderTodoStats();
}

function renderTodoStats() {
    if (!domRefs.todoStats) return;
    
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const remaining = total - completed;
    
    domRefs.todoStats.innerHTML = `
        <strong>${total}</strong> total | 
        <span style="color: var(--color-success);"><strong>${completed}</strong> completed</span> | 
        <span style="color: var(--color-warning);"><strong>${remaining}</strong> remaining</span>
    `;
}

// ===== MENU MANAGEMENT =====

function initMenu() {
    if (!domRefs.hamburger || !domRefs.navLinks) return;
    
    domRefs.hamburger.addEventListener('click', toggleMenu);
    
    domRefs.navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar')) {
            closeMenu();
        }
    });
}

function toggleMenu() {
    if (domRefs.hamburger) domRefs.hamburger.classList.toggle('active');
    if (domRefs.navLinks) domRefs.navLinks.classList.toggle('active');
}

function closeMenu() {
    if (domRefs.hamburger) domRefs.hamburger.classList.remove('active');
    if (domRefs.navLinks) domRefs.navLinks.classList.remove('active');
}

// ===== API DATA MANAGEMENT =====

async function loadAndRenderPosts() {
    if (!domRefs.postsContainer) return;
    
    try {
        appState.isLoadingPosts = true;
        showLoadingSkeletons();
        
        const posts = await ApiService.fetchPosts();
        renderPosts(posts);
        
        appState.isLoadingPosts = false;
    } catch (error) {
        console.error('Failed to load posts:', error);
        showPostsError(error.message);
        appState.isLoadingPosts = false;
    }
}

function showLoadingSkeletons() {
    if (!domRefs.postsContainer) return;
    
    domRefs.postsContainer.innerHTML = `
        <div class="card skeleton-card skeleton"></div>
        <div class="card skeleton-card skeleton"></div>
        <div class="card skeleton-card skeleton"></div>
    `;
}

function renderPosts(posts) {
    if (!domRefs.postsContainer) return;
    
    if (!posts || posts.length === 0) {
        domRefs.postsContainer.innerHTML = '<div class="posts-empty">No posts available</div>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    posts.forEach(post => {
        const card = createPostCard(post);
        fragment.appendChild(card);
    });
    
    domRefs.postsContainer.innerHTML = '';
    domRefs.postsContainer.appendChild(fragment);
}

function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'card post-card';
    article.setAttribute('data-post-id', post.id);
    
    const title = document.createElement('h3');
    title.textContent = post.title;
    
    const body = document.createElement('p');
    body.textContent = post.body;
    
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = `Post ID: ${post.id}`;
    
    article.appendChild(title);
    article.appendChild(body);
    article.appendChild(meta);
    
    return article;
}

function showPostsError(errorMessage) {
    if (!domRefs.postsContainer) return;
    
    domRefs.postsContainer.innerHTML = `
        <div class="error-message">
            ❌ Failed to load posts: ${escapeHtml(errorMessage)}
        </div>
    `;
}

// ===== UTILITIES =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== THEME MANAGEMENT (PRESERVED AT THE BOTTOM) =====

function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    if (isDark) {
        html.setAttribute('data-theme', 'dark');
        if (domRefs.themeToggle) domRefs.themeToggle.textContent = '☀️';
    } else {
        html.setAttribute('data-theme', 'light');
        if (domRefs.themeToggle) domRefs.themeToggle.textContent = '🌙';
    }
    
    if (domRefs.themeToggle) {
        domRefs.themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    
    if (domRefs.themeToggle) {
        domRefs.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    localStorage.setItem('theme', newTheme);
}

// ===== ENTRY POINT =====

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export { initApp };