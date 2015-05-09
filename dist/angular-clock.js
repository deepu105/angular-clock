(function() {
  'use strict';

  /* <ds-widget-clock data-gmt-offset="0"></ds-widget-clock> */
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  angular.module('ds.clock', [])
    .directive('dsWidgetClock', ['$interval', '$filter',
      function($interval, $filter) {
        return clock($interval, $filter);
      }
    ]);

  function clock($interval, $filter) {
    return {
      restrict: 'EA',
      scope: {
        gmtOffset: '=gmtOffset',
        digitalFormat: '=digitalFormat'
      },
      template: '<div class="widget-clock" ng-class="theme" ng-if="date"><div class="digital" ng-if="digital"><span class="time"><span class="hours">{{digital}}</span></span></div><div class="analog" ng-if="analog"><div class="square"><svg viewBox="0 0 100 100"><g transform="translate(50,50)"><circle class="clock-face" r="48" /><line ng-repeat="minor in minors track by $index" class="minor" y1="42" y2="45" ng-attr-transform="rotate({{360 * $index / minors.length}})" /><line ng-repeat="major in majors track by $index" class="major" y1="35" y2="46" ng-attr-transform="rotate({{360 * $index / majors.length}})" /><line class="hour" y1="2" y2="-20" ng-attr-transform="rotate({{30 * date.hrs + date.mins / 2}})" /><line class="minute" y1="4" y2="-30" ng-attr-transform="rotate({{6 * date.mins + date.secs / 10}})" /><g ng-attr-transform="rotate({{6 * date.secs}})"><line class="second" y1="10" y2="-38" /><line class="second-counterweight" y1="10" y2="2" /></g></g></svg></div></div><div ng-if="gmtInfo" class="gmt-info">{{gmtInfo}}</div></div>',
      link: function(scope, element, attrs) {
        var format, // date format
          stopTime; // so that we can cancel the time updates
        var o = {}; //angular.copy(defaults)
        var gmtOffset = scope.gmtOffset;
        var digitalFormat = scope.digitalFormat !== undefined ? scope.digitalFormat : 'HH:mm:ss';
        //o.gmtOffset = (gmtOffset !== undefined && gmtOffset !== null) ? parseFloat(gmtOffset) : false;
        //o.showSecs = attrs.hideSecs !== undefined ? false : true;
        //o.showAmPm = attrs.showAmPm !== undefined ? true : false;
        o.showDigital = attrs.showDigital !== undefined ? true : false;
        o.showAnalog = attrs.showAnalog !== undefined ? true : false;
        o.showGmtInfo = attrs.showGmtInfo !== undefined ? true : false;
        o.startTime = parseInt(attrs.startTime, 10); // ms
        scope.theme = attrs.theme !== undefined ? attrs.theme : 'light';
        if (!o.showDigital && !o.showAnalog) {
          o.showAnalog = true;
          o.showDigital = true;
        }
        scope.gmtInfo = false;

        scope.date = getDate(o);

        scope.digital = o.showDigital ? 'Loading..' : false;
        scope.analog = o.showAnalog;
        scope.majors = new Array(12);
        scope.minors = new Array(60);
        var date = null;
        var tick = function() {
          if (!isNaN(o.startTime)) {
            o.startTime = o.startTime + 1000;
          }
          date = getDate(o);
          scope.date = date;
          if (o.showDigital) {
            scope.digital = timeText(date, digitalFormat, gmtOffset, $filter);
          }
        };

        stopTime = $interval(tick, 1000);
        // watch the expression, and update the UI on change.
        scope.$watch('gmtOffset', function(value) {
          gmtOffset = value;
          o.gmtOffset = (gmtOffset !== undefined && gmtOffset !== null) ? getGMTbase100(gmtOffset) : false;
          if (o.showGmtInfo && o.gmtOffset !== false) {
            scope.gmtInfo = getGMTText(o.gmtOffset);
          }
          tick();
        });
        /*scope.$watch('digitalFormat', function(value) {
          digitalFormat = value;
        });*/
        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
        element.on('$destroy', function() {
          $interval.cancel(stopTime);
          stopTime = null;
        });

      }
    };
  }

  function getGMTbase100(offset) {
    offset = parseFloat(offset);
    var f = offset > 0 ? Math.floor(offset) : Math.ceil(offset),
      s = (offset % 1) / 0.6;

    return f + s;

  }

  function getGMTbase60(offset) {
    var f = offset > 0 ? Math.floor(offset) : Math.ceil(offset),
      s = ((offset > 0 ? offset : offset * -1) % 1) * 60;
    return f + s;

  }

  function getGMTText(offset) {

    var f = offset > 0 ? Math.floor(offset) : Math.ceil(offset),
      s = Math.round(((offset > 0 ? offset : offset * -1) % 1) * 60);

    return 'GMT' + (offset === 0 ? '' : ((offset > 0 ? ' +' : ' ') + lpad(f) + '.' + rpad(s).substring(0, 2)));

  }

  function lpad(num) {
    if (num < 0) {
      return (num > -10 ? '-0' : '-') + (num * -1);
    } else {
      return (num < 10 ? '0' : '') + num;
    }

  }

  function rpad(num) {
    return num + (num < 10 ? '0' : '');
  }
  // Checkfor offset and get correct time
  function getDate(o) {
    var now = (!isNaN(o.startTime)) ? new Date(o.startTime) : new Date();
    if (o.gmtOffset !== null && o.gmtOffset !== false) {
      // Use GMT + gmtOffset
      // convert to msec
      // add local time zone offset
      // get UTC time in msec
      var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      // create new Date object for different city
      // using supplied offset
      var offsetNow = new Date(utc + (3600000 * o.gmtOffset));
      return {
        hrs: offsetNow.getHours(),
        mins: offsetNow.getMinutes(),
        secs: offsetNow.getSeconds(),
        date: offsetNow
      };
    } else {
      // Use local time
      return {
        hrs: now.getHours(),
        mins: now.getMinutes(),
        secs: now.getSeconds(),
        date: now
      };
    }
  }

  function timeText(d, format, timezone, $filter) {
    return $filter('date')(d.date, format, timezone);
    /*return '' +
      (o.showAmPm ? ((d.hrs % 12) === 0 ? 12 : (d.hrs % 12)) : d.hrs) + ':' +
      lpad(d.mins) +
      (o.showSecs ? ':' + lpad(d.secs) : '') +
      (o.showAmPm ? (d.hrs < 12 ? ' AM' : ' PM') : '');*/
  }

})();
