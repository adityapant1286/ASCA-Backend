const _ = require('lodash');
const util = require('../util/utils');
const ConfigRepository = require('../db/ConfigRepository');
const repository = new ConfigRepository();

const setup = () => {
    return repository.createTable();
};

exports.persistsConfig = (req, res, next) => {

    if (util.isEmpty(req.body)) {
        return res.status(400).send('Bad Request: Please check configurations in file');
    }

    setup()
        .then((data) => {
            // util.info("after table creation");
            // util.info(data, true);
            // util.highlight("---------before insert---------");
            return repository.insertRows(req.body);
        })
        .then((found) => {
            res.status(200).send({
                success: true,
                msg: 'Configurations Loaded'
            });
        })
        .catch(err => {
            util.error("err");
            util.error(err, true);
            res.status(400).send({
                success: false,
                msg: err ? err : 'Error in inserting rows'
            });
        });
};

exports.findAll = (req, res, next) => {
    let requiredOnly = req.query.requiredOnly !== undefined ? req.query.requiredOnly : true;

    repository.findAll(requiredOnly)
        .then(found => { 
            const transformed = _.map(found, (f) => {
                                f.checked = (f.checked === 0) ? false : true;
                                return f;
                            });
            res.status(200).send(transformed);
        })
        .catch(err => { 
            if (err && err.includes('no such table')) {
                res.status(400).send('Please load configurations first configurations'); 
            } else {
                res.status(400).send('Error in retrieving configurations'); 
            }            
        });

};

/**
 * Request:
 * queryParams = requiredOnly: boolean & names=commaSeparatedNames
 * 
 */
exports.findByNames = (req, res, next) => {
    let requiredOnly = req.query.requiredOnly !== undefined ? req.query.requiredOnly : true;

    if (util.isEmpty(req.query.names)) {
        return res.status(400).send({
            message: "Bad Request: Instance name required in the body"
        });
    }

    let names = req.query.names.split(',').map(s => s.trim());

    repository.findByNames(names, requiredOnly)
        .then((configs) => {
            const transformed = _.map(configs, (f) => {
                f.checked = (f.checked === 0) ? false : true;
                return f;
            });
            
            res.status(200).send(transformed);
        })
        .catch(err => { 
            if (err && err.includes('no such table')) {
                res.status(400).send('Please load configurations first configurations'); 
            } else {
                res.status(400).send('Error in retrieving configurations. Please check the names.'); 
            }            
        });
};