const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

async function getCachedKarma(username) {
  try {
    const response = await fetch(`https://storage.googleapis.com/dirty-karma-cache/${username.toLowerCase()}.json`);
    const json = await response.json();
    return json.map(k => {
      return {
        vote: k.vote,
        changed: k.changed,
        user: {
          login: k.to
        },
        from: k.from,
        deleted: k.deleted,
      }
    })
  } catch (error) {
    return [];
  }
}

async function getKarma(username) {
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
      const response = await fetch(`https://d3.ru/api/users/${username}/votes/?page=${page}&per_page=210`, params);
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

    data.forEach((v, i) => {
      if (i === 0) {
        v.karma = v.vote;
      }
      else {
        v.karma = data[i - 1].karma + v.vote;
      }
    });

    const cache = await getCachedKarma(username);

    if (cache.length !== 0) {
      data = data.concat(cache);
      data.sort((a, b) => a.changed > b.changed ? 1 : -1);
    }

    return data;
}

router.get('/users/:username/karma/', async (req, res) => {
    try {
        let username = encodeURI(req.params.username);

        if (!username || username === '') {
          res.status(404).end();
        }
        else {
            const karma = await getKarma(username);
            res.json(karma);
        }
      } catch (e) {
        console.error(e)
        res.status(500).json({
          error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
        })
      }
    });

module.exports = router;