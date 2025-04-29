
const { Pool } = require('pg');
const { parse } = require('pg-connection-string');
require('dotenv').config();

const config = parse(process.env.DATABASE_URL);

// Optional: manually ensure ssl is configured
config.ssl = { rejectUnauthorized: true };

const pool = new Pool(config);
module.exports = pool;
