const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()

router.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;
    const response = await fetch(`https://d3.ru/api/posts/${postId}/comments/`);
    const json = await response.json();
    res.json(json);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
})

module.exports = router;