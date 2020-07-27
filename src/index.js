require('dotenv').config();

const mongoose = require('mongoose');
require('./model');

const {SyncJob} = require('./jobs');
const {UniqueVisitors} = require('./services/google-analytics');

const uniqueVisitors = new UniqueVisitors();
const syncJob = new SyncJob(uniqueVisitors);
(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  await syncJob.run();
  await mongoose.disconnect();
})();

