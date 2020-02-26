const express = require('express');
const router = express.Router();
const util = require('../util/utils');

router.post('/', (req, res, next) => {
    util.info(Array.isArray(req.body));
    util.info(req.body);

    
});
