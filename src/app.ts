import 'dotenv/config';
import express = require('express');
import routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);

export = app;
