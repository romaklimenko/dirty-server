const express = require('express');
const router = express.Router();
const connect = require('../../connect');

let posts;

router.get('/posts/:post_id', async (req, res) => {
  try {
    if (!posts) {
      const connection = await connect(process.env.MONGO);
      posts = connection.db('dirty').collection('posts');
    }

    const post_id = parseInt(req.params.post_id);

    res.json(await posts.findOne({ _id: post_id }));
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;