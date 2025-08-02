// aiController.js
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


// Generate an article
export const generateArticle = async (req, res) => {
    try {
        
        const {userId} = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // Validate required fields
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        // Check usage limits for free users
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: 'You have reached your free usage limit. Please upgrade to premium for more usage.'
            });
        }


        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt, 
                },
            ],
            temperature: 0.7,
            max_tokens: length || 1000,
        });

        const content = response.choices[0].message.content;

        
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;


        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({
            success: true,
            message: 'Article generated successfully',
            content: content
        });

        console.log('Article generated for user:', userId);

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the article.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const generateImage = async (req, res) => {
    try {
        
        const {userId} = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // Validate required fields
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        // Check usage limits for free users
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: 'You have reached your free usage limit. Please upgrade to premium for more usage.'
            });
        }


        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt, 
                },
            ],
            temperature: 0.7,
            max_tokens: length || 1000,
        });

        const content = response.choices[0].message.content;

        
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;


        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({
            success: true,
            message: 'Article generated successfully',
            content: content
        });

        console.log('Article generated for user:', userId);

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the article.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};