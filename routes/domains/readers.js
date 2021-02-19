const express = require('express');
const router = express.Router();
const connect = require('../../connect');
const fetch = require('node-fetch')

let domains;

router.get('/domains/:domainPrefix/readers', async (req, res) => {
  try {
    if (!domains) {
      const connection = await connect(process.env.MONGO);
      domains = connection.db('dirty').collection('domains');
    }

    const domainPrefix = req.params.domainPrefix.toLocaleLowerCase();

    const cursor = await domains.find({ '_id.prefix': domainPrefix }).sort({ '_id.epoch': 1 });
    const result = await cursor.toArray();
    if (result.length > 0) {
      const domain_info = await (await fetch(`https://d3.ru/api/domains/${domainPrefix}`)).json();
      const epoch = new Date() / 1000;
      result.push({
        _id: {
          prefix: domainPrefix,
          epoch: epoch,
          id: result[0]._id.id
        },
        readers_count: domain_info.readers_count,
        readers_count_change: domain_info.readers_count - result[result.length - 1].readers_count,
        epoch_change: epoch - result[result.length - 1]._id.epoch
      })
    }

    res.json(result);
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;