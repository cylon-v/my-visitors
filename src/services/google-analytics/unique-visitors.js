const {google} = require('googleapis');
const auth = require('./auth');

/**
 * Domain-specific wrapper for accessing Google Analytics API.
 */
class UniqueVisitors {
  /**
   * Loads unique visitors according to the date range.
   * Requires GOOGLE_ANALYTICS_ID environment variable.
   * @param {string} startDate - date in string format 'YYYY-MM-DD'
   * @param {string} endDate - date in string format 'YYYY-MM-DD'
   * @returns {Promise<number>}
   */
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