const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    util = require('./src/util/utils');
    app = express(),
    port = process.env.PORT || 4545;
    
const DB = require('better-sqlite3-helper');
const DB_FILE_PATH = './src/db/configs.sqlite3';
DB({
    path: DB_FILE_PATH, // this is the default
    memory: false, // create a db only in memory
    readonly: false, // read only
    fileMustExist: false, // throw error if database not exists
    WAL: false, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: false 
});

const configRouter = require('./src/routes/configRoute');
const oauthRouter = require('./src/routes/oauthRoute');

util.setDebug(true);

app.use(cors());
app.use(logger('dev'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));

// const routes = require('./src/externalRoutes');
// routes(app);

app.use('/configs', configRouter);
app.use('/tokens', oauthRouter);

app.listen(port);

console.log("setting-sync server started on http://localhost:" + port);