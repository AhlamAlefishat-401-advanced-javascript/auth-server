require('dotenv').config();
const express = require('express');
const morgon = require('morgan');
const router = require('./auth/router.js');
const app = express();
const notFoundHandler = require('../src/middleware/404.js');
const errorHandler = require('../src/middleware/500.js');
const extraRouter=require('./auth/extra-routes.js');

app.use(express.json());
app.use(morgon('dev'));
app.use(express.static('./public'));
app.use('/',router);
app.use('/', extraRouter);
app.use('*',notFoundHandler);
app.use(errorHandler);


module.exports = {
  server: app,
  start: (port) => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};