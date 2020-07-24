const {median} = require('../math');

class SyncJob {
  constructor(visitorStats, uniqueVisitors) {
    this.uniqueVisitors = uniqueVisitors;
  }

  async run() {
    const count = await this.uniqueVisitors.count('yesterday', 'today');
    const today = new Date();
    today.setHours(0,0,0,0); // midnight

    const oneDay = 24 * 60 * 60 * 100; // milliseconds
    const week = 7 * oneDay;

    let todayStats = await visitorStats.findOne({date: today});
    if (todayStats === null) {
      const data = {
        date: today,
        todayCount: count
      };

      const yesterday = new Date(today.getDate() - oneDay);
      const yesterdayStats = await visitorStats.findOne({date: yesterday});
      if (yesterdayStats) {
        const increase = (count - yesterdayStats.count) / yesterdayStats.count * 100;
        data.increaseSinceYesterday = Math.round(increase);

        const weekAgo = new Date(today.getDate() - week);
        const weekStats = await visitorStats.find({
          date: {
            $gt: weekAgo,
            $lte: today
          }
        });
        data.weekMedian = median(weekStats.map(s => s.count));
      }

      await visitorStats.create(data);
    }
  }
}

exports.SyncJob = SyncJob;