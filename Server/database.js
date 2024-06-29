const pg = require('pg');
const client = new pg.Client('postgres://localhost/daily_goal_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = 'shhh';



module.exports = {
    client,
    createTables
};