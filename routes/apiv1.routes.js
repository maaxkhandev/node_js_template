const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.success('API Running'));

module.exports = router;
