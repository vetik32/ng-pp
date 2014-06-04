describe('filter', function () {

  beforeEach(module('sjDates'));

  describe('date filters', function () {

    it('should format date to full "dayFullName, monthFullName date" ',
        inject(function (sjDateFilter) {
          //e.g "Friday, October 29"
          expect(sjDateFilter(1288323623006)).toBe(moment(1288323623006).format('dddd, MMMM DD'));
        }));

    it('should format date to ISO_8601',
      inject(function (sjISO_8601_DateFilter) {
        //e.g "2010-10-29T06:40+0300"
        expect(sjISO_8601_DateFilter(1288323623006)).toBe(moment(1288323623006).format('YYYY-MM-DDTHH:mmZZ'));
      }));
  });
});
