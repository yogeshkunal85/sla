const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { startSLAJob } = require('./jobs/slaJob');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(errorHandler);

startSLAJob();

module.exports = app;