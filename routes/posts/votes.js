const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

async function getVotes(postId) {
  let data = [];
  let page = 1;
  let page_count = 1;

  const params = {
    method: 'GET',
    headers: {
      'X-Futuware-UID': process.env.D3_UID,
      'X-Futuware-SID': process.env.D3_SID
    }
  };

  while (page <= page_count) {
    const response = await fetch(`https://d3.ru/api/posts/${postId}/votes/?page=${page}&per_page=210&cache=${Math.floor(new Date().getTime() / 1000.0)}`, params);
    const result = await response.json();

    if (result === null) {
      return [];
    }

    if (result.page_count) {
      page_count = result.page_count;
    }

    if (result.upvotes) {
      data.push(...result.upvotes);
    }

    if (result.downvotes) {
      data.push(...result.downvotes);
    }

    page++;
  }

  data.sort((a, b) => a.changed > b.changed ? 1 : -1);

  return data;
}

router.get('/posts/:postId/votes/', async (req, res) => {
  try {
    const postId = req.params.postId;

    const votes = await getVotes(postId);

    res.json(votes);
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;