const express = require('express');
const { fetchPosts } = require('./posts.service');
const axios = require('axios');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    const postsWithImages = await Promise.all(posts.map(async (post) => {
      try {
        const { data: images } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);

        return {
          ...post,
          images: images.map(img => ({ url: img.url }))
        };
      } catch (error) {
        console.error(`Error fetching data for post ${post.id}:`, error.message);

        return {
          ...post,
          images: [],   
        };
      }
    }));

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
