const express = require('express');

module.exports = (req, res, next) => {
  if (req.originalUrl === '/api/v1/stripe/webhook') {
    req.rawBody = '';
    req.on('data', (chunk) => {
      req.rawBody += chunk;
    });
  }
  next();
};
