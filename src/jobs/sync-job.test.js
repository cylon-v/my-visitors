const mongoose = require('mongoose');
const moment = require('moment');
const {expect} = require('chai');
const {stub} = require('sinon');
const {SyncJob} = require('./');
const VisitorStats = mongoose.model('VisitorStats');

const uniqueVisitors = {
  count: stub()
};

let syncJob = new SyncJob(uniqueVisitors);

describe('SyncJob', () => {
  afterEach(async () => {
    await VisitorStats.deleteMany({});
    uniqueVisitors.count.reset();
    uniqueVisitors.count.returns(12);
  });

  const today = moment().startOf('day').toDate();
  const ago = (days) => moment(today).subtract(days, 'day').format('YYYY-MM-DD');

  describe('run', () => {
    context('when there is Stats entry in the DB for today', () => {
      before(async () => {
        await VisitorStats.create({
          date: today,
          todayCount: 12,
          increaseSinceYesterday: 0,
          weekMedian: 0
        });
      });

      it('does not create new entry', async () => {
        await syncJob.run();
        const count = await VisitorStats.countDocuments({date: today});
        expect(count).to.equal(1);
      });
    });

    context('when there is no Stats entry in the DB for today', () => {
      it('creates new entry', async () => {
        await syncJob.run();
        const count = await VisitorStats.countDocuments({date: today});
        expect(count).to.equal(1);
      });

      context('when there is no stats for previous dates', () => {
        beforeEach(() => {
          uniqueVisitors.count.withArgs(today).returns(12);
          uniqueVisitors.count.withArgs(ago(7)).returns(1);
          uniqueVisitors.count.withArgs(ago(5)).returns(2);
          uniqueVisitors.count.withArgs(ago(4)).returns(3);
          uniqueVisitors.count.withArgs(ago(3)).returns(4);
          uniqueVisitors.count.withArgs(ago(2)).returns(5);
          uniqueVisitors.count.withArgs(ago(1)).returns(6);
        });

        it('calls Google Analytics 7 times (for a week)', async () => {
          await syncJob.run();

          expect(uniqueVisitors.count.calledWith(ago(7), ago(6))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(6), ago(5))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(5), ago(4))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(4), ago(3))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(3), ago(2))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(2), ago(1))).to.equal(true);
        });

        it('correctly calculates and saves "increase since yesterday" value', async () => {
          await syncJob.run();

          const stats = await VisitorStats.findOne({});
          expect(stats.increaseSinceYesterday).to.equal(100);
        });

        it('correctly saves "median for past 7 days" value', async () => {
          await syncJob.run();

          const stats = await VisitorStats.findOne({});
          expect(stats.weekMedian).to.equal(4);
        });
      });

      context('when there are some stats for previous dates', () => {
        before(async () => {
          const createForDate = async (date) => {
            await VisitorStats.create({
              date: moment(date).toDate(),
              todayCount: 12,
              increaseSinceYesterday: 0,
              weekMedian: 0
            });
          };

          await Promise.all([
            createForDate(ago(1)),
            createForDate(ago(2)),
            createForDate(ago(3)),
            createForDate(ago(4))
          ]);
        });

        it('calls Google Analytics only when it is required', async () => {
          await syncJob.run();

          expect(uniqueVisitors.count.calledWith(ago(7), ago(6))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(6), ago(5))).to.equal(true);
          expect(uniqueVisitors.count.calledWith(ago(5), ago(4))).to.equal(false);
          expect(uniqueVisitors.count.calledWith(ago(4), ago(3))).to.equal(false);
          expect(uniqueVisitors.count.calledWith(ago(3), ago(2))).to.equal(false);
          expect(uniqueVisitors.count.calledWith(ago(2), ago(1))).to.equal(false);
        });
      });
    });
  });
});