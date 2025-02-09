import express from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

import Post from '../mongodb/models/post.js'

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration loaded correctly
console.log('Cloudinary Configuration Status:', cloudinary.config().cloud_name ? 'Loaded' : 'Not Loaded');

//GET ALL POST
router.route('/').get(async(req, res) => {
    try {
        const posts = await Post.find({})

        res.status(200).json({ success: true, data: posts })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

//CREATING POSTS
router.route('/').post(async(req, res) => {
    try {
        const { name, prompt, photo } = req.body;
        
        if (!photo) {
            return res.status(400).json({ success: false, message: 'Photo is required' });
        }

        // Check if photo is a valid base64 string
        if (!photo.startsWith('data:image')) {
            return res.status(400).json({ success: false, message: 'Invalid image format' });
        }

        // Verify Cloudinary config
        console.log('Cloudinary Config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET?.slice(0, 5) + '...' // Only log first 5 chars of secret
        });

        console.log('Attempting to upload to Cloudinary...');
        try {
            // Remove the data:image prefix and convert to buffer
            const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            
            const photoUrl = await cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'dalle_clone'
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error uploading to Cloudinary',
                        error: error.message || 'Upload failed'
                    });
                }
                
                // Create post with the uploaded URL
                const newPost = new Post({
                    name,
                    prompt,
                    photo: result.url,
                });
                
                newPost.save();
                return res.status(201).json({ success: true, data: newPost });
            }).end(buffer);

        } catch (error) {
            console.error('Upload Error:', {
                name: error.name,
                message: error.message,
                error: JSON.stringify(error, null, 2)
            });
            
            return res.status(500).json({
                success: false,
                message: 'Error processing image',
                error: error.message || 'Unknown error'
            });
        }
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating post', 
            error: error.toString()
        });
    }
});

export default router;
