const express = require('express');
const router = express.Router();
const util = require('../util/utils');
const controller = require('../controllers/oauth.controller');

router.post('/', (req, res, next) => {
    util.info(Array.isArray(req.body));
    util.info(req.body);

    controller.getNewToken(req, res, next);
});

module.exports = router;