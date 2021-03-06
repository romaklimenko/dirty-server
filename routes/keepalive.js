const express = require('express');
const router = express.Router();

router.get('/api/keepalive*', async (req, res) => {
  res.status(204).end();
});

module.exports = router;