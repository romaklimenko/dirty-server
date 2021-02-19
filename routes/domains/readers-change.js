const express = require('express');
const router = express.Router();
const connect = require('../../connect');
const fetch = require('node-fetch')

const CACHE_DURATION_IN_MS = 1000 * 60;

let cache;
let result = null;
let expiry = +new Date();

router.get('/domains/readers', async (req, res) => {
  try {
    if (result !== null && expiry > +new Date()) {
      res.json(result);
      return;
    }

    if (!cache) {
      const connection = await connect(process.env.MONGO);
      cache = connection.db('dirty').collection('cache');
    }

    result = await cache.findOne({ _id: 'domain_readers_change' });

    expiry = +new Date() + CACHE_DURATION_IN_MS;
    res.json(result.result);
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;