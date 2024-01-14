const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`) });
const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const cors = require('cors');

const connectDB = require('./config/db');
const responseMiddleware = require('./middlewares/response.mw');
const loggerMiddleware = require('./middlewares/logger.mw');

console.log('CURRENT ENVIRONMENT : ', process.env.NODE_ENV);

// Initialize App
const app = express();

// Response Middleware
app.use(responseMiddleware);

// Connect Database
connectDB();

// Passport Config
require('./config/passport')(passport);

// Accept Json in Request
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '200mb' }));

// Log Routes
app.use(loggerMiddleware);

// Enable Cors
app.use(cors());

// Other MiddleWares
app.use(express.static(path.join(__dirname, 'public')));

// Routes Configuration
app.get('/', (req, res) => res.success('Server Running'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/api/v1', require('./routes/apiv1.routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.fail('Page Not Found');
});

module.exports = app;
