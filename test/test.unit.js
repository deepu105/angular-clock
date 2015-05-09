/*jshint mocha:true*/
/*global module:true*/
/*global inject:true*/
/*global expect:true*/
/*global sinon:true*/
'use strict';
describe('Angular Clock Unit testing', function() {

  var $compile, scope, sandbox;

  beforeEach(module('ds.clock'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    scope = _$rootScope_;
    sandbox = sinon.sandbox.create();
  }));

  afterEach(function() {
    sandbox.restore();
  });

  describe('base', function() {
    it('replaces the directive element with the appropriate content', function() {
      var markup = '<div>' +
        '<ds-widget-clock></ds-widget-clock></div>';



      var element = $compile(markup)(scope);
      scope.$digest();

      expect(element.html()).to.have.string('class="widget-clock');
    });

    describe('clock types', function() {
      [0, 8, 5.30, -5.30, -5.15, 5.45, -1].forEach(function(type) {
        it('creates a GMT ' + type + ' timezone clock using the directive', function() {
          var markup = '<div><ds-widget-clock data-gmt-offset="' +
            type + '" data-show-gmt-info></ds-widget-clock></div>';


          //var mock = sandbox.mock(Chart.prototype);
          //mock.expects(type);

          var element = $compile(markup)(scope);
          scope.$digest();

          //mock.verify(); GMT +5.0
          expect(element.html()).to.have.string('>' + getGMTText(type) + '<');
        });

      });
    });
    describe('clock theme', function() {
      it('replaces the element with the appropriate content for dark theme', function() {
        var markup = '<div>' +
          '<ds-widget-clock theme="dark"></ds-widget-clock></div>';



        var element = $compile(markup)(scope);
        scope.$digest();

        expect(element.html()).to.have.string('class="widget-clock ng-scope dark');
      });
    });

    describe('clock set start time', function() {
      it('set a intial time and clock is base on this time to tick.', function() {
        var date = new Date();
        var ms = date.getTime();
        var markup = '<div><ds-widget-clock start-time="' +
          ms + '" data-show-gmt-info></ds-widget-clock></div>';
        var element = $compile(markup)(scope);

        scope.$digest();
        expect(element.html()).to.match(/<span class="hours[^>]+>([^<]+)<\/span>/);
      });
    });

    describe('digital clock format', function() {
      it('replaces the element with the appropriate content for digital clock in given format', function() {
        var format = 'dd-MMM-yyyy hh:mm:ss a';
        var markup = '<div>' +
          '<ds-widget-clock show-digital digital-format="\'' + format + '\'"></ds-widget-clock></div>';

        var element = $compile(markup)(scope);
        scope.$digest();

        expect(element.html()).to.match(/<span class="hours[^>]+>\d{2}[-][A-Z][a-z]{2}[-]\d{4}[ ]\d{2}[:]\d{2}[:]\d{2}[ ]([^<]+)<\/span>/);
      });
    });
  });

});

function getGMTText(offset) {

  var f = offset > 0 ? Math.floor(offset) : Math.ceil(offset),
    s = Math.round(((offset > 0 ? offset : offset * -1) % 1) * 100);

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
