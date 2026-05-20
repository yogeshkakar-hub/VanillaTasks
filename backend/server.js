const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = require('./middleware/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
    console.log(`[API LOG] ${req.method} ${req.url}`);
    next();
});

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch((err) => console.error('MongoDB connection failure:', err));

// ===== SCHEMA & MODELS =====
const TodoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Todo = mongoose.model('Todo', TodoSchema);

// ===== AUTHENTICATION ENDPOINTS =====

// POST: Register user
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Save user
        const newUser = new User({
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        
        // Sign JWT
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: savedUser._id, email: savedUser.email }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST: Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        
        // Sign JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ===== PROTECTED REST API ENDPOINTS (TODOS) =====

// GET: Fetch user's todos
app.get('/api/todos', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    }
});

// POST: Save a new todo
app.post('/api/todos', auth, async (req, res) => {
    try {
        const { text, completed } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Task text is required' });
        }
        
        const newTodo = new Todo({
            user: req.user.id,
            text: text.trim(),
            completed: completed || false
        });
        
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PUT: Update a todo
app.put('/api/todos/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;
        
        // Ensure user owns this todo
        const todo = await Todo.findOne({ _id: id, user: req.user.id });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }
        
        if (text !== undefined) todo.text = text.trim();
        if (completed !== undefined) todo.completed = completed;
        
        const savedTodo = await todo.save();
        res.status(200).json(savedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE: Remove a todo
app.delete('/api/todos/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }
        
        res.status(200).json({ message: 'Todo deleted successfully', id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// ===== START SERVER =====
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Express server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
