const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')

router.get('/api/domains/:domainPrefix/', async (req, res) => {
  try {
    const domainPrefix = req.params.domainPrefix.toLocaleLowerCase();
    const domainInfo = await (await fetch(`https://d3.ru/api/domains/${domainPrefix}`)).json();
    res.json(domainInfo);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'здесь должно быть осмысленное сообщение об ошибке, но его нет'
    })
  }
});

module.exports = router;