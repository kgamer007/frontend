'use strict';

const express = require('express');
require('dotenv').config();

const app = express();

const build = `${__dirname}/build`;
console.log('this is IS THIS READING HERE ' + __dirname);

app.use(express.static(build));

app.get('*', (request, response) => {
  response.sendFile(`${build}/index.html`);
});

app.listen(process.env.PORT, () => {
  console.log('__SERVER_UP__', process.env.PORT); // eslint-disable-line
});
