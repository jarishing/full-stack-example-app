import jwt from 'jsonwebtoken';
import { db } from './database/index';
console.log('Database connection loaded:', !!db);
export async function createContext({ req, res }) {
    console.log('Creating context with db:', !!db);
    // Extract token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    let user;
    if (token) {
        try {
            const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
            const decoded = jwt.verify(token, JWT_SECRET);
            // In a real app, you'd fetch user from database
            // For now, we'll create a mock user based on token
            user = {
                id: decoded.userId,
                email: 'user@example.com',
                username: 'user',
                bio: 'A passionate developer',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
            };
        }
        catch (error) {
            // Invalid token - user remains undefined
            console.log('Invalid token:', error);
        }
    }
    return {
        req,
        res,
        db,
        user
    };
}
