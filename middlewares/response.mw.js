module.exports = (req, res, next) => {
  res.success = (data) => {
    res.status(200).json({ status: 200, data });
  };

  res.serverError = (error) => {
    if (error.isJoi) {
      let data = error.details.map((d) => d.message);
      data = data.join(', ');
      console.log(`ERROR: [${req.method}-${req.url}] ${data}`);
      res.status(400).json({ status: 400, data });
    } else {
      console.log(`ERROR: [${req.method}-${req.url}] ${error}`);
      res.status(500).json({ status: 500, data: 'Server Error' });
    }
  };

  res.fail = (data) => {
    res.status(400).json({ status: 400, data });
  };

  res.sendResponse = (statusCode, data) => {
    res.status(statusCode).json({ status: statusCode, data });
  };

  next();
};
