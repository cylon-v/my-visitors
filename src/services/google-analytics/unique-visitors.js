const {google} = require('googleapis');
const auth = require('./auth');

class UniqueVisitors {
  async count(startDate, endDate) {
    google.options({auth});

    const res = await google.analytics('v3').data.ga.get({
      'start-date': startDate,
      'end-date': endDate,
      ids: 'ga:98877168',
      metrics: 'ga:sessions',
    });

    console.log(res.data);
    return res.data;
  }
}

module.exports = UniqueVisitors;