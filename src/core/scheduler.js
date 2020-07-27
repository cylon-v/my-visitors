const {CronJob} = require('cron');

class Scheduler {
  constructor(job, cron) {
    this.job = new CronJob(
      cron,
      job.run,
      () => console.log('Job has completed.')
    );
  }

  start() {
    this.job.start();
  }
}