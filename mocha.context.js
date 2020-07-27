require('dotenv').config();
const mongoose = require('mongoose');
require('./src/model');

before(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
});

after(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
