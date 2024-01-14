const moment = require('moment');

module.exports = (req, res, next) => {
  // const timeNow = moment().format('MM-DD-YYYYTHH:mm:ss');
  // console.log(`${timeNow} - ${req.method} - ${req.url}`);
  console.log(`${req.method} - ${req.url}`);
  switch (req.method) {
    case 'GET':
    case 'DELTE':
      if (Object.keys(req.params).length) {
        // console.log(`${timeNow} - PARAMETERS:`);
        console.log(`PARAMETERS:`);
        console.log(req.params);
      }
      if (Object.keys(req.query).length) {
        // console.log(`${timeNow} - QUERY:`);
        console.log(`QUERY:`);
        console.log(req.query);
      }
      break;
    case 'POST':
    case 'PUT':
      if (Object.keys(req.body).length) {
        // console.log(`${timeNow} - BODY:`);
        console.log(`BODY:`);
        console.log(req.body);
      }
      break;
    default:
      break;
  }
  next();
};
