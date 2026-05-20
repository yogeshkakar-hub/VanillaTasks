/**
 * API MODULE
 * Handles all asynchronous data fetching with robust error handling
 * Pure async/await with try-catch
 */

export class ApiService {
    constructor() {
        this.posts = [
            {
                id: 1,
                title: 'Why Vanilla JavaScript Still Matters',
                body: 'In 2026, frameworks dominate the landscape, but vanilla JavaScript remains the foundation of web development. Learning vanilla JS teaches you the core concepts that every framework builds upon. Understanding the DOM, event delegation, and async operations in pure JavaScript makes you a better developer, no matter what tools you use.'
            },
            {
                id: 2,
                title: 'Building Responsive Layouts with CSS Grid & Flexbox',
                body: 'CSS Grid and Flexbox have revolutionized responsive web design. Instead of relying on heavy frameworks, modern CSS provides powerful layout tools that are lightweight and performant. This article covers best practices for creating responsive designs that work seamlessly across all devices without unnecessary JavaScript dependencies.'
            },
            {
                id: 3,
                title: 'The Power of Web APIs and localStorage',
                body: 'Web browsers provide powerful APIs like localStorage, Fetch API, and more that enable rich, dynamic experiences without backend calls. Learn how to persist user preferences, cache data locally, and build offline-capable applications using modern Web APIs and best practices for data management.'
            }
        ];
    }

    /**
     * Fetch posts with simulated network delay
     * @returns {Promise<Array>} Array of post objects
     * @throws {Error} If fetch fails
     */
    async fetchPosts() {
        try {
            // Simulate realistic network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Validate data
            if (!Array.isArray(this.posts) || this.posts.length === 0) {
                throw new Error('No posts available');
            }
            
            return this.posts;
        } catch (error) {
            console.error('ApiService.fetchPosts error:', error);
            throw new Error(`Failed to fetch posts: ${error.message}`);
        }
    }

    /**
     * Get posts by ID
     * @param {number} id - Post ID
     * @returns {Object|null} Post object or null
     */
    getPostById(id) {
        return this.posts.find(post => post.id === id) || null;
    }

    /**
     * Validate post object structure
     * @param {Object} post - Post object to validate
     * @returns {boolean} True if valid
     */
    validatePost(post) {
        return (
            post && 
            typeof post === 'object' && 
            'id' in post && 
            'title' in post && 
            'body' in post &&
            typeof post.id === 'number' &&
            typeof post.title === 'string' &&
            typeof post.body === 'string'
        );
    }
}

export default new ApiService();
