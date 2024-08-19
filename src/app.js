const express = require('express');
const app = express();
// const {appendFileCsv} = require('../src/services/csvServices.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes/events'));
app.use(require('./routes/shortcuts'));
app.use(require('./routes/interactivity'));
// appendFileCsv()

module.exports = app;
