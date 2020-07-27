const mongoose = require('mongoose');
const moment = require('moment');
const VisitorStats = mongoose.model('VisitorStats');
const {median} = require('../math');

class SyncJob {
  constructor(uniqueVisitors) {
    this.uniqueVisitors = uniqueVisitors;
  }

  async run() {
    const today = moment().startOf('day').toDate();

    let todayStats = await VisitorStats.findOne({date: today});
    let count;
    if (todayStats === null) {
      count = await this.uniqueVisitors.count('yesterday', 'today');

      const data = {
        date: today,
        todayCount: count
      };

      const weekCounts = await this._getWeekCounts();
      if (weekCounts.length > 1) {
        const yesterdayCount = weekCounts[weekCounts.length - 1];
        const increase = (count - yesterdayCount) / yesterdayCount * 100;
        data.increaseSinceYesterday = Math.round(increase);
        data.weekMedian = median(weekCounts);
      }

      await VisitorStats.create(data);
    } else {
      count = todayStats.todayCount;
    }
    console.log(`Unique visitors for today: ${count}`);
  }

  async _getByDate(date) {
    const today = moment(date).startOf('day').format('YYYY-MM-DD');
    const yesterday = moment(date).subtract(1, 'day').startOf('day').format('YYYY-MM-DD');
    return await this.uniqueVisitors.count(yesterday, today);
  }

  async _getWeekCounts() {
    const weekAgo = moment().subtract(6, 'day').startOf('day').toDate();
    const existingStats = await VisitorStats.find({
      date: {$gt: weekAgo}
    });

    const dayCounts = [];
    const dateStats = new Map(existingStats.map(vs => [moment(vs.date).startOf('day').format('YYYY-MM-DD'), vs]));
    for (let i = 0; i < 7; i++) {
      const date = moment(weekAgo).add(i, 'day').startOf('day').format('YYYY-MM-DD');

      const existing = dateStats.get(date);
      if (!existing) {
        const count = await this._getByDate(date);
        dayCounts.push(count);
      } else {
        dayCounts.push(existing.todayCount);
      }
    }

    return dayCounts;
  }
}

module.exports = SyncJob;