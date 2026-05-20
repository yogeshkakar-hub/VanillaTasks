const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Spy on mongoose.connect to intercept database initialization calls
jest.spyOn(mongoose, 'connect').mockResolvedValue(mongoose);

const app = require('../server');
const Todo = mongoose.model('Todo');

describe('To-Do List API Endpoints', () => {
    beforeAll(() => {
        // Ensure test environment uses a fallback JWT key matching server defaults
        process.env.JWT_SECRET = 'super_secret_jwt_passphrase_2026';
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        await mongoose.connection.close();
    });

    describe('GET /api/todos', () => {
        test('should return 401 Unauthorized if no Authorization header is present', async () => {
            const res = await request(app)
                .get('/api/todos');
            
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain('No token provided');
        });

        test('should return 401 Unauthorized if token format is incorrect', async () => {
            const res = await request(app)
                .get('/api/todos')
                .set('Authorization', 'InvalidBearerToken123');
            
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain('Token format must be Bearer');
        });

        test('should return 200 OK and a list of todos if a valid JWT is provided', async () => {
            const mockUserId = new mongoose.Types.ObjectId().toString();
            const token = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET);

            const mockTodos = [
                { _id: new mongoose.Types.ObjectId(), text: 'Learn Testing with Jest', completed: false, user: mockUserId },
                { _id: new mongoose.Types.ObjectId(), text: 'Integrate Supertest', completed: true, user: mockUserId }
            ];

            // Mock implementation for the Mongoose query chain: Todo.find().sort()
            const sortSpy = jest.fn().mockResolvedValue(mockTodos);
            const findSpy = jest.spyOn(Todo, 'find').mockReturnValue({
                sort: sortSpy
            });

            const res = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].text).toBe('Learn Testing with Jest');
            expect(res.body[1].completed).toBe(true);
            expect(findSpy).toHaveBeenCalledWith({ user: mockUserId });

            findSpy.mockRestore();
        });
    });
});
