const express = require('express');
const router = express.Router();
const controller = require('../controllers/config.db.controller');
const util = require('../util/utils');


router.post('/', (req, res, next) => {
    const mode = req.query.mode;
    util.info(Array.isArray(req.body));
    util.info(req.body);

    if (mode && mode === 'wrapper') {
        controller.loadConfig(req, res, next);
    } else {
        controller.persistsConfig(req, res, next);
    }
});

router.get('/', (req, res, next) => {
    util.debug(req.query);
    if (util.isEmpty(req.query.names)) {
        controller.findAll(req, res, next);
    } else {
        controller.findByNames(req, res, next);
    }    
});



module.exports = router;