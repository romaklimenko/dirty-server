// https://d3.ru/api/posts2/?&page=1&per_page=10&domain_prefix=leprosorium
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

async function getVotes(id, type) {
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
    const response = await fetch(`https://d3.ru/api/${type}/${id}/votes/?page=${page}&per_page=210`, params);
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

router.get('/api/domains/:prefix/votes/', async (req, res) => {
  try {
    let prefix = encodeURI(req.params.prefix);

    if (!prefix || prefix === '') {
      res.status(404).end();
    }
    else {
      // TypeError: Cannot read property 'posts' of null
      const posts_response = await (
        await fetch(`https://d3.ru/api/posts2/?&page=1&per_page=10&domain_prefix=${prefix}`)).json();

      if (posts_response === null) {
        res.status(404).end();
        return;
      }

      let activities = posts_response.posts
        .filter(a => a.created !== null);

      activities.sort((a, b) => a.created < b.created ? 1 : -1);

      const voters = { };

      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        let votes
        if (activity.post) {
          votes = await getVotes(activity.id, 'comments');
        }
        else {
          votes = await getVotes(activity.id, 'posts');
        }

        for (let j = 0; j < votes.length; j++) {
          const vote = votes[j];
          if (!voters[vote.user.login]) {
            voters[vote.user.login] = {
              pros: 0,
              cons: 0
            };
          }

          if (vote.vote > 0) {
            voters[vote.user.login].pros++;
          }
          else {
            voters[vote.user.login].cons--;
          }
        }
      }

      const votes_array = [];
      const voters_keys = Object.keys(voters);

      for (let i = 0; i < voters_keys.length; i++) {
        const voter = voters_keys[i];
        votes_array.push({
          voter: voter,
          pros: voters[voter].pros,
          cons: voters[voter].cons
        });
      }

      votes_array.sort((a, b) => a.pros > b.pros ? -1 : 1);
      const top_lovers = votes_array.slice(0, 10);
      votes_array.sort((a, b) => a.cons > b.cons ? -1 : 1);
      const top_haters = votes_array.slice(-10);

      res.json({
        top_lovers,
        top_haters
      });
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;