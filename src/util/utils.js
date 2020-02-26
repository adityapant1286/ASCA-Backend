
const CONSOLE_COLORS = {

    "Reset": "\x1b[0m",
    "Bright": "\x1b[1m",
    "Dim": "\x1b[2m",
    "Underscore": "\x1b[4m",
    "Blink": "\x1b[5m",
    "Reverse": "\x1b[7m",
    "Hidden": "\x1b[8m",

    "FgBlack": "\x1b[30m",
    "FgRed": "\x1b[31m",
    "FgGreen": "\x1b[32m",
    "FgYellow": "\x1b[33m",
    "FgBlue": "\x1b[34m",
    "FgMagenta": "\x1b[35m",
    "FgCyan": "\x1b[36m",
    "FgWhite": "\x1b[37m",

    "BgBlack": "\x1b[40m",
    "BgRed": "\x1b[41m",
    "BgGreen": "\x1b[42m",
    "BgYellow": "\x1b[43m",
    "BgBlue": "\x1b[44m",
    "BgMagenta": "\x1b[45m",
    "BgCyan": "\x1b[46m",
    "BgWhite": "\x1b[47m"
};

let debugOn = false;

exports.setDebug = (enable=false) => debugOn = enable;

const logIt = (c, simbol, msg, stringify = false) => console.log(c + '%s %s' + CONSOLE_COLORS.Reset, 
                                                                simbol,
                                                                (stringify ? JSON.stringify(msg, null, 2) : msg));

exports.error = (msg, stringify = false) => logIt(CONSOLE_COLORS.FgRed, '(X)', msg, stringify);

exports.info = (msg, stringify = false) => logIt(CONSOLE_COLORS.FgGreen, '(i)', msg, stringify);

exports.warn = (msg, stringify = false) => logIt(CONSOLE_COLORS.FgYellow, '(!)', msg, stringify);

exports.highlight = (msg = '--------------------', stringify = false) =>
    logIt(CONSOLE_COLORS.FgCyan, '(*)', stringify ? msg : '------' + msg + '------', stringify)

exports.debug = (msg, stringify = false) => {
    if (debugOn) {
        console.log(CONSOLE_COLORS.FgMagenta + '%s %s' + CONSOLE_COLORS.Reset, '(>)',msg);
    }    
};

// exports.arrChunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

exports.isEmpty = (val) => {
    let typeOfVal = typeof val;
    switch (typeOfVal) {
        case 'object':
            return (val.length === 0) || !Object.keys(val).length;
        case 'string':
            let str = val.trim();
            return str === '' || str === undefined;
        case 'number':
            return val === '';
        default:
            return val === '' || val === undefined;
    }
};

exports.isEnoughToCompare = (arr=[]) => arr.length > 1 && arr.length < 4;

exports.extractBaseUrl = (tokenUrl) => {
    return new URL(tokenUrl).origin;
};

const TABLE_NAME = "configs";
exports.SQL = {
    CREATE_TABLE: [
        "CREATE TABLE ",
        TABLE_NAME,
        "(",
        "id INTEGER PRIMARY KEY AUTOINCREMENT,",
        "name TEXT NOT NULL,",
        "checked INTEGER,",
        "tokenUrl TEXT NOT NULL,",
        "baseUrl TEXT,",
        "username TEXT,",
        "password TEXT,",
        "client_id TEXT NOT NULL,",
        "client_secret TEXT NOT NULL,",
        "grant_type TEXT DEFAULT 'client_credentials'",
        ")"
    ].join(""),
    DROP_TABLE: ["DROP TABLE IF EXISTS ", TABLE_NAME].join(""),
    INSERT_ROW: [
        "INSERT INTO ",
        TABLE_NAME,
        "(name, tokenUrl, baseUrl, username, password, client_id, client_secret, grant_type) VALUES",
        "(?,?,?,?,?,?,?,?)"
    ].join(""),
    SELECT_ALL: [
        "SELECT id, name, checked, tokenUrl, baseUrl, username, password, client_id, client_secret, grant_type FROM ",
        TABLE_NAME
    ].join(""),
    SELECT_REQUIRED: [
        "SELECT id, name, username, baseUrl, checked FROM ",
        TABLE_NAME
    ].join(""),
    SELECT_REQUIRED_BY_NAME: [
        "SELECT id, name, username, baseUrl, checked FROM ",
        TABLE_NAME,
        " WHERE name = ?"
    ].join(""),
    SELECT_REQUIRED_BY_NAMES: [
        "SELECT id, name, username, baseUrl, checked FROM ",
        TABLE_NAME,
        " WHERE name in (comma)"
    ].join(""),
    SELECT_BY_NAME: [
        "SELECT id, name, checked, tokenUrl, baseUrl, username, password, client_id, client_secret, grant_type FROM ",
        TABLE_NAME,
        " WHERE name = ?"
    ].join(""),
    SELECT_BY_NAMES: [
        "SELECT id, name, checked, tokenUrl, baseUrl, username, password, client_id, client_secret, grant_type FROM ",
        TABLE_NAME,
        " WHERE name in (comma)"
    ].join(""),
    SELECT_BY_NAMES_NO_PASS: [
        "SELECT id, name, checked, tokenUrl, baseUrl, username, client_id, client_secret, grant_type FROM ",
        TABLE_NAME,
        " WHERE name in (comma)"
    ].join(""),
    UPDATE_BY_NAME: [
        "UPDATE ",
        TABLE_NAME,
        " SET checked = ? WHERE name = ?"
    ].join("")
};

exports.JSONATA_EXP = {
    GET_ENDPOINTS: [
        "(",
            "$isEmpty := function($arr) { $count($arr) = 0 };",
            "$allGET := $map(settings, function($v, $i) {(",
                "{",
                "'name': $v.key,",
                "'path': $v.pathPattern,",
                "'emptyParams': $isEmpty($v.httpOperations[method = 'GET'].parameters),",
                "'url': $v.httpOperations[method = 'GET'].url",
                "}[emptyParams and url];",
            ")});",
            "$batchRequests := $map($allGET, function($v, $i) {(",
                "{",
                    "'id': $formatNumber($random() * 1000, '000'),",
                    "'method': 'GET',",
                    "'url': $v.path",
                "}",
            ")});",
            "{",
                "'allGET' : $allGET,",
                "'batchRequests': $batchRequests",
            "}",        
        ")"
    ].join(""),
    FILTER_SETTING_VALUES: [
        "(",
            "$results := $map(responses, function($v, $i) {(",
                "{",
                    "'id': $v.id,",
                    "'name': $replace($v.url, '/', ''),",
                    "'url': $v.url,",
                    "'body': $v.response.body",
                "}",
            ")})[body];",
            "$sortedResults := $sort($results, function($l, $r) {(",
                "$number($l.id) > $number($r.id)",
            ")});",
        ")"
    ].join("")
};

exports.TABLE_NAME = "configs";

