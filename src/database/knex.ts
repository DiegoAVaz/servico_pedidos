import 'dotenv/config';
import knexFactory = require('knex');
import process = require('node:process');

const knex = knexFactory({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
  },
});

export = knex;
