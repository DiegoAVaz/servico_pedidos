import 'dotenv/config';
import express = require('express');
import routes = require('./routes');
import path = require('node:path');

const app = express();

app.use(express.json());
app.use(routes);
app.use(express.static(path.join(__dirname, '..', 'public')));

export = app;
