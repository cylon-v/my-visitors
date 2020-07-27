const {expect} = require('chai');
const median = require('./median');

describe('median', () => {
  context('when array is empty', () => {
    it('returns 0', () => {
      expect(median([])).to.equal(0);
    });
  });

  context('for array [2, 3, 14, 17, 36]', () => {
    it('returns 14', () => {
      expect(median([2, 3, 14, 17, 36])).to.equal(14);
    });
  });

  context('for array [6, 7, 15, 17, 24, 29, 48, 59]', () => {
    it('returns 20.5', () => {
      expect(median([6, 7, 15, 17, 24, 29, 48, 59])).to.equal(20.5);
    });
  });
});