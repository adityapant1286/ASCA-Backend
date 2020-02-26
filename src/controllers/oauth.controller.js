const util = require('../util/utils');


exports.getNewToken = (req, res, next) => {

    if (util.isEmpty(req.body)) {
        return res.status(400).send({
            message: "Bad Request: Missing OAuth configurations. Please check the request."
        });
    }

    

};
