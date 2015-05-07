(function() {
  'use strict';

  var app = angular.module('examples', ['ds.clock', 'ui.bootstrap']);

  app.controller('MenuCtrl', function($scope) {
    $scope.isCollapsed = true;
  });



  app.controller('HeadCtrl', ['$scope',
    function($scope) {

    }
  ]);
  app.controller('BaseCtrl', ['$scope',
    function($scope) {
        $scope.gmtValue = 5.45;
        $scope.startTimeValue = 1430990693334;
    }
  ]);

})();
