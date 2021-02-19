const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');

function fucked(username) {
  const bans = [ /* ...  */ ];

  for (const ban of bans) {
    if (username.toLowerCase() === ban.toLowerCase()) {
      return true;
    }
  }

  return false;
}

function banned(username) {
  const bans = [ /* ...  */ ];

  for (const ban of bans) {
    if (username.toLowerCase() === ban.toLowerCase()) {
      return true;
    }
  }

  return false;
}

async function downvoted(from, to) {
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
    const response = await fetch(`https://d3.ru/api/users/${to}/votes/?page=${page}&per_page=210`, params);
    const result = await response.json();

    if (result === null) {
      return false;
    }

    if (result.page_count) {
      page_count = result.page_count;
    }

    if (result.downvotes !== null) {
      for (const downvote of result.downvotes) {
        if (downvote.user.login.toLowerCase() === from.toLowerCase()) {
          return true;
        }
      }
    }

    page++;
  }

  return false;
}

const CACHE_DURATION_IN_MS = 1000 * 60 * 10;

const cache = new Map();

router.get('/lopata/:username/', async (req, res) => {
    try {
      let username = encodeURI(req.params.username);

      res.set('Cache-Control', 'no-cache');

      if (!username || username === '') {
        res.status(404).end()
        return;
      }

      username = username.toLowerCase();

      if (fucked(username)) {
        res.json({ lopata: 2 });
        return;
      }

      if (banned(username)) {
        res.json({ lopata: 1 });
        return;
      }

      const cacheData = cache.get(username);

      if (cacheData !== undefined && cacheData.username === username && cacheData.expires > +new Date()) {
        res.json(cacheData);
        return;
      }

      const result = {
        lopata: 0,
        expires: +new Date() + CACHE_DURATION_IN_MS
      };
      
      if (await downvoted(username, 'r10o') || await downvoted(username, 'romaklimenko')) {
        result.lopata = 1;
      }

      cache.set(username, result);
      res.json(result);
    } catch (e) {
        console.error(e)
        res.status(500).json({
          error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
        })
    }
});

module.exports = router;