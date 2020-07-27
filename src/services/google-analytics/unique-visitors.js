const {google} = require('googleapis');
const auth = require('./auth');

class UniqueVisitors {
  async count(startDate, endDate) {
    google.options({auth});

    const res = await google.analytics('v3').data.ga.get({
      'start-date': startDate,
      'end-date': endDate,
      ids: process.env.GOOGLE_ANALYTICS_ID,
      metrics: 'ga:visitors'
    });

    return parseInt(res.data.rows[0][0]);
  }
}

module.exports = UniqueVisitors;