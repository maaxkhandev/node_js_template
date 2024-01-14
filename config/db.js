const mongoose = require('mongoose');
const seedAdmin = require('./seed_db/admin.seed');

module.exports = () =>
  new Promise(async (resolve, reject) => {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });

      if (process.env.NODE_ENV == 'development') mongoose.set('debug', true);
      console.log('MongoDB Connected...');

      seedAdmin();

      resolve(true);
    } catch (error) {
      console.log('MongoDB Connection Error: ', error);
      reject(error);
    }
  });
