const express = require('express');
const router = express.Router();

router.get('/keepalive*', async (req, res) => {
  res.status(204).end();
});

module.exports = router;