const util = require('../util/utils');
const OAuthService = require('../services/oauth.service');
const oauthService = new OAuthService();


exports.getNewToken = (req, res, next) => {

    if (util.isEmpty(req.body)) {
        return res.status(400).send({
            message: "Bad Request: Missing OAuth configurations. Please check the request."
        });
    }

    oauthService.generateToken(req.body)
                .then(oaResp => {
                    if (oaResp.status === 200) {
                        util.highlight('OAuth resp');
                        util.debug(oaResp.data);

                        res.status(200).send({
                            'name': req.body.name,
                            'access_token': oaResp.data.access_token,
                            'token_type': oaResp.data.token_type,
                            'expires_in': oaResp.data.expires_in
                        });
                    }
                })
                .catch(error => {
                    util.error(error, true);
                    res.status(400).send(error);        
                });
};
