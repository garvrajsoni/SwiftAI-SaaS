// aiController.js
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { response } from "express";
import {v2 as cloudinary} from 'cloudinary';
import axios from 'axios';
import FormData from 'form-data';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs';


const AI = new OpenAI({
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


        const response = await AI.chat.completions.create({
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

export const generateBlogTittle = async (req, res) => {
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


        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt, 
                },
            ],
            temperature: 0.7,
            max_tokens:  100,
        });

        const content = response.choices[0].message.content;

        
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog tittle')`;


        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({
            success: true,
            message: 'tittle generated successfully',
            content: content
        });

        console.log('tittle generated for user:', userId);

    } catch (error) {
        console.error("Error generating tittle:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the tittle.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const generateImage = async (req, res) => {
    try {
        
        const {userId} = req.auth();
        const { prompt, publish} = req.body;
        const plan = req.plan;
        

        console.log(plan);

        // Validate required fields
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'

            });
        }

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: `${plan} This feature is not available for free users. Please upgrade to premium.`
            });
        }


              const formData = new FormData();
    formData.append('prompt', prompt); // ✅ Correct key

   
    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIP_API_KEY,
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer'
      }
    );


    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;


    const { secure_url } = await cloudinary.uploader.upload(base64Image);
   

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ? true : false})`;

        res.json({
            success: true,
            message: 'image generated successfully',
            content: secure_url
        });

        console.log('Image generated for user:', userId);

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the image.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const removeImgeBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        console.log('Uploaded file:', req.file);
        console.log(image);

        console.log(plan);

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: `${plan} This feature is not available for free users. Please upgrade to premium.`
            });
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: {
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type)
                   VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({
            success: true,
            message: 'Background removed successfully',
            content: secure_url
        });

        console.log('Image processed for user:', userId);

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the image.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




export const removeImgeObject = async (req, res) => {
    try {
        
        const {userId} = req.auth();
        const  image = req.file;
        const {object} = req.body;
        const plan = req.plan;
        

        // Validate required fields
        if (!object) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'

            });
        }

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: `${plan} This feature is not available for free users. Please upgrade to premium.`
            });
        }

    const { public_id } = await cloudinary.uploader.upload(image.path);
   
      const imageUrl =  cloudinary.url(public_id, {
            transformation : [{
                effect: `gen_remove:${object}`,
            }],
            resource_type : 'image'
        })    

        await sql`
  INSERT INTO creations (user_id, prompt, content, type) 
  VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
`;


        res.json({
            success: true,
            message: 'object remove successfully',
            content: imageUrl
        });

        console.log('Image generated for user:', userId);

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the image.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: `${plan} This feature is not available for free users. Please upgrade to premium.`,
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: 'Resume size should be less than 5MB',
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses and area for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-reviewer')
    `;

    res.json({
      success: true,
      message: 'Resume reviewed successfully',
      content,
    });

    console.log('Resume reviewed for user:', userId);
  } catch (error) {
    console.error('Error reviewing resume:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while reviewing the resume.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};



