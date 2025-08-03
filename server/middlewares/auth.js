// middleware/auth.js
import { clerkClient } from '@clerk/clerk-sdk-node';
import { getAuth } from '@clerk/express';

export const auth = async (req, res, next) => {
    try {
        const { userId, has } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - No user ID found'
            });
        }

        // Check if user has premium plan (adjust this based on your Clerk setup)
        // This might be a role or permission depending on how you've configured Clerk
        const hasPremiumPlan = has({ plan: 'premium' }); 

        // Get user data
        const user = await clerkClient.users.getUser(userId);
        const privateMetadata = user.privateMetadata || {};

        // Handle free usage tracking
        if (!hasPremiumPlan) {
            if (privateMetadata.free_usage !== undefined) {
                req.free_usage = privateMetadata.free_usage;
            } else {
                // Initialize free usage if not set
                await clerkClient.users.updateUserMetadata(userId, {
                    privateMetadata: {
                        ...privateMetadata,
                        free_usage: 0
                    }
                });
                req.free_usage = 0;
            }
        } else {
            req.free_usage = 0; 
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        req.userId = userId; 
        
        next(); 
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};