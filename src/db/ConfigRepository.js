
const _ = require('lodash');
const bPromise = require('bluebird');
const DB = require('better-sqlite3-helper');
const util = require('../util/utils');

/**
 * Store and retrieve configurations
 */
class ConfigRepository {
    constructor() { 
    }

    /**
     * Drops the config table
     */
    _dropTable() {
        
        const res = DB().run(util.SQL.DROP_TABLE);
        util.highlight('_dropTable()');
        util.debug(res, true);
    }

    /**
     * Creates a configuration table.
     * This operation always drops the existing table.
     * 
     * @param {*} drop default true
     * @returns Promise
     */
    createTable(drop = true) {
        return new bPromise((resolve, reject) => {
            try {
                if (drop) { this._dropTable(); }

                const res = DB().run(util.SQL.CREATE_TABLE);
                util.highlight('createTable()');
                util.debug(res, true);

                resolve('Table created');

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Finds all records from the configuration table.
     * This operation by default hides sensitive data returning to the caller.
     * If necessary please pass requiredOnly=false to return all data.
     * 
     * @param {*} requiredOnly default true
     * @returns Promise
     */
    findAll(requiredOnly = true) {
        util.highlight('findAll (requiredOnly)=' + requiredOnly);
        return new bPromise((resolve, reject) => {
            try {
                const results = DB().query(
                    requiredOnly ? util.SQL.SELECT_REQUIRED : util.SQL.SELECT_ALL
                );
                resolve(results);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Finds a record by name.
     * This operation by default hides sensitive data returning to the caller.
     * If necessary please pass requiredOnly=false to return all data.
     * 
     * @param {*} name a name value to search a record
     * @param {*} requiredOnly default true
     * @returns Promise
     */
    findByName(name, requiredOnly = true) {
        util.highlight('findByName (requiredOnly)=' + requiredOnly);
        return new bPromise((resolve, reject) => {
            try {
                const results = DB().queryFirstRow(
                    requiredOnly ? util.SQL.SELECT_REQUIRED_BY_NAME : util.SQL.SELECT_BY_NAME,
                    name
                );
                resolve(results);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Finds all records by names.
     * This operation by default hides sensitive data returning to the caller.
     * If necessary please pass requiredOnly=false to return all data.
     * 
     * @param {*} names an array of name value to search records
     * @param {*} requiredOnly default true
     * @returns Promise
     */
    findByNames(names, requiredOnly = true) {
        util.highlight('findByNames (requiredOnly)=' + requiredOnly);
        return new bPromise((resolve, reject) => {
            try {
                
                const sql = requiredOnly !== 'false' ? util.SQL.SELECT_REQUIRED_BY_NAMES : util.SQL.SELECT_BY_NAMES_NO_PASS;
                const formattedSql = Array.isArray(names) ? 
                                        sql.replace('comma', names.map(nm => `'${nm}'`).join(', ')) : 
                                        sql.replace('comma', names);

                const results = DB().query(formattedSql);
                resolve(results);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Inserts multiple rows.
     * @param {*} rows
     * @returns Promise
     */
    insertRows(rows = []) {
        util.highlight('insertRows()');
        return new bPromise((resolve, reject) => {
            try {
                DB().insert(
                    util.TABLE_NAME,
                    _.map(rows, r => {
                        r.baseUrl = util.extractBaseUrl(r.tokenUrl);
                        r.checked = 0;
                        return r;
                    })
                );

                util.debug(rows.length + ' rows inserted.');
                
                resolve(rows.length + ' rows inserted.');

            } catch (error) {
                util.error(error, true);

                reject(error);
            }
        });
    }

    /**
     * Updates multiple rows by name.
     * @param {*} rows 
     * @returns Promise
     */
    updateRows(rows = []) {
        util.highlight('updateRows()');

        return new bPromise((resolve, reject) => {
            try {
                let changedRows = 0;
                _.forEach(rows, (r) => {
                    changedRows = changedRows + DB().update(util.TABLE_NAME, r, ['name = ?', r.name], ['checked']);
                });

                util.debug(changedRows + ' rows updated.');
                
                resolve(changedRows + ' rows updated.');

            } catch (error) {
                util.error(error, true);

                reject(error);
            }
        });
    }
}

module.exports = ConfigRepository;