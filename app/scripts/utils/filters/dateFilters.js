angular.module('sjDates', [])
  .filter('sjDate', function($filter){
    var standardDateFilterFn = $filter('date');

    return function(dateToFormat){
      return standardDateFilterFn(dateToFormat, 'EEEE, MMMM dd');
    }
  })
  .filter('sjISO_8601_Date', function($filter){
    var standardDateFilterFn = $filter('date');

    return function(dateToFormat){
      return standardDateFilterFn(dateToFormat, 'yyyy-MM-ddTHH:mmZ') ;
    }
  });
