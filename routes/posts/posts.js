const express = require('express');
const router = express.Router();
const connect = require('../../connect');

let posts;

router.get('/posts/', async (req, res) => {
  try {
    if (!posts) {
      const connection = await connect(process.env.MONGO);
      posts = connection.db('dirty').collection('posts');
    }
    const now = +new Date() / 1000;
    const cursor = await posts
      .find({ last_seen: { $gt: now - 60 * 60 * 24 } })
      .sort({ minutes: -1 });
    res.json(await cursor.toArray());
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;