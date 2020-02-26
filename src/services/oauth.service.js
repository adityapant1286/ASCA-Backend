const qs = require('qs');
const axios = require('axios').default;
const util = require('../util/utils');

class OAuthService {

    constructor() {}

    _generateTokenLocal(instance) {
        
        const form = {
            client_id: instance.client_id,
            client_secret: instance.client_secret,
            grant_type: instance.grant_type
        };
        let formdata = qs.stringify(form);
        let contentLength = formdata.length;

        const headers = {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        };

        return axios.post(instance.tokenUrl, formdata, headers);
    }

    generateToken(instanceConfig) {
        return this._generateTokenLocal(instanceConfig);
    }
}

module.exports = OAuthService;
