import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Get all posts
router.route('/').get(async(req, res) => {
    try {
        const posts = await Post.find({});

        res.status(200).json({ success: true, data: posts })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
});

// Create a new post
router.route('/').post(async (req, res) => {
    try {
      const { name, prompt, photo } = req.body;
      console.log('Received form data:', req.body); // Debugging statement
  
      // Validate the form data
      if (!name || !prompt || !photo) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      console.log('form data successfully validated'); // Debugging statement
  
      const photoURL = await cloudinary.uploader.upload(photo);
  
      const newPost = await Post.create({
        name,
        prompt,
        photo: photoURL.url,
      });
  
      res.status(201).json({ success: true, data: newPost });
      console.log('New post created:', newPost); // Debugging statement
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: error });
      console.log('Error creating a new post:', error); // Debugging statement
    }
  });

export default router;